// Deterministic round runner for golden fixtures, server recomputation, and
// performance benchmarks. Mirrors the client round loop in SystemEditorV2.

import type { GameArchitecture, GameLoadProfile } from '../game/types';
import { architectureComplianceGraph, architectureToSimConfig } from './architectureToSim';
import { evaluateCompliance } from './compliance';
import { makeLoadProfile, type ChaosEvent, type LoadProfileType } from './scenarios';
import {
  accumulate,
  applyCompliance,
  emptyAccumulator,
  frameScore,
  normalizeScoring,
  type ScoreAccumulator,
  type ScoringConfig,
} from './scoring';
import { Simulator } from './simulator';
import type { SimulationFrame } from './types';

export interface RoundRunConfig {
  architecture: GameArchitecture;
  seed: number;
  loadProfile?: GameLoadProfile | { type: LoadProfileType; multiplier?: number };
  chaosEvents?: ChaosEvent[];
  scoringConfig?: Partial<ScoringConfig> | null;
  /** Total simulated seconds to run (inclusive of tick 1..tickCount). */
  tickCount: number;
  /** First simulated second eligible for scoring (late-join offset). */
  eligibleFromTick?: number;
  /** Last simulated second eligible for scoring (exclusive upper bound). */
  eligibleToTick?: number;
}

export interface RoundRunResult {
  score: ScoreAccumulator;
  /** Rounded total used for leaderboard display. */
  roundedScore: number;
  tickCount: number;
  eligibleTicks: number;
  finalFrame: SimulationFrame | null;
  compliant: boolean;
}

function resolveLoadProfile(
  profile?: RoundRunConfig['loadProfile'],
): ReturnType<typeof makeLoadProfile> {
  const type = profile?.type ?? 'constant';
  const base = makeLoadProfile(type);
  const mult = profile?.multiplier && profile.multiplier > 0 ? profile.multiplier : 1;
  if (mult === 1) return base;
  return {
    ...base,
    multiplierAt: (t: number) => base.multiplierAt(t) * mult,
  };
}

/**
 * Run a deterministic round simulation for `tickCount` seconds and accumulate
 * the score using the same compliance + streak rules as the live client loop.
 */
export function runRound(config: RoundRunConfig): RoundRunResult {
  const {
    architecture,
    seed,
    chaosEvents = [],
    scoringConfig,
    tickCount,
    eligibleFromTick = 0,
    eligibleToTick = tickCount,
  } = config;

  if (tickCount < 0) throw new Error('tickCount must be non-negative');

  const simConfig = architectureToSimConfig(architecture, seed);
  const sim = new Simulator(simConfig);
  sim.setProfile(resolveLoadProfile(config.loadProfile));
  sim.setChaos(chaosEvents);

  const scoringCfg = normalizeScoring(scoringConfig);
  const complianceGraph = architectureComplianceGraph(architecture);
  const compliant = evaluateCompliance(complianceGraph.nodes, complianceGraph.edges).ok;

  let score = emptyAccumulator();
  let finalFrame: SimulationFrame | null = null;
  let eligibleTicks = 0;

  for (let tick = 1; tick <= tickCount; tick++) {
    const frame = sim.tick();
    finalFrame = frame;
    if (tick <= eligibleFromTick || tick > eligibleToTick) continue;
    eligibleTicks++;
    score = accumulate(
      score,
      applyCompliance(frameScore(frame.system, scoringCfg), compliant),
    );
  }

  return {
    score,
    roundedScore: Math.round(score.total),
    tickCount,
    eligibleTicks,
    finalFrame,
    compliant,
  };
}

/** Convenience helper for checkpoint/final recomputation windows. */
export function runRoundWindow(
  config: Omit<RoundRunConfig, 'eligibleFromTick' | 'eligibleToTick'>,
  fromTick: number,
  toTick: number,
): RoundRunResult {
  return runRound({
    ...config,
    tickCount: toTick,
    eligibleFromTick: fromTick,
    eligibleToTick: toTick,
  });
}
