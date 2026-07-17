import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runRound } from '../roundRunner';
import type { GameArchitecture } from '../../game/types';
import type { ChaosEvent } from '../scenarios';
import type { ScoringConfig } from '../scoring';

interface GoldenFixture {
  id: string;
  description: string;
  architecture: GameArchitecture;
  seed: number;
  loadProfile: { type: 'constant' | 'ramp' | 'spike' | 'diurnal' | 'step'; multiplier?: number };
  chaosEvents: ChaosEvent[];
  scoringConfig: Partial<ScoringConfig>;
  tickCount: number;
  expected: {
    roundedScore: number;
    ticks: number;
    bestStreak: number;
    nonCompliantTicks: number;
    finalP95: number | null;
    finalThroughput: number | null;
  };
}

const FIXTURE_DIR = resolve(import.meta.dirname, '../__fixtures__/golden');

function loadFixture(name: string): GoldenFixture {
  return JSON.parse(readFileSync(resolve(FIXTURE_DIR, `${name}.json`), 'utf8')) as GoldenFixture;
}

describe('roundRunner golden fixtures', () => {
  it('matches the three-tier constant 30s baseline', () => {
    const fx = loadFixture('three-tier-constant-30s');
    const result = runRound({
      architecture: fx.architecture,
      seed: fx.seed,
      loadProfile: fx.loadProfile,
      chaosEvents: fx.chaosEvents,
      scoringConfig: fx.scoringConfig,
      tickCount: fx.tickCount,
    });

    expect(result.roundedScore).toBe(fx.expected.roundedScore);
    expect(result.score.ticks).toBe(fx.expected.ticks);
    expect(result.score.bestStreak).toBe(fx.expected.bestStreak);
    expect(result.score.nonCompliantTicks).toBe(fx.expected.nonCompliantTicks);
    expect(result.finalFrame?.system.p95).toBe(fx.expected.finalP95);
    expect(result.finalFrame?.system.totalThroughput).toBe(fx.expected.finalThroughput);
  });

  it('is deterministic across repeated runs', () => {
    const fx = loadFixture('three-tier-constant-30s');
    const a = runRound({
      architecture: fx.architecture,
      seed: fx.seed,
      loadProfile: fx.loadProfile,
      tickCount: fx.tickCount,
    });
    const b = runRound({
      architecture: fx.architecture,
      seed: fx.seed,
      loadProfile: fx.loadProfile,
      tickCount: fx.tickCount,
    });
    expect(a.roundedScore).toBe(b.roundedScore);
    expect(a.score).toEqual(b.score);
  });
});
