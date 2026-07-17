import { STATIC_CONTENT_SCHEMA_VERSION, type ContentManifest, type PageBodyPayload } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseModule(value: unknown): ContentManifest['modules'][number] | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.label)) return null;
  if (!isNonEmptyString(value.tier) || !isNonEmptyString(value.base)) return null;
  if (typeof value.orderIndex !== 'number') return null;
  const paths = value.paths;
  if (paths !== undefined && (!Array.isArray(paths) || paths.some((p) => typeof p !== 'string'))) {
    return null;
  }
  return {
    id: value.id,
    label: value.label,
    tier: value.tier,
    base: value.base,
    paths: paths as string[] | undefined,
    orderIndex: value.orderIndex,
  };
}

function parsePage(value: unknown): ContentManifest['pages'][number] | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.slug) || !isNonEmptyString(value.path)) return null;
  if (!isNonEmptyString(value.bodyEnUrl) || !isNonEmptyString(value.bodyPtUrl)) return null;
  if (typeof value.orderIndex !== 'number') return null;
  if (typeof value.hasEn !== 'boolean' || typeof value.hasPt !== 'boolean') return null;
  const moduleId = value.moduleId;
  if (moduleId !== null && typeof moduleId !== 'string') return null;
  const simulatorKey = value.simulatorKey;
  if (simulatorKey !== null && typeof simulatorKey !== 'string') return null;
  const titleEn = value.titleEn;
  const titlePt = value.titlePt;
  if (titleEn !== null && typeof titleEn !== 'string') return null;
  if (titlePt !== null && typeof titlePt !== 'string') return null;
  return {
    slug: value.slug,
    path: value.path,
    moduleId: moduleId as string | null,
    orderIndex: value.orderIndex,
    simulatorKey: simulatorKey as string | null,
    titleEn: titleEn as string | null,
    titlePt: titlePt as string | null,
    hasEn: value.hasEn,
    hasPt: value.hasPt,
    bodyEnUrl: value.bodyEnUrl,
    bodyPtUrl: value.bodyPtUrl,
  };
}

export function validateContentManifest(data: unknown): ContentManifest | null {
  if (!isRecord(data)) return null;
  if (typeof data.schemaVersion !== 'number' || data.schemaVersion < STATIC_CONTENT_SCHEMA_VERSION) {
    return null;
  }
  if (!isNonEmptyString(data.contentHash) || !isNonEmptyString(data.generatedAt)) return null;
  if (!Array.isArray(data.modules) || !Array.isArray(data.pages)) return null;

  const modules = data.modules.map(parseModule);
  if (modules.some((m) => m === null)) return null;

  const pages = data.pages.map(parsePage);
  if (pages.some((p) => p === null)) return null;

  return {
    schemaVersion: data.schemaVersion,
    contentHash: data.contentHash,
    generatedAt: data.generatedAt,
    modules: modules as ContentManifest['modules'],
    pages: pages as ContentManifest['pages'],
  };
}

export function isPageBodyPayload(value: unknown): value is PageBodyPayload {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.slug) || !isNonEmptyString(value.path)) return false;
  if (value.lang !== 'en' && value.lang !== 'pt') return false;
  if (typeof value.body !== 'string') return false;
  return true;
}
