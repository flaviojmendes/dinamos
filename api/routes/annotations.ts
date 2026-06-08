import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { contentAnnotations } from '../db/schema';
import { authRequired, type AppVariables } from '../middleware/auth';

export const annotationsRouter = new Hono<{ Variables: AppVariables }>();

type AnnotationRow = typeof contentAnnotations.$inferSelect;

function toDict(row: AnnotationRow) {
  return {
    id: row.id,
    slug: row.slug,
    path: row.path,
    kind: row.kind,
    body: row.body,
    drawing: row.drawing ?? null,
    anchor: row.anchor ?? null,
    color: row.color,
    created_at: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updated_at: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
  };
}

interface AnnotationAnchor {
  quote: string;
  prefix?: string;
  suffix?: string;
  start: number;
  end: number;
}

interface AnnotationPayload {
  slug?: string;
  path?: string | null;
  kind?: string;
  body?: string | null;
  drawing?: unknown;
  anchor?: AnnotationAnchor | null;
  color?: string | null;
}

function hasContent(body: string | null | undefined, drawing: unknown): boolean {
  return Boolean((body && body.trim()) || drawing);
}

/**
 * List the current user's annotations. Filter by `slug` for a single page, or
 * omit it to fetch every note (used by a future "my notes" overview).
 */
annotationsRouter.get('/api/annotations', authRequired, async (c) => {
  const user = c.get('user');
  const slug = c.req.query('slug');
  const conditions = [eq(contentAnnotations.userId, user.uid)];
  if (slug) conditions.push(eq(contentAnnotations.slug, slug));

  const rows = await db
    .select()
    .from(contentAnnotations)
    .where(and(...conditions))
    .orderBy(asc(contentAnnotations.createdAt));

  return c.json({ annotations: rows.map(toDict) });
});

annotationsRouter.post('/api/annotations', authRequired, async (c) => {
  const user = c.get('user');
  const body = await c.req.json<AnnotationPayload>();
  if (!body.slug) {
    throw new HTTPException(400, { message: 'slug is required' });
  }
  const kind = body.kind === 'drawing' ? 'drawing' : 'text';
  if (!hasContent(body.body, body.drawing)) {
    throw new HTTPException(400, { message: 'A note needs text or a drawing' });
  }
  const inserted = await db
    .insert(contentAnnotations)
    .values({
      userId: user.uid,
      slug: body.slug.trim(),
      path: body.path?.trim() || null,
      kind,
      body: body.body ?? null,
      drawing: body.drawing ?? null,
      anchor: body.anchor ?? null,
      color: body.color?.trim() || null,
    })
    .returning();
  return c.json(toDict(inserted[0]), 201);
});

annotationsRouter.put('/api/annotations/:id', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  const body = await c.req.json<AnnotationPayload>();

  const updates: Partial<typeof contentAnnotations.$inferInsert> = { updatedAt: new Date() };
  if (body.body !== undefined) updates.body = body.body || null;
  if (body.drawing !== undefined) updates.drawing = body.drawing ?? null;
  if (body.anchor !== undefined) updates.anchor = body.anchor ?? null;
  if (body.kind !== undefined) updates.kind = body.kind === 'drawing' ? 'drawing' : 'text';
  if (body.color !== undefined) updates.color = body.color?.trim() || null;

  const updated = await db
    .update(contentAnnotations)
    .set(updates)
    .where(and(eq(contentAnnotations.id, id), eq(contentAnnotations.userId, user.uid)))
    .returning();
  if (!updated[0]) throw new HTTPException(404, { message: 'Annotation not found' });
  return c.json(toDict(updated[0]));
});

annotationsRouter.delete('/api/annotations/:id', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  const deleted = await db
    .delete(contentAnnotations)
    .where(and(eq(contentAnnotations.id, id), eq(contentAnnotations.userId, user.uid)))
    .returning({ id: contentAnnotations.id });
  if (!deleted[0]) throw new HTTPException(404, { message: 'Annotation not found' });
  return c.json({ message: 'Annotation deleted successfully' });
});
