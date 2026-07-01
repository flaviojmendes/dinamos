// Simulation orchestrator. Owns cross-tick state (queues, breakers, autoscaler
// replicas), the RNG, the simulated clock and a rolling history of frames.
//
// Each tick:
//   1. advance clock, apply load profile + active chaos to effective configs
//   2. fluid-solve steady-state rates/utilisation/failures (cycle-aware)
//   3. update circuit breakers and autoscalers for the next tick
//   4. Monte-Carlo trace latency percentiles
//   5. assemble a SimulationFrame (per-node + system metrics + cost)

import {
  EdgeSpec,
  NodeConfig,
  NodeMetrics,
  SimConfig,
  SimulationFrame,
  SystemMetrics,
  nodeCapacity,
} from './types';
import { buildTopology, validateTopology } from './topology';
import { EngineState, solveFlow, NodeRuntime } from './fluidSolver';
import { CircuitBreaker } from './failureModel';
import { traceLatency } from './latencyTracer';
import { Rng } from './rng';
import { ChaosEvent, LoadProfile, isChaosActive, makeLoadProfile } from './scenarios';
import { estimateNodeCostPerHour, CloudProvider } from './costModel';

const HISTORY_LIMIT = 240;

export class Simulator {
  private nodes: NodeConfig[];
  private edges: EdgeSpec[];
  private readonly dt: number;
  private readonly traceSamples: number;
  private rng: Rng;
  private seed: number;
  private time = 0;

  private state: EngineState;
  private breakers = new Map<string, CircuitBreaker>();
  profile: LoadProfile;
  chaos: ChaosEvent[] = [];
  provider: CloudProvider = 'aws';

  history: SimulationFrame[] = [];
  totalCost = 0; // accumulated USD over the run
  totalSuccess = 0; // cumulative successful requests over the run
  totalFailed = 0; // cumulative failed requests over the run

  constructor(config: SimConfig) {
    this.nodes = config.nodes;
    this.edges = config.edges;
    this.dt = config.dtSeconds || 1;
    this.traceSamples = config.traceSamples || 2000;
    this.seed = config.seed;
    this.rng = new Rng(config.seed);
    this.profile = makeLoadProfile('constant');
    this.state = {
      queueLengths: new Map(),
      breakerShed: new Map(),
      replicaOverride: new Map(),
      dtSeconds: this.dt,
    };
    this.initStatefulNodes();
  }

  private initStatefulNodes(): void {
    this.nodes.forEach((n) => {
      if (n.kind === 'circuitBreaker') {
        this.breakers.set(
          n.id,
          new CircuitBreaker(n.errorThreshold ?? 0.5, n.resetTimeoutMs ?? 5000),
        );
      }
      if (isAutoScaling(n)) {
        this.state.replicaOverride.set(n.id, n.replicas);
      }
    });
  }

  /** Replace the graph (e.g. user edits) without losing the clock. */
  setGraph(nodes: NodeConfig[], edges: EdgeSpec[]): void {
    this.nodes = nodes;
    this.edges = edges;
    // Drop stale state for removed nodes; add state for new ones.
    const ids = new Set(nodes.map((n) => n.id));
    [...this.state.queueLengths.keys()].forEach((id) => !ids.has(id) && this.state.queueLengths.delete(id));
    [...this.breakers.keys()].forEach((id) => !ids.has(id) && this.breakers.delete(id));
    nodes.forEach((n) => {
      if (n.kind === 'circuitBreaker' && !this.breakers.has(n.id)) {
        this.breakers.set(n.id, new CircuitBreaker(n.errorThreshold ?? 0.5, n.resetTimeoutMs ?? 5000));
      }
      if (isAutoScaling(n)) {
        if (!this.state.replicaOverride.has(n.id)) this.state.replicaOverride.set(n.id, n.replicas);
      } else if (this.state.replicaOverride.has(n.id)) {
        // Autoscaling was turned off: drop the stale override so the node uses
        // its configured replica count again.
        this.state.replicaOverride.delete(n.id);
      }
    });
  }

  setProfile(profile: LoadProfile): void {
    this.profile = profile;
  }

  setChaos(events: ChaosEvent[]): void {
    this.chaos = events;
  }

  setProvider(provider: CloudProvider): void {
    this.provider = provider;
  }

