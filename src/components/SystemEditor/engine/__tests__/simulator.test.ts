import { describe, it, expect } from 'vitest';
import { Simulator } from '../simulator';
import { buildTopology } from '../topology';
import { defaultsForKind, EdgeSpec, NodeConfig, SimConfig } from '../types';
import { getPreset } from '../scenarios';

function configFromPreset(id: string): SimConfig {
  const preset = getPreset(id)!;
  return {
    nodes: preset.nodes.map((n) => n.config),
    edges: preset.edges,
    seed: preset.seed,
    dtSeconds: 1,
    traceSamples: 3000,
  };
}

describe('simulator', () => {
  it('is deterministic for a fixed seed', () => {
    const a = new Simulator(configFromPreset('three-tier'));
    const b = new Simulator(configFromPreset('three-tier'));
    let fa = a.tick();
    let fb = b.tick();
    for (let i = 0; i < 5; i++) {
      fa = a.tick();
      fb = b.tick();
    }
    expect(fa.system.p95).toBe(fb.system.p95);
    expect(fa.system.totalThroughput).toBe(fb.system.totalThroughput);
  });

  it('never reports throughput exceeding offered load', () => {
    const sim = new Simulator(configFromPreset('read-heavy-cache'));
    for (let i = 0; i < 10; i++) {
      const f = sim.tick();
      expect(f.system.totalThroughput).toBeLessThanOrEqual(f.system.offeredLoad + 1e-6);
      expect(f.system.successRate).toBeGreaterThanOrEqual(0);
      expect(f.system.successRate).toBeLessThanOrEqual(1);
    }
  });

  it('orders latency percentiles p50 <= p95 <= p99', () => {
    const sim = new Simulator(configFromPreset('microservice-mesh'));
    let f = sim.tick();
    for (let i = 0; i < 4; i++) f = sim.tick();
    expect(f.system.p50).toBeLessThanOrEqual(f.system.p95 + 1e-6);
    expect(f.system.p95).toBeLessThanOrEqual(f.system.p99 + 1e-6);
  });

  it('detects a capacity bottleneck', () => {
    // Tiny database behind a heavy client.
    const nodes: NodeConfig[] = [
      { ...defaultsForKind('client', 'c', 'Client'), baseRate: 500 },
      { ...defaultsForKind('database', 'db', 'DB'), serviceTimeMs: 100, concurrency: 1, replicas: 1 },
    ];
    const edges: EdgeSpec[] = [{ id: 'e', source: 'c', target: 'db' }];
    const sim = new Simulator({ nodes, edges, seed: 7, dtSeconds: 1, traceSamples: 500 });
    const f = sim.tick();
    expect(f.nodeMetrics['db'].utilization).toBeGreaterThanOrEqual(1);
    expect(f.system.warnings.some((w) => w.startsWith('BOTTLENECK'))).toBe(true);
  });

  it('converges on a graph that contains a cycle', () => {
    // a -> b -> a feedback loop plus a client feeding a.
    const nodes: NodeConfig[] = [
      { ...defaultsForKind('client', 'c', 'Client'), baseRate: 20 },
      defaultsForKind('server', 'a', 'A'),
      defaultsForKind('server', 'b', 'B'),
    ];
    const edges: EdgeSpec[] = [
      { id: 'e1', source: 'c', target: 'a' },
      { id: 'e2', source: 'a', target: 'b' },
      { id: 'e3', source: 'b', target: 'a' },
    ];
    const topo = buildTopology(nodes, edges);
    // The cycle {a, b} must be recognised as a strongly-connected component.
    expect([...topo.cyclicSccs].length).toBeGreaterThan(0);

    const sim = new Simulator({ nodes, edges, seed: 1, dtSeconds: 1, traceSamples: 200 });
    const f = sim.tick();
    // No NaNs/Infinities leaked out of the solver.
    expect(Number.isFinite(f.nodeMetrics['a'].arrivalRate)).toBe(true);
    expect(Number.isFinite(f.nodeMetrics['b'].arrivalRate)).toBe(true);
  });

  it('autoscaler increases replicas under sustained overload', () => {
    const nodes: NodeConfig[] = [
      { ...defaultsForKind('client', 'c', 'Client'), baseRate: 400 },
      { ...defaultsForKind('autoScaler', 'svc', 'Svc'), serviceTimeMs: 50, concurrency: 2, replicas: 1, maxReplicas: 20 },
    ];
    const edges: EdgeSpec[] = [{ id: 'e', source: 'c', target: 'svc' }];
    const sim = new Simulator({ nodes, edges, seed: 3, dtSeconds: 1, traceSamples: 200 });
    let last = sim.tick();
    for (let i = 0; i < 15; i++) last = sim.tick();
    expect(last.nodeMetrics['svc'].replicas).toBeGreaterThan(1);
  });
});
