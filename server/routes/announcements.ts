import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, count, desc, eq, notInArray, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { announcements, announcementAcks, announcementViews, users } from '../db/schema.js';
import { authRequired, adminRequired, type AppVariables } from '../middleware/auth.js';

export const announcementsRouter = new Hono<{ Variables: AppVariables }>();

type AnnouncementRow = typeof announcements.$inferSelect;

/** Full row for the admin panel (both languages + flags). */
function toAdminDict(row: AnnouncementRow) {
  return {
    id: row.id,
    title_en: row.titleEn,
    title_pt: row.titlePt,
    body_en: row.bodyEn,
    body_pt: row.bodyPt,
    published: row.published,
    published_at: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
    created_at: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updated_at: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
  };
}

function normalizeOptional(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : value;
}

// ==================== Public (any signed-in user) ====================

/**
 * The single announcement to show the current user right now: the most recently
 * published one they have not acknowledged yet, resolved to the requested
 * language (with fallback to the other language when one body is empty). Returns
 * `{ announcement: null }` when there is nothing to show.
 */
announcementsRouter.get('/api/announcements/active', authRequired, async (c) => {
  const user = c.get('user');
  const lang = c.req.query('lang') === 'pt' ? 'pt' : 'en';

  const ackedRows = await db
    .select({ announcementId: announcementAcks.announcementId })
    .from(announcementAcks)
    .where(eq(announcementAcks.userId, user.uid));
  const ackedIds = ackedRows.map((r) => r.announcementId);

  const where =
    ackedIds.length > 0
      ? and(eq(announcements.published, true), notInArray(announcements.id, ackedIds))
      : eq(announcements.published, true);

  const rows = await db
    .select()
    .from(announcements)
    .where(where)
    .orderBy(desc(announcements.publishedAt), desc(announcements.id))
    .limit(1);

  const row = rows[0];
  if (!row) return c.json({ announcement: null });

  const primaryBody = lang === 'pt' ? row.bodyPt : row.bodyEn;
  const fallbackBody = lang === 'pt' ? row.bodyEn : row.bodyPt;
  const primaryTitle = lang === 'pt' ? row.titlePt : row.titleEn;
  const fallbackTitle = lang === 'pt' ? row.titleEn : row.titlePt;
  const body = (primaryBody && primaryBody.trim() ? primaryBody : fallbackBody) ?? '';
  const title = (primaryTitle && primaryTitle.trim() ? primaryTitle : fallbackTitle) ?? null;

  // Nothing renderable (both bodies empty) — treat as no announcement.
  if (!body.trim()) return c.json({ announcement: null });

  return c.json({ announcement: { id: row.id, title, body } });
});

/**
 * Record that the current user was actually shown an announcement (the modal
 * rendered it). Idempotent: one "received" row per (announcement, user). This is
 * the signal behind the received-vs-acknowledged analytics; it is fired by the
 * client when the modal becomes visible, before any dismissal.
 */
announcementsRouter.post('/api/announcements/:id/seen', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  if (!Number.isInteger(id)) throw new HTTPException(400, { message: 'Invalid announcement id' });

  const exists = await db
    .select({ id: announcements.id })
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);
  if (!exists[0]) throw new HTTPException(404, { message: 'Announcement not found' });

  await db
    .insert(announcementViews)
    .values({ announcementId: id, userId: user.uid })
    .onConflictDoNothing({
      target: [announcementViews.announcementId, announcementViews.userId],
    });

  return c.json({ message: 'Recorded' });
});

/** Record that the current user dismissed an announcement. Idempotent. */
announcementsRouter.post('/api/announcements/:id/ack', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  if (!Number.isInteger(id)) throw new HTTPException(400, { message: 'Invalid announcement id' });

  const exists = await db
    .select({ id: announcements.id })
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);
  if (!exists[0]) throw new HTTPException(404, { message: 'Announcement not found' });

  await db
    .insert(announcementAcks)
    .values({ announcementId: id, userId: user.uid })
    .onConflictDoNothing({
      target: [announcementAcks.announcementId, announcementAcks.userId],
    });

  return c.json({ message: 'Acknowledged' });
});

// ==================== Admin CRUD ====================

announcementsRouter.use('/api/admin/announcements', authRequired, adminRequired);
announcementsRouter.use('/api/admin/announcements/*', authRequired, adminRequired);

announcementsRouter.get('/api/admin/announcements', async (c) => {
  const rows = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt), desc(announcements.id));
  return c.json({ announcements: rows.map(toAdminDict) });
});

/**
 * Reach analytics per announcement: how many users received it (the modal was
 * shown) and how many acknowledged it. An acknowledgement implies receipt, so
 * "received" counts the distinct users present in either the views or the acks
 * table (this also backfills reach for acks recorded before view tracking
 * existed). `ack_rate` is acknowledged / received.
 */