  reset(seed?: number): void {
    this.time = 0;
    this.history = [];
    this.totalCost = 0;
    this.totalSuccess = 0;
    this.totalFailed = 0;
    if (seed !== undefined) this.seed = seed;
    this.rng = new Rng(this.seed);
    this.state.queueLengths.clear();
    this.state.breakerShed.clear();
    this.state.replicaOverride.clear();
    this.breakers.clear();
    this.initStatefulNodes();
  }

  get currentTime(): number {
    return this.time;
  }

  /** Run one simulation step and return the resulting frame. */
  tick(): SimulationFrame {
    this.time += this.dt;

    const mult = this.profile.multiplierAt(this.time);
    const effectiveNodes = this.applyChaosAndLoad(mult);
    const effectiveEdges = this.applyPartitions();

    const topo = buildTopology(effectiveNodes, effectiveEdges);
    const result = solveFlow(effectiveNodes, effectiveEdges, topo, this.state);

    this.updateBreakers(result.runtime);
    this.updateAutoscalers(result.runtime);

    const trace = traceLatency(result.runtime, this.rng, this.traceSamples);

    const nodeMetrics: Record<string, NodeMetrics> = {};
    result.runtime.forEach((rt, id) => {
      const p = trace.perNode.get(id) ?? { p50: 0, p95: 0, p99: 0 };
      const m = toNodeMetrics(rt, p);
      const breaker = this.breakers.get(id);
      if (breaker) m.circuitState = breaker.state;
      nodeMetrics[id] = m;
    });

    const edgeFlow: Record<string, number> = {};
    result.edgeFlow.forEach((v, k) => (edgeFlow[k] = v));

    const warnings = validateTopology(effectiveNodes, effectiveEdges, topo);
    if (!result.converged) warnings.push('NOT_CONVERGED');
    result.runtime.forEach((rt) => {
      if (rt.utilization >= 1) warnings.push(`BOTTLENECK:${rt.cfg.label}`);
    });

    const system = this.systemMetrics(result.runtime, trace.system, warnings);
    this.totalCost += (system.costPerHour / 3600) * this.dt;
    this.totalSuccess += system.totalThroughput * this.dt;
    this.totalFailed += system.failedRate * this.dt;

    const frame: SimulationFrame = { time: this.time, nodeMetrics, edgeFlow, system };
    this.history.push(frame);
    if (this.history.length > HISTORY_LIMIT) this.history.shift();
    return frame;
  }

  private applyChaosAndLoad(mult: number): NodeConfig[] {
    return this.nodes.map((n) => {
      let cfg = n;
      if (n.kind === 'client') {
        cfg = { ...cfg, baseRate: (n.baseRate ?? 0) * mult };
      }
      // Scheduled (cron) sources scale with the load profile just like clients.
      if (n.cronEnabled) {
        cfg = { ...cfg, cronRate: (n.cronRate ?? 0) * mult };
      }
      for (const ev of this.chaos) {
        if (ev.targetId !== n.id || !isChaosActive(ev, this.time)) continue;
        if (ev.type === 'killNode') {
          cfg = { ...cfg, failureRate: 1 };
        } else if (ev.type === 'latencyInjection') {
          cfg = { ...cfg, serviceTimeMs: cfg.serviceTimeMs * (ev.magnitude ?? 5) };
        }
      }
      return cfg;
    });
  }

  private applyPartitions(): EdgeSpec[] {
    const partitioned = new Set<string>();
    for (const ev of this.chaos) {
      if (ev.type === 'partition' && isChaosActive(ev, this.time)) partitioned.add(ev.targetId);
    }
    if (partitioned.size === 0) return this.edges;
    return this.edges.filter((e) => !partitioned.has(e.source) && !partitioned.has(e.target));
  }

  private updateBreakers(runtime: Map<string, NodeRuntime>): void {
    this.breakers.forEach((breaker, id) => {
      const rt = runtime.get(id);
      if (!rt) return;
      // Observe downstream error rate from the breaker's children.
      const branches = rt.branches;
      let err = 0;
      let total = 0;
      branches.forEach((b) => {
        const child = runtime.get(b.target);
        if (child) {
          err += b.prob * child.effFailProb;
          total += b.prob;
        }
      });
      const errorRate = total > 0 ? err / total : 0;
      const shed = breaker.update(errorRate, this.time * 1000);
      this.state.breakerShed.set(id, shed);
    });
  }

