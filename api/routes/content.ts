import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { asc, eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { contentPages, contentModules } from '../db/schema.js';
import { authRequired, adminRequired, type AppVariables } from '../middleware/auth.js';

export const contentRouter = new Hono<{ Variables: AppVariables }>();

type ContentRow = typeof contentPages.$inferSelect;
type ModuleRow = typeof contentModules.$inferSelect;

const VALID_TIERS = ['FOUNDATIONAL', 'CORE', 'ADVANCED', 'APPLIED', 'TOOLS'];

function toModulePublic(row: ModuleRow) {
  return {
    id: row.key,
    label: row.label,
    tier: row.tier,
    base: row.base,
    paths: (row.paths as string[] | null) ?? undefined,
    orderIndex: row.orderIndex,
  };
}

function toModuleAdminDict(row: ModuleRow) {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    tier: row.tier,
    base: row.base,
    paths: (row.paths as string[] | null) ?? null,
    order_index: row.orderIndex,
    created_at: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updated_at: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
  };
}

/** Public index entry — just what routing + the navigation registry need. */
function toIndexEntry(row: ContentRow) {
  return {
    slug: row.slug,
    path: row.path,
    moduleId: row.moduleId,
    requiresSubscription: row.requiresSubscription,
    orderIndex: row.orderIndex,
    simulatorKey: row.simulatorKey,
    titleEn: row.titleEn,
    titlePt: row.titlePt,
    hasEn: Boolean(row.bodyEn && row.bodyEn.trim()),
    hasPt: Boolean(row.bodyPt && row.bodyPt.trim()),
  };
}

/** Full row for the admin CMS (includes both language bodies). */
function toAdminDict(row: ContentRow) {
  return {
    id: row.id,
    slug: row.slug,
    path: row.path,
    module_id: row.moduleId,
    requires_subscription: row.requiresSubscription,
    order_index: row.orderIndex,
    simulator_key: row.simulatorKey,
    published: row.published,
    title_en: row.titleEn,
    title_pt: row.titlePt,
    body_en: row.bodyEn,
    body_pt: row.bodyPt,
    created_at: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updated_at: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
  };
}

// ==================== Public read ====================

/** Index of published pages — drives dynamic routing + the nav registry. */
contentRouter.get('/api/content', async (c) => {
  const rows = await db
    .select()
    .from(contentPages)
    .where(eq(contentPages.published, true))
    .orderBy(asc(contentPages.orderIndex), asc(contentPages.slug));
  return c.json({ pages: rows.map(toIndexEntry) });
});

/** Body for a single published page, in the requested language (with fallback). */
contentRouter.get('/api/content/:slug{.+}', async (c) => {
  const slug = c.req.param('slug');
  const lang = c.req.query('lang') === 'pt' ? 'pt' : 'en';
  const rows = await db
    .select()
    .from(contentPages)
    .where(eq(contentPages.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row || !row.published) {
    throw new HTTPException(404, { message: 'Content not found' });
  }
  const primaryBody = lang === 'pt' ? row.bodyPt : row.bodyEn;
  const fallbackBody = lang === 'pt' ? row.bodyEn : row.bodyPt;
  const primaryTitle = lang === 'pt' ? row.titlePt : row.titleEn;
  const fallbackTitle = lang === 'pt' ? row.titleEn : row.titlePt;
  const body = (primaryBody && primaryBody.trim() ? primaryBody : fallbackBody) ?? '';
  const resolvedLang = primaryBody && primaryBody.trim() ? lang : lang === 'pt' ? 'en' : 'pt';
  return c.json({
    slug: row.slug,
    path: row.path,
    lang: resolvedLang,
    title: primaryTitle ?? fallbackTitle ?? null,
    simulator_key: row.simulatorKey,
    body,
  });
});

// ==================== Admin CRUD ====================

contentRouter.use('/api/admin/content', authRequired, adminRequired);
contentRouter.use('/api/admin/content/*', authRequired, adminRequired);

contentRouter.get('/api/admin/content', async (c) => {
  const rows = await db
    .select()
    .from(contentPages)
    .orderBy(asc(contentPages.moduleId), asc(contentPages.orderIndex), asc(contentPages.slug));
  return c.json({ pages: rows.map(toAdminDict) });
});

contentRouter.get('/api/admin/content/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const rows = await db.select().from(contentPages).where(eq(contentPages.id, id)).limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Content not found' });
  return c.json(toAdminDict(rows[0]));
});

