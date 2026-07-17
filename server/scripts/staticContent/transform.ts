import { createHash } from 'node:crypto';
import {
  STATIC_CONTENT_SCHEMA_VERSION,
  type ContentManifest,
  type ContentModuleRow,
  type ContentPageRow,
  type ManifestPageEntry,
  type PageBodyPayload,
  type PublicModuleEntry,
  type StaticBodyFile,
  type StaticContentSnapshot,
} from './types.js';
import { stableStringify } from './stableJson.js';

const VALID_TIERS = new Set(['FOUNDATIONAL', 'CORE', 'ADVANCED', 'APPLIED', 'TOOLS']);

function comparePages(a: ContentPageRow, b: ContentPageRow): number {
  const order = a.orderIndex - b.orderIndex;
  if (order !== 0) return order;
  return a.slug.localeCompare(b.slug);
}

function compareModules(a: ContentModuleRow, b: ContentModuleRow): number {
  const order = a.orderIndex - b.orderIndex;
  if (order !== 0) return order;
  return a.key.localeCompare(b.key);
}

export function slugHash(slug: string): string {
  return createHash('sha256').update(slug).digest('hex').slice(0, 16);
}

export function hasLanguageBody(body: string | null | undefined): boolean {
  return Boolean(body && body.trim());
}

/** Mirrors server/routes/content.ts pageBodyResponse for CDN body files. */
export function resolvePageBody(row: ContentPageRow, lang: 'en' | 'pt'): PageBodyPayload {
  const primaryBody = lang === 'pt' ? row.bodyPt : row.bodyEn;
  const fallbackBody = lang === 'pt' ? row.bodyEn : row.bodyPt;
  const primaryTitle = lang === 'pt' ? row.titlePt : row.titleEn;
  const fallbackTitle = lang === 'pt' ? row.titleEn : row.titlePt;
  const body = (primaryBody && primaryBody.trim() ? primaryBody : fallbackBody) ?? '';
  const resolvedLang = primaryBody && primaryBody.trim() ? lang : lang === 'pt' ? 'en' : 'pt';
  return {
    slug: row.slug,
    path: row.path,
    lang: resolvedLang,
    title: primaryTitle ?? fallbackTitle ?? null,
    simulator_key: row.simulatorKey,
    body,
  };
}

function toPublicModule(row: ContentModuleRow): PublicModuleEntry {
  return {
    id: row.key,
    label: row.label,
    tier: row.tier,
    base: row.base,
    paths: row.paths ?? undefined,
    orderIndex: row.orderIndex,
  };
}

/** Public index entry — matches GET /api/content index contract. */
function toIndexEntry(row: ContentPageRow): Omit<
  ManifestPageEntry,
  'bodyEnUrl' | 'bodyPtUrl'
> {
  return {
    slug: row.slug,
    path: row.path,
    moduleId: row.moduleId,
    orderIndex: row.orderIndex,
    simulatorKey: row.simulatorKey,
    titleEn: row.titleEn,
    titlePt: row.titlePt,
    hasEn: hasLanguageBody(row.bodyEn),
    hasPt: hasLanguageBody(row.bodyPt),
  };
}

function bodyRelativePath(contentHash: string, slug: string, lang: 'en' | 'pt'): string {
  return `${contentHash}/pages/${slugHash(slug)}-${lang}.json`;
}

function bodyPublicUrl(contentHash: string, slug: string, lang: 'en' | 'pt'): string {
  return `/content/${bodyRelativePath(contentHash, slug, lang)}`;
}

export function computeContentHash(
  modules: ContentModuleRow[],
  publishedPages: ContentPageRow[]
): string {
  const payload = {
    modules: modules.map((m) => ({
      key: m.key,
      label: m.label,
      tier: m.tier,
      base: m.base,
      paths: m.paths,
      orderIndex: m.orderIndex,
    })),
    pages: publishedPages.map((p) => ({
      slug: p.slug,
      path: p.path,
      moduleId: p.moduleId,
      orderIndex: p.orderIndex,
      simulatorKey: p.simulatorKey,
      titleEn: p.titleEn,
      titlePt: p.titlePt,
      bodyEn: p.bodyEn,
      bodyPt: p.bodyPt,
    })),
  };
  return createHash('sha256').update(stableStringify(payload)).digest('hex').slice(0, 16);
}

export function buildStaticContentSnapshot(
  modules: ContentModuleRow[],
  pages: ContentPageRow[],
  generatedAt: string
): StaticContentSnapshot {
  const sortedModules = [...modules].sort(compareModules);
  const publishedPages = pages.filter((p) => p.published).sort(comparePages);
  const contentHash = computeContentHash(sortedModules, publishedPages);

  const bodyFiles: StaticBodyFile[] = [];
  const manifestPages: ManifestPageEntry[] = publishedPages.map((row) => {
    for (const lang of ['en', 'pt'] as const) {
      bodyFiles.push({
        relativePath: bodyRelativePath(contentHash, row.slug, lang),
        payload: resolvePageBody(row, lang),
      });
    }
    return {
      ...toIndexEntry(row),
      bodyEnUrl: bodyPublicUrl(contentHash, row.slug, 'en'),
      bodyPtUrl: bodyPublicUrl(contentHash, row.slug, 'pt'),
    };
  });

  return {
    schemaVersion: STATIC_CONTENT_SCHEMA_VERSION,
    contentHash,
    generatedAt,
    modules: sortedModules.map(toPublicModule),
    pages: manifestPages,
    bodyFiles,
  };
}

export function toManifest(snapshot: StaticContentSnapshot): ContentManifest {
  return {
    schemaVersion: snapshot.schemaVersion,
    contentHash: snapshot.contentHash,
    generatedAt: snapshot.generatedAt,
    modules: snapshot.modules,
    pages: snapshot.pages,
  };
}

export function isValidTier(tier: string): boolean {
  return VALID_TIERS.has(tier);
}
