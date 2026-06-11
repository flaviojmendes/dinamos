// Turns per-tick system metrics into a game score. The score is accumulated
// each simulated second so that players who keep their system healthy under the
// admin's broadcast traffic/chaos climb the leaderboard. All weights are
// admin-configurable via the match's scoringConfig.

import { SystemMetrics } from './types';

export interface ScoringConfig {
  /** Reward per request/s successfully served end-to-end. */
  wThroughput: number;
  /** Reward for availability (successRate scaled to 0..100). */
  wSuccess: number;
  /** Penalty applied when p95 latency exceeds the target. */
  wLatency: number;
  /** Penalty applied when cost/hour exceeds the budget. */
  wCost: number;
  /** p95 latency (ms) below which there is no latency penalty. */
  latencyTargetMs: number;
  /** Cloud budget (USD/hour); 0 disables the cost penalty. */
  budgetPerHour: number;
}

export const DEFAULT_SCORING: ScoringConfig = {
  wThroughput: 1,
  wSuccess: 2,
  wLatency: 1,
  wCost: 1,
  latencyTargetMs: 250,
  budgetPerHour: 0,
};

export function normalizeScoring(cfg?: Partial<ScoringConfig> | null): ScoringConfig {
  return { ...DEFAULT_SCORING, ...(cfg ?? {}) };
}

export interface ScoreBreakdown {
  throughput: number;
  availability: number;
  latencyPenalty: number;
  costPenalty: number;
  net: number;
  /**
   * Whether this simulated second met the SLO (healthy error rate and p95
   * within target while actually serving traffic). Drives the streak bonus.
   */
  sloMet?: boolean;
  /**
   * Whether the architecture satisfied the match's house rules this second
   * (see engine/compliance.ts). False means no points were earned.
   */
  compliant?: boolean;
}

/** Seconds of sustained SLO needed to reach the maximum streak multiplier. */
export const STREAK_RAMP_SEC = 60;
/** Maximum bonus multiplier applied to positive points while on a streak. */
export const STREAK_MAX_MULTIPLIER = 2;

/** Bonus multiplier for a given streak length (1x → 2x over STREAK_RAMP_SEC). */
export function streakMultiplier(streak: number): number {
  return 1 + (STREAK_MAX_MULTIPLIER - 1) * Math.min(1, streak / STREAK_RAMP_SEC);
}

/**
 * Points earned for a single simulated second. Net can be negative when a
 * system is failing badly, but the accumulated total is floored at 0 so a bad
 * stretch can't drag a player below the start line.
 */
export function frameScore(
  system: SystemMetrics,
  cfg: ScoringConfig
): ScoreBreakdown {
  const served = Math.max(0, system.totalThroughput);
  const throughput = cfg.wThroughput * served;
  const availability = cfg.wSuccess * system.successRate * 100;

  const latencyOver = Math.max(0, system.p95 - cfg.latencyTargetMs);
  // Scale the latency penalty by the target so it is unit-independent.
  const latencyPenalty =
    cfg.wLatency * (latencyOver / Math.max(1, cfg.latencyTargetMs)) * 100;

  let costPenalty = 0;
  if (cfg.budgetPerHour > 0 && system.costPerHour > cfg.budgetPerHour) {
    const over = (system.costPerHour - cfg.budgetPerHour) / cfg.budgetPerHour;
    costPenalty = cfg.wCost * over * 100;
  }

  const net = throughput + availability - latencyPenalty - costPenalty;

  // SLO check: the system is serving real traffic with ≤1% errors and p95
  // within target. Sustaining this builds the streak multiplier; one bad
  // second resets it, so resilience under chaos pays more than raw capacity.
  const sloMet =
    system.offeredLoad > 0 &&
    system.successRate >= 0.99 &&
    system.p95 <= cfg.latencyTargetMs;

  return { throughput, availability, latencyPenalty, costPenalty, net, sloMet };
}

/**
 * Apply the architecture-compliance gate to a frame's score. A non-compliant
 * second earns nothing: positive points are zeroed (penalties still bite, so a
 * melting system keeps hurting) and the SLO streak is broken. Cheating the
 * topology (cache-only, no database, clients wired into the DB) therefore
 * freezes the player's score instead of inflating it.
 */
export function applyCompliance(
  frame: ScoreBreakdown,
  compliant: boolean
): ScoreBreakdown {
  if (compliant) return { ...frame, compliant: true };
  return {
    ...frame,
    throughput: 0,
    availability: 0,
    net: -frame.latencyPenalty - frame.costPenalty,
    sloMet: false,
    compliant: false,
  };
}

export interface ScoreAccumulator {
  total: number;
  ticks: number;
  throughput: number;
  availability: number;
  latencyPenalty: number;
  costPenalty: number;
  /** Consecutive SLO-meeting seconds (resets on any bad second). */
  streak: number;
  /** Longest streak achieved this round. */
  bestStreak: number;
  /** Current bonus multiplier derived from the streak. */
  multiplier: number;
  /** Total bonus points earned from streak multipliers. */
  bonus: number;
  /** Seconds spent with a rule-breaking architecture (earned no points). */
  nonCompliantTicks: number;
}

export function emptyAccumulator(): ScoreAccumulator {
  return {
    total: 0,
    ticks: 0,
    throughput: 0,
    availability: 0,
    latencyPenalty: 0,
    costPenalty: 0,
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    bonus: 0,
    nonCompliantTicks: 0,
  };
}

export function accumulate(
  acc: ScoreAccumulator,
  frame: ScoreBreakdown
): ScoreAccumulator {
  const sloMet = frame.sloMet ?? false;
  const streak = sloMet ? (acc.streak ?? 0) + 1 : 0;
  const multiplier = streakMultiplier(streak);
  // The bonus applies only to positive points: a streak amplifies what you
  // earn, it never softens penalties.
  const positive = frame.throughput + frame.availability;
  const frameBonus = sloMet ? positive * (multiplier - 1) : 0;
  return {
    total: Math.max(0, acc.total + frame.net + frameBonus),
    ticks: acc.ticks + 1,
    throughput: acc.throughput + frame.throughput,
    availability: acc.availability + frame.availability,
    latencyPenalty: acc.latencyPenalty + frame.latencyPenalty,
    costPenalty: acc.costPenalty + frame.costPenalty,
    streak,
    bestStreak: Math.max(acc.bestStreak ?? 0, streak),
    multiplier,
    bonus: (acc.bonus ?? 0) + frameBonus,
    nonCompliantTicks:
      (acc.nonCompliantTicks ?? 0) + (frame.compliant === false ? 1 : 0),
  };
}