interface ContentPayload {
  slug?: string;
  path?: string;
  module_id?: string | null;
  requires_subscription?: boolean;
  order_index?: number;
  simulator_key?: string | null;
  published?: boolean;
  title_en?: string | null;
  title_pt?: string | null;
  body_en?: string | null;
  body_pt?: string | null;
}

function normalizeOptional(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : value;
}

contentRouter.post('/api/admin/content', async (c) => {
  const body = await c.req.json<ContentPayload>();
  if (!body.slug || !body.path) {
    throw new HTTPException(400, { message: 'slug and path are required' });
  }
  const slug = body.slug.trim();
  const path = body.path.trim();

  const existing = await db
    .select({ id: contentPages.id })
    .from(contentPages)
    .where(eq(contentPages.slug, slug))
    .limit(1);
  if (existing[0]) throw new HTTPException(400, { message: 'A page with this slug already exists' });
  const existingPath = await db
    .select({ id: contentPages.id })
    .from(contentPages)
    .where(eq(contentPages.path, path))
    .limit(1);
  if (existingPath[0]) throw new HTTPException(400, { message: 'A page with this path already exists' });

  const inserted = await db
    .insert(contentPages)
    .values({
      slug,
      path,
      moduleId: normalizeOptional(body.module_id) ?? null,
      requiresSubscription: body.requires_subscription ?? true,
      orderIndex: body.order_index ?? 0,
      simulatorKey: normalizeOptional(body.simulator_key) ?? null,
      published: body.published ?? true,
      titleEn: normalizeOptional(body.title_en) ?? null,
      titlePt: normalizeOptional(body.title_pt) ?? null,
      bodyEn: body.body_en ?? null,
      bodyPt: body.body_pt ?? null,
    })
    .returning();
  return c.json(toAdminDict(inserted[0]), 201);
});

contentRouter.put('/api/admin/content/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json<ContentPayload>();
  const current = await db.select().from(contentPages).where(eq(contentPages.id, id)).limit(1);
  if (!current[0]) throw new HTTPException(404, { message: 'Content not found' });

  const updates: Partial<typeof contentPages.$inferInsert> = {};
  if (body.slug !== undefined) {
    const slug = body.slug.trim();
    const dup = await db
      .select({ id: contentPages.id })
      .from(contentPages)
      .where(eq(contentPages.slug, slug))
      .limit(1);
    if (dup[0] && dup[0].id !== id)
      throw new HTTPException(400, { message: 'A page with this slug already exists' });
    updates.slug = slug;
  }
  if (body.path !== undefined) {
    const path = body.path.trim();
    const dup = await db
      .select({ id: contentPages.id })
      .from(contentPages)
      .where(eq(contentPages.path, path))
      .limit(1);
    if (dup[0] && dup[0].id !== id)
      throw new HTTPException(400, { message: 'A page with this path already exists' });
    updates.path = path;
  }
  if (body.module_id !== undefined) updates.moduleId = normalizeOptional(body.module_id) ?? null;
  if (body.requires_subscription !== undefined)
    updates.requiresSubscription = body.requires_subscription;
  if (body.order_index !== undefined) updates.orderIndex = body.order_index;
  if (body.simulator_key !== undefined)
    updates.simulatorKey = normalizeOptional(body.simulator_key) ?? null;
  if (body.published !== undefined) updates.published = body.published;
  if (body.title_en !== undefined) updates.titleEn = normalizeOptional(body.title_en) ?? null;
  if (body.title_pt !== undefined) updates.titlePt = normalizeOptional(body.title_pt) ?? null;
  if (body.body_en !== undefined) updates.bodyEn = body.body_en;
  if (body.body_pt !== undefined) updates.bodyPt = body.body_pt;
  updates.updatedAt = new Date();

  const updated = await db
    .update(contentPages)
    .set(updates)
    .where(eq(contentPages.id, id))
    .returning();
  return c.json(toAdminDict(updated[0]));
});

contentRouter.delete('/api/admin/content/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const deleted = await db.delete(contentPages).where(eq(contentPages.id, id)).returning();
  if (!deleted[0]) throw new HTTPException(404, { message: 'Content not found' });
  return c.json({ message: 'Content deleted successfully' });
});

// ==================== Content tree (drag & drop) ====================

interface TreeReorderPayload {
  modules?: { id: number; order_index: number }[];
  pages?: { id: number; module_id: string | null; order_index: number }[];
}

contentRouter.use('/api/admin/content-tree', authRequired, adminRequired);

/**
 * Batch reorder used by the drag-and-drop organizer. Persists module order plus
 * each page's parent module (module_id) and order within its module in one shot.
 */
