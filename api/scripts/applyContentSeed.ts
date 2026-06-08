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

/**
 * Idempotent DDL for the content tables. Production was never migrated (schema
 * is normally managed locally via `db:push`), so the seed has to ensure the
 * tables exist before inserting. Mirrors migrations 0004–0007.
 */
const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS "content_modules" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar(50) NOT NULL,
  "label" varchar(200) NOT NULL,
  "tier" varchar(20) DEFAULT 'CORE' NOT NULL,
  "base" varchar(255) NOT NULL,
  "paths" jsonb,
  "order_index" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "content_modules_key_unique" UNIQUE("key")
);

CREATE TABLE IF NOT EXISTS "content_pages" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" varchar(255) NOT NULL,
  "path" varchar(255) NOT NULL,
  "module_id" varchar(50),
  "requires_subscription" boolean DEFAULT true NOT NULL,
  "order_index" integer DEFAULT 0 NOT NULL,
  "simulator_key" varchar(120),
  "published" boolean DEFAULT true NOT NULL,
  "title_en" varchar(500),
  "title_pt" varchar(500),
  "body_en" text,
  "body_pt" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "content_pages_slug_unique" UNIQUE("slug"),
  CONSTRAINT "content_pages_path_unique" UNIQUE("path")
);

CREATE TABLE IF NOT EXISTS "content_annotations" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "path" varchar(255),
  "body" text,
  "kind" varchar(20) DEFAULT 'text' NOT NULL,
  "drawing" jsonb,
  "anchor" jsonb,
  "color" varchar(20),
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "content_annotations" ADD COLUMN IF NOT EXISTS "kind" varchar(20) DEFAULT 'text' NOT NULL;
ALTER TABLE "content_annotations" ADD COLUMN IF NOT EXISTS "drawing" jsonb;
ALTER TABLE "content_annotations" ADD COLUMN IF NOT EXISTS "anchor" jsonb;
ALTER TABLE "content_annotations" ALTER COLUMN "body" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "content_annotations_user_slug_idx"
  ON "content_annotations" USING btree ("user_id","slug");
`;

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
    console.log('[seed] Ensuring content schema…');
    await client.unsafe(SCHEMA_DDL);

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
