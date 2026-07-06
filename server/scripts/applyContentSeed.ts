/**
 * Ensures the database schema exists and applies the content seed (modules +
 * pages) to whatever database DATABASE_URL points at. Runs during the Vercel
 * build (`vercel-build` script) so production is provisioned on every deploy —
 * the static frontend build never touched the DB before.
 *
 * Production was migrated from the old FastAPI backend, so only the original
 * tables existed; Drizzle-only tables (app_settings, content_*) were missing.
 * We idempotently re-create the full base schema (0000_init.sql, rewritten to
 * CREATE TABLE IF NOT EXISTS + guarded FK adds) plus the content tables, then
 * run the idempotent content seed (INSERT ... ON CONFLICT DO UPDATE).
 *
 * We execute SQL directly instead of via `drizzle-kit migrate` because this
 * project manages schema with `db:push`, so Drizzle's migration journal is not
 * a reliable source of "what has already run".
 *
 * Run with:  tsx server/scripts/applyContentSeed.ts
 */
import postgres from 'postgres';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { createHash } from 'node:crypto';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Preview deploys / local builds without a DB configured should not fail the
  // build — just skip seeding.
  console.warn('[seed] DATABASE_URL is not set; skipping content seed.');
  process.exit(0);
}

const SEED_FILE = resolve('server/db/migrations/0008_seed_content.sql');
const BASE_SCHEMA_FILE = resolve('server/db/migrations/0000_init.sql');
// Idempotent post-seed fixups that must run on every deploy regardless of the
// seed-hash skip (they UPDATE existing rows in place, so they are cheap and
// non-clobbering — only the targeted rows change). They must run AFTER the seed
// because the seed re-applies the original values (e.g. simulator_key = NULL),
// so these fixups have to land last to win.
//
// 0012 backfills content_pages.simulator_key so the CMS simulator auto-routes
//   (`<page.path>/simulator`) actually register — without it the repointed
//   links below point at routes that don't exist.
// 0013 repoints legacy Portuguese `/simulador` links to canonical `/simulator`.
const BACKFILL_KEYS_FILE = resolve('server/db/migrations/0012_backfill_simulator_keys.sql');
const REPOINT_FILE = resolve('server/db/migrations/0013_repoint_simulator_links.sql');
// 0015 scrubs historical, re-identifiable visitor hashes from the analytics
// view log (authed rows that were hashed from the Firebase uid). It is guarded
// by a singleton state row, so re-running it on every deploy is a no-op once
// applied — crucial, because an unguarded re-run would clobber the new
// anon-based hashes and break distinct-visitor counting.
const ANONYMIZE_VIEWS_FILE = resolve('server/db/migrations/0015_anonymize_view_history.sql');

// Incremental content additions that live in their own migration files (one per
// module) instead of being folded into the giant 0008 seed. Each is an
// idempotent `INSERT ... ON CONFLICT DO UPDATE`, so re-running on every deploy is
// cheap and non-clobbering. They must run AFTER the seed and the simulator-key
// backfill so their rows (and attached simulator_key values) always win.
const CONTENT_ADDENDA: string[] = [
  '0016_add_data_storage_pages.sql',
  '0017_add_components_pages.sql',
  '0018_add_consistency_pages.sql',
  '0019_add_design_pages.sql',
  '0020_add_theory_pages.sql',
  '0021_add_monitoring_pages.sql',
  // Not content pages, but an idempotent announcement insert that broadcasts the
  // new-content batch above. Safe to re-run on every deploy (guarded by NOT
  // EXISTS) and depends only on the announcements table from SCHEMA_DDL.
  '0023_add_content_announcement.sql',
].map((f) => resolve('server/db/migrations', f));

/**
 * Load the base-schema migration and rewrite it to be idempotent so it can run
 * against a database that already has some (or all) of the tables:
 *  - `CREATE TABLE "x"`            -> `CREATE TABLE IF NOT EXISTS "x"`
 *  - `ALTER TABLE ... ADD ...`     -> wrapped in a DO block that swallows
 *                                     duplicate_object/duplicate_column errors
 *    (Postgres has no `ADD CONSTRAINT IF NOT EXISTS`).
 */
