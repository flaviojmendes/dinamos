import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { appSettings } from '../db/schema';

const KEY = 'free_access_mode';

function envDefault(): boolean {
  const v = (process.env.FREE_ACCESS_DEFAULT ?? 'true').toLowerCase();
  return ['true', '1', 'yes', 'on'].includes(v);
}

/**
 * Read the free-access flag. Persisted in the app_settings table so it survives
 * across stateless serverless invocations; falls back to FREE_ACCESS_DEFAULT.
 */
export async function isFreeAccessEnabled(): Promise<boolean> {
  try {
    const rows = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, KEY))
      .limit(1);
    if (rows.length === 0) return envDefault();
    return rows[0].value === 'true';
  } catch (e) {
    console.error('[freeAccess] read failed, using env default:', e);
    return envDefault();
  }
}

export async function setFreeAccessMode(enabled: boolean): Promise<void> {
  const value = enabled ? 'true' : 'false';
  await db
    .insert(appSettings)
    .values({ key: KEY, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

export async function getFreeAccessStatus() {
  const enabled = await isFreeAccessEnabled();
  return {
    enabled,
    description:
      'When enabled, all users are treated as subscribed without modifying the database',
  };
}
