/**
 * One-time migration: seed the `content_pages` table from the static MDX files
 * under src/content. Run with:
 *
 *   node --env-file=.env node_modules/.bin/tsx server/scripts/seedContent.ts
 *
 * Idempotent: upserts by slug, so re-running refreshes bodies without creating
 * duplicates. The path comes from the (authoritative) contentManifest; the
 * moduleId is derived the same way the nav registry does.
 *
 * After verifying the seed, the static .mdx files can be removed (one is kept
 * as an authoring template). Content is then edited via the admin CMS.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { db } from '../db/client.js';
import { contentPages } from '../db/schema.js';
import { contentManifest } from '../../src/config/contentManifest.js';
import { moduleIdForPath } from '../../src/config/contentRegistry.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, '../../src/content');

/** First markdown H1 ("# Title") becomes the page title. */
function extractTitle(mdx: string | null): string | null {
  if (!mdx) return null;
  for (const line of mdx.split('\n')) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1].trim();
  }
  return null;
}

function readBody(slug: string, lang: 'en' | 'pt'): string | null {
  const file = resolve(CONTENT_DIR, `${slug}.${lang}.mdx`);
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8');
}

async function main() {
  // Dedupe manifest by slug (first occurrence = canonical path; alias paths
  // such as /fallback and /horizontal-scaling are dropped — they were excluded
  // from search anyway and the canonical route is preserved).
  const bySlug = new Map<string, { path: string }>();
  for (const entry of contentManifest) {
    if (bySlug.has(entry.slug)) continue;
    bySlug.set(entry.slug, {
      path: entry.path,
    });
  }

  let seeded = 0;
  let skipped = 0;
  let order = 0;

  for (const [slug, meta] of bySlug) {
    const bodyEn = readBody(slug, 'en');
    const bodyPt = readBody(slug, 'pt');
    if (!bodyEn && !bodyPt) {
      skipped++;
      console.warn(`  skip (no mdx files): ${slug}`);
      continue;
    }

    const values = {
      slug,
      path: meta.path,
      moduleId: moduleIdForPath(meta.path),
      orderIndex: order++,
      simulatorKey: null as string | null,
      published: true,
      titleEn: extractTitle(bodyEn),
      titlePt: extractTitle(bodyPt),
      bodyEn,
      bodyPt,
      updatedAt: new Date(),
    };

    await db
      .insert(contentPages)
      .values(values)
      .onConflictDoUpdate({
        target: contentPages.slug,
        set: {
          path: values.path,
          moduleId: values.moduleId,
          orderIndex: values.orderIndex,
          titleEn: values.titleEn,
          titlePt: values.titlePt,
          bodyEn: values.bodyEn,
          bodyPt: values.bodyPt,
          updatedAt: values.updatedAt,
        },
      });
    seeded++;
  }

  console.log(`\nSeeded/updated ${seeded} content pages (${skipped} skipped).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
