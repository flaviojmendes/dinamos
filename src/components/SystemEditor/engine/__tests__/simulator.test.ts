import { describe, it, expect } from 'vitest';
import { Simulator } from '../simulator';
import { buildTopology } from '../topology';
import { defaultsForKind, EdgeSpec, NodeConfig, SimConfig } from '../types';
import { getPreset, makeLoadProfile } from '../scenarios';
import { AUTOSCALER_INTERVAL_SECONDS, AUTOSCALER_DOWNSCALE_WINDOW_SECONDS } from '../constants';

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

function simpleGraph(kind: NodeConfig['kind'] = 'server'): SimConfig {
  return {
    nodes: [
      { ...defaultsForKind('client', 'c', 'Client'), baseRate: 100 },
      { ...defaultsForKind(kind, 'svc', 'Service'), serviceTimeMs: 10, concurrency: 100, replicas: 1, latencyDistribution: 'deterministic' },
    ],
    edges: [{ id: 'e', source: 'c', target: 'svc' }],
    seed: 0,
    dtSeconds: 1,
    traceSamples: 10,
  };
}

describe('simulator runtime transitions', () => {
  it.each([0, -1, NaN, Infinity])('rejects invalid tick duration %s', (dtSeconds) => {
    expect(() => new Simulator({ ...simpleGraph(), dtSeconds })).toThrow('dtSeconds');
  });

  it.each([0, -1, NaN, Infinity, 0.5])('rejects invalid trace count %s', (traceSamples) => {
    expect(() => new Simulator({ ...simpleGraph(), traceSamples })).toThrow('traceSamples');
  });

  it('applies a one-second outage scheduled at zero exactly once', () => {
    const sim = new Simulator(simpleGraph());
    sim.setChaos([{ id: 'kill', type: 'killNode', targetId: 'svc', startSec: 0, durationSec: 1 }]);
    expect(sim.tick().system.successRate).toBe(0);
    expect(sim.tick().system.successRate).toBeCloseTo(1, 8);
  });

  it('keeps fractional steps aligned with scheduled outage boundaries', () => {
    const sim = new Simulator({ ...simpleGraph(), dtSeconds: 0.1 });
    sim.setChaos([{ id: 'kill', type: 'killNode', targetId: 'svc', startSec: 0, durationSec: 1 }]);
    const success = Array.from({ length: 20 }, () => sim.tick().system.successRate);
    expect(success.slice(0, 10).every((rate) => rate === 0)).toBe(true);
    expect(success.slice(10).every((rate) => rate > 0.99)).toBe(true);
    expect(sim.currentTime).toBe(2);
  });

  it('preserves failed dependencies during a partition instead of turning the caller into a successful sink', () => {
    const config = simpleGraph();
    config.nodes.push({ ...defaultsForKind('database', 'db', 'DB'), latencyDistribution: 'deterministic', concurrency: 100 });
    config.edges.push({ id: 'db-call', source: 'svc', target: 'db' });
    const sim = new Simulator(config);
    sim.setChaos([{ id: 'partition', type: 'partition', targetId: 'db', startSec: 0, durationSec: 1 }]);
    const failed = sim.tick();
    expect(failed.system.successRate).toBe(0);
    expect(failed.edgeFlow['db-call']).toBeGreaterThan(0);
    expect(sim.tick().system.successRate).toBeCloseTo(1, 8);
  });

  it('samples load at interval start and gives the spike exactly ten seconds', () => {
    const sim = new Simulator(simpleGraph());
    sim.setProfile(makeLoadProfile('spike'));
    const offered = Array.from({ length: 31 }, () => sim.tick().system.offeredLoad);
    expect(offered.slice(0, 20).every((load) => load === 100)).toBe(true);
    expect(offered.slice(20, 30).every((load) => load === 400)).toBe(true);
    expect(offered[30]).toBe(100);
  });

  it('counts residual client retry failure exactly once', () => {
    const config = simpleGraph();
    config.nodes[0].retry = { maxRetries: 1, backoffBaseMs: 10, jitter: false };
    config.nodes[1].failureRate = 0.5;
    const frame = new Simulator(config).tick();
    expect(frame.system.successRate).toBeCloseTo(0.75, 7);
    expect(frame.system.totalThroughput).toBeCloseTo(75, 5);
    expect(frame.edgeFlow.e).toBeCloseTo(150, 5);
  });

  it('does not discount provisioned hardware when chaos slows it down', () => {
    const config = simpleGraph();
    const normal = new Simulator(config).tick();
    const degraded = new Simulator(config);
    degraded.setChaos([{ id: 'slow', type: 'latencyInjection', targetId: 'svc', magnitude: 10, startSec: 0, durationSec: 1 }]);
    const frame = degraded.tick();
    expect(frame.nodeMetrics.svc.responseTimeMs).toBeGreaterThan(normal.nodeMetrics.svc.responseTimeMs);
    expect(frame.system.costPerHour).toBe(normal.system.costPerHour);
  });

  it('drops queue backlog when a node id changes kind', () => {
    const config = simpleGraph('messageQueue');
    config.nodes[1].dequeueRate = 10;
    const sim = new Simulator(config);
    expect(sim.tick().nodeMetrics.svc.queueLength).toBeGreaterThan(0);
    sim.setGraph([config.nodes[0], defaultsForKind('server', 'svc', 'Service')], config.edges);
    sim.tick();
    const noLoad = { ...config.nodes[0], baseRate: 0 };
    sim.setGraph([noLoad, config.nodes[1]], config.edges);
    expect(sim.tick().nodeMetrics.svc.queueLength).toBe(0);
  });

  it.each(['killNode', 'partition'] as const)('preserves durable backlog and rejects producers during %s', (type) => {
    const config = simpleGraph('messageQueue');
    config.nodes[1] = { ...config.nodes[1], dequeueRate: 40, timeoutMs: Infinity };
    const sim = new Simulator(config);
    expect(sim.tick().nodeMetrics.svc.queueLength).toBe(60);
    sim.setChaos([{ id: 'outage', type, targetId: 'svc', startSec: 1, durationSec: 2 }]);
    for (let i = 0; i < 2; i++) {
      const outage = sim.tick();
      expect(outage.system.totalThroughput).toBe(0);
      expect(outage.nodeMetrics.svc.throughput).toBe(0);
      expect(outage.nodeMetrics.svc.queueLength).toBe(60);
      expect(outage.nodeMetrics.svc.droppedRate).toBe(100);
    }
    const recovery = sim.tick();
    expect(recovery.system.totalThroughput).toBe(100);
    expect(recovery.nodeMetrics.svc.throughput).toBe(40);
    expect(recovery.nodeMetrics.svc.queueLength).toBe(120);
  });

  it('honours changed breaker settings and limits recovery to a single real probe', () => {
    const config = simpleGraph();
    const cb = { ...defaultsForKind('circuitBreaker', 'cb', 'Breaker'), resetTimeoutMs: 2000 };
    config.nodes.splice(1, 0, cb);
    config.nodes[2].failureRate = 1;
    config.edges = [{ id: 'in', source: 'c', target: 'cb' }, { id: 'out', source: 'cb', target: 'svc' }];
    const sim = new Simulator(config);
    expect(sim.tick().nodeMetrics.cb.circuitState).toBe('open');
    expect(sim.tick().nodeMetrics.svc.arrivalRate).toBe(0);
    expect(sim.tick().nodeMetrics.svc.arrivalRate).toBe(0);
    const probe = sim.tick();
    expect(probe.nodeMetrics.svc.arrivalRate).toBeCloseTo(1, 5);
    expect(probe.nodeMetrics.cb.circuitState).toBe('open');

    const relaxed = { ...cb, errorThreshold: 0.9 };
    const recovering = { ...config.nodes[2], failureRate: 0.6 };
    sim.setGraph([config.nodes[0], relaxed, recovering], config.edges);
    const reconfigured = sim.tick();
    expect(reconfigured.nodeMetrics.cb.circuitState).toBe('closed');
    expect(reconfigured.nodeMetrics.svc.arrivalRate).toBeGreaterThan(1);
  });

  it('does not reopen a removed breaker when its id is reused', () => {
    const config = simpleGraph('circuitBreaker');
    config.nodes.push({ ...defaultsForKind('server', 'down', 'Downstream'), failureRate: 1 });
    config.edges.push({ id: 'out', source: 'svc', target: 'down' });
    const sim = new Simulator(config);
    expect(sim.tick().nodeMetrics.svc.circuitState).toBe('open');
    sim.setGraph([config.nodes[0]], []);
    sim.setGraph([config.nodes[0], defaultsForKind('server', 'svc', 'Healthy')], [config.edges[0]]);
    const frame = sim.tick();
    expect(frame.nodeMetrics.svc.circuitState).toBeUndefined();
    expect(frame.nodeMetrics.svc.arrivalRate).toBe(100);
    expect(frame.nodeMetrics.svc.throughput).toBeGreaterThan(0);
  });

  it('reset reproduces the original state and cumulative accounting', () => {
    const sim = new Simulator(simpleGraph());
    const first = sim.tick();
    sim.tick();
    sim.reset();
    const reset = sim.tick();
    expect(reset).toEqual(first);
    expect(sim.totalSuccess).toBe(reset.system.totalThroughput);
    expect(sim.totalFailed).toBe(reset.system.failedRate);
    expect(sim.totalCost).toBe(reset.system.costPerHour / 3600);
    expect(sim.history).toHaveLength(1);
  });

  it('scales on simulated time, applies configured bounds, and stabilizes scale-down', () => {
    const config = simpleGraph('autoScaler');
    config.nodes[1] = { ...config.nodes[1], concurrency: 1, serviceTimeMs: 20, maxReplicas: 10, targetUtilization: 0.5 };
    const sim = new Simulator(config);
    for (let i = 0; i < AUTOSCALER_INTERVAL_SECONDS; i++) expect(sim.tick().nodeMetrics.svc.replicas).toBe(1);
    expect(sim.tick().nodeMetrics.svc.replicas).toBe(4);
    sim.setGraph([{ ...config.nodes[0], baseRate: 1 }, config.nodes[1]], config.edges);
    for (let i = 0; i < AUTOSCALER_DOWNSCALE_WINDOW_SECONDS - 2; i++) expect(sim.tick().nodeMetrics.svc.replicas).toBe(4);
    // The old high recommendation expires at t=315, the controller updates
    // capacity for the following tick rather than changing this frame's bill.
    expect(sim.tick().nodeMetrics.svc.replicas).toBe(4);
    expect(sim.tick().nodeMetrics.svc.replicas).toBe(1);
  });

  it('uses the same autoscaling cadence for fractional steps and clears deleted overrides', () => {
    const config = simpleGraph('autoScaler');
    config.nodes[1] = { ...config.nodes[1], concurrency: 1, serviceTimeMs: 20, maxReplicas: 10, targetUtilization: 0.5 };
    const sim = new Simulator({ ...config, dtSeconds: 0.5 });
    for (let i = 0; i < 30; i++) expect(sim.tick().nodeMetrics.svc.replicas).toBe(1);
    expect(sim.tick().nodeMetrics.svc.replicas).toBe(4);
    sim.setGraph([config.nodes[0]], []);
    sim.setGraph([config.nodes[0], { ...defaultsForKind('server', 'svc', 'Replacement'), replicas: 3 }], config.edges);
    expect(sim.tick().nodeMetrics.svc.replicas).toBe(3);
  });

  it('does not interpret a killed node as an idle node to scale down', () => {
    const config = simpleGraph('autoScaler');
    config.nodes[0].baseRate = 1;
    config.nodes[1].replicas = 4;
    const sim = new Simulator(config);
    sim.setChaos([{ id: 'kill', type: 'killNode', targetId: 'svc', startSec: 0, durationSec: 15 }]);
    for (let i = 0; i < 16; i++) expect(sim.tick().nodeMetrics.svc.replicas).toBe(4);
  });
});
