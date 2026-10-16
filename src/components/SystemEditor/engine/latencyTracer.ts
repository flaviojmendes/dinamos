// Sampled request tracing for tail-latency percentiles.
//
// The fluid solver gives us mean per-node response times and routing
// probabilities. To recover realistic p95/p99 we Monte-Carlo a batch of
// synthetic requests through the resolved graph, sampling each hop's service
// time from its configured distribution plus an exponential queue-wait whose
// mean equals the queue's Wq. End-to-end and per-node samples are reduced to
// percentiles.

import { NodeRuntime } from './fluidSolver.js';
import { Rng } from './rng.js';

export interface Percentiles {
  p50: number;
  p95: number;
  p99: number;
}

export interface TraceResult {
  perNode: Map<string, Percentiles>;
  system: Percentiles;
}

const MAX_HOPS = 64;

export function traceLatency(
  runtime: Map<string, NodeRuntime>,
  rng: Rng,
  samples: number,
): TraceResult {
  const nodes = [...runtime.values()];
  // The safety limit must still permit a valid long acyclic architecture.
  const maxHops = Math.max(MAX_HOPS, runtime.size * 2);

  // Include scheduled workers as sources, and keep failed client attempts in
  // the latency population (a timeout must not disappear from the percentiles).
  const sources = nodes.map((rt) => ({
    rt,
    rate: rt.cfg.kind === 'client' ? rt.arrival : rt.cfg.cronEnabled ? Math.max(0, rt.cfg.cronRate ?? 0) : 0,
  })).filter((source) => source.rate > 0);
  const perNodeSamples = new Map<string, number[]>();
  const e2eSamples: number[] = [];

  const sourceTotal = sources.reduce((sum, source) => sum + source.rate, 0);

  const visit = (rt: NodeRuntime, budget: { hops: number }, delivery = false): { latency: number; failed: boolean } => {
    if (budget.hops++ >= maxHops) return { latency: 0, failed: true };
    // Rejections do not spend a full service/queue time at the rejected node.
    const brokerAck = rt.cfg.kind === 'messageQueue' && !delivery;
    const rejected = !delivery && rt.arrival > 0 && rng.next() < Math.min(1, rt.dropped / rt.arrival);
    const rawLatency = rejected ? 0 : hopLatency(rt, rng, brokerAck);
    // A broker's ACK timeout cannot expire messages waiting for delivery.
    const deadline = !delivery && rt.cfg.timeoutMs > 0 && Number.isFinite(rt.cfg.timeoutMs) ? rt.cfg.timeoutMs : Infinity;
    const localLatency = Math.min(rawLatency, deadline);
    if (!brokerAck) recordSample(perNodeSamples, rt.cfg.id, localLatency);
    if (rejected || rawLatency > deadline || (!delivery && rng.next() < rt.cfg.failureRate)) {
      return { latency: localLatency, failed: true };
    }
    if (brokerAck) return { latency: localLatency, failed: false };
    if (rt.branches.length === 0) {
      return { latency: localLatency, failed: rt.cfg.kind === 'client' ||
        (rt.cfg.kind === 'cache' && rng.next() >= rt.terminateProb) };
    }
    if (rng.next() < rt.terminateProb) return { latency: localLatency, failed: false };

    let latency = localLatency;
    const retries = Math.max(0, Math.floor(rt.cfg.retry?.maxRetries ?? 0));
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) {
        const backoff = Math.max(0, rt.cfg.retry?.backoffBaseMs ?? 0) * 2 ** (attempt - 1);
        latency += rt.cfg.retry?.jitter ? rng.range(0, backoff) : backoff;
      }
      const childId = pickBranch(rt, rng);
      const child = childId ? runtime.get(childId) : undefined;
      if (!child) return { latency, failed: true };
      const result = visit(child, budget);
      latency += result.latency;
      if (!result.failed) return { latency, failed: false };
      if (budget.hops >= maxHops) break;
    }
    return { latency, failed: true };
  };

  for (let i = 0; sourceTotal > 0 && i < samples; i++) {
    let draw = rng.next() * sourceTotal;
    let source = sources[sources.length - 1].rt;
    for (const candidate of sources) {
      draw -= candidate.rate;
      if (draw <= 0) { source = candidate.rt; break; }
    }
    e2eSamples.push(visit(source, { hops: 0 }).latency);
  }

  // Consumers execute asynchronously after the producer's acknowledgement.
  // Trace their local/worker latency separately, without extending HTTP time.
  const queues = nodes.filter((rt) => rt.cfg.kind === 'messageQueue' && rt.processed > 0);
  const deliveries = queues.reduce((sum, rt) => sum + rt.processed, 0);
  for (const queue of queues) {
    const count = Math.ceil(samples * queue.processed / deliveries);
    for (let i = 0; i < count; i++) visit(queue, { hops: 0 }, true);
  }

  const perNode = new Map<string, Percentiles>();
  runtime.forEach((_, id) => {
    perNode.set(id, percentiles(perNodeSamples.get(id) ?? []));
  });

  return { perNode, system: percentiles(e2eSamples) };
}

function hopLatency(rt: NodeRuntime, rng: Rng, brokerAck = false): number {
  const cfg = rt.cfg;
  const service = sampleService(cfg.serviceTimeMs, cfg.latencyDistribution, cfg.latencyCv, rng);
  // Queue wait is approximately exponential with mean Wq.
  const wait = !brokerAck && rt.queue.waitMs > 0 ? rng.exponential(rt.queue.waitMs) : 0;
  let total = service + wait;
  // Only synchronous WRITES wait for replica acknowledgement; reads and
  // eventual writes must not all inherit the configured replication delay.
  if (cfg.kind === 'replicatedDb' && (cfg.replicaCount ?? 1) > 1 && cfg.consistency !== 'eventual'
    && rng.next() < Math.min(1, Math.max(0, cfg.writeFraction ?? 0.2))) {
    total += cfg.replicationLagMs ?? 0;
  }
  return total;
}

function sampleService(
  meanMs: number,
  dist: string,
  cv: number,
  rng: Rng,
): number {
  if (meanMs <= 0) return 0;
  switch (dist) {
    case 'deterministic':
      return meanMs;
    case 'exponential':
      return rng.exponential(meanMs);
    case 'lognormal':
    default:
      return rng.lognormal(meanMs, cv);
  }
}

function pickBranch(rt: NodeRuntime, rng: Rng): string | undefined {
  const total = rt.branches.reduce((s, b) => s + b.prob, 0);
  if (total <= 0) return undefined;
  let r = rng.next() * total;
  for (const b of rt.branches) {
    r -= b.prob;
    if (r <= 0) return b.target;
  }
  return rt.branches[rt.branches.length - 1]?.target;
}

function recordSample(map: Map<string, number[]>, id: string, value: number): void {
  const arr = map.get(id);
  if (arr) arr.push(value);
  else map.set(id, [value]);
}

export function percentiles(samples: number[]): Percentiles {
  if (samples.length === 0) return { p50: 0, p95: 0, p99: 0 };
  const sorted = [...samples].sort((a, b) => a - b);
  return {
    p50: quantile(sorted, 0.5),
    p95: quantile(sorted, 0.95),
    p99: quantile(sorted, 0.99),
  };
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor(q * sorted.length));
  return sorted[idx];
}