contentRouter.put('/api/admin/content-tree', async (c) => {
  const body = await c.req.json<TreeReorderPayload>();
  const modules = body.modules ?? [];
  const pages = body.pages ?? [];

  await Promise.all([
    ...modules.map((m) =>
      db
        .update(contentModules)
        .set({ orderIndex: m.order_index, updatedAt: new Date() })
        .where(eq(contentModules.id, m.id))
    ),
    ...pages.map((p) =>
      db
        .update(contentPages)
        .set({
          moduleId: normalizeOptional(p.module_id) ?? null,
          orderIndex: p.order_index,
          updatedAt: new Date(),
        })
        .where(eq(contentPages.id, p.id))
    ),
  ]);

  return c.json({ message: 'Content tree updated', modules: modules.length, pages: pages.length });
});

// ==================== Modules ====================

/** Public modules index — drives the nav tiers / sidebar / explore filters. */
contentRouter.get('/api/modules', async (c) => {
  const rows = await db
    .select()
    .from(contentModules)
    .orderBy(asc(contentModules.orderIndex), asc(contentModules.key));
  return c.json({ modules: rows.map(toModulePublic) });
});

contentRouter.use('/api/admin/modules', authRequired, adminRequired);
contentRouter.use('/api/admin/modules/*', authRequired, adminRequired);

contentRouter.get('/api/admin/modules', async (c) => {
  const rows = await db
    .select()
    .from(contentModules)
    .orderBy(asc(contentModules.orderIndex), asc(contentModules.key));
  return c.json({ modules: rows.map(toModuleAdminDict) });
});

interface ModulePayload {
  key?: string;
  label?: string;
  tier?: string;
  base?: string;
  paths?: string[] | null;
  order_index?: number;
}

function validateTier(tier: string | undefined): string {
  if (!tier) return 'CORE';
  if (!VALID_TIERS.includes(tier))
    throw new HTTPException(400, { message: `Invalid tier. Must be one of: ${VALID_TIERS.join(', ')}` });
  return tier;
}

function normalizePaths(paths: string[] | null | undefined): string[] | null | undefined {
  if (paths === undefined) return undefined;
  if (paths === null) return null;
  const cleaned = paths.map((p) => p.trim()).filter(Boolean);
  return cleaned.length ? cleaned : null;
}

contentRouter.post('/api/admin/modules', async (c) => {
  const body = await c.req.json<ModulePayload>();
  if (!body.key || !body.label || !body.base) {
    throw new HTTPException(400, { message: 'key, label and base are required' });
  }
  const key = body.key.trim();
  const existing = await db
    .select({ id: contentModules.id })
    .from(contentModules)
    .where(eq(contentModules.key, key))
    .limit(1);
  if (existing[0]) throw new HTTPException(400, { message: 'A module with this key already exists' });

  const inserted = await db
    .insert(contentModules)
    .values({
      key,
      label: body.label.trim(),
      tier: validateTier(body.tier),
      base: body.base.trim(),
      paths: normalizePaths(body.paths) ?? null,
      orderIndex: body.order_index ?? 0,
    })
    .returning();
  return c.json(toModuleAdminDict(inserted[0]), 201);
});

contentRouter.put('/api/admin/modules/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json<ModulePayload>();
  const current = await db.select().from(contentModules).where(eq(contentModules.id, id)).limit(1);
  if (!current[0]) throw new HTTPException(404, { message: 'Module not found' });

  const updates: Partial<typeof contentModules.$inferInsert> = {};
  if (body.key !== undefined) {
    const key = body.key.trim();
    const dup = await db
      .select({ id: contentModules.id })
      .from(contentModules)
      .where(eq(contentModules.key, key))
      .limit(1);
    if (dup[0] && dup[0].id !== id)
      throw new HTTPException(400, { message: 'A module with this key already exists' });
    updates.key = key;
  }
  if (body.label !== undefined) updates.label = body.label.trim();
  if (body.tier !== undefined) updates.tier = validateTier(body.tier);
  if (body.base !== undefined) updates.base = body.base.trim();
  if (body.paths !== undefined) updates.paths = normalizePaths(body.paths) ?? null;
  if (body.order_index !== undefined) updates.orderIndex = body.order_index;
  updates.updatedAt = new Date();

  const updated = await db
    .update(contentModules)
    .set(updates)
    .where(eq(contentModules.id, id))
    .returning();
  return c.json(toModuleAdminDict(updated[0]));
});

contentRouter.delete('/api/admin/modules/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const deleted = await db.delete(contentModules).where(eq(contentModules.id, id)).returning();
  if (!deleted[0]) throw new HTTPException(404, { message: 'Module not found' });
  return c.json({ message: 'Module deleted successfully' });
});
