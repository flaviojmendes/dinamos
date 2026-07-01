// Fluid / rate-based steady-state solver.
//
// Computes per-node arrival rates, throughput, utilization, failures and the
// routing probabilities the latency tracer needs. Cycles (retry loops, queue
// feedback, replication) are handled by Gauss-Seidel relaxation: we iterate the
// whole graph until edge flows converge, reading the previous iteration's
// failure estimates for retry amplification.

import {
  EdgeSpec,
  NodeConfig,
  serverServiceRate,
} from './types';
import { Topology } from './topology';
import { mmcMetrics, QueueMetrics } from './queueing';
import {
  afterRetryFailProb,
  combineFailureProbs,
  expectedAttempts,
  timeoutFailureProb,
} from './failureModel';

/** Mutable cross-tick state owned by the simulator and threaded through solves. */
export interface EngineState {
  /** messageQueue id -> current backlog length. */
  queueLengths: Map<string, number>;
  /** circuitBreaker id -> fraction of traffic to shed this tick [0..1]. */
  breakerShed: Map<string, number>;
  /** autoScaler id -> current replica count override. */
  replicaOverride: Map<string, number>;
  dtSeconds: number;
}

export interface RouteBranch {
  edgeId: string;
  target: string;
  prob: number;
}

export interface NodeRuntime {
  cfg: NodeConfig;
  /** Effective replicas this tick (autoscaler may override). */
  replicas: number;
  servers: number;
  /** Offered load reaching the node (req/s), retries included. */
  arrival: number;
  /** Requests admitted into service after shedding/throttling (req/s). */
  processed: number;
  /** Requests that completed successfully here (req/s). */
  throughput: number;
  failed: number;
  dropped: number;
  retried: number;
  utilization: number;
  queue: QueueMetrics;
  /** Per-request probability a caller's request fails at this node or below. */
  effFailProb: number;
  /** Fraction of processed traffic that terminates here (cache hit / sink). */
  terminateProb: number;
  branches: RouteBranch[];
  cacheHits?: number;
  cacheMisses?: number;
  shardLoads?: number[];
}

export interface SolveResult {
  runtime: Map<string, NodeRuntime>;
  edgeFlow: Map<string, number>;
  iterations: number;
  converged: boolean;
}

const MAX_ITERS = 80;
const EPSILON = 0.25; // req/s convergence tolerance

export function solveFlow(
  nodes: NodeConfig[],
  edges: EdgeSpec[],
  topo: Topology,
  state: EngineState,
): SolveResult {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edgeFlow = new Map<string, number>();
  edges.forEach((e) => edgeFlow.set(e.id, 0));

  // effFailProb from the previous iteration, used for retry amplification.
  const effFail = new Map<string, number>();
  nodes.forEach((n) => effFail.set(n.id, 0));

  let iterations = 0;
  let converged = false;
  let runtime = new Map<string, NodeRuntime>();

  for (let iter = 0; iter < MAX_ITERS; iter++) {
    iterations = iter + 1;
    const nextEffFail = new Map<string, number>();
    let maxDelta = 0;
    runtime = new Map<string, NodeRuntime>();

    for (const node of nodes) {
      const incoming = topo.incoming.get(node.id) ?? [];
      // Cron-enabled nodes self-generate load on a schedule, so they act as a
      // source: their arrival is the incoming edge flow plus their own cron rate.
      const cronRate = node.cronEnabled ? Math.max(0, node.cronRate ?? 0) : 0;
      const arrival =
        node.kind === 'client'
          ? Math.max(0, node.baseRate ?? 0)
          : incoming.reduce((sum, e) => sum + (edgeFlow.get(e.id) ?? 0), 0) + cronRate;

      const outgoing = topo.outgoing.get(node.id) ?? [];
      const rt = processNode(node, arrival, outgoing, state, effFail, nodeById);
      runtime.set(node.id, rt);
      nextEffFail.set(node.id, rt.effFailProb);

      // Push forwarded flow onto outgoing edges with retry amplification.
      const forwarded = rt.throughput * (1 - rt.terminateProb);
      const downstreamFail = weightedDownstreamFail(rt.branches, effFail);
      const attempts = expectedAttempts(downstreamFail, node.retry);
      const amplified = forwarded * attempts;

      rt.retried = amplified - forwarded;

      for (const b of rt.branches) {
        const flow = amplified * b.prob;
        const prev = edgeFlow.get(b.edgeId) ?? 0;
        maxDelta = Math.max(maxDelta, Math.abs(flow - prev));
        edgeFlow.set(b.edgeId, flow);
      }
    }

    nextEffFail.forEach((v, k) => effFail.set(k, v));

    if (maxDelta < EPSILON) {
      converged = true;
      break;
    }
  }

  return { runtime, edgeFlow, iterations, converged };
}

