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
} from './types.js';
import { buildTopology, validateTopology } from './topology.js';
import { EngineState, solveFlow, NodeRuntime } from './fluidSolver.js';
import { CircuitBreaker } from './failureModel.js';
import { traceLatency } from './latencyTracer.js';
import { Rng } from './rng.js';
import { ChaosEvent, LoadProfile, isChaosActive, makeLoadProfile } from './scenarios.js';
import { estimateNodeCostPerHour, CloudProvider } from './costModel.js';
import { AUTOSCALER_DOWNSCALE_WINDOW_SECONDS, AUTOSCALER_INTERVAL_SECONDS } from './constants.js';

const HISTORY_LIMIT = 240;

export class Simulator {
  private nodes: NodeConfig[];
  private edges: EdgeSpec[];
  private readonly dt: number;
  private readonly traceSamples: number;
  private rng: Rng;
  private seed: number;
  private time = 0;
  private ticks = 0;

  private state: EngineState;
  private breakers = new Map<string, CircuitBreaker>();
  private scalerLastEvaluation = new Map<string, number>();
  private scalerRecommendations = new Map<string, { time: number; replicas: number }[]>();
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
    this.dt = config.dtSeconds ?? 1;
    this.traceSamples = config.traceSamples ?? 2000;
    if (!Number.isFinite(this.dt) || this.dt <= 0) {
      throw new RangeError('Simulation dtSeconds must be finite and greater than zero');
    }
    if (!Number.isInteger(this.traceSamples) || this.traceSamples <= 0) {
      throw new RangeError('Simulation traceSamples must be a positive integer');
    }
    this.seed = config.seed;
    this.rng = new Rng(config.seed);
    this.profile = makeLoadProfile('constant');
    this.state = {
      queueLengths: new Map(),
      breakerShed: new Map(),
      breakerProbeLimit: new Map(),
      unavailableNodes: new Set(),
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
        const { min, max } = scalingBounds(n);
        this.state.replicaOverride.set(n.id, Math.max(min, Math.min(max, n.replicas)));
        this.scalerLastEvaluation.set(n.id, this.time);
        this.scalerRecommendations.set(n.id, []);
      }
    });
  }

  /** Replace the graph (e.g. user edits) without losing the clock. */
  setGraph(nodes: NodeConfig[], edges: EdgeSpec[]): void {
    const previous = new Map(this.nodes.map((n) => [n.id, n]));
    this.nodes = nodes;
    this.edges = edges;
    // State belongs to a node kind, not just its id. Reusing an id for another
    // kind must not resurrect old backlog, a tripped breaker or replica count.
    const byId = new Map(nodes.map((n) => [n.id, n]));
    [...this.state.queueLengths.keys()].forEach((id) => byId.get(id)?.kind !== 'messageQueue' && this.state.queueLengths.delete(id));
    [...this.breakers.keys()].forEach((id) => {
      if (byId.get(id)?.kind === 'circuitBreaker') return;
      this.breakers.delete(id);
      this.state.breakerShed.delete(id);
      this.state.breakerProbeLimit?.delete(id);
    });
    [...this.state.replicaOverride.keys()].forEach((id) => {
      const node = byId.get(id);
      if (node && isAutoScaling(node)) return;
      this.state.replicaOverride.delete(id);
      this.scalerLastEvaluation.delete(id);
      this.scalerRecommendations.delete(id);
    });
    nodes.forEach((n) => {
      const old = previous.get(n.id);
      if (n.kind === 'circuitBreaker' && (!this.breakers.has(n.id) ||
        n.errorThreshold !== old?.errorThreshold || n.resetTimeoutMs !== old?.resetTimeoutMs)) {
        this.breakers.set(n.id, new CircuitBreaker(n.errorThreshold ?? 0.5, n.resetTimeoutMs ?? 5000));
        this.state.breakerShed.delete(n.id);
        this.state.breakerProbeLimit?.delete(n.id);
      }
      if (isAutoScaling(n)) {
        const { min, max } = scalingBounds(n);
        const current = n.replicas !== old?.replicas ? n.replicas : this.state.replicaOverride.get(n.id) ?? n.replicas;
        this.state.replicaOverride.set(n.id, Math.max(min, Math.min(max, current)));
        if (!this.scalerLastEvaluation.has(n.id) || n.replicas !== old?.replicas) {
          this.scalerLastEvaluation.set(n.id, this.time);
          this.scalerRecommendations.set(n.id, []);
        }
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
    this.ticks = 0;
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
    this.state.breakerProbeLimit?.clear();
    this.state.unavailableNodes?.clear();
    this.scalerLastEvaluation.clear();
    this.scalerRecommendations.clear();
    this.initStatefulNodes();
  }

  get currentTime(): number {
    return this.time;
  }

  /** Run one simulation step and return the resulting frame. */
  tick(): SimulationFrame {
    // A frame describes [time, time + dt). Sampling at the interval's end
    // skips an outage scheduled for [0, 1) entirely with the default 1s step.
    this.state.unavailableNodes = new Set(this.chaos
      .filter((event) => (event.type === 'killNode' || event.type === 'partition') && isChaosActive(event, this.time))
      .map((event) => event.targetId));
    const mult = this.profile.multiplierAt(this.time);
    const effectiveNodes = this.applyChaosAndLoad(mult);
    const effectiveEdges = this.edges;
    this.prepareBreakers();

    const topo = buildTopology(effectiveNodes, effectiveEdges);
    const result = solveFlow(effectiveNodes, effectiveEdges, topo, this.state);

    this.time = ++this.ticks * this.dt;
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
        if (ev.type === 'killNode' || ev.type === 'partition') {
          // Keep dependency edges: removing them would turn the upstream
          // service into a successful terminal node during a network outage.
          cfg = { ...cfg, failureRate: 1 };
        } else if (ev.type === 'latencyInjection') {
          cfg = { ...cfg, serviceTimeMs: cfg.serviceTimeMs * (ev.magnitude ?? 5) };
        }
      }
      return cfg;
    });
  }

  private prepareBreakers(): void {
    this.breakers.forEach((breaker, id) => {
      breaker.advance(this.time * 1000);
      this.state.breakerShed.set(id, breaker.state === 'open' ? 1 : 0);
      if (breaker.state === 'halfOpen') this.state.breakerProbeLimit?.set(id, 1);
      else this.state.breakerProbeLimit?.delete(id);
    });
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
      // An open breaker has no observations; a half-open breaker may only
      // recover after an admitted probe actually reaches the dependency.
      breaker.update(errorRate, this.time * 1000, rt.throughput * this.dt);
    });
  }

  private updateAutoscalers(runtime: Map<string, NodeRuntime>): void {
    this.nodes.forEach((n) => {
      if (!isAutoScaling(n)) return;
      // An unavailable node has missing load observations, not zero demand.
      if (this.state.unavailableNodes?.has(n.id)) return;
      const rt = runtime.get(n.id);
      if (!rt) return;
      const lastEvaluation = this.scalerLastEvaluation.get(n.id) ?? 0;
      if (this.time - lastEvaluation < AUTOSCALER_INTERVAL_SECONDS - 1e-9) return;
      this.scalerLastEvaluation.set(n.id, this.time);
      const target = Math.max(0.01, n.targetUtilization ?? 0.7);
      const { min, max } = scalingBounds(n);
      const current = this.state.replicaOverride.get(n.id) ?? n.replicas;
      const ratio = rt.utilization / target;
      const desired = Math.max(min, Math.min(max,
        Math.abs(1 - ratio) <= 0.1 ? current : Math.ceil(current * ratio),
      ));
      const recommendations = (this.scalerRecommendations.get(n.id) ?? [])
        .filter((r) => this.time - r.time < AUTOSCALER_DOWNSCALE_WINDOW_SECONDS);
      recommendations.push({ time: this.time, replicas: desired });
      this.scalerRecommendations.set(n.id, recommendations);
      // Keep the highest recent recommendation when scaling down; a single
      // quiet interval should not immediately remove provisioned capacity.
      const stabilized = desired < current
        ? Math.max(...recommendations.map((r) => r.replicas))
        : desired;
      this.state.replicaOverride.set(n.id, Math.max(min, Math.min(max, stabilized)));
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

    const configuredById = new Map(this.nodes.map((n) => [n.id, n]));
    runtime.forEach((rt) => {
      inFlight += rt.queue.inSystem;
      // Chaos changes response time, not the price of already provisioned
      // hardware. Retain actual runtime replica counts for autoscaling costs.
      const configured = configuredById.get(rt.cfg.id);
      const billingRuntime = configured && configured.serviceTimeMs !== rt.cfg.serviceTimeMs
        ? { ...rt, cfg: { ...rt.cfg, serviceTimeMs: configured.serviceTimeMs } }
        : rt;
      costPerHour += estimateNodeCostPerHour(billingRuntime, this.provider);
    });

    // Aggregate every source of externally-offered work: clients emit `arrival`,
    // cron-enabled nodes emit their self-generated `cronRate`. Each source's load
    // is discounted by the fraction that fails locally or anywhere downstream.
    runtime.forEach((rt) => {
      if (rt.cfg.kind === 'client') {
        const load = rt.arrival;
        if (load <= 0) return;
        offered += load;
        // The solver includes client-side failure, downstream dependencies and
        // residual failure after this client's retries exactly once.
        totalThroughput += load * (1 - rt.effFailProb);
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

function scalingBounds(n: NodeConfig): { min: number; max: number } {
  const min = Math.max(1, Math.ceil(n.minReplicas ?? 1));
  const max = Math.max(min, Math.floor(n.maxReplicas ?? 20));
  return { min, max };
}

export { nodeCapacity };
