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
  nodeCapacity,
  serverServiceRate,
} from './types.js';
import { Topology } from './topology.js';
import { boundedQueueMetrics, mmcMetrics, QueueMetrics } from './queueing.js';
import {
  afterRetryFailProb,
  combineFailureProbs,
  expectedAttempts,
  responseTimeoutFailureProb,
} from './failureModel.js';

/** Mutable cross-tick state owned by the simulator and threaded through solves. */
export interface EngineState {
  /** messageQueue id -> current backlog length. */
  queueLengths: Map<string, number>;
  /** circuitBreaker id -> fraction of traffic to shed this tick [0..1]. */
  breakerShed: Map<string, number>;
  /** Half-open breaker id -> maximum probe requests in this tick. */
  breakerProbeLimit?: Map<string, number>;
  /** Chaos-unavailable nodes reject work without consuming durable backlog. */
  unavailableNodes?: Set<string>;
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
  // Start conservatively: a closed, lossless cycle never answers a request.
  // Solving from zero would incorrectly assign it 100% success forever. The
  // greatest failure fixed point discounts only paths that reach a real sink.
  nodes.forEach((n) => effFail.set(n.id, 1));
  // Relaxation iterations solve ONE tick. Never advance a stateful queue while
  // finding the fixed point, otherwise node ordering/iteration count changes time.
  const tickState = { ...state, queueLengths: new Map(state.queueLengths) };

  let iterations = 0;
  let converged = false;
  let runtime = new Map<string, NodeRuntime>();

  for (let iter = 0; iter < Math.max(MAX_ITERS, nodes.length * 2 + 1); iter++) {
    iterations = iter + 1;
    const nextEffFail = new Map<string, number>();
    let maxDelta = 0;
    let maxFailureDelta = 0;
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
      const rt = processNode(node, arrival, outgoing, tickState, effFail, nodeById);
      runtime.set(node.id, rt);
      nextEffFail.set(node.id, rt.effFailProb);
      maxFailureDelta = Math.max(maxFailureDelta, Math.abs(rt.effFailProb - (effFail.get(node.id) ?? 0)));

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

    if (maxDelta < EPSILON && maxFailureDelta < 1e-7) {
      converged = true;
      break;
    }
  }

  runtime.forEach((rt, id) => {
    if (rt.cfg.kind === 'messageQueue') state.queueLengths.set(id, rt.queue.queueLength);
  });

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

