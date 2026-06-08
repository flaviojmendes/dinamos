/**
 * Applies the content seed (modules + pages) to whatever database DATABASE_URL
 * points at. This runs during the Vercel build (`vercel-build` script) so the
 * production database is seeded on every deploy — the static frontend build
 * never touched the DB before, which is why content was missing in production.
 *
 * The seed SQL (api/db/migrations/0008_seed_content.sql) is fully idempotent
 * (INSERT ... ON CONFLICT DO UPDATE), so re-running it on each deploy is safe.
 * We execute it directly instead of via `drizzle-kit migrate` because this
 * project manages schema with `db:push`, so Drizzle's migration journal is not
 * a reliable source of "what has already run".
 *
 * Run with:  tsx api/scripts/applyContentSeed.ts
 */
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Preview deploys / local builds without a DB configured should not fail the
  // build — just skip seeding.
  console.warn('[seed] DATABASE_URL is not set; skipping content seed.');
  process.exit(0);
}

const SEED_FILE = resolve('api/db/migrations/0008_seed_content.sql');

const isLocalHost = /@(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:|\/)/.test(databaseUrl);
const sslDisabled = /[?&]sslmode=disable/.test(databaseUrl);
const useSsl = !isLocalHost && !sslDisabled;

async function main(): Promise<void> {
  const sqlText = readFileSync(SEED_FILE, 'utf8');
  const client = postgres(databaseUrl as string, {
    prepare: false,
    max: 1,
    ssl: useSsl ? 'require' : false,
  });

  try {
    console.log('[seed] Applying content seed…');
    // The simple-query protocol (used by `unsafe` with no parameters) runs the
    // whole script in one round trip; Postgres parses the dollar-quoted bodies
    // and statement separators server-side.
    await client.unsafe(sqlText);

    const [{ count: moduleCount }] = await client`SELECT count(*)::int AS count FROM content_modules`;
    const [{ count: pageCount }] = await client`SELECT count(*)::int AS count FROM content_pages`;
    console.log(`[seed] Done. content_modules=${moduleCount}, content_pages=${pageCount}.`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('[seed] Failed to apply content seed:', err);
  process.exit(1);
});
