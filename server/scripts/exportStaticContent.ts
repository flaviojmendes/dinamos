/**
 * Export published CMS content to versioned static JSON under public/content/.
 *
 * Run with: npm run content:export-static
 */
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fetchPublishedContent } from './staticContent/fetchPublishedContent.js';
import { buildStaticContentSnapshot } from './staticContent/transform.js';
import { validateSourceRows } from './staticContent/validate.js';
import { CONTENT_ROOT_DIR, writeStaticContentSnapshot } from './staticContent/write.js';

export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }
  return url;
}

async function main(): Promise<void> {
  requireDatabaseUrl();

  const contentRoot = resolve(CONTENT_ROOT_DIR);
  const { modules, pages } = await fetchPublishedContent();
  validateSourceRows(modules, pages);

  const snapshot = buildStaticContentSnapshot(modules, pages, new Date().toISOString());
  const result = writeStaticContentSnapshot(contentRoot, snapshot);

  console.log(
    `[content:export-static] Wrote manifest ${snapshot.contentHash} ` +
      `(${snapshot.modules.length} modules, ${snapshot.pages.length} pages, ` +
      `${snapshot.bodyFiles.length} body files).`
  );
  if (result.previousContentHash) {
    console.log(
      `[content:export-static] Retained previous version ${result.previousContentHash}.`
    );
  }
}

const isDirectRun =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('[content:export-static] Export failed:', error);
      process.exit(1);
    });
}