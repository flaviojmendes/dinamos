import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { notifications } from '../db/schema.js';
import { authRequired, type AppVariables } from '../middleware/auth.js';
import { notificationToDict } from '../db/serializers.js';

export const notificationsRouter = new Hono<{ Variables: AppVariables }>();

async function unreadCount(userId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return Number(rows[0]?.count ?? 0);
}

notificationsRouter.get('/api/notifications', authRequired, async (c) => {
  const user = c.get('user');
  const skip = Number(c.req.query('skip') ?? '0');
  const limit = Number(c.req.query('limit') ?? '50');
  const unreadOnly = c.req.query('unread_only') === 'true';

  const conditions = [eq(notifications.userId, user.uid)];
  if (unreadOnly) conditions.push(eq(notifications.isRead, false));

  const totalRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(...conditions));
  const total = Number(totalRows[0]?.count ?? 0);

  const rows = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .offset(skip)
    .limit(limit);

  return c.json({
    notifications: rows.map(notificationToDict),
    total,
    skip,
    limit,
    unread_count: await unreadCount(user.uid),
  });
});

notificationsRouter.get('/api/notifications/unread-count', authRequired, async (c) => {
  const user = c.get('user');
  return c.json({ unread_count: await unreadCount(user.uid) });
});

notificationsRouter.put('/api/notifications/read-all', authRequired, async (c) => {
  const user = c.get('user');
  const updated = await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notifications.userId, user.uid), eq(notifications.isRead, false)))
    .returning({ id: notifications.id });
  return c.json({ message: `Marked ${updated.length} notification(s) as read`, count: updated.length });
});

notificationsRouter.put('/api/notifications/:id/read', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  const updated = await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.uid)))
    .returning();
  if (!updated[0]) throw new HTTPException(404, { message: 'Notification not found' });
  return c.json(notificationToDict(updated[0]));
});

notificationsRouter.delete('/api/notifications/:id', authRequired, async (c) => {
  const user = c.get('user');
  const id = Number(c.req.param('id'));
  const deleted = await db
    .delete(notifications)
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.uid)))
    .returning({ id: notifications.id });
  if (!deleted[0]) throw new HTTPException(404, { message: 'Notification not found' });
  return c.json({ message: 'Notification deleted successfully' });
});