function weightedDownstreamFail(branches: RouteBranch[], effFail: Map<string, number>): number {
  if (branches.length === 0) return 0;
  let acc = 0;
  let total = 0;
  for (const b of branches) {
    acc += b.prob * (effFail.get(b.target) ?? 0);
    total += b.prob;
  }
  return total > 0 ? acc / total : 0;
}

function processNode(
  node: NodeConfig,
  arrival: number,
  outgoing: EdgeSpec[],
  state: EngineState,
  effFail: Map<string, number>,
  nodeById: Map<string, NodeConfig>,
): NodeRuntime {
  const replicas = state.replicaOverride.get(node.id) ?? node.replicas;
  const mu = serverServiceRate(node);
  const servers = Math.max(1, Math.round(node.concurrency * replicas));

  // Default branch routing: even split across outgoing edges.
  const evenBranches = (): RouteBranch[] =>
    outgoing.map((e) => ({ edgeId: e.id, target: e.target, prob: outgoing.length ? 1 / outgoing.length : 0 }));

  const base: NodeRuntime = {
    cfg: node,
    replicas,
    servers,
    arrival,
    processed: arrival,
    throughput: arrival,
    failed: 0,
    dropped: 0,
    retried: 0,
    utilization: 0,
    queue: mmcMetrics(arrival, mu, servers),
    effFailProb: 0,
    terminateProb: outgoing.length === 0 ? 1 : 0,
    branches: evenBranches(),
  };

  // Closures capture the effective replica count so capacity helpers report it.
  const capNode = (arr: number, m: number, srv: number, out: EdgeSpec[], ef: Map<string, number>, extra: Partial<NodeRuntime>) =>
    capacityNode(node, arr, m, srv, out, ef, extra, replicas);
  const capNodeWithCap = (arr: number, cap: number, srv: number, m: number, out: EdgeSpec[], ef: Map<string, number>, extra: Partial<NodeRuntime>) =>
    capacityNodeWithCap(node, arr, cap, srv, m, out, ef, extra, replicas);

  switch (node.kind) {
    case 'client': {
      // Clients generate load; they do not queue. Their own failure rate models
      // client-side errors. They always forward downstream.
      const fail = arrival * node.failureRate;
      base.processed = arrival;
      base.failed = fail;
      base.throughput = arrival - fail;
      base.terminateProb = 0;
      base.utilization = 0;
      base.queue = mmcMetrics(0, mu, servers);
      base.effFailProb = node.failureRate;
      return base;
    }

    case 'cache': {
      const hit = clamp01(node.hitRate ?? 0.8);
      return capNode(arrival, mu, servers, outgoing, effFail, {
        terminateProb: hit,
        cacheHits: 0, // filled below
        cacheMisses: 0,
      });
    }

    case 'apiGateway': {
      const limit = node.rateLimit ?? Infinity;
      const throttled = Math.max(0, arrival - limit);
      const admitted = Math.min(arrival, limit);
      const rt = capNode(admitted, mu, servers, outgoing, effFail, {});
      // Fold throttling into drops/arrival so the caller sees it as failures.
      rt.arrival = arrival;
      rt.dropped += throttled;
      rt.effFailProb = combineFailureProbs(
        rt.effFailProb,
        arrival > 0 ? throttled / arrival : 0,
      );
      return rt;
    }

    case 'messageQueue': {
      return queueNode(node, arrival, outgoing, state, effFail);
    }

    case 'circuitBreaker': {
      const shed = clamp01(state.breakerShed.get(node.id) ?? 0);
      const admitted = arrival * (1 - shed);
      const rejected = arrival * shed;
      const rt = capNode(admitted, mu, servers, outgoing, effFail, {});
      rt.arrival = arrival;
      rt.dropped += rejected;
      rt.effFailProb = combineFailureProbs(rt.effFailProb, shed);
      return rt;
    }

    case 'shardRouter': {
      const shards = Math.max(1, node.shardCount ?? 1);
      const skew = clamp01(node.skew ?? 0);
      // Hot-shard skew: the hottest shard receives a disproportionate share,
      // so effective capacity is throttled by the busiest shard.
      const hotShare = 1 / shards + skew * (1 - 1 / shards);
      const effectiveCapacity = mu * servers * (1 / Math.max(hotShare * shards, 1e-9));
      const rt = capNodeWithCap(arrival, effectiveCapacity, servers, mu, outgoing, effFail, {});
      const loads: number[] = [];
      for (let i = 0; i < shards; i++) {
        const share = i === 0 ? hotShare : (1 - hotShare) / Math.max(shards - 1, 1);
        loads.push(rt.processed * share);
      }
      rt.shardLoads = loads;
      return rt;
    }

    case 'replicatedDb': {
      // For a replicated DB the replica set size is a single knob (replicaCount):
      // one primary plus read replicas. Each node has `concurrency` workers.
      const replicaCount = Math.max(1, node.replicaCount ?? 1);
      const writeFrac = clamp01(node.writeFraction ?? 0.2);
      const perNode = Math.max(1, node.concurrency);
      // Reads spread across the whole set; writes are serialized on the primary.
      const readCap = mu * perNode * replicaCount;
      const writeCap = mu * perNode;
      const effectiveCapacity = 1 / ((1 - writeFrac) / readCap + writeFrac / writeCap);
      const totalServers = Math.max(1, Math.round(perNode * replicaCount));
      const rt = capNodeWithCap(arrival, effectiveCapacity, totalServers, mu, outgoing, effFail, {});
      rt.replicas = replicaCount;
      return rt;
    }

    default: {
      // server, database, autoScaler, externalDependency, loadBalancer.
      const rt = capNode(arrival, mu, servers, outgoing, effFail, {});
      if (node.kind === 'loadBalancer') {
        rt.branches = balancerBranches(node, outgoing, nodeById, effFail);
      }
      return rt;
    }
  }
}