announcementsRouter.get('/api/admin/announcements/analytics', async (c) => {
  const totalUsers = Number((await db.select({ c: count() }).from(users))[0].c);

  const rows = (await db.execute(sql`
    SELECT
      a.id AS id,
      a.title_en AS title_en,
      a.title_pt AS title_pt,
      a.published AS published,
      a.published_at AS published_at,
      COALESCE(r.received, 0) AS received,
      COALESCE(k.acknowledged, 0) AS acknowledged
    FROM ${announcements} a
    LEFT JOIN (
      SELECT announcement_id, count(DISTINCT user_id) AS received
      FROM (
        SELECT announcement_id, user_id FROM ${announcementViews}
        UNION
        SELECT announcement_id, user_id FROM ${announcementAcks}
      ) reach
      GROUP BY announcement_id
    ) r ON r.announcement_id = a.id
    LEFT JOIN (
      SELECT announcement_id, count(DISTINCT user_id) AS acknowledged
      FROM ${announcementAcks}
      GROUP BY announcement_id
    ) k ON k.announcement_id = a.id
    ORDER BY a.published_at DESC NULLS LAST, a.id DESC
  `)) as unknown as Array<{
    id: number;
    title_en: string | null;
    title_pt: string | null;
    published: boolean;
    published_at: string | Date | null;
    received: number | string;
    acknowledged: number | string;
  }>;

  const list = Array.from(rows).map((row) => {
    const received = Number(row.received) || 0;
    const acknowledged = Number(row.acknowledged) || 0;
    return {
      id: row.id,
      title: row.title_en || row.title_pt || null,
      published: row.published,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      received,
      acknowledged,
      ack_rate: received > 0 ? Math.round((acknowledged / received) * 100) : 0,
    };
  });

  const totals = list.reduce(
    (acc, a) => {
      acc.received += a.received;
      acc.acknowledged += a.acknowledged;
      return acc;
    },
    { received: 0, acknowledged: 0 }
  );

  return c.json({
    total_users: totalUsers,
    totals: {
      announcements: list.length,
      received: totals.received,
      acknowledged: totals.acknowledged,
      ack_rate: totals.received > 0 ? Math.round((totals.acknowledged / totals.received) * 100) : 0,
    },
    announcements: list,
  });
});

interface AnnouncementPayload {
  title_en?: string | null;
  title_pt?: string | null;
  body_en?: string | null;
  body_pt?: string | null;
  published?: boolean;
}

announcementsRouter.post('/api/admin/announcements', async (c) => {
  const body = await c.req.json<AnnouncementPayload>();
  const published = body.published ?? false;
  const inserted = await db
    .insert(announcements)
    .values({
      titleEn: normalizeOptional(body.title_en) ?? null,
      titlePt: normalizeOptional(body.title_pt) ?? null,
      bodyEn: body.body_en ?? null,
      bodyPt: body.body_pt ?? null,
      published,
      publishedAt: published ? new Date() : null,
    })
    .returning();
  return c.json(toAdminDict(inserted[0]), 201);
});

announcementsRouter.put('/api/admin/announcements/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json<AnnouncementPayload>();
  const current = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
  if (!current[0]) throw new HTTPException(404, { message: 'Announcement not found' });

  const updates: Partial<typeof announcements.$inferInsert> = {};
  if (body.title_en !== undefined) updates.titleEn = normalizeOptional(body.title_en) ?? null;
  if (body.title_pt !== undefined) updates.titlePt = normalizeOptional(body.title_pt) ?? null;
  if (body.body_en !== undefined) updates.bodyEn = body.body_en;
  if (body.body_pt !== undefined) updates.bodyPt = body.body_pt;
  if (body.published !== undefined) {
    updates.published = body.published;
    // Stamp publishedAt the first time it transitions to published; clear when
    // unpublished so the active query ordering stays meaningful.
    if (body.published && !current[0].published) {
      updates.publishedAt = new Date();
    } else if (!body.published) {
      updates.publishedAt = null;
    }
  }
  updates.updatedAt = new Date();

  const updated = await db
    .update(announcements)
    .set(updates)
    .where(eq(announcements.id, id))
    .returning();
  return c.json(toAdminDict(updated[0]));
});

announcementsRouter.delete('/api/admin/announcements/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const deleted = await db.delete(announcements).where(eq(announcements.id, id)).returning();
  if (!deleted[0]) throw new HTTPException(404, { message: 'Announcement not found' });
  return c.json({ message: 'Announcement deleted successfully' });
});

/**
 * Clear every acknowledgement for an announcement so it is shown again to all
 * users — the "re-trigger" action after editing an existing announcement.
 */
announcementsRouter.post('/api/admin/announcements/:id/reset-acks', async (c) => {
  const id = Number(c.req.param('id'));
  const exists = await db
    .select({ id: announcements.id })
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);
  if (!exists[0]) throw new HTTPException(404, { message: 'Announcement not found' });

  const deleted = await db
    .delete(announcementAcks)
    .where(eq(announcementAcks.announcementId, id))
    .returning({ id: announcementAcks.id });
  return c.json({ message: 'Acknowledgements reset', cleared: deleted.length });
});
