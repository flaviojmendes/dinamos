import { Hono } from 'hono';
import { createHash } from 'node:crypto';
import { db } from '../db/client.js';
import { contentViews } from '../db/schema.js';
import { optionalAuth, type AppVariables } from '../middleware/auth.js';

export const viewsRouter = new Hono<{ Variables: AppVariables }>();

interface ViewPayload {
  path?: string;
  // Opaque, client-generated anonymous id (persisted in localStorage). Only used
  // to derive a one-way hash so distinct visitors can be counted; never stored.
  visitorId?: string;
}

/**
 * Hash an opaque visitor key with a server-side salt. The result is one-way:
 * it lets us count distinct visitors without ever being able to recover who
 * they are. Falls back to a constant default salt in local/dev environments.
 *
 * The key must be an identity-less, client-generated value (never the Firebase
 * uid): hashing a stable account id with a known salt would let anyone holding
 * that uid recompute the hash and reconstruct a specific person's view history.
 */
function hashVisitor(visitorKey: string): string {
  const salt = process.env.ANALYTICS_SALT ?? 'dinamos-analytics-default-salt';
  return createHash('sha256').update(`${salt}:${visitorKey}`).digest('hex');
}

/**
 * Record an anonymized content page view. Uses optionalAuth (never 401) so it
 * keeps working for logged-out visitors — the frontend axios interceptor would
 * otherwise redirect to /login on a 401.
 */
viewsRouter.post('/api/views', optionalAuth, async (c) => {
  let body: ViewPayload = {};
  try {
    body = await c.req.json<ViewPayload>();
  } catch {
    /* tolerate empty/invalid body — tracking must never break the page */
  }

  const path = typeof body.path === 'string' ? body.path.trim() : '';
  if (!path || path.length > 255) {
    return c.json({ ok: false }, 200);
  }

  const user = c.get('user');
  // Always hash the anonymous, client-generated visitor id — never the Firebase
  // uid. The visitor id is not linked to any account in the database, so view
  // rows stay aggregate-only and can't be reversed to a specific person. We
  // still keep the (non-identifying) authed flag for the authed/anon split.
  const anonId = body.visitorId?.trim();
  const visitorKey = anonId && anonId.length ? anonId : 'anon';
  const visitorHash = hashVisitor(visitorKey);

  try {
    await db.insert(contentViews).values({
      path,
      visitorHash,
      isAuthed: Boolean(user?.uid),
    });
  } catch (error) {
    console.error('[views] Failed to record view:', error);
  }

  return c.json({ ok: true }, 200);
});
