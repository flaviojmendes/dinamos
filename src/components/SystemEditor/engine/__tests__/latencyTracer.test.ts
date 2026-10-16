import { describe, expect, it } from 'vitest';
import { traceLatency } from '../latencyTracer';
import { NodeRuntime } from '../fluidSolver';
import { Rng } from '../rng';
import { defaultsForKind, NodeConfig, NodeKind } from '../types';

function runtime(kind: NodeKind, id: string, cfg: Partial<NodeConfig> = {}, changes: Partial<NodeRuntime> = {}): NodeRuntime {
  const node = { ...defaultsForKind(kind, id, id), timeoutMs: Infinity, ...cfg };
  return {
    cfg: node, replicas: 1, servers: 1, arrival: 10, processed: 10, throughput: 10,
    failed: 0, dropped: 0, retried: 0, utilization: 0.1, effFailProb: 0,
    terminateProb: 1, branches: [],
    queue: { rho: 0.1, waitMs: 0, responseMs: node.serviceTimeMs, queueLength: 0, inSystem: 0, saturated: false },
    ...changes,
  };
}
const run = (...nodes: NodeRuntime[]) => traceLatency(new Map(nodes.map((n) => [n.cfg.id, n])), new Rng(17), 1000);

describe('request latency tracing', () => {
  it('traces cron-only graphs instead of reporting zero latency', () => {
    const trace = run(runtime('server', 'cron', { cronEnabled: true, cronRate: 10, serviceTimeMs: 50, latencyDistribution: 'deterministic' }));
    expect(trace.system).toEqual({ p50: 50, p95: 50, p99: 50 });
  });

  it('records the same hop sample in node and end-to-end percentiles', () => {
    const c = runtime('client', 'c', {}, { terminateProb: 0, branches: [{ edgeId: 'e', target: 's', prob: 1 }] });
    const s = runtime('server', 's', { serviceTimeMs: 40, latencyDistribution: 'exponential' });
    const trace = run(c, s);
    expect(trace.system).toEqual(trace.perNode.get('s'));
  });

  it('includes failed retry attempts and exponential backoff in request time', () => {
    const c = runtime('client', 'c', { retry: { maxRetries: 2, backoffBaseMs: 50, jitter: false } }, { terminateProb: 0, branches: [{ edgeId: 'e', target: 's', prob: 1 }] });
    const s = runtime('server', 's', { serviceTimeMs: 10, latencyDistribution: 'deterministic', failureRate: 1 }, { throughput: 0, effFailProb: 1 });
    expect(run(c, s).system).toEqual({ p50: 180, p95: 180, p99: 180 });
  });

  it('caps a timed-out attempt at its deadline and does not visit descendants', () => {
    const c = runtime('client', 'c', {}, { terminateProb: 0, branches: [{ edgeId: 'a', target: 's', prob: 1 }] });
    const s = runtime('server', 's', { serviceTimeMs: 100, timeoutMs: 20, latencyDistribution: 'deterministic' }, { terminateProb: 0, branches: [{ edgeId: 'b', target: 'db', prob: 1 }] });
    const db = runtime('database', 'db', { serviceTimeMs: 50 });
    const trace = run(c, s, db);
    expect(trace.system.p99).toBe(20);
    expect(trace.perNode.get('db')!.p99).toBe(0);
  });

  it('does not charge all strong-consistency reads for write acknowledgement', () => {
    const db = runtime('replicatedDb', 'db', { cronEnabled: true, cronRate: 10, consistency: 'strong', replicaCount: 3, writeFraction: 0, replicationLagMs: 500, serviceTimeMs: 10, latencyDistribution: 'deterministic' });
    expect(run(db).system.p99).toBe(10);
    db.cfg.writeFraction = 1;
    expect(run(db).system.p99).toBe(510);
    db.cfg.consistency = 'eventual';
    expect(run(db).system.p99).toBe(10);
    db.cfg.consistency = 'quorum';
    expect(run(db).system.p99).toBe(510);
  });

  it('does not sample full service time for load shed immediately', () => {
    const s = runtime('server', 's', { cronEnabled: true, cronRate: 10, serviceTimeMs: 1000 }, { dropped: 10, throughput: 0 });
    expect(run(s).system.p99).toBe(0);
  });
  it('ends producer latency at the broker acknowledgement while tracing consumers separately', () => {
    const c = runtime('client', 'c', {}, { terminateProb: 0, branches: [{ edgeId: 'cq', target: 'q', prob: 1 }] });
    const q = runtime('messageQueue', 'q', { serviceTimeMs: 1, latencyDistribution: 'deterministic' }, {
      terminateProb: 0, branches: [{ edgeId: 'qs', target: 's', prob: 1 }],
      queue: { rho: 2, waitMs: 500, responseMs: 501, queueLength: 50, inSystem: 50, saturated: true },
    });
    const s = runtime('server', 's', { serviceTimeMs: 100, latencyDistribution: 'deterministic', failureRate: 1 });
    const trace = run(c, q, s);
    expect(trace.system).toEqual({ p50: 1, p95: 1, p99: 1 });
    expect(trace.perNode.get('q')!.p95).toBeGreaterThan(500);
    expect(trace.perNode.get('s')!.p95).toBe(100);
  });

  it('traces valid architectures longer than the old 64-hop limit', () => {
    const nodes = [runtime('client', '0'), ...Array.from({ length: 100 }, (_, i) => runtime('server', `${i + 1}`, { serviceTimeMs: 1, latencyDistribution: 'deterministic' }))];
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].terminateProb = 0;
      nodes[i].branches = [{ edgeId: `${i}`, target: `${i + 1}`, prob: 1 }];
    }
    const trace = run(...nodes);
    expect(trace.system.p95).toBe(100);
    expect(trace.perNode.get('100')!.p95).toBe(1);
  });

  it('does not expire asynchronous delivery at the producer ACK deadline', () => {
    const c = runtime('client', 'c', {}, { terminateProb: 0, branches: [{ edgeId: 'cq', target: 'q', prob: 1 }] });
    const q = runtime('messageQueue', 'q', { serviceTimeMs: 1, timeoutMs: 10, latencyDistribution: 'deterministic' }, {
      terminateProb: 0, branches: [{ edgeId: 'qs', target: 's', prob: 1 }],
      queue: { rho: 2, waitMs: 5000, responseMs: 5001, queueLength: 500, inSystem: 500, saturated: true },
    });
    const s = runtime('server', 's', { serviceTimeMs: 100, latencyDistribution: 'deterministic' });
    const trace = run(c, q, s);
    expect(trace.system.p95).toBe(1);
    expect(trace.perNode.get('q')!.p95).toBeGreaterThan(5000);
    expect(trace.perNode.get('s')!.p95).toBe(100);
  });

});