function loadBaseSchemaDDL(): string {
  const raw = readFileSync(BASE_SCHEMA_FILE, 'utf8');
  return raw
    .split('--> statement-breakpoint')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((stmt) => {
      if (/^CREATE TABLE\s+"/i.test(stmt)) {
        return stmt.replace(/^CREATE TABLE\s+"/i, 'CREATE TABLE IF NOT EXISTS "');
      }
      if (/^ALTER TABLE/i.test(stmt)) {
        const body = stmt.replace(/;\s*$/, '');
        return `DO $do$ BEGIN\n  ${body};\nEXCEPTION WHEN duplicate_object OR duplicate_column THEN NULL;\nEND $do$;`;
      }
      return stmt;
    })
    .join('\n');
}

/**
 * Idempotent DDL for the content tables (mirrors migrations 0004–0007). These
 * live outside 0000_init.sql, so they are ensured separately.
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

CREATE TABLE IF NOT EXISTS "content_progress" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "path" varchar(255) NOT NULL,
  "completed" boolean DEFAULT true NOT NULL,
  "completed_at" timestamp with time zone DEFAULT now(),
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "content_progress_user_path_unique" UNIQUE("user_id","path")
);

CREATE INDEX IF NOT EXISTS "content_progress_user_idx"
  ON "content_progress" USING btree ("user_id");

CREATE TABLE IF NOT EXISTS "announcements" (
  "id" serial PRIMARY KEY NOT NULL,
  "title_en" varchar(300),
  "title_pt" varchar(300),
  "body_en" text,
  "body_pt" text,
  "published" boolean DEFAULT false NOT NULL,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "announcement_acks" (
  "id" serial PRIMARY KEY NOT NULL,
  "announcement_id" integer NOT NULL REFERENCES "announcements"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "acknowledged_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "announcement_acks_announcement_user_unique" UNIQUE("announcement_id","user_id")
);

CREATE INDEX IF NOT EXISTS "announcement_acks_user_idx"
  ON "announcement_acks" USING btree ("user_id");

CREATE TABLE IF NOT EXISTS "announcement_views" (
  "id" serial PRIMARY KEY NOT NULL,
  "announcement_id" integer NOT NULL REFERENCES "announcements"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "seen_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "announcement_views_announcement_user_unique" UNIQUE("announcement_id","user_id")
);

CREATE INDEX IF NOT EXISTS "announcement_views_user_idx"
  ON "announcement_views" USING btree ("user_id");

CREATE TABLE IF NOT EXISTS "game_sessions" (
  "id" serial PRIMARY KEY NOT NULL,
  "code" varchar(20) NOT NULL,
  "name" varchar(120),
  "status" varchar(20) DEFAULT 'lobby' NOT NULL,
  "seed" integer DEFAULT 1 NOT NULL,
  "starts_at" timestamp with time zone,
  "starting_architecture" jsonb,
  "locked_node_ids" jsonb,
  "allow_delete_starting" boolean DEFAULT true,
  "load_profile" jsonb,
  "chaos_events" jsonb,
  "scoring_config" jsonb,
  "budget" jsonb,
  "duration_sec" integer,
  "rounds" jsonb,
  "phase" varchar(20) DEFAULT 'lobby' NOT NULL,
  "current_round" integer DEFAULT 0 NOT NULL,
  "round_started_at" timestamp with time zone,
  "round_ends_at" timestamp with time zone,
  "started_at" timestamp with time zone,
  "ends_at" timestamp with time zone,
  "announcement" text,
  "announcement_at" timestamp with time zone,
  "join_open" boolean DEFAULT true NOT NULL,
  "listed" boolean DEFAULT true NOT NULL,
  "join_key" varchar(32),
  "created_by" varchar(255),
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "game_sessions_code_unique" UNIQUE("code")
);

-- Columns added by later migrations (0010/0011/0024/0025). Idempotent so a
-- table created by an older deploy still gets the newer fields.
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "rounds" jsonb;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "phase" varchar(20) DEFAULT 'lobby' NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "current_round" integer DEFAULT 0 NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "round_started_at" timestamp with time zone;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "round_ends_at" timestamp with time zone;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "join_open" boolean DEFAULT true NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "listed" boolean DEFAULT true NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "join_key" varchar(32);

CREATE TABLE IF NOT EXISTS "game_players" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_id" integer NOT NULL REFERENCES "game_sessions"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "joined_at" timestamp with time zone DEFAULT now(),
  "architecture" jsonb,
  "score" double precision DEFAULT 0,
  "score_breakdown" jsonb,
  "round_scores" jsonb,
  "metrics" jsonb,
  "last_submitted_at" timestamp with time zone,
  CONSTRAINT "game_players_session_user_unique" UNIQUE("session_id","user_id")
);

ALTER TABLE "game_players" ADD COLUMN IF NOT EXISTS "score_breakdown" jsonb;
ALTER TABLE "game_players" ADD COLUMN IF NOT EXISTS "round_scores" jsonb;
ALTER TABLE "game_players" ADD COLUMN IF NOT EXISTS "metrics" jsonb;

CREATE TABLE IF NOT EXISTS "saved_architectures" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "title" varchar(160),
  "visibility" varchar(20) DEFAULT 'private' NOT NULL,
  "design" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "saved_architectures_user_idx"
  ON "saved_architectures" USING btree ("user_id");

-- User-generated ("tailored") Design Lab problems (migration 0027). The
-- challenges table itself comes from 0000_init; these columns were added later,
-- so ensure them idempotently on every deploy. A non-null generated_by_user_id
-- marks a problem as private to that user; generation_context stores the
-- questionnaire answers used to tailor it.
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "generated_by_user_id" varchar(255);
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "generation_context" jsonb;

CREATE INDEX IF NOT EXISTS "challenges_generated_by_idx"
  ON "challenges" USING btree ("generated_by_user_id");
`;

const isLocalHost = /@(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:|\/)/.test(databaseUrl);
const sslDisabled = /[?&]sslmode=disable/.test(databaseUrl);
const useSsl = !isLocalHost && !sslDisabled;

async function main(): Promise<void> {
  const sqlText = readFileSync(SEED_FILE, 'utf8');
  // The content seed is large (600KB+) and rarely changes, but it sat on the
  // build critical path and re-ran on every deploy — making build time hostage
  // to DB/network throughput. Hash the seed and skip the expensive INSERTs when
  // the already-applied hash matches. Schema-ensure stays (it's cheap and
  // idempotent) so the structure is always guaranteed.
  const seedHash = createHash('sha256').update(sqlText).digest('hex');

  const client = postgres(databaseUrl as string, {
    prepare: false,
    max: 1,
    ssl: useSsl ? 'require' : false,
  });

  try {
    console.log('[seed] Ensuring base schema…');
    await client.unsafe(loadBaseSchemaDDL());

    console.log('[seed] Ensuring content schema…');
    await client.unsafe(SCHEMA_DDL);

    // Tiny single-row table recording which seed hash is already applied.
    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS "content_seed_state" (
        "id" integer PRIMARY KEY DEFAULT 1,
        "seed_hash" text NOT NULL,
        "applied_at" timestamp with time zone DEFAULT now(),
        CONSTRAINT "content_seed_state_singleton" CHECK ("id" = 1)
      );
    `);

    const applied = await client`SELECT "seed_hash" FROM "content_seed_state" WHERE "id" = 1`;
    const seedUnchanged = applied.length > 0 && applied[0].seed_hash === seedHash;

    if (seedUnchanged) {
      console.log(`[seed] Content seed unchanged (${seedHash.slice(0, 12)}…); skipping insert.`);
    } else {
      console.log('[seed] Applying content seed…');
      // The simple-query protocol (used by `unsafe` with no parameters) runs the
      // whole script in one round trip; Postgres parses the dollar-quoted bodies
      // and statement separators server-side.
      await client.unsafe(sqlText);

      await client`
        INSERT INTO "content_seed_state" ("id", "seed_hash", "applied_at")
        VALUES (1, ${seedHash}, now())
        ON CONFLICT ("id") DO UPDATE
          SET "seed_hash" = EXCLUDED."seed_hash", "applied_at" = EXCLUDED."applied_at"
      `;

      const [{ count: moduleCount }] = await client`SELECT count(*)::int AS count FROM content_modules`;
      const [{ count: pageCount }] = await client`SELECT count(*)::int AS count FROM content_pages`;
      console.log(`[seed] Done. content_modules=${moduleCount}, content_pages=${pageCount}.`);
    }

    // Always run post-seed fixups. These are idempotent UPDATEs, so they correct
    // existing rows even when the seed insert was skipped (the seed still carries
    // simulator_key = NULL and the legacy `/simulador` links, so these must run
    // after it to land the canonical values).
    console.log('[seed] Backfilling simulator keys…');
    await client.unsafe(readFileSync(BACKFILL_KEYS_FILE, 'utf8'));

    console.log('[seed] Repointing legacy simulator links…');
    await client.unsafe(readFileSync(REPOINT_FILE, 'utf8'));

    console.log('[seed] Anonymizing historical view log (run-once)…');
    await client.unsafe(readFileSync(ANONYMIZE_VIEWS_FILE, 'utf8'));

    // Apply incremental per-module content additions (idempotent upserts).
    for (const file of CONTENT_ADDENDA) {
      if (!existsSync(file)) continue;
      console.log(`[seed] Applying content addendum ${basename(file)}…`);
      await client.unsafe(readFileSync(file, 'utf8'));
    }
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('[seed] Failed to apply content seed:', err);
  process.exit(1);
});
