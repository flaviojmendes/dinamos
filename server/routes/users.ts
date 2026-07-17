import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, count, desc, eq, gte, max, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  contentProgress,
  forumMessages,
  forumTopics,
  quizAttempts,
  solutions,
  users,
} from '../db/schema.js';
import {
  authRequired,
  type AppVariables,
} from '../middleware/auth.js';
import { ensureUser, getUserContext, getUserRow } from '../db/repo.js';
import { userToDict, solutionToDict } from '../db/serializers.js';

export const usersRouter = new Hono<{ Variables: AppVariables }>();

async function serializeCurrentUser(userId: string) {
  const ctx = await getUserContext(userId);
  if (!ctx) return null;
  return userToDict(ctx.user, ctx.role, ctx.permissionCodes);
}

usersRouter.get('/api/users/me', authRequired, async (c) => {
  const user = c.get('user');
  let dbUser = await getUserRow(user.uid);
  if (!dbUser) {
    const email = user.email || `${user.uid}@email.com`;
    const nickname = email.split('@')[0] || 'User';
    await ensureUser(user.uid, email, nickname);
  }
  const result = await serializeCurrentUser(user.uid);
  return c.json(result);
});

usersRouter.put('/api/users/me/onboarding-complete', authRequired, async (c) => {
  const user = c.get('user');
  const dbUser = await getUserRow(user.uid);
  if (!dbUser) throw new HTTPException(404, { message: 'User not found' });
  await db
    .update(users)
    .set({ onboardingCompleted: true })
    .where(eq(users.id, user.uid));
  const result = await serializeCurrentUser(user.uid);
  return c.json(result);
});

usersRouter.put('/api/users/me', authRequired, async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{
    nickname?: string;
    avatar_image?: string;
    email?: string;
    github_username?: string;
  }>();

  let dbUser = await getUserRow(user.uid);
  if (!dbUser) {
    const email = user.email || body.email || `${user.uid}@email.com`;
    const nickname = email.split('@')[0] || 'User';
    dbUser = await ensureUser(user.uid, email, nickname);
  }

  const updates: Record<string, unknown> = {};
  if (body.nickname != null) updates.nickname = body.nickname;
  if (body.avatar_image != null) updates.avatarImage = body.avatar_image;
  if (body.github_username != null) updates.githubUsername = body.github_username;
  // Only allow setting email if it was previously empty
  if (body.email && (!dbUser.email || dbUser.email === '')) {
    updates.email = body.email;
  }
  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, user.uid));
  }
  const result = await serializeCurrentUser(user.uid);
  return c.json(result);
});

usersRouter.get('/api/user/solutions', authRequired, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(solutions)
    .where(eq(solutions.userId, user.uid))
    .orderBy(desc(solutions.createdAt));
  return c.json({ solutions: rows.map(solutionToDict) });
});

usersRouter.get('/api/user/solutions/:id', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  const rows = await db
    .select()
    .from(solutions)
    .where(eq(solutions.id, id))
    .limit(1);
  const sol = rows[0];
  if (!sol) throw new HTTPException(404, { message: 'Solution not found' });
  if (sol.userId !== user.uid)
    throw new HTTPException(403, { message: 'Not authorized to view this solution' });
  return c.json(solutionToDict(sol));
});

usersRouter.get('/api/user/scores', authRequired, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select({
      challenge_id: solutions.challengeId,
      best_score: max(solutions.score),
    })
    .from(solutions)
    .where(and(eq(solutions.userId, user.uid), eq(solutions.status, 'submitted')))
    .groupBy(solutions.challengeId);
  return c.json({ scores: rows });
});

/**
 * Per-user activity contribution graph (GitHub-style mosaic). Returns one entry
 * per calendar day for the requested window, with a total count and a per-type
 * breakdown. Sources are unioned in JS from date-grouped queries:
 *   - lessons read / marked done  -> content_progress.updated_at (any toggle)
 *   - quiz attempts                -> quiz_attempts.started_at
 *   - challenge solutions          -> solutions.created_at (submitted only)
 *   - forum topics + replies       -> forum_*.created_at
 */
usersRouter.get('/api/user/activity', authRequired, async (c) => {
  const user = c.get('user');
  const uid = user.uid;

  const rawDays = Number(c.req.query('days'));
  const days = Number.isFinite(rawDays) ? Math.min(Math.max(Math.trunc(rawDays), 1), 366) : 365;

  // Anchor the window to the start of "today" (UTC) so the last cell is today.
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const since = new Date(todayUtc.getTime() - (days - 1) * 86400000);

  const [readRows, quizRows, solutionRows, topicRows, messageRows] = await Promise.all([
    db
      .select({ d: sql<string>`date(${contentProgress.updatedAt})`, c: count() })
      .from(contentProgress)
      .where(and(eq(contentProgress.userId, uid), gte(contentProgress.updatedAt, since)))
      .groupBy(sql`date(${contentProgress.updatedAt})`),
    db
      .select({ d: sql<string>`date(${quizAttempts.startedAt})`, c: count() })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, uid), gte(quizAttempts.startedAt, since)))
      .groupBy(sql`date(${quizAttempts.startedAt})`),
    db
      .select({ d: sql<string>`date(${solutions.createdAt})`, c: count() })
      .from(solutions)
      .where(
        and(
          eq(solutions.userId, uid),
          eq(solutions.status, 'submitted'),
          gte(solutions.createdAt, since),
        ),
      )
      .groupBy(sql`date(${solutions.createdAt})`),
    db
      .select({ d: sql<string>`date(${forumTopics.createdAt})`, c: count() })
      .from(forumTopics)
      .where(and(eq(forumTopics.userId, uid), gte(forumTopics.createdAt, since)))
      .groupBy(sql`date(${forumTopics.createdAt})`),
    db
      .select({ d: sql<string>`date(${forumMessages.createdAt})`, c: count() })
      .from(forumMessages)
      .where(and(eq(forumMessages.userId, uid), gte(forumMessages.createdAt, since)))
      .groupBy(sql`date(${forumMessages.createdAt})`),
  ]);

  const toMap = (rows: { d: string; c: number }[]) =>
    new Map(rows.map((r) => [String(r.d), Number(r.c)]));
  const readMap = toMap(readRows);
  const quizMap = toMap(quizRows);
  const solutionMap = toMap(solutionRows);
  const forumMap = new Map<string, number>();
  for (const r of [...topicRows, ...messageRows]) {
    const key = String(r.d);
    forumMap.set(key, (forumMap.get(key) ?? 0) + Number(r.c));
  }

  const timeline: {
    date: string;
    count: number;
    reads: number;
    quizzes: number;
    solutions: number;
    forum: number;
  }[] = [];
  let total = 0;
  for (let i = 0; i < days; i++) {
    const day = new Date(since.getTime() + i * 86400000).toISOString().slice(0, 10);
    const reads = readMap.get(day) ?? 0;
    const quizzes = quizMap.get(day) ?? 0;
    const sols = solutionMap.get(day) ?? 0;
    const forum = forumMap.get(day) ?? 0;
    const dayTotal = reads + quizzes + sols + forum;
    total += dayTotal;
    timeline.push({ date: day, count: dayTotal, reads, quizzes, solutions: sols, forum });
  }

  return c.json({ days, total, activity: timeline });
});