/** Standard capacity-limited node using M/M/c with capacity = servers * mu. */
function capacityNode(
  node: NodeConfig,
  arrival: number,
  mu: number,
  servers: number,
  outgoing: EdgeSpec[],
  effFail: Map<string, number>,
  extra: Partial<NodeRuntime>,
  replicas: number,
): NodeRuntime {
  const capacity = isFinite(mu) ? servers * mu : Infinity;
  return capacityNodeWithCap(node, arrival, capacity, servers, mu, outgoing, effFail, extra, replicas);
}

function capacityNodeWithCap(
  node: NodeConfig,
  arrival: number,
  capacity: number,
  servers: number,
  mu: number,
  outgoing: EdgeSpec[],
  effFail: Map<string, number>,
  extra: Partial<NodeRuntime>,
  replicas: number,
): NodeRuntime {
  const dropped = isFinite(capacity) ? Math.max(0, arrival - capacity) : 0;
  const processed = arrival - dropped;

  const queue = mmcMetrics(processed, mu, servers);
  const timeoutP = timeoutFailureProb(queue.responseMs, node.timeoutMs);
  const serviceFail = combineFailureProbs(node.failureRate, timeoutP);
  const failedInService = processed * serviceFail;
  const throughput = processed - failedInService;

  const terminateProb = extra.terminateProb ?? (outgoing.length === 0 ? 1 : 0);
  const branches: RouteBranch[] = outgoing.map((e) => ({
    edgeId: e.id,
    target: e.target,
    prob: outgoing.length ? 1 / outgoing.length : 0,
  }));

  // Local failure as seen by the caller: drops + in-service failures.
  const localFail = arrival > 0 ? (dropped + failedInService) / arrival : 0;
  const downstreamFail = weightedDownstreamFail(branches, effFail);
  const downstreamAfterRetry = afterRetryFailProb(downstreamFail, node.retry);
  const forwardShare = 1 - terminateProb;
  const effFailProb = combineFailureProbs(localFail, forwardShare * downstreamAfterRetry);

  const rt: NodeRuntime = {
    cfg: node,
    replicas,
    servers,
    arrival,
    processed,
    throughput,
    failed: failedInService,
    dropped,
    retried: 0,
    utilization: capacity > 0 && isFinite(capacity) ? arrival / capacity : 0,
    queue,
    effFailProb,
    terminateProb,
    branches,
  };

  if (extra.cacheHits !== undefined) {
    rt.cacheHits = throughput * (extra.terminateProb ?? 0);
    rt.cacheMisses = throughput * (1 - (extra.terminateProb ?? 0));
  }

  return rt;
}

