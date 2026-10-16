/**
 * Apply the reviewed course release to the current local snapshot, without a
 * database connection or environment file. Run with:
 *   npx tsx server/scripts/releaseReviewedContent.ts
 */
import { readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { applyCourseRelease } from '../content/courseRelease.js';
import { buildStaticContentSnapshot } from './staticContent/transform.js';
import type {
  ContentManifest,
  ContentModuleRow,
  ContentPageRow,
  ManifestPageEntry,
  PageBodyPayload,
} from './staticContent/types.js';
import { validateSnapshot, validateSourceRows } from './staticContent/validate.js';
import {
  CONTENT_ROOT_DIR,
  readExistingManifest,
  writeStaticContentSnapshot,
} from './staticContent/write.js';

function readPageBody(
  contentRoot: string,
  manifest: ContentManifest,
  page: ManifestPageEntry,
  lang: 'en' | 'pt'
): string {
  const url = lang === 'pt' ? page.bodyPtUrl : page.bodyEnUrl;
  const prefix = `/content/${manifest.contentHash}/pages/`;
  if (!url.startsWith(prefix)) {
    throw new Error(`Page ${page.slug} ${lang} body must reference the current content version`);
  }

  const target = resolve(contentRoot, url.slice('/content/'.length));
  const relativeTarget = relative(contentRoot, target);
  if (isAbsolute(relativeTarget) || relativeTarget === '..' || relativeTarget.startsWith(`..${sep}`)) {
    throw new Error(`Page ${page.slug} ${lang} body path is outside the content directory`);
  }

  const payload = JSON.parse(readFileSync(target, 'utf8')) as PageBodyPayload;
  if (
    payload.slug !== page.slug ||
    payload.path !== page.path ||
    typeof payload.body !== 'string'
  ) {
    throw new Error(`Page ${page.slug} ${lang} has an inconsistent body payload`);
  }

  // Older snapshots could contain a fallback in the missing language's file.
  // The manifest availability flag prevents publishing that fallback as a
  // translation merely because a body file exists.
  const available = lang === 'pt' ? page.hasPt : page.hasEn;
  if (!available) return '';
  if (payload.lang !== lang) {
    throw new Error(`Page ${page.slug} ${lang} has an inconsistent body payload`);
  }
  return payload.body;
}

export interface ReviewedContentReleaseResult {
  contentHash: string;
  written: boolean;
  moduleCount: number;
  pageCount: number;
  bodyFileCount: number;
  previousContentHash: string | null;
}

export function releaseReviewedContent(
  contentRoot = resolve(CONTENT_ROOT_DIR),
  generatedAt = new Date().toISOString()
): ReviewedContentReleaseResult {
  const manifest = readExistingManifest(contentRoot);
  if (!manifest) throw new Error(`No content manifest found in ${contentRoot}`);
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.modules) || !Array.isArray(manifest.pages)) {
    throw new Error('The current content manifest has an unsupported schema');
  }

  const modules: ContentModuleRow[] = manifest.modules.map((entry) => ({
    key: entry.id,
    label: entry.label,
    tier: entry.tier,
    base: entry.base,
    paths: entry.paths ?? null,
    orderIndex: entry.orderIndex,
  }));
  const pages: ContentPageRow[] = manifest.pages.map((entry) =>
    applyCourseRelease({
      slug: entry.slug,
      path: entry.path,
      moduleId: entry.moduleId,
      orderIndex: entry.orderIndex,
      simulatorKey: entry.simulatorKey,
      published: true,
      titleEn: entry.titleEn,
      titlePt: entry.titlePt,
      bodyEn: readPageBody(contentRoot, manifest, entry, 'en'),
      bodyPt: readPageBody(contentRoot, manifest, entry, 'pt'),
    })
  );

  validateSourceRows(modules, pages);
  const snapshot = buildStaticContentSnapshot(modules, pages, generatedAt);
  validateSnapshot(snapshot);

  const result: ReviewedContentReleaseResult = {
    contentHash: snapshot.contentHash,
    written: false,
    moduleCount: snapshot.modules.length,
    pageCount: snapshot.pages.length,
    bodyFileCount: snapshot.bodyFiles.length,
    previousContentHash: null,
  };

  // Calling the writer again for the same hash would prune the useful previous
  // version and change generatedAt even though no content has changed.
  if (snapshot.contentHash === manifest.contentHash) return result;

  const written = writeStaticContentSnapshot(contentRoot, snapshot);
  return { ...result, written: true, previousContentHash: written.previousContentHash };
}

const isDirectRun =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const result = releaseReviewedContent();
    const action = result.written ? 'Wrote' : 'Already current:';
    console.log(
      `[content:release-reviewed] ${action} ${result.contentHash} ` +
        `(${result.moduleCount} modules, ${result.pageCount} pages, ${result.bodyFileCount} body files).`
    );
    if (result.previousContentHash) {
      console.log(`[content:release-reviewed] Retained previous version ${result.previousContentHash}.`);
    }
  } catch (error) {
    console.error('[content:release-reviewed] Release failed:', error);
    process.exitCode = 1;
  }
}
