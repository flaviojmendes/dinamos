import { sql } from 'drizzle-orm';
import { db } from '../db/client.js';

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

function pruneMemoryBuckets(now: number) {
  if (memoryBuckets.size < 5000) return;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt <= now) memoryBuckets.delete(key);
  }
}

function incrementMemoryBucket(
  key: string,
  windowMs: number,
  max: number,
): { allowed: boolean; count: number } {
  const now = Date.now();
  pruneMemoryBuckets(now);
  let bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    memoryBuckets.set(key, bucket);
  }
  bucket.count += 1;
  return { allowed: bucket.count <= max, count: bucket.count };
}

/** Reset in-memory buckets between tests. */
export function resetMemoryRateLimitBuckets() {
  memoryBuckets.clear();
}

/**
 * Fixed-window counter stored in Postgres when available, with an in-memory
 * fallback for local dev or transient DB errors.
 */
export async function incrementRateLimitBucket(
  key: string,
  windowMs: number,
  max: number,
): Promise<{ allowed: boolean; count: number }> {
  const resetAt = new Date(Date.now() + windowMs);
  try {
    const rows = (await db.execute(sql`
      INSERT INTO rate_limit_buckets (bucket_key, count, reset_at)
      VALUES (${key}, 1, ${resetAt})
      ON CONFLICT (bucket_key) DO UPDATE SET
        count = CASE
          WHEN rate_limit_buckets.reset_at <= NOW() THEN 1
          ELSE rate_limit_buckets.count + 1
        END,
        reset_at = CASE
          WHEN rate_limit_buckets.reset_at <= NOW() THEN EXCLUDED.reset_at
          ELSE rate_limit_buckets.reset_at
        END
      RETURNING count
    `)) as { count: number | string }[];
    const count = Number(rows[0]?.count ?? 1);
    return { allowed: count <= max, count };
  } catch {
    return incrementMemoryBucket(key, windowMs, max);
  }
}
