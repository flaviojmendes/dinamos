import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { AppVariables } from './auth.js';
import { incrementRateLimitBucket } from '../lib/rateLimitStore.js';

function clientKey(c: { req: { header: (name: string) => string | undefined } }): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return c.req.header('x-real-ip') ?? 'unknown';
}

function rateLimitKey(
  c: { req: { path: string; header: (name: string) => string | undefined }; get: (key: 'user') => { uid: string } | undefined },
  keyPrefix: string,
): string {
  const user = c.get('user');
  const actor = user?.uid ?? clientKey(c);
  return `${keyPrefix}:${c.req.path}:${actor}`;
}

/**
 * Shared fixed-window rate limiter keyed by route and authenticated user when
 * available (IP fallback otherwise). Uses Postgres when configured, with a safe
 * in-memory fallback per instance.
 */
export function rateLimit(options: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}): MiddlewareHandler<{ Variables: AppVariables }> {
  const { windowMs, max, keyPrefix } = options;
  return async (c, next) => {
    const key = rateLimitKey(c, keyPrefix);
    const { allowed } = await incrementRateLimitBucket(key, windowMs, max);
    if (!allowed) {
      throw new HTTPException(429, { message: 'Too many requests; try again shortly' });
    }
    await next();
  };
}

/** Reject oversized bodies using Content-Length and streamed byte counts. */
export function maxBodyBytes(maxBytes: number): MiddlewareHandler {
  return async (c, next) => {
    const rawLength = c.req.header('content-length');
    if (rawLength) {
      const len = Number(rawLength);
      if (Number.isFinite(len) && len > maxBytes) {
        throw new HTTPException(413, { message: 'Request body too large' });
      }
    }

    const method = c.req.method.toUpperCase();
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      const body = await c.req.arrayBuffer();
      if (body.byteLength > maxBytes) {
        throw new HTTPException(413, { message: 'Request body too large' });
      }
      c.req.raw = new Request(c.req.raw, {
        method: c.req.method,
        headers: c.req.raw.headers,
        body: body.byteLength > 0 ? body : null,
      });
    }

    await next();
  };
}
