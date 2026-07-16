import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Drop stale buckets occasionally so the map does not grow without bound. */
function pruneBuckets(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function clientKey(c: { req: { header: (name: string) => string | undefined } }): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return c.req.header('x-real-ip') ?? 'unknown';
}

/**
 * Simple fixed-window rate limiter (in-memory, per serverless instance).
 * Reject before expensive auth/DB/provider work when the window is exceeded.
 */
export function rateLimit(options: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}): MiddlewareHandler {
  const { windowMs, max, keyPrefix } = options;
  return async (c, next) => {
    const now = Date.now();
    pruneBuckets(now);
    const key = `${keyPrefix}:${clientKey(c)}`;
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      throw new HTTPException(429, { message: 'Too many requests; try again shortly' });
    }
    await next();
  };
}

/** Reject oversized JSON bodies using Content-Length before parsing. */
export function maxBodyBytes(maxBytes: number): MiddlewareHandler {
  return async (c, next) => {
    const raw = c.req.header('content-length');
    if (raw) {
      const len = Number(raw);
      if (Number.isFinite(len) && len > maxBytes) {
        throw new HTTPException(413, { message: 'Request body too large' });
      }
    }
    await next();
  };
}
