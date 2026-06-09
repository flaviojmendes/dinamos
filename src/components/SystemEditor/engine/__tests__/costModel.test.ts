import { describe, it, expect } from 'vitest';
import {
  serviceTimePremium,
  estimateNodeCostPerHour,
  estimateCostFromMetrics,
  providerLabel,
  productName,
} from '../costModel';
import { NodeRuntime } from '../fluidSolver';
import { NodeKind } from '../types';

function rt(kind: NodeKind, extra: Partial<NodeRuntime['cfg']> & Partial<NodeRuntime> = {}): NodeRuntime {
  const { servers, arrival, ...cfgExtra } = extra as any;
  return {
    cfg: { kind, serviceTimeMs: 20, ...cfgExtra },
    servers: servers ?? 1,
    arrival: arrival ?? 0,
  } as NodeRuntime;
}

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
