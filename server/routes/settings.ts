import { Hono, type MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { appSettings } from '../db/schema.js';
import { authRequired, adminRequired, type AppVariables } from '../middleware/auth.js';

export const settingsRouter = new Hono<{ Variables: AppVariables }>();

const DIORAMAS_KEY = 'dioramas_enabled';

// This global switch must be read from shared storage, including after an admin
// changes it in another process. Never cache it at a CDN or in a warm function.
export const settingsNoStore: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
  c.header('Cache-Control', 'no-store');
  await next();
};
settingsRouter.use('/api/settings/public', settingsNoStore);
settingsRouter.use('/api/admin/settings', settingsNoStore);
settingsRouter.use('/api/admin/settings', authRequired, adminRequired);

async function readPublicSettings(): Promise<{ dioramas_enabled: boolean }> {
  const rows = await db
    .select({ value: appSettings.value })
    .from(appSettings)
    .where(eq(appSettings.key, DIORAMAS_KEY))
    .limit(1);
  const row = rows[0];
  if (!row) return { dioramas_enabled: true };
  if (row.value !== 'true' && row.value !== 'false') {
    throw new Error('Invalid persisted diorama setting');
  }
  // Explicitly project the only public setting. Other app_settings entries may
  // contain private configuration and must never be exposed by this endpoint.
  return { dioramas_enabled: row.value === 'true' };
}

settingsRouter.get('/api/settings/public', async (c) => c.json(await readPublicSettings()));
settingsRouter.get('/api/admin/settings', async (c) => c.json(await readPublicSettings()));

settingsRouter.put('/api/admin/settings', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw new HTTPException(400, { message: 'Invalid JSON body' });
  }
  if (
    typeof body !== 'object' || body === null || Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    typeof (body as Record<string, unknown>).dioramas_enabled !== 'boolean'
  ) {
    throw new HTTPException(400, { message: 'Expected only dioramas_enabled as a boolean' });
  }

  const enabled = (body as { dioramas_enabled: boolean }).dioramas_enabled;
  const value = enabled ? 'true' : 'false';
  const updatedAt = new Date();
  await db
    .insert(appSettings)
    .values({ key: DIORAMAS_KEY, value, updatedAt })
    .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt } });

  return c.json({ dioramas_enabled: enabled });
});
