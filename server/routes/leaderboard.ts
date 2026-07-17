import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { quizAttempts, users } from '../db/schema.js';
import { authRequired, type AppVariables } from '../middleware/auth.js';

export const leaderboardRouter = new Hono<{ Variables: AppVariables }>();

const QUIZ_WEIGHT = 0.5;
const COINS_WEIGHT = 0.5;

interface RankedUser {
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  coins: number;
  avg_quiz_score: number;
  quizzes_completed: number;
  total_correct_answers: number;
  ranking_score: number;
  created_at: Date | null;
}

async function computeRankings(): Promise<RankedUser[]> {
  // best percentage per (user, quiz)
  const bestPerQuiz = await db
    .select({
      userId: quizAttempts.userId,
      quizId: quizAttempts.quizId,
      best: sql<number>`max(${quizAttempts.percentage})`,
    })
    .from(quizAttempts)
    .groupBy(quizAttempts.userId, quizAttempts.quizId);

  // total correct answers per user
  const totalCorrect = await db
    .select({
      userId: quizAttempts.userId,
      total: sql<number>`sum(${quizAttempts.score})`,
    })
    .from(quizAttempts)
    .groupBy(quizAttempts.userId);
  const correctMap = new Map(totalCorrect.map((r) => [r.userId, Number(r.total)]));

  // aggregate quiz stats per user
  const quizAgg = new Map<string, { sum: number; count: number }>();
  for (const r of bestPerQuiz) {
    const cur = quizAgg.get(r.userId) ?? { sum: 0, count: 0 };
    cur.sum += Number(r.best);
    cur.count += 1;
    quizAgg.set(r.userId, cur);
  }

  const allUsers = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      avatarImage: users.avatarImage,
      tokens: users.tokens,
      createdAt: users.createdAt,
    })
    .from(users);

  const maxTokens = Math.max(1, ...allUsers.map((u) => u.tokens ?? 0));

  const ranked: RankedUser[] = [];
  for (const u of allUsers) {
    const agg = quizAgg.get(u.id);
    const quizzesCompleted = agg?.count ?? 0;
    const avgQuiz = agg && agg.count > 0 ? agg.sum / agg.count : 0;
    const tokens = u.tokens ?? 0;
    if (tokens <= 0 && quizzesCompleted <= 0) continue; // only active users
    const normalizedCoins = maxTokens > 0 ? (tokens / maxTokens) * 100 : 0;
    const rankingScore = avgQuiz * QUIZ_WEIGHT + normalizedCoins * COINS_WEIGHT;
    ranked.push({
      user_id: u.id,
      nickname: u.nickname,
      avatar_image: u.avatarImage,
      coins: tokens,
      avg_quiz_score: Math.round(avgQuiz * 10) / 10,
      quizzes_completed: quizzesCompleted,
      total_correct_answers: correctMap.get(u.id) ?? 0,
      ranking_score: Math.round(rankingScore * 10) / 10,
      created_at: u.createdAt ? new Date(u.createdAt) : null,
    });
  }

  ranked.sort((a, b) => {
    if (b.ranking_score !== a.ranking_score) return b.ranking_score - a.ranking_score;
    if (b.avg_quiz_score !== a.avg_quiz_score) return b.avg_quiz_score - a.avg_quiz_score;
    if (b.coins !== a.coins) return b.coins - a.coins;
    const at = a.created_at?.getTime() ?? 0;
    const bt = b.created_at?.getTime() ?? 0;
    return at - bt;
  });
  return ranked;
}

leaderboardRouter.get('/api/leaderboard', authRequired, async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? '50'), 100);
  const ranked = await computeRankings();
  const leaderboard = ranked.slice(0, limit).map((r, i) => ({
    rank: i + 1,
    user_id: r.user_id,
    nickname: r.nickname,
    avatar_image: r.avatar_image,
    coins: r.coins,
    avg_quiz_score: r.avg_quiz_score,
    quizzes_completed: r.quizzes_completed,
    total_correct_answers: r.total_correct_answers,
    ranking_score: r.ranking_score,
  }));
  return c.json({ leaderboard });
});

leaderboardRouter.get('/api/leaderboard/me', authRequired, async (c) => {
  const user = c.get('user');
  const ranked = await computeRankings();
  const idx = ranked.findIndex((r) => r.user_id === user.uid);
  if (idx === -1) {
    return c.json({
      rank: null,
      user_id: user.uid,
      nickname: null,
      avatar_image: null,
      coins: 0,
      avg_quiz_score: 0,
      quizzes_completed: 0,
      total_correct_answers: 0,
      ranking_score: 0,
      message: 'Complete quizzes or earn DinaCoins to appear on the leaderboard!',
    });
  }
  const r = ranked[idx];
  return c.json({
    rank: idx + 1,
    user_id: r.user_id,
    nickname: r.nickname,
    avatar_image: r.avatar_image,
    coins: r.coins,
    avg_quiz_score: r.avg_quiz_score,
    quizzes_completed: r.quizzes_completed,
    total_correct_answers: r.total_correct_answers,
    ranking_score: r.ranking_score,
  });
});

/** Arena wins/podiums/participation — separate from quiz/coins formula. */
leaderboardRouter.get('/api/leaderboard/arena', authRequired, async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? '50'), 100);
  const { computeArenaRankings } = await import('../lib/game/progression.js');
  const leaderboard = await computeArenaRankings(limit);
  return c.json({ leaderboard });
});

leaderboardRouter.get('/api/leaderboard/arena/me', authRequired, async (c) => {
  const user = c.get('user');
  const { computeArenaRankings } = await import('../lib/game/progression.js');
  const ranked = await computeArenaRankings(500);
  const idx = ranked.findIndex((r) => r.user_id === user.uid);
  if (idx === -1) {
    return c.json({
      rank: null,
      user_id: user.uid,
      arena_matches_played: 0,
      arena_wins: 0,
      arena_podiums: 0,
      win_rate: 0,
      message: 'Play an Arena match to appear on the Arena leaderboard!',
    });
  }
  return c.json(ranked[idx]);
});
