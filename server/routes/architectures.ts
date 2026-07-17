import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { savedArchitectures } from '../db/schema.js';
import {
  authRequired,
  optionalAuth,
  type AppVariables,
} from '../middleware/auth.js';
import { maxBodyBytes, rateLimit } from '../middleware/guardrails.js';
import { savedArchitectureToDict } from '../db/serializers.js';
import { validateDesignPayload } from '../../src/components/SystemEditor/engine/designSchema.js';

export const architecturesRouter = new Hono<{ Variables: AppVariables }>();

const VISIBILITIES = ['private', 'unlisted', 'public'] as const;
type Visibility = (typeof VISIBILITIES)[number];

const writeGuard = [
  maxBodyBytes(512_000),
  rateLimit({ windowMs: 60_000, max: 60, keyPrefix: 'architectures' }),
] as const;

function normalizeVisibility(value: unknown): Visibility {
  return VISIBILITIES.includes(value as Visibility) ? (value as Visibility) : 'private';
}

function normalizeTitle(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, 160);
  return trimmed.length > 0 ? trimmed : null;
}

// List the current user's saved designs (no heavy design blob).
architecturesRouter.get(
  '/api/architectures',
  authRequired,
  rateLimit({ windowMs: 60_000, max: 60, keyPrefix: 'architectures' }),
  async (c) => {
  const user = c.get('user');
  const rows = await db
    .select({
      id: savedArchitectures.id,
      userId: savedArchitectures.userId,
      title: savedArchitectures.title,
      visibility: savedArchitectures.visibility,
      createdAt: savedArchitectures.createdAt,
      updatedAt: savedArchitectures.updatedAt,
    })
    .from(savedArchitectures)
    .where(eq(savedArchitectures.userId, user.uid))
    .orderBy(desc(savedArchitectures.updatedAt));
  return c.json({ architectures: rows.map((r) => savedArchitectureToDict(r, false)) });
});

// Create a new saved design owned by the current user.
architecturesRouter.post(
  '/api/architectures',
  authRequired,
  ...writeGuard,
  async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{
    title?: string;
    visibility?: string;
    design?: unknown;
  }>();

  let design: object;
  try {
    design = validateDesignPayload(body.design);
  } catch {
    throw new HTTPException(400, { message: 'Invalid design payload' });
  }

  const [row] = await db
    .insert(savedArchitectures)
    .values({
      userId: user.uid,
      title: normalizeTitle(body.title),
      visibility: normalizeVisibility(body.visibility),
      design,
    })
    .returning();

  return c.json(savedArchitectureToDict(row), 201);
});

// Read a single design. Owners can read any of theirs; everyone else can only
// read unlisted/public rows (powers share links and embeds).
architecturesRouter.get(
  '/api/architectures/:id',
  optionalAuth,
  rateLimit({ windowMs: 60_000, max: 120, keyPrefix: 'architectures-read' }),
  async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  const rows = await db
    .select()
    .from(savedArchitectures)
    .where(eq(savedArchitectures.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new HTTPException(404, { message: 'Architecture not found' });

  const isOwner = !!user && user.uid === row.userId;
  if (!isOwner && row.visibility === 'private') {
    throw new HTTPException(404, { message: 'Architecture not found' });
  }
  return c.json(savedArchitectureToDict(row));
});

// Update an existing design. Owner-only.
architecturesRouter.put(
  '/api/architectures/:id',
  authRequired,
  ...writeGuard,
  async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json<{
    title?: string;
    visibility?: string;
    design?: unknown;
  }>();

  const existing = await db
    .select()
    .from(savedArchitectures)
    .where(eq(savedArchitectures.id, id))
    .limit(1);
  if (!existing[0]) throw new HTTPException(404, { message: 'Architecture not found' });
  if (existing[0].userId !== user.uid) {
    throw new HTTPException(403, { message: 'Not allowed' });
  }

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (body.design !== undefined) {
    try {
      update.design = validateDesignPayload(body.design);
    } catch {
      throw new HTTPException(400, { message: 'Invalid design payload' });
    }
  }
  if (body.title !== undefined) update.title = normalizeTitle(body.title);
  if (body.visibility !== undefined) update.visibility = normalizeVisibility(body.visibility);

  const [row] = await db
    .update(savedArchitectures)
    .set(update)
    .where(eq(savedArchitectures.id, id))
    .returning();

  return c.json(savedArchitectureToDict(row));
});

// Delete a design. Owner-only.
architecturesRouter.delete(
  '/api/architectures/:id',
  authRequired,
  rateLimit({ windowMs: 60_000, max: 60, keyPrefix: 'architectures' }),
  async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  const result = await db
    .delete(savedArchitectures)
    .where(and(eq(savedArchitectures.id, id), eq(savedArchitectures.userId, user.uid)))
    .returning({ id: savedArchitectures.id });
  if (!result[0]) throw new HTTPException(404, { message: 'Architecture not found' });
  return c.json({ ok: true });
});
