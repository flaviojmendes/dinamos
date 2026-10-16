import { describe, it, expect } from 'vitest';
import { architectureComplianceGraph, architectureToSimConfig } from '../architectureToSim';
import { defaultsForKind } from '../types';
import type { GameArchitecture } from '../../game/types';

describe('architectureToSimConfig', () => {
  it('uses the same node identity as the graph without mutating the snapshot', () => {
    const architecture: GameArchitecture = {
      nodes: [{
        id: 'stored-client',
        position: { x: 0, y: 0 },
        config: defaultsForKind('client', 'stale-config-id', 'Users'),
      }],
      edges: [],
    };

    const sim = architectureToSimConfig(architecture, 42);
    const graph = architectureComplianceGraph(architecture);
    expect(sim.nodes[0].id).toBe(graph.nodes[0].id);
    expect(sim.nodes[0].id).toBe('stored-client');
    expect(architecture.nodes[0].config.id).toBe('stale-config-id');
    expect(sim.nodes[0]).not.toBe(architecture.nodes[0].config);
    expect(sim.seed).toBe(42);
  });
});
