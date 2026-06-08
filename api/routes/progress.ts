import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { contentProgress } from '../db/schema.js';
import { authRequired, type AppVariables } from '../middleware/auth.js';

export const progressRouter = new Hono<{ Variables: AppVariables }>();

type ProgressRow = typeof contentProgress.$inferSelect;

// Shape returned to the client mirrors the legacy localStorage object so the
// frontend can use it as a drop-in replacement: { [path]: { completed, completedAt } }.
interface ProgressEntry {
  completed: boolean;
  completedAt: string | null;
}

function toMap(rows: ProgressRow[]): Record<string, ProgressEntry> {
  const map: Record<string, ProgressEntry> = {};
  for (const row of rows) {
    map[row.path] = {
      completed: row.completed,
      completedAt: row.completedAt ? new Date(row.completedAt).toISOString() : null,
    };
  }
  return map;
}

interface SetProgressPayload {
  path?: string;
  completed?: boolean;
  // Optional descendant paths that should inherit the same completion state.
  paths?: string[];
}

interface MigratePayload {
  // Legacy localStorage `content-progress` object.
  progress?: Record<string, { completed?: boolean; completedAt?: string }>;
}

/** Upsert one (user, path) row, preserving the original createdAt. */
async function upsert(userId: string, path: string, completed: boolean, completedAt: Date) {
  await db
    .insert(contentProgress)
    .values({ userId, path, completed, completedAt, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [contentProgress.userId, contentProgress.path],
      set: { completed, completedAt, updatedAt: new Date() },
    });
}

/** Return every completion row for the current user, keyed by path. */
progressRouter.get('/api/progress', authRequired, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(contentProgress)
    .where(eq(contentProgress.userId, user.uid));
  return c.json({ progress: toMap(rows) });
});

/** Mark a path (and any descendant paths) complete or incomplete. */
progressRouter.put('/api/progress', authRequired, async (c) => {
  const user = c.get('user');
  const body = await c.req.json<SetProgressPayload>();
  const path = body.path?.trim();
  if (!path) throw new HTTPException(400, { message: 'path is required' });

  const completed = body.completed !== false;
  const completedAt = new Date();
  const targets = [path, ...(Array.isArray(body.paths) ? body.paths : [])]
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean);

  for (const target of targets) {
    await upsert(user.uid, target, completed, completedAt);
  }

  const rows = await db
    .select()
    .from(contentProgress)
    .where(eq(contentProgress.userId, user.uid));
  return c.json({ progress: toMap(rows) });
});

/**
 * One-time seamless import of a user's local progress on first sign-in. Existing
 * DB rows win (we never clobber server state), so this is safe to call more than
 * once — only paths the user has no row for yet are inserted.
 */
progressRouter.post('/api/progress/migrate', authRequired, async (c) => {
  const user = c.get('user');
  const body = await c.req.json<MigratePayload>();
  const incoming = body.progress ?? {};

  const existing = await db
    .select({ path: contentProgress.path })
    .from(contentProgress)
    .where(eq(contentProgress.userId, user.uid));
  const known = new Set(existing.map((r) => r.path));

  let migrated = 0;
  for (const [rawPath, entry] of Object.entries(incoming)) {
    const path = rawPath?.trim();
    if (!path || known.has(path) || !entry) continue;
    const completedAt = entry.completedAt ? new Date(entry.completedAt) : new Date();
    await db.insert(contentProgress).values({
      userId: user.uid,
      path,
      completed: entry.completed !== false,
      completedAt: isNaN(completedAt.getTime()) ? new Date() : completedAt,
      updatedAt: new Date(),
    });
    migrated += 1;
  }

  const rows = await db
    .select()
    .from(contentProgress)
    .where(eq(contentProgress.userId, user.uid));
  return c.json({ migrated, progress: toMap(rows) });
});

/** Clear a single path's progress entirely (optional convenience). */
progressRouter.delete('/api/progress', authRequired, async (c) => {
  const user = c.get('user');
  const path = c.req.query('path')?.trim();
  if (!path) throw new HTTPException(400, { message: 'path is required' });
  await db
    .delete(contentProgress)
    .where(and(eq(contentProgress.userId, user.uid), eq(contentProgress.path, path)));
  return c.json({ message: 'Progress cleared' });
});
