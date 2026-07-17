import type { RoundConfig } from '../../../src/components/SystemEditor/game/types';
import { DEFAULT_MAX_PLAYERS } from '../../../src/components/SystemEditor/engine/constants';

export const DEFAULT_SCORING = {
  wThroughput: 1,
  wSuccess: 2,
  wLatency: 1,
  wCost: 1,
  latencyTargetMs: 250,
  budgetPerHour: 0,
};

export const DEFAULT_LOAD_PROFILE = { type: 'constant' as const };

export function normalizeRound(raw: Partial<RoundConfig> | undefined, idx: number): RoundConfig {
  return {
    name: raw?.name ?? `Round ${idx + 1}`,
    story: raw?.story,
    intervalSec: Number(raw?.intervalSec ?? 60),
    durationSec: Number(raw?.durationSec ?? 120),
    loadProfile: raw?.loadProfile ?? DEFAULT_LOAD_PROFILE,
    chaosEvents: Array.isArray(raw?.chaosEvents) ? raw!.chaosEvents : [],
    scoringConfig: { ...DEFAULT_SCORING, ...(raw?.scoringConfig ?? {}) },
    weight: Number(raw?.weight ?? 1),
  };
}

export function getRoundsFromSession(session: { rounds: unknown }): RoundConfig[] {
  const raw = session.rounds;
  if (!Array.isArray(raw)) return [];
  return raw.map((r, i) => normalizeRound(r as Partial<RoundConfig>, i));
}

/** Non-sensitive round metadata safe to show players and the audience. */
export function publicRounds(rounds: RoundConfig[]) {
  return rounds.map((r) => ({
    name: r.name ?? null,
    story: r.story ?? null,
    interval_sec: r.intervalSec,
    duration_sec: r.durationSec,
    weight: r.weight,
  }));
}

export function roundConfigAt(rounds: RoundConfig[], roundIndex: number): RoundConfig | null {
  if (roundIndex < 0 || roundIndex >= rounds.length) return null;
  return rounds[roundIndex] ?? null;
}

/** 0-based round index for the active round (currentRound is 1-based). */
export function activeRoundIndex(currentRound: number): number {
  return Math.max(0, currentRound - 1);
}

export { DEFAULT_MAX_PLAYERS };
