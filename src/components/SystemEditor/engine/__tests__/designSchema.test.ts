import { describe, it, expect } from 'vitest';
import {
  designV2Schema,
  MAX_DESIGN_EDGES,
  MAX_DESIGN_NODES,
  normalizeDesignInput,
  parseDesignRaw,
  upgradeLegacyDesign,
} from '../designSchema';
import { defaultsForKind } from '../types';
import { parseDesign, serializeDesign } from '../../ui/persistence';

const minimalDesign = {
  version: '2.0' as const,
  seed: 1,
  profileType: 'constant' as const,
  chaos: [],
  nodes: [
    {
      id: 'c1',
      position: { x: 0, y: 0 },
      config: defaultsForKind('client', 'c1', 'Client'),
    },
  ],
  edges: [],
};

describe('designSchema', () => {
  it('accepts a minimal valid v2 design', () => {
    expect(designV2Schema.parse(minimalDesign).version).toBe('2.0');
  });

  it('rejects designs exceeding node limits', () => {
    const tooManyNodes = {
      ...minimalDesign,
      nodes: Array.from({ length: MAX_DESIGN_NODES + 1 }, (_, i) => ({
        id: `n${i}`,
        position: { x: 0, y: 0 },
        config: defaultsForKind('server', `n${i}`, 'Server'),
      })),
    };
    expect(() => designV2Schema.parse(tooManyNodes)).toThrow();
  });

  it('rejects designs exceeding edge limits', () => {
    const tooManyEdges = {
      ...minimalDesign,
      edges: Array.from({ length: MAX_DESIGN_EDGES + 1 }, (_, i) => ({
        id: `e${i}`,
        source: 'c1',
        target: `t${i}`,
      })),
    };
    expect(() => designV2Schema.parse(tooManyEdges)).toThrow();
  });

  it('upgrades legacy v1 exports', () => {
    const legacy = {
      nodes: [
        {
          id: '1',
          type: 'client',
          position: { x: 0, y: 0 },
          data: { label: 'Client', throughput: 100 },
        },
      ],
      edges: [],
    };
    const upgraded = upgradeLegacyDesign(legacy);
    expect(upgraded.version).toBe('2.0');
    expect(upgraded.nodes[0].config.kind).toBe('client');
  });

  it('parseDesignRaw rejects oversized files', () => {
    expect(() => parseDesignRaw('x'.repeat(600_000))).toThrow(/FILE_TOO_LARGE/);
  });

  it('normalizeDesignInput is stable for equivalent v2 payloads', () => {
    const a = normalizeDesignInput(minimalDesign);
    const b = normalizeDesignInput({ ...minimalDesign, seed: 1 });
    expect(a).toEqual(b);
  });

  it('restores unbounded queues after a JSON/file round trip', () => {
    const raw = serializeDesign(minimalDesign.nodes, [], 0, 'spike', [], 'gcp', 0);
    const restored = parseDesign(raw);
    expect(restored.nodes[0].config.queueCapacity).toBe(Infinity);
    expect(restored).toMatchObject({ seed: 0, profileType: 'spike', provider: 'gcp', profileMultiplier: 0 });
  });

  it('fills missing v2 parameters and canonicalizes node IDs', () => {
    const design = normalizeDesignInput({ ...minimalDesign, nodes: [{
      id: 'canonical', position: { x: 0, y: 0 }, config: { id: 'stale', kind: 'server', label: 'API' },
    }] });
    expect(design.nodes[0].config).toEqual(defaultsForKind('server', 'canonical', 'API'));
    expect(design.provider).toBe('aws');
  });

  it.each([
    { serviceTimeMs: 0 }, { concurrency: 0 }, { replicas: 1.5 },
    { concurrency: 1e12 }, { replicas: 1e12 }, { replicaCount: 1e12 },
    { failureRate: 1.1 }, { timeoutMs: -1 }, { hitRate: -0.1 },
    { queueCapacity: -1 }, { queueCapacity: 1.5 }, { baseRate: NaN },
    { baseRate: null }, { latencyCv: 'fast' }, { maxQueue: -1 },
    { weights: { db: -1 } }, { minReplicas: 5, maxReplicas: 2 },
    { retry: { maxRetries: 2.5, backoffBaseMs: 20, jitter: true } },
  ])('rejects malformed node parameters: %j', (patch) => {
    const invalid = { ...minimalDesign, nodes: [{
      id: 's', position: { x: 0, y: 0 }, config: { ...defaultsForKind('server', 's', 'API'), ...patch },
    }] };
    expect(() => normalizeDesignInput(invalid)).toThrow();
  });

  it('preserves a zero-sized buffer and zero offered load', () => {
    const restored = normalizeDesignInput({ ...minimalDesign, nodes: [{ ...minimalDesign.nodes[0],
      config: { ...minimalDesign.nodes[0].config, queueCapacity: 0, baseRate: 0 },
    }] });
    expect(restored.nodes[0].config).toMatchObject({ queueCapacity: 0, baseRate: 0 });
  });

  it('rejects ambiguous IDs and dangling edges', () => {
    expect(() => normalizeDesignInput({ ...minimalDesign, nodes: [...minimalDesign.nodes, ...minimalDesign.nodes] })).toThrow();
    expect(() => normalizeDesignInput({ ...minimalDesign, edges: [{ id: 'e', source: 'c1', target: 'missing' }] })).toThrow();
    expect(() => normalizeDesignInput({ ...minimalDesign, edges: [
      { id: 'e', source: 'c1', target: 'c1' }, { id: 'e', source: 'c1', target: 'c1' },
    ] })).toThrow();
  });

  it('enforces the upload limit in UTF-8 bytes', () => {
    expect(() => parseDesignRaw(JSON.stringify({ text: 'á'.repeat(260_000) }))).toThrow(/FILE_TOO_LARGE/);
  });
});
