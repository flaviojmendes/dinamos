import type { Context } from 'hono';

/** Moderate shared CDN cache for stable public reads. */
export const PUBLIC_READ_CACHE =
  'public, max-age=300, s-maxage=300, stale-while-revalidate=60';

/** Attach cache headers to a JSON response for anonymous CDN caching. */
export function withPublicCache(c: Context, init?: ResponseInit) {
  c.header('Cache-Control', PUBLIC_READ_CACHE);
  c.header('Vary', 'Accept-Encoding');
  return init;
}
