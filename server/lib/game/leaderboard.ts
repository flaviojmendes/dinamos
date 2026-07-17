import type { gamePlayers } from '../../db/schema';
import type { RoundConfig } from '../../../src/components/SystemEditor/game/types';
import type { VerifiedRoundScore } from './types.js';
import { readVerifiedRoundScores } from './snapshots.js';
import { computeVerifiedAggregate } from './scoring/recompute.js';
import { getRoundsFromSession } from './rounds.js';

type PlayerRow = typeof gamePlayers.$inferSelect;

export interface RankablePlayer {
  userId: string;
  joinedAt: Date | string | null;
  lastSubmittedAt: Date | string | null;
  roundScores: Record<string, { score?: number; clientScore?: number }> | null;
  verifiedRoundScores: Record<string, VerifiedRoundScore> | null;
}

export interface RankedEntry {
  user_id: string;
  score: number;
  verified: boolean;
  best_streak: number;
  rank: number;
}

function bestStreakFromVerified(verified: Record<string, VerifiedRoundScore>): number {
  let best = 0;
  for (const entry of Object.values(verified)) {
    const streak = (entry.breakdown as { bestStreak?: number } | null)?.bestStreak ?? 0;
    best = Math.max(best, streak);
  }
  return best;
}

function earliestVerifiedAt(verified: Record<string, VerifiedRoundScore>): number {
  let earliest = Number.POSITIVE_INFINITY;
  for (const entry of Object.values(verified)) {
    const t = new Date(entry.verifiedAt).getTime();
    if (t < earliest) earliest = t;
  }
  return earliest === Number.POSITIVE_INFINITY ? Number.MAX_SAFE_INTEGER : earliest;
}

function provisionalAggregate(
  rounds: RoundConfig[],
  roundScores: Record<string, { score?: number }>,
): number {
  let total = 0;
  for (const [key, val] of Object.entries(roundScores)) {
    const idx = Number(key);
    total += (rounds[idx]?.weight ?? 1) * (val?.score ?? 0);
  }
  return total;
}

/**
 * Deterministic ranking: verified score, best streak, earliest verified
 * submission, join time, then user id.
 */
export function rankPlayers(
  players: RankablePlayer[],
  rounds: RoundConfig[],
  options?: { provisionalOk?: boolean },
): RankedEntry[] {
  const provisionalOk = options?.provisionalOk ?? false;

  const scored = players.map((p) => {
    const verified = readVerifiedRoundScores(p.verifiedRoundScores);
    const hasVerified = Object.keys(verified).length > 0;
    const score = hasVerified
      ? computeVerifiedAggregate(rounds, verified)
      : provisionalOk
        ? provisionalAggregate(rounds, (p.roundScores ?? {}) as Record<string, { score?: number }>)
        : 0;

    return {
      user_id: p.userId,
      score,
      verified: hasVerified,
      best_streak: hasVerified ? bestStreakFromVerified(verified) : 0,
      verified_at: hasVerified ? earliestVerifiedAt(verified) : Number.MAX_SAFE_INTEGER,
      joined_at: p.joinedAt ? new Date(p.joinedAt).getTime() : Number.MAX_SAFE_INTEGER,
      last_submitted_at: p.lastSubmittedAt
        ? new Date(p.lastSubmittedAt).getTime()
        : Number.MAX_SAFE_INTEGER,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.best_streak !== a.best_streak) return b.best_streak - a.best_streak;
    if (a.verified_at !== b.verified_at) return a.verified_at - b.verified_at;
    if (a.joined_at !== b.joined_at) return a.joined_at - b.joined_at;
    return a.user_id.localeCompare(b.user_id);
  });

  return scored.map((entry, i) => ({
    user_id: entry.user_id,
    score: entry.score,
    verified: entry.verified,
    best_streak: entry.best_streak,
    rank: i + 1,
  }));
}

export function rankSessionPlayers(
  session: { rounds: unknown },
  players: PlayerRow[],
  options?: { provisionalOk?: boolean },
): RankedEntry[] {
  const rounds = getRoundsFromSession(session);
  return rankPlayers(
    players.map((p) => ({
      userId: p.userId,
      joinedAt: p.joinedAt,
      lastSubmittedAt: p.lastSubmittedAt,
      roundScores: (p.roundScores ?? null) as Record<string, { score?: number }> | null,
      verifiedRoundScores: (p.verifiedRoundScores ?? null) as Record<
        string,
        VerifiedRoundScore
      > | null,
    })),
    rounds,
    options,
  );
}
