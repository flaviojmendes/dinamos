import { and, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { gamePlayers, gameSessions, users } from '../../db/schema.js';
import { rankSessionPlayers } from './leaderboard.js';

type SessionRow = typeof gameSessions.$inferSelect;

/**
 * Idempotently record Arena wins, podiums, and participation when a match ends.
 * Does not alter quiz/coins ranking — separate arena_* columns on users.
 */
export async function recordArenaProgression(session: SessionRow): Promise<void> {
  if (session.phase !== 'ended') return;
  if (session.progressionRecorded) return;

  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));

  if (players.length === 0) {
    await db
      .update(gameSessions)
      .set({ progressionRecorded: true, updatedAt: new Date() })
      .where(eq(gameSessions.id, session.id));
    return;
  }

  const ranked = rankSessionPlayers(session, players, { provisionalOk: false });
  const winnerId = ranked.find((r) => r.rank === 1)?.user_id;
  const podiumIds = new Set(
    ranked.filter((r) => r.rank >= 1 && r.rank <= 3).map((r) => r.user_id),
  );

  for (const p of players) {
    const [row] = await db
      .select({
        arenaMatchesPlayed: users.arenaMatchesPlayed,
        arenaWins: users.arenaWins,
        arenaPodiums: users.arenaPodiums,
      })
      .from(users)
      .where(eq(users.id, p.userId))
      .limit(1);
    if (!row) continue;

    const isPodium = podiumIds.has(p.userId);
    const isWin = p.userId === winnerId;
    await db
      .update(users)
      .set({
        arenaMatchesPlayed: (row.arenaMatchesPlayed ?? 0) + 1,
        arenaWins: (row.arenaWins ?? 0) + (isWin ? 1 : 0),
        arenaPodiums: (row.arenaPodiums ?? 0) + (isPodium ? 1 : 0),
        updatedAt: new Date(),
      })
      .where(eq(users.id, p.userId));
  }

  await db
    .update(gameSessions)
    .set({ progressionRecorded: true, updatedAt: new Date() })
    .where(and(eq(gameSessions.id, session.id), eq(gameSessions.progressionRecorded, false)));
}

export interface ArenaLeaderboardEntry {
  rank: number;
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  arena_matches_played: number;
  arena_wins: number;
  arena_podiums: number;
  win_rate: number;
}

/** Arena-specific ranking: wins, then podiums, then participation. */
export async function computeArenaRankings(limit = 50): Promise<ArenaLeaderboardEntry[]> {
  const rows = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      avatarImage: users.avatarImage,
      arenaMatchesPlayed: users.arenaMatchesPlayed,
      arenaWins: users.arenaWins,
      arenaPodiums: users.arenaPodiums,
    })
    .from(users);

  const ranked = rows
    .filter((u) => (u.arenaMatchesPlayed ?? 0) > 0)
    .map((u) => ({
      user_id: u.id,
      nickname: u.nickname,
      avatar_image: u.avatarImage,
      arena_matches_played: u.arenaMatchesPlayed ?? 0,
      arena_wins: u.arenaWins ?? 0,
      arena_podiums: u.arenaPodiums ?? 0,
      win_rate:
        (u.arenaMatchesPlayed ?? 0) > 0
          ? Math.round(((u.arenaWins ?? 0) / (u.arenaMatchesPlayed ?? 1)) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => {
      if (b.arena_wins !== a.arena_wins) return b.arena_wins - a.arena_wins;
      if (b.arena_podiums !== a.arena_podiums) return b.arena_podiums - a.arena_podiums;
      if (b.arena_matches_played !== a.arena_matches_played) {
        return b.arena_matches_played - a.arena_matches_played;
      }
      return a.user_id.localeCompare(b.user_id);
    })
    .slice(0, limit)
    .map((r, i) => ({ rank: i + 1, ...r }));

  return ranked;
}
