import { describe, it, expect } from 'vitest';
import { Simulator } from '../simulator';
import { defaultsForKind, EdgeSpec, NodeConfig, NodeKind, SimConfig } from '../types';

function chain(kinds: NodeKind[], clientRate = 80): SimConfig {
  const nodes: NodeConfig[] = [
    { ...defaultsForKind('client', 'c', 'Client'), baseRate: clientRate },
  ];
  const edges: EdgeSpec[] = [];
  let prev = 'c';
  kinds.forEach((kind, i) => {
    const id = `n${i}`;
    nodes.push(defaultsForKind(kind, id, kind));
    edges.push({ id: `e${i}`, source: prev, target: id });
    prev = id;
  });
  return { nodes, edges, seed: 11, dtSeconds: 1, traceSamples: 300 };
}

function tickAll(cfg: SimConfig, ticks = 5) {
  const sim = new Simulator(cfg);
  let f = sim.tick();
  for (let i = 0; i < ticks; i++) f = sim.tick();
  return f;
}

describe('fluidSolver node kinds', () => {
  const kinds: NodeKind[] = [
    'loadBalancer',
    'apiGateway',
    'cache',
    'server',
    'database',
    'replicatedDb',
    'shardRouter',
    'messageQueue',
    'circuitBreaker',
    'autoScaler',
    'externalDependency',
  ];

  for (const kind of kinds) {
    it(`produces finite metrics for a ${kind}`, () => {
      const f = tickAll(chain([kind]));
      const m = f.nodeMetrics['n0'];
      expect(Number.isFinite(m.arrivalRate)).toBe(true);
      expect(Number.isFinite(m.utilization)).toBe(true);
      expect(m.utilization).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(f.system.p95)).toBe(true);
      expect(Number.isFinite(f.system.costPerHour)).toBe(true);
    });
  }

  it('flows traffic through a deep multi-kind chain', () => {
    const f = tickAll(chain(['loadBalancer', 'apiGateway', 'cache', 'server', 'replicatedDb']));
    expect(f.system.totalThroughput).toBeGreaterThan(0);
    expect(f.system.successRate).toBeGreaterThanOrEqual(0);
    expect(f.system.successRate).toBeLessThanOrEqual(1);
  });

  it('sheds load when a downstream node is tiny', () => {
    const cfg = chain(['server'], 600);
    cfg.nodes[1] = { ...defaultsForKind('server', 'n0', 'svc'), serviceTimeMs: 200, concurrency: 1, replicas: 1, queueCapacity: 5 };
    const f = tickAll(cfg);
    const m = f.nodeMetrics['n0'];
    expect(m.utilization).toBeGreaterThan(0);
    expect(f.system.totalThroughput).toBeLessThanOrEqual(f.system.offeredLoad + 1e-6);
  });
});
