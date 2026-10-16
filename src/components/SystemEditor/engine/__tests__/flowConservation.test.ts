import { describe, expect, it } from 'vitest';
import { solveFlow, EngineState } from '../fluidSolver';
import { buildTopology } from '../topology';
import { defaultsForKind, EdgeSpec, NodeConfig, NodeKind } from '../types';

const node = (kind: NodeKind, id: string, changes: Partial<NodeConfig> = {}): NodeConfig => ({
  ...defaultsForKind(kind, id, id), timeoutMs: Infinity, ...changes,
});
const edge = (source: string, target: string): EdgeSpec => ({ id: `${source}-${target}`, source, target });
const state = (): EngineState => ({ queueLengths: new Map(), replicaOverride: new Map(), breakerShed: new Map(), dtSeconds: 1 });
const solve = (nodes: NodeConfig[], edges: EdgeSpec[], s = state()) => solveFlow(nodes, edges, buildTopology(nodes, edges), s);

describe('flow conservation and relaxation', () => {
  it('advances queue backlog once per tick independent of node ordering', () => {
    const nodes = [node('client', 'c', { baseRate: 100 }), node('messageQueue', 'q', { dequeueRate: 40 }), node('server', 's')];
    const edges = [edge('c', 'q'), edge('q', 's')];
    const forward = state();
    const reverse = state();
    const a = solve(nodes, edges, forward);
    const b = solve([...nodes].reverse(), edges, reverse);
    expect(a.converged).toBe(true);
    expect(b.converged).toBe(true);
    expect(forward.queueLengths.get('q')).toBe(60);
    expect(reverse.queueLengths.get('q')).toBe(60);
    solve(nodes, edges, forward);
    expect(forward.queueLengths.get('q')).toBe(120);
  });

  it('allows consumers to drain concurrently with producers', () => {
    const result = solve([node('client', 'c', { baseRate: 100 }), node('messageQueue', 'q', { dequeueRate: 100, maxQueue: 10 })], [edge('c', 'q')]);
    const q = result.runtime.get('q')!;
    expect(q.throughput).toBe(100);
    expect(q.dropped).toBe(0);
    expect(q.queue.queueLength).toBe(0);
  });

  it('conserves arrival between drain, overflow and queued messages', () => {
    const result = solve([node('client', 'c', { baseRate: 100 }), node('messageQueue', 'q', { dequeueRate: 40, maxQueue: 10 })], [edge('c', 'q')]);
    const q = result.runtime.get('q')!;
    expect(q.throughput).toBe(40);
    expect(q.dropped).toBe(50);
    expect(q.queue.queueLength).toBe(10);
    expect(q.processed + q.dropped + q.queue.queueLength).toBe(q.arrival);
  });

  it('propagates terminal failure through a deep chain before declaring convergence', () => {
    const nodes = [node('client', 'c', { baseRate: 10 }), node('server', 'a'), node('server', 'b'), node('database', 'db', { failureRate: 1 })];
    const edges = [edge('c', 'a'), edge('a', 'b'), edge('b', 'db')];
    const result = solve(nodes, edges);
    expect(result.converged).toBe(true);
    for (const id of ['c', 'a', 'b', 'db']) expect(result.runtime.get(id)!.effFailProb).toBe(1);
  });

  it('applies client retries both to downstream flow and residual failures', () => {
    const result = solve([node('client', 'c', { baseRate: 10, retry: { maxRetries: 1, backoffBaseMs: 0, jitter: false } }), node('server', 's', { failureRate: 0.5 })], [edge('c', 's')]);
    expect(result.edgeFlow.get('c-s')).toBeCloseTo(15, 6);
    expect(result.runtime.get('c')!.effFailProb).toBeCloseTo(0.25, 6);
  });

  it('uses weighted destinations when computing a balancer failure rate', () => {
    const nodes = [node('client', 'c', { baseRate: 10 }), node('loadBalancer', 'lb', { strategy: 'weighted', weights: { good: 1, dead: 0 } }), node('server', 'good'), node('server', 'dead', { failureRate: 1 })];
    const result = solve(nodes, [edge('c', 'lb'), edge('lb', 'good'), edge('lb', 'dead')]);
    expect(result.edgeFlow.get('lb-good')).toBe(10);
    expect(result.edgeFlow.get('lb-dead')).toBe(0);
    expect(result.runtime.get('lb')!.effFailProb).toBe(0);
  });

  it('does not silently lose requests when all routing weights are zero', () => {
    const nodes = [node('client', 'c', { baseRate: 10 }), node('loadBalancer', 'lb', { strategy: 'weighted', weights: { a: 0, b: 0 } }), node('server', 'a'), node('server', 'b')];
    const result = solve(nodes, [edge('c', 'lb'), edge('lb', 'a'), edge('lb', 'b')]);
    expect(result.edgeFlow.get('lb-a')! + result.edgeFlow.get('lb-b')!).toBe(10);
  });

  it('honors a zero-sized waiting room instead of treating it as unbounded', () => {
    const result = solve([node('client', 'c', { baseRate: 100 }), node('server', 's', { serviceTimeMs: 100, concurrency: 1, replicas: 1, queueCapacity: 0 })], [edge('c', 's')]);
    const s = result.runtime.get('s')!;
    expect(s.processed).toBeCloseTo(100 / 11, 8);
    expect(s.queue.queueLength).toBe(0);
    expect(s.dropped + s.throughput).toBeCloseTo(100, 8);
  });

  it('queues against hot-shard capacity instead of unconstrained worker capacity', () => {
    const result = solve([node('client', 'c', { baseRate: 4 }), node('shardRouter', 's', { serviceTimeMs: 100, concurrency: 1, replicas: 1, shardCount: 2, skew: 1 })], [edge('c', 's')]);
    const s = result.runtime.get('s')!;
    expect(s.utilization).toBeCloseTo(0.8, 8);
    expect(s.queue.rho).toBeCloseTo(0.8, 8);
    expect(s.queue.waitMs).toBeCloseTo(800, 6);
  });

  it('fails cache misses without an origin and clients without destinations', () => {
    const result = solve([node('client', 'c', { baseRate: 10 }), node('cache', 'cache', { hitRate: 0.8 })], [edge('c', 'cache')]);
    expect(result.runtime.get('cache')!.effFailProb).toBeCloseTo(0.2, 6);
    expect(solve([node('client', 'alone')], []).runtime.get('alone')!.effFailProb).toBe(1);
  });
  it('does not count a closed feedback cycle as successful completion', () => {
    const nodes = [node('client', 'c', { baseRate: 1 }), node('server', 'a'), node('server', 'b')];
    const result = solve(nodes, [edge('c', 'a'), edge('a', 'b'), edge('b', 'a')]);
    expect(result.runtime.get('c')!.effFailProb).toBe(1);
  });

  it('permits a cycle that eventually exits to a healthy sink', () => {
    const nodes = [node('client', 'c', { baseRate: 1 }), node('server', 'a'), node('server', 'b'), node('database', 'db')];
    const result = solve(nodes, [edge('c', 'a'), edge('a', 'b'), edge('b', 'a'), edge('b', 'db')]);
    expect(result.converged).toBe(true);
    expect(result.runtime.get('c')!.effFailProb).toBeLessThan(1e-6);
  });

  it('routes hot-shard traffic to the same overloaded destination it displays', () => {
    const nodes = [node('client', 'c', { baseRate: 10 }), node('shardRouter', 'r', { skew: 1, shardCount: 2 }), node('database', 'a'), node('database', 'b')];
    const result = solve(nodes, [edge('c', 'r'), edge('r', 'a'), edge('r', 'b')]);
    expect(result.edgeFlow.get('r-a')).toBeCloseTo(10, 6);
    expect(result.edgeFlow.get('r-b')).toBe(0);
    expect(result.runtime.get('r')!.shardLoads).toEqual([10, 0]);
  });

  it('accounts for synchronous replication acknowledgement in write capacity', () => {
    const c = node('client', 'c', { baseRate: 1 });
    const db = node('replicatedDb', 'db', { serviceTimeMs: 10, concurrency: 1, replicaCount: 3, writeFraction: 1, replicationLagMs: 90, consistency: 'quorum' });
    const sync = solve([c, db], [edge('c', 'db')]).runtime.get('db')!;
    const eventual = solve([c, { ...db, consistency: 'eventual' }], [edge('c', 'db')]).runtime.get('db')!;
    expect(sync.utilization).toBeCloseTo(0.1, 8);
    expect(eventual.utilization).toBeCloseTo(0.01, 8);
  });

  it('acknowledges durable enqueue without claiming that consumers finished', () => {
    const nodes = [node('client', 'c', { baseRate: 100 }), node('messageQueue', 'q', { dequeueRate: 0 }), node('server', 'worker', { failureRate: 1 })];
    const result = solve(nodes, [edge('c', 'q'), edge('q', 'worker')]);
    expect(result.runtime.get('q')!.throughput).toBe(0);
    expect(result.runtime.get('q')!.queue.queueLength).toBe(100);
    expect(result.runtime.get('c')!.effFailProb).toBe(0);
  });

  it('does not undo producer acknowledgements when a consumer fails', () => {
    const nodes = [node('client', 'c', { baseRate: 10 }), node('messageQueue', 'q'), node('server', 'worker', { failureRate: 1 })];
    const result = solve(nodes, [edge('c', 'q'), edge('q', 'worker')]);
    expect(result.runtime.get('worker')!.throughput).toBe(0);
    expect(result.runtime.get('c')!.effFailProb).toBe(0);
  });

  it('rejects producers but retains durable backlog during broker outages', () => {
    const s = state();
    s.queueLengths.set('q', 80);
    s.unavailableNodes = new Set(['q']);
    const result = solve([node('client', 'c', { baseRate: 100 }), node('messageQueue', 'q')], [edge('c', 'q')], s);
    expect(result.runtime.get('q')!.processed).toBe(0);
    expect(result.runtime.get('q')!.dropped).toBe(100);
    expect(result.runtime.get('c')!.effFailProb).toBe(1);
    expect(s.queueLengths.get('q')).toBe(80);
  });

  it('rejects failed enqueue attempts before they enter durable backlog', () => {
    const result = solve([node('client', 'c', { baseRate: 100 }), node('messageQueue', 'q', { failureRate: 0.2, dequeueRate: 0 })], [edge('c', 'q')]);
    expect(result.runtime.get('q')!.queue.queueLength).toBe(80);
    expect(result.runtime.get('c')!.effFailProb).toBeCloseTo(0.2, 6);
  });

  it('propagates failures through a reversed chain longer than the old iteration limit', () => {
    const nodes = [node('client', '0', { baseRate: 1 }), ...Array.from({ length: 100 }, (_, i) => node('server', `${i + 1}`, { failureRate: i === 99 ? 1 : 0 }))];
    const edges = Array.from({ length: 100 }, (_, i) => edge(`${i}`, `${i + 1}`));
    const result = solve(nodes.reverse(), edges);
    expect(result.converged).toBe(true);
    expect(result.runtime.get('0')!.effFailProb).toBe(1);
    expect(result.runtime.get('100')!.arrival).toBe(1);
  });

  it('balances heterogeneous healthy backends using their effective service capacity', () => {
    const nodes = [node('client', 'c', { baseRate: 55 }), node('loadBalancer', 'lb', { strategy: 'leastConnections' }), node('server', 'slow', { serviceTimeMs: 100, concurrency: 1, replicas: 1 }), node('server', 'fast', { serviceTimeMs: 10, concurrency: 1, replicas: 1 })];
    const result = solve(nodes, [edge('c', 'lb'), edge('lb', 'slow'), edge('lb', 'fast')]);
    expect(result.edgeFlow.get('lb-slow')).toBeCloseTo(5, 6);
    expect(result.edgeFlow.get('lb-fast')).toBeCloseTo(50, 6);
    expect(result.runtime.get('slow')!.utilization).toBeCloseTo(0.5, 6);
    expect(result.runtime.get('fast')!.utilization).toBeCloseTo(0.5, 6);
  });

  it('delivers durable messages after backlog wait exceeds the producer ACK timeout', () => {
    const s = state();
    s.queueLengths.set('q', 500);
    const nodes = [node('client', 'c', { baseRate: 20 }), node('messageQueue', 'q', { dequeueRate: 40, maxQueue: 1000, serviceTimeMs: 1, timeoutMs: 10, latencyDistribution: 'deterministic' }), node('server', 'worker')];
    const result = solve(nodes, [edge('c', 'q'), edge('q', 'worker')], s);
    const q = result.runtime.get('q')!;
    expect(q.queue.waitMs).toBeGreaterThan(10);
    expect(q.throughput).toBe(40);
    expect(result.edgeFlow.get('q-worker')).toBe(40);
    expect(result.runtime.get('worker')!.arrival).toBe(40);
    expect(q.failed).toBe(0);
    expect(q.effFailProb).toBe(0);
    expect(s.queueLengths.get('q')).toBe(480);
  });

  it('counts enqueue failures without inventing delivery failures for old messages', () => {
    const s = state();
    s.queueLengths.set('q', 500);
    const nodes = [node('client', 'c', { baseRate: 20 }), node('messageQueue', 'q', { dequeueRate: 40, failureRate: 0.25, timeoutMs: 10, serviceTimeMs: 1, latencyDistribution: 'deterministic' }), node('server', 'worker')];
    const result = solve(nodes, [edge('c', 'q'), edge('q', 'worker')], s);
    expect(result.runtime.get('q')!.failed).toBe(5);
    expect(result.edgeFlow.get('q-worker')).toBe(40);
    expect(s.queueLengths.get('q')).toBe(475);
  });

});
