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
  return { throughput, availability, latencyPenalty, costPenalty, net };
}

export interface ScoreAccumulator {
  total: number;
  ticks: number;
  throughput: number;
  availability: number;
  latencyPenalty: number;
  costPenalty: number;
}

export function emptyAccumulator(): ScoreAccumulator {
  return {
    total: 0,
    ticks: 0,
    throughput: 0,
    availability: 0,
    latencyPenalty: 0,
    costPenalty: 0,
  };
}

export function accumulate(
  acc: ScoreAccumulator,
  frame: ScoreBreakdown
): ScoreAccumulator {
  return {
    total: Math.max(0, acc.total + frame.net),
    ticks: acc.ticks + 1,
    throughput: acc.throughput + frame.throughput,
    availability: acc.availability + frame.availability,
    latencyPenalty: acc.latencyPenalty + frame.latencyPenalty,
    costPenalty: acc.costPenalty + frame.costPenalty,
  };
}
