// Sampled request tracing for tail-latency percentiles.
//
// The fluid solver gives us mean per-node response times and routing
// probabilities. To recover realistic p95/p99 we Monte-Carlo a batch of
// synthetic requests through the resolved graph, sampling each hop's service
// time from its configured distribution plus an exponential queue-wait whose
// mean equals the queue's Wq. End-to-end and per-node samples are reduced to
// percentiles.

import { NodeRuntime } from './fluidSolver';
import { Rng } from './rng';

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

  // Entry points: client nodes weighted by the load they generate.
  const clients = nodes.filter((n) => n.cfg.kind === 'client' && n.throughput > 0);
  const perNodeSamples = new Map<string, number[]>();
  const e2eSamples: number[] = [];

  if (clients.length === 0) {
    return { perNode: emptyPercentiles(runtime), system: { p50: 0, p95: 0, p99: 0 } };
  }

  const clientTotal = clients.reduce((s, c) => s + c.throughput, 0);

  for (let i = 0; i < samples; i++) {
    let current: NodeRuntime | undefined = pickWeighted(clients, clientTotal, rng);
    let latency = 0;
    let hops = 0;

    while (current && hops < MAX_HOPS) {
      hops++;
      latency += sampleNodeLatency(current, rng);
      recordSample(perNodeSamples, current.cfg.id, hopLatency(current, rng));

      // Terminate (cache hit, sink, answered request)?
      if (current.branches.length === 0 || rng.next() < current.terminateProb) {
        break;
      }
      const nextId = pickBranch(current, rng);
      if (!nextId) break;
      current = runtime.get(nextId);
    }

    e2eSamples.push(latency);
  }

  const perNode = new Map<string, Percentiles>();
  runtime.forEach((_, id) => {
    perNode.set(id, percentiles(perNodeSamples.get(id) ?? []));
  });

  return { perNode, system: percentiles(e2eSamples) };
}

/** A single hop's contribution to the end-to-end path latency. */
function sampleNodeLatency(rt: NodeRuntime, rng: Rng): number {
  return hopLatency(rt, rng);
}

function hopLatency(rt: NodeRuntime, rng: Rng): number {
  const cfg = rt.cfg;
  const service = sampleService(cfg.serviceTimeMs, cfg.latencyDistribution, cfg.latencyCv, rng);
  // Queue wait is approximately exponential with mean Wq.
  const wait = rt.queue.waitMs > 0 ? rng.exponential(rt.queue.waitMs) : 0;
  let total = service + wait;
  // Replicated DB writes carry replication lag on the tail.
  if (cfg.kind === 'replicatedDb' && cfg.consistency === 'strong') {
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

function pickWeighted(clients: NodeRuntime[], total: number, rng: Rng): NodeRuntime {
  if (total <= 0) return clients[0];
  let r = rng.next() * total;
  for (const c of clients) {
    r -= c.throughput;
    if (r <= 0) return c;
  }
  return clients[clients.length - 1];
}

function pickBranch(rt: NodeRuntime, rng: Rng): string | undefined {
  const total = rt.branches.reduce((s, b) => s + b.prob, 0);
  if (total <= 0) return rt.branches[0]?.target;
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

function emptyPercentiles(runtime: Map<string, NodeRuntime>): Map<string, Percentiles> {
  const m = new Map<string, Percentiles>();
  runtime.forEach((_, id) => m.set(id, { p50: 0, p95: 0, p99: 0 }));
  return m;
}
