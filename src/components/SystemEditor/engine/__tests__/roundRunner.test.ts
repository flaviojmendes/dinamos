import { describe, it, expect } from 'vitest';
import { getPreset } from '../scenarios';
import { presetNodesToArchitecture } from '../../game/architecture';
import { runRound, runRoundWindow } from '../roundRunner';
import { evaluateCompliance } from '../compliance';
import { architectureComplianceGraph } from '../architectureToSim';
import { defaultsForKind } from '../types';
import type { GameArchitecture } from '../../game/types';

describe('roundRunner', () => {
  it('scores zero ticks when tickCount is 0', () => {
    const preset = getPreset('three-tier')!;
    const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
    const result = runRound({
      architecture,
      seed: preset.seed,
      tickCount: 0,
    });
    expect(result.score.ticks).toBe(0);
    expect(result.roundedScore).toBe(0);
    expect(result.finalFrame).toBeNull();
  });

  it.each([-1, 1.5, NaN, Infinity])('rejects invalid tick counts (%s)', (tickCount) => {
    const preset = getPreset('three-tier')!;
    const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
    expect(() => runRound({ architecture, seed: preset.seed, tickCount }))
      .toThrow('tickCount must be a non-negative integer');
  });

  it('does not reward an idle but structurally compliant service', () => {
    const preset = getPreset('three-tier')!;
    const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
    architecture.nodes[0].config.baseRate = 0;
    const result = runRound({ architecture, seed: preset.seed, tickCount: 10 });
    expect(result.compliant).toBe(true);
    expect(result.roundedScore).toBe(0);
    expect(result.score.availability).toBe(0);
    expect(result.score.bestStreak).toBe(0);
  });

  it('honours eligibleFromTick for late-join windows', () => {
    const preset = getPreset('three-tier')!;
    const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
    const full = runRound({ architecture, seed: preset.seed, tickCount: 20 });
    const late = runRound({
      architecture,
      seed: preset.seed,
      tickCount: 20,
      eligibleFromTick: 10,
    });
    expect(late.score.ticks).toBe(10);
    expect(late.roundedScore).toBeLessThan(full.roundedScore);
  });

  it('zeroes gains for non-compliant architectures', () => {
    const cacheOnly: GameArchitecture = {
      nodes: [
        { id: 'c', position: { x: 0, y: 0 }, config: defaultsForKind('client', 'c', 'Client') },
        { id: 'cache', position: { x: 0, y: 0 }, config: defaultsForKind('cache', 'cache', 'Cache') },
      ],
      edges: [{ id: 'e1', source: 'c', target: 'cache' }],
    };
    const graph = architectureComplianceGraph(cacheOnly);
    expect(evaluateCompliance(graph.nodes, graph.edges).ok).toBe(false);

    const result = runRound({ architecture: cacheOnly, seed: 1, tickCount: 10 });
    expect(result.compliant).toBe(false);
    expect(result.roundedScore).toBe(0);
    expect(result.score.nonCompliantTicks).toBe(10);
  });

  it('runRoundWindow matches an equivalent eligible slice', () => {
    const preset = getPreset('read-heavy-cache')!;
    const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
    const sliced = runRoundWindow(
      { architecture, seed: preset.seed, tickCount: 25 },
      5,
      25,
    );
    const direct = runRound({
      architecture,
      seed: preset.seed,
      tickCount: 25,
      eligibleFromTick: 5,
      eligibleToTick: 25,
    });
    expect(sliced.roundedScore).toBe(direct.roundedScore);
    expect(sliced.score).toEqual(direct.score);
  });
});