  private updateAutoscalers(runtime: Map<string, NodeRuntime>): void {
    this.nodes.forEach((n) => {
      if (!isAutoScaling(n)) return;
      const rt = runtime.get(n.id);
      if (!rt) return;
      const target = n.targetUtilization ?? 0.7;
      const min = n.minReplicas ?? 1;
      const max = n.maxReplicas ?? 20;
      const current = this.state.replicaOverride.get(n.id) ?? n.replicas;
      let desired = current;
      if (rt.utilization > target * 1.1) desired = current + 1;
      else if (rt.utilization < target * 0.7 && current > min) desired = current - 1;
      this.state.replicaOverride.set(n.id, Math.max(min, Math.min(max, desired)));
    });
  }

  private systemMetrics(
    runtime: Map<string, NodeRuntime>,
    e2e: { p50: number; p95: number; p99: number },
    warnings: string[],
  ): SystemMetrics {
    let offered = 0;
    let totalThroughput = 0;
    let inFlight = 0;
    let costPerHour = 0;

    runtime.forEach((rt) => {
      inFlight += rt.queue.inSystem;
      costPerHour += estimateNodeCostPerHour(rt, this.provider);
    });

    // Aggregate every source of externally-offered work: clients emit `arrival`,
    // cron-enabled nodes emit their self-generated `cronRate`. Each source's load
    // is discounted by the fraction that fails locally or anywhere downstream.
    runtime.forEach((rt) => {
      if (rt.cfg.kind === 'client') {
        const load = rt.arrival;
        if (load <= 0) return;
        offered += load;
        // The client's throughput already removes client-side failures; discount
        // the remainder by the weighted downstream failure across its branches.
        let branchFail = 0;
        let branchWeight = 0;
        rt.branches.forEach((b) => {
          const child = runtime.get(b.target);
          if (child) {
            branchFail += b.prob * child.effFailProb;
            branchWeight += b.prob;
          }
        });
        const downstreamFail = branchWeight > 0 ? branchFail / branchWeight : 0;
        totalThroughput += rt.throughput * (1 - downstreamFail);
      } else if (rt.cfg.cronEnabled) {
        const load = Math.max(0, rt.cfg.cronRate ?? 0);
        if (load <= 0) return;
        offered += load;
        // A cron node's effFailProb already folds in local drops/failures and
        // downstream failure, so the surviving fraction is (1 - effFailProb).
        totalThroughput += load * (1 - rt.effFailProb);
      }
    });

    const failedRate = Math.max(0, offered - totalThroughput);
    const errorRate = offered > 0 ? failedRate / offered : 0;

    return {
      time: this.time,
      offeredLoad: offered,
      totalThroughput,
      successRate: offered > 0 ? totalThroughput / offered : 1,
      errorRate: Math.max(0, Math.min(1, errorRate)),
      failedRate,
      inFlightTotal: inFlight,
      p50: e2e.p50,
      p95: e2e.p95,
      p99: e2e.p99,
      costPerHour,
      warnings: [...new Set(warnings)],
    };
  }
}

function toNodeMetrics(rt: NodeRuntime, p: { p50: number; p95: number; p99: number }): NodeMetrics {
  const metrics: NodeMetrics = {
    arrivalRate: round(rt.arrival),
    throughput: round(rt.throughput),
    utilization: rt.utilization,
    inFlight: rt.queue.inSystem,
    queueLength: rt.queue.queueLength,
    waitMs: rt.queue.waitMs,
    responseTimeMs: rt.queue.responseMs,
    failedRate: round(rt.failed),
    droppedRate: round(rt.dropped),
    retriedRate: round(rt.retried),
    servers: rt.servers,
    replicas: rt.replicas,
    p50: p.p50,
    p95: p.p95,
    p99: p.p99,
  };
  if (rt.cacheHits !== undefined) {
    metrics.cacheHits = round(rt.cacheHits);
    metrics.cacheMisses = round(rt.cacheMisses ?? 0);
    metrics.hitRate = rt.cfg.hitRate;
  }
  if (rt.shardLoads) metrics.shardLoads = rt.shardLoads.map(round);
  return metrics;
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

/** A node scales its own replicas if it is an autoScaler or has autoScaleEnabled. */
function isAutoScaling(n: NodeConfig): boolean {
  return n.kind === 'autoScaler' || n.autoScaleEnabled === true;
}

export { nodeCapacity };