/** Message queue with cross-tick backlog (req/s in, bounded buffer, drain). */
function queueNode(
  node: NodeConfig,
  arrival: number,
  outgoing: EdgeSpec[],
  state: EngineState,
  effFail: Map<string, number>,
): NodeRuntime {
  const maxQueue = node.maxQueue ?? Infinity;
  const drainRate = node.dequeueRate ?? 50;
  const dt = state.dtSeconds;
  let backlog = state.queueLengths.get(node.id) ?? 0;

  const incoming = arrival * dt;
  let dropped = 0;
  if (backlog + incoming > maxQueue) {
    dropped = backlog + incoming - maxQueue;
    backlog = maxQueue;
  } else {
    backlog += incoming;
  }

  const drained = Math.min(backlog, drainRate * dt);
  backlog -= drained;
  state.queueLengths.set(node.id, backlog);

  const drainPerSec = drained / dt;
  const droppedPerSec = dropped / dt;

  // Queue wait grows with backlog: Wq ~ backlog / drainRate.
  const waitMs = drainRate > 0 ? (backlog / drainRate) * 1000 : 60000;
  const serviceMs = node.serviceTimeMs;
  const responseMs = waitMs + serviceMs;

  const serviceFail = combineFailureProbs(
    node.failureRate,
    timeoutFailureProb(responseMs, node.timeoutMs),
  );
  const failed = drainPerSec * serviceFail;
  const throughput = drainPerSec - failed;

  const terminateProb = outgoing.length === 0 ? 1 : 0;
  const branches: RouteBranch[] = outgoing.map((e) => ({
    edgeId: e.id,
    target: e.target,
    prob: outgoing.length ? 1 / outgoing.length : 0,
  }));
  const downstreamFail = weightedDownstreamFail(branches, effFail);
  const localFail = arrival > 0 ? droppedPerSec / arrival : 0;
  const effFailProb = combineFailureProbs(localFail, serviceFail, (1 - terminateProb) * downstreamFail);

  return {
    cfg: node,
    replicas: node.replicas,
    servers: 1,
    arrival,
    processed: drainPerSec,
    throughput,
    failed,
    dropped: droppedPerSec,
    retried: 0,
    utilization: drainRate > 0 ? Math.min(2, arrival / drainRate) : 1,
    queue: {
      rho: drainRate > 0 ? arrival / drainRate : 1,
      waitMs,
      responseMs,
      queueLength: backlog,
      inSystem: backlog + drainPerSec * (serviceMs / 1000),
      saturated: arrival > drainRate,
    },
    effFailProb,
    terminateProb,
    branches,
  };
}

/** Load-balancer routing weights by strategy. */
function balancerBranches(
  node: NodeConfig,
  outgoing: EdgeSpec[],
  nodeById: Map<string, NodeConfig>,
  effFail: Map<string, number>,
): RouteBranch[] {
  if (outgoing.length === 0) return [];
  const strategy = node.strategy ?? 'roundRobin';

  if (strategy === 'weighted') {
    const weights = node.weights ?? {};
    const raw = outgoing.map((e) => Math.max(0, weights[e.target] ?? 1));
    const total = raw.reduce((s, w) => s + w, 0) || 1;
    return outgoing.map((e, i) => ({ edgeId: e.id, target: e.target, prob: raw[i] / total }));
  }

  if (strategy === 'leastConnections') {
    // Approximate least-connections by steering away from saturated targets:
    // weight inversely with the target's effective failure probability + a
    // capacity-aware term keeps the split balanced under uniform health.
    const raw = outgoing.map((e) => {
      const fail = effFail.get(e.target) ?? 0;
      return 1 - 0.9 * fail;
    });
    const total = raw.reduce((s, w) => s + w, 0) || 1;
    return outgoing.map((e, i) => ({ edgeId: e.id, target: e.target, prob: raw[i] / total }));
  }

  // roundRobin and hashing both produce an even aggregate split.
  return outgoing.map((e) => ({ edgeId: e.id, target: e.target, prob: 1 / outgoing.length }));
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
