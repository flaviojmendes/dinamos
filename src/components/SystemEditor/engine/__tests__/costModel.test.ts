import { describe, it, expect } from 'vitest';
import {
  serviceTimePremium,
  estimateNodeCostPerHour,
  estimateCostFromMetrics,
  providerLabel,
  productName,
  configuredWorkers,
} from '../costModel';
import { NodeRuntime } from '../fluidSolver';
import { NodeKind } from '../types';
import { defaultsForKind } from '../types';

function rt(kind: NodeKind, extra: Partial<NodeRuntime['cfg']> & Partial<NodeRuntime> = {}): NodeRuntime {
  const { servers, arrival, ...cfgExtra } = extra as any;
  return {
    cfg: { kind, serviceTimeMs: 20, ...cfgExtra },
    servers: servers ?? (kind === 'replicatedDb' ? 8 * (cfgExtra.replicaCount ?? 1) : kind === 'database' ? 8 : 1),
    arrival: arrival ?? 0,
  } as NodeRuntime;
}

describe('configuredWorkers', () => {
  it('includes replicated database set size before runtime metrics exist', () => {
    const config = defaultsForKind('replicatedDb', 'db', 'Database');
    config.replicaCount = 4;
    config.replicas = 1;
    expect(configuredWorkers(config)).toBe(32);
    expect(estimateCostFromMetrics(config.kind, configuredWorkers(config), 0, config.replicaCount, 'aws', config.serviceTimeMs))
      .toBeCloseTo(estimateNodeCostPerHour(rt(config.kind, { servers: 32, replicaCount: 4, serviceTimeMs: config.serviceTimeMs })), 10);
  });

  it('includes ordinary compute replicas', () => {
    const config = defaultsForKind('server', 's', 'Server');
    expect(configuredWorkers(config)).toBe(config.concurrency * config.replicas);
  });
});

describe('serviceTimePremium', () => {
  it('returns the max tier for instant/invalid service times', () => {
    expect(serviceTimePremium(0)).toBe(4);
    expect(serviceTimePremium(-1)).toBe(4);
  });

  it('returns 1x at the baseline', () => {
    expect(serviceTimePremium(20)).toBe(1);
  });

  it('clamps fast and slow nodes to the [0.4, 4] band', () => {
    expect(serviceTimePremium(1)).toBe(4);
    expect(serviceTimePremium(1000)).toBe(0.4);
  });
});

describe('estimateNodeCostPerHour', () => {
  it('prices compute nodes by servers and premium', () => {
    const cost = estimateNodeCostPerHour(rt('server', { servers: 3, serviceTimeMs: 20 }), 'aws');
    expect(cost).toBeCloseTo(3 * 0.0416 * 1, 5);
  });

  it('prices replicated databases by replica count', () => {
    const cost = estimateNodeCostPerHour(rt('replicatedDb', { replicaCount: 4, serviceTimeMs: 20 } as any));
    expect(cost).toBeCloseTo(4 * 0.136, 5);
  });

  it('prices a plain database as a single replica', () => {
    const cost = estimateNodeCostPerHour(rt('database', { serviceTimeMs: 20 }));
    expect(cost).toBeCloseTo(0.136, 5);
  });

  it('charges for database concurrency and replica upgrades', () => {
    const baseline = estimateNodeCostPerHour(rt('database', { servers: 8 }));
    const doubleWorkers = estimateNodeCostPerHour(rt('database', { servers: 16 }));
    const fourWorkers = estimateNodeCostPerHour(rt('database', { servers: 4 }));
    expect(doubleWorkers).toBeCloseTo(2 * baseline, 8);
    expect(fourWorkers).toBeCloseTo(baseline / 2, 8);
  });

  it('prices usage nodes by request volume', () => {
    const cost = estimateNodeCostPerHour(rt('apiGateway', { arrival: 1000 }), 'aws');
    expect(cost).toBeCloseTo((1000 * 3600 / 1_000_000) * 1.0, 5);
  });

  it('prices external dependencies at the external rate', () => {
    const cost = estimateNodeCostPerHour(rt('externalDependency', { arrival: 1000 }), 'gcp');
    expect(cost).toBeCloseTo((1000 * 3600 / 1_000_000) * 4.5, 5);
  });

  it('returns zero for nodes that are not billed', () => {
    expect(estimateNodeCostPerHour(rt('client'))).toBe(0);
  });
});

describe('estimateCostFromMetrics', () => {
  it('matches the runtime estimate for compute nodes', () => {
    expect(estimateCostFromMetrics('server', 2, 0, undefined, 'gcp')).toBeCloseTo(2 * 0.0395, 5);
  });

  it.each(['database', 'replicatedDb'] as const)('matches runtime database costs for %s', (kind) => {
    const runtime = rt(kind, { servers: 48, replicaCount: 3, serviceTimeMs: 12 });
    expect(estimateCostFromMetrics(kind, 48, 0, 3, 'gcp', 12))
      .toBeCloseTo(estimateNodeCostPerHour(runtime, 'gcp'), 10);
  });

  it('prices usage and external nodes from arrival', () => {
    expect(estimateCostFromMetrics('messageQueue', 1, 1000, undefined, 'aws')).toBeCloseTo((1000 * 3600 / 1_000_000) * 1.0, 5);
    expect(estimateCostFromMetrics('externalDependency', 1, 1000, undefined, 'aws')).toBeCloseTo((1000 * 3600 / 1_000_000) * 5.0, 5);
  });

  it('returns zero for unbilled kinds', () => {
    expect(estimateCostFromMetrics('client', 1, 100, undefined, 'aws')).toBe(0);
  });
});

describe('labels', () => {
  it('providerLabel maps providers to names', () => {
    expect(providerLabel('aws')).toBe('AWS');
    expect(providerLabel('gcp')).toBe('Google Cloud');
  });

  it('productName differs by provider and falls back for unknown kinds', () => {
    expect(productName('server', 'aws')).toBe('EC2');
    expect(productName('server', 'gcp')).toBe('Compute Engine');
    expect(productName('database', 'aws')).toBe('RDS');
    expect(productName('messageQueue', 'gcp')).toBe('Pub/Sub');
    expect(productName('unknownKind' as NodeKind, 'aws')).toBe('AWS');
    expect(productName('unknownKind' as NodeKind, 'gcp')).toBe('GCP');
  });
});
