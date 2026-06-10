import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, max } from 'drizzle-orm';
import { db } from '../db/client.js';
import { solutions, users } from '../db/schema.js';
import {
  authRequired,
  type AppVariables,
} from '../middleware/auth.js';
import { createUser, getUserContext, getUserRow } from '../db/repo.js';
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
    await createUser(user.uid, email, nickname);
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
    dbUser = await createUser(user.uid, email, nickname);
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
