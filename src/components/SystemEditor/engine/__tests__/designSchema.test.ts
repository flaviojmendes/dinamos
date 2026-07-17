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
});