  if (state.unavailableNodes?.has(node.id)) {
    const backlog = node.kind === 'messageQueue' ? state.queueLengths.get(node.id) ?? 0 : 0;
    return { ...base, processed: 0, throughput: 0, dropped: arrival, effFailProb: 1,
      queue: { rho: 0, waitMs: backlog > 0 ? 60000 : 0, responseMs: backlog > 0 ? 60000 : 0,
        queueLength: backlog, inSystem: backlog, saturated: backlog > 0 } };
  }

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
      base.effFailProb = combineFailureProbs(node.failureRate,
        outgoing.length === 0 ? 1 : afterRetryFailProb(weightedDownstreamFail(base.branches, effFail), node.retry));
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
      return queueNode(node, arrival, outgoing, state);
    }

    case 'circuitBreaker': {
      const shed = clamp01(state.breakerShed.get(node.id) ?? 0);
      const probes = state.breakerProbeLimit?.get(node.id);
      const admitted = probes === undefined ? arrival * (1 - shed) : Math.min(arrival, Math.max(0, probes) / state.dtSeconds);
      const rejected = arrival - admitted;
      const rt = capNode(admitted, mu, servers, outgoing, effFail, {});
      rt.arrival = arrival;
      rt.dropped += rejected;
      rt.effFailProb = combineFailureProbs(rt.effFailProb, arrival > 0 ? rejected / arrival : 0);
      return rt;
    }

    case 'shardRouter': {
      const shards = Math.max(1, node.shardCount ?? 1);
      const skew = clamp01(node.skew ?? 0);
      // Hot-shard skew: the hottest shard receives a disproportionate share,
      // so effective capacity is throttled by the busiest shard.
      const hotShare = 1 / shards + skew * (1 - 1 / shards);
      const effectiveCapacity = mu * servers * (1 / Math.max(hotShare * shards, 1e-9));
      // The first downstream destination is the hot partition. Keep displayed
      // shard imbalance and actual downstream traffic consistent.
      const destinationHotShare = outgoing.length > 0 ? 1 / outgoing.length + skew * (1 - 1 / outgoing.length) : 0;
      const branches = outgoing.map((e, i) => ({ edgeId: e.id, target: e.target,
        prob: i === 0 ? destinationHotShare : (1 - destinationHotShare) / Math.max(1, outgoing.length - 1) }));
      const rt = capNodeWithCap(arrival, effectiveCapacity, servers, mu, outgoing, effFail, { branches });
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
      const perNode = Math.max(1, node.concurrency);
      // Reads spread across the whole set; writes are serialized on the primary.
      const effectiveCapacity = nodeCapacity(node);
      const totalServers = Math.max(1, Math.round(perNode * replicaCount));
      const rt = capNodeWithCap(arrival, effectiveCapacity, totalServers, mu, outgoing, effFail, {});
      rt.replicas = replicaCount;
      return rt;
    }

    default: {
      // server, database, autoScaler, externalDependency, loadBalancer.
      const rt = capNode(arrival, mu, servers, outgoing, effFail, node.kind === 'loadBalancer'
        ? { branches: balancerBranches(node, outgoing, nodeById, effFail, state) }
        : {});
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
  // A constrained replica/shard set must queue against its EFFECTIVE capacity,
  // rather than pretending every worker still offers its unconstrained rate.
  const effectiveMu = Number.isFinite(capacity) ? capacity / servers : mu;
  const bounded = Number.isFinite(node.queueCapacity)
    ? boundedQueueMetrics(arrival, effectiveMu, servers, node.queueCapacity)
    : undefined;
  const processed = bounded?.admittedRate ?? Math.min(arrival, capacity);
  const dropped = Math.max(0, arrival - processed);
  const queue = bounded ?? mmcMetrics(arrival, effectiveMu, servers);
  const timeoutP = nodeTimeoutFailure(node, queue.waitMs);
  const serviceFail = combineFailureProbs(node.failureRate, timeoutP);
  const failedInService = processed * serviceFail;
  const throughput = processed - failedInService;

  const terminateProb = extra.terminateProb ?? (outgoing.length === 0 ? 1 : 0);
  const branches: RouteBranch[] = extra.branches ?? outgoing.map((e) => ({
    edgeId: e.id,
    target: e.target,
    prob: outgoing.length ? 1 / outgoing.length : 0,
  }));

  // Local failure as seen by the caller: drops + in-service failures.
  const localFail = arrival > 0 ? (dropped + failedInService) / arrival : 0;
  // An isolated cache can answer its hits, but a miss without an origin fails.
  const downstreamFail = node.kind === 'cache' && branches.length === 0
    ? 1 : weightedDownstreamFail(branches, effFail);
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
): NodeRuntime {
  const maxQueue = node.maxQueue ?? Infinity;
  const drainRate = node.dequeueRate ?? 50;
  const dt = state.dtSeconds;
  const initialBacklog = state.queueLengths.get(node.id) ?? 0;

  const enqueueFailed = arrival * clamp01(node.failureRate);
  const incoming = (arrival - enqueueFailed) * dt;
  // Producers and consumers run concurrently over the tick. Filling the whole
  // input batch before draining falsely drops traffic even when drain >= input.
  const available = initialBacklog + incoming;
  const drained = Math.min(available, drainRate * dt);
  const dropped = Math.max(0, available - drained - maxQueue);
  const backlog = Math.max(0, available - drained - dropped);

  const drainPerSec = drained / dt;
  const droppedPerSec = dropped / dt;

  // Queue wait grows with backlog: Wq ~ backlog / drainRate.
  const waitMs = drainRate > 0 ? ((initialBacklog + backlog) / 2 / drainRate) * 1000 : 60000;
  const serviceMs = node.serviceTimeMs;
  const responseMs = waitMs + serviceMs;

  // timeoutMs is the producer ACK budget, not a message TTL. Accepted durable
  // messages keep waiting and drain at the configured rate. Worker timeouts
  // apply at the worker; delivery acknowledgements/requeue are not modeled.
  const throughput = drainPerSec;

  const terminateProb = outgoing.length === 0 ? 1 : 0;
  const branches: RouteBranch[] = outgoing.map((e) => ({
    edgeId: e.id,
    target: e.target,
    prob: outgoing.length ? 1 / outgoing.length : 0,
  }));
  // A durable broker acknowledges a producer on admission. Worker failures or
  // later delivery timeouts cannot retroactively fail an accepted request.
  const enqueueTimeout = responseTimeoutFailureProb(serviceMs, 0, node.timeoutMs, node.latencyDistribution, node.latencyCv);
  const localFail = arrival > 0 ? (droppedPerSec + enqueueFailed) / arrival : 0;
  const effFailProb = combineFailureProbs(localFail, enqueueTimeout);

  return {
    cfg: node,
    replicas: node.replicas,
    servers: 1,
    arrival,
    processed: drainPerSec,
    throughput,
    failed: enqueueFailed,
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
  state: EngineState,
): RouteBranch[] {
  if (outgoing.length === 0) return [];
  const strategy = node.strategy ?? 'roundRobin';

  if (strategy === 'weighted') {
    const weights = node.weights ?? {};
    const raw = outgoing.map((e) => Math.max(0, weights[e.target] ?? 1));
    const total = raw.reduce((s, w) => s + w, 0);
    return outgoing.map((e, i) => ({ edgeId: e.id, target: e.target, prob: total > 0 ? raw[i] / total : 1 / outgoing.length }));
  }

  if (strategy === 'leastConnections') {
    // Approximate least-connections by steering away from saturated targets:
    // weight inversely with the target's effective failure probability + a
    // capacity-aware term keeps the split balanced under uniform health.
    const raw = outgoing.map((e) => {
      const fail = effFail.get(e.target) ?? 0;
      const target = nodeById.get(e.target);
      if (!target) return 0;
      const replicas = state.replicaOverride.get(target.id) ?? target.replicas;
      const targetCapacity = nodeCapacity({ ...target, replicas });
      const capacity = Number.isFinite(targetCapacity) ? targetCapacity : 1e9;
      return capacity * (1 - fail);
    });
    const total = raw.reduce((s, w) => s + w, 0);
    return outgoing.map((e, i) => ({ edgeId: e.id, target: e.target, prob: total > 0 ? raw[i] / total : 1 / outgoing.length }));
  }

  // roundRobin and hashing both produce an even aggregate split.
  return outgoing.map((e) => ({ edgeId: e.id, target: e.target, prob: 1 / outgoing.length }));
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function nodeTimeoutFailure(node: NodeConfig, waitMs: number): number {
  const tail = (ackMs: number) => node.timeoutMs > 0 && Number.isFinite(node.timeoutMs) && ackMs >= node.timeoutMs
    ? 1 : responseTimeoutFailureProb(node.serviceTimeMs, waitMs, node.timeoutMs - ackMs, node.latencyDistribution, node.latencyCv);
  if (node.kind !== 'replicatedDb' || (node.replicaCount ?? 1) <= 1 || node.consistency === 'eventual') return tail(0);
  const writes = clamp01(node.writeFraction ?? 0.2);
  return (1 - writes) * tail(0) + writes * tail(Math.max(0, node.replicationLagMs ?? 0));
}
