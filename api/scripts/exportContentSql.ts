/**
 * Dumps the local content_modules + content_pages rows into the custom Drizzle
 * migration 0008_seed_content.sql as idempotent upserts, so the same content
 * lands in any environment that runs migrations (e.g. production / Supabase).
 *
 * Run with:  SRC_DB_URL=postgres://... npx tsx api/scripts/exportContentSql.ts
 */
import postgres from 'postgres';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.env.SRC_DB_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('Set SRC_DB_URL (or DATABASE_URL) to the source database');
  process.exit(1);
}
const isLocal = /@(localhost|127\.0\.0\.1)/.test(url);
const sql = postgres(url, { prepare: false, max: 1, ssl: isLocal ? false : 'require' });

const OUT = resolve('api/db/migrations/0008_seed_content.sql');

function dollar(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  const s = String(val);
  let tag = 'mdx';
  let n = 0;
  while (s.includes(`$${tag}$`)) tag = `mdx${n++}`;
  return `$${tag}$${s}$${tag}$`;
}
function lit(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}
function intLit(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  return String(Number(val));
}
function boolLit(val: unknown): string {
  return val ? 'true' : 'false';
}
function jsonLit(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  return `${dollar(JSON.stringify(val))}::jsonb`;
}

async function main() {
  const modules = await sql`SELECT key, label, tier, base, paths, order_index FROM content_modules ORDER BY order_index, key`;
  const pages = await sql`
    SELECT slug, path, module_id, order_index, simulator_key,
           published, title_en, title_pt, body_en, body_pt
    FROM content_pages ORDER BY module_id NULLS FIRST, order_index, slug`;

  const parts: string[] = [];
  parts.push('-- Seed content modules + pages (idempotent upserts).');
  parts.push('-- Generated from the local DB; safe to re-run.');
  parts.push('');

  // ---- modules ----
  if (modules.length) {
    const rows = modules
      .map(
        (m: any) =>
          `  (${lit(m.key)}, ${lit(m.label)}, ${lit(m.tier)}, ${lit(m.base)}, ${jsonLit(
            m.paths
          )}, ${intLit(m.order_index)})`
      )
      .join(',\n');
    parts.push(
      `INSERT INTO "content_modules" ("key", "label", "tier", "base", "paths", "order_index") VALUES\n${rows}\n` +
        `ON CONFLICT ("key") DO UPDATE SET ` +
        `"label" = EXCLUDED."label", "tier" = EXCLUDED."tier", "base" = EXCLUDED."base", ` +
        `"paths" = EXCLUDED."paths", "order_index" = EXCLUDED."order_index", "updated_at" = now();`
    );
    parts.push('--> statement-breakpoint');
  }

  // ---- pages ----
  if (pages.length) {
    const rows = pages
      .map(
        (p: any) =>
          `  (${lit(p.slug)}, ${lit(p.path)}, ${lit(p.module_id)}, ${intLit(
            p.order_index
          )}, ${lit(p.simulator_key)}, ${boolLit(p.published)}, ${lit(
            p.title_en
          )}, ${lit(p.title_pt)}, ${dollar(p.body_en)}, ${dollar(p.body_pt)})`
      )
      .join(',\n');
    parts.push(
      `INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES\n${rows}\n` +
        `ON CONFLICT ("slug") DO UPDATE SET ` +
        `"path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id", ` +
        `"order_index" = EXCLUDED."order_index", ` +
        `"simulator_key" = EXCLUDED."simulator_key", "published" = EXCLUDED."published", ` +
        `"title_en" = EXCLUDED."title_en", "title_pt" = EXCLUDED."title_pt", ` +
        `"body_en" = EXCLUDED."body_en", "body_pt" = EXCLUDED."body_pt", "updated_at" = now();`
    );
  }

  writeFileSync(OUT, parts.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${OUT}: ${modules.length} modules, ${pages.length} pages.`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
