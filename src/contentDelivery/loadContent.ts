import api from '../app/utils/api';
import { MANIFEST_URL, isForceContentApi } from './config';
import { setPreferContentApi, shouldUseContentApi } from './session';
import { isPageBodyPayload, validateContentManifest } from './validateManifest';
import type { ContentIndex, ContentManifest, PageBodyPayload } from './types';

let cachedManifest: ContentManifest | null = null;
let fallbackWarned = false;

function warnFallbackOnce(reason: string): void {
  if (fallbackWarned || isForceContentApi()) return;
  fallbackWarned = true;
  console.warn('[content] Static CDN delivery unavailable; using API fallback.', reason);
}

function toContentIndex(manifest: ContentManifest): ContentIndex {
  return {
    modules: manifest.modules,
    pages: manifest.pages.map(({ bodyEnUrl: _en, bodyPtUrl: _pt, ...page }) => page),
  };
}

async function fetchManifestFromCdn(): Promise<ContentManifest> {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) {
    throw new Error(`manifest HTTP ${res.status}`);
  }
  const data: unknown = await res.json();
  const manifest = validateContentManifest(data);
  if (!manifest) {
    throw new Error('invalid manifest schema');
  }
  return manifest;
}

interface ApiModuleEntry {
  id: string;
  label: string;
  tier: string;
  base: string;
  paths?: string[];
  orderIndex: number;
}

interface ApiIndexEntry {
  slug: string;
  path: string;
  moduleId: string | null;
  orderIndex: number;
  simulatorKey: string | null;
  titleEn: string | null;
  titlePt: string | null;
  hasEn?: boolean;
  hasPt?: boolean;
}

async function fetchIndexFromApi(): Promise<ContentIndex> {
  const [modRes, pageRes] = await Promise.all([
    api.get<{ modules: ApiModuleEntry[] }>('/api/modules'),
    api.get<{ pages: ApiIndexEntry[] }>('/api/content'),
  ]);
  const pages = (pageRes.data?.pages ?? []).map((p) => ({
    slug: p.slug,
    path: p.path,
    moduleId: p.moduleId,
    orderIndex: p.orderIndex,
    simulatorKey: p.simulatorKey,
    titleEn: p.titleEn,
    titlePt: p.titlePt,
    hasEn: p.hasEn ?? false,
    hasPt: p.hasPt ?? false,
  }));
  return {
    modules: modRes.data?.modules ?? [],
    pages,
  };
}

export interface LoadContentIndexOptions {
  /** Admin reload and explicit callers bypass CDN. */
  forceApi?: boolean;
}

export async function loadContentIndex(options: LoadContentIndexOptions = {}): Promise<ContentIndex> {
  const useApi = options.forceApi || shouldUseContentApi();
  if (useApi) {
    cachedManifest = null;
    return fetchIndexFromApi();
  }

  try {
    const manifest = await fetchManifestFromCdn();
    cachedManifest = manifest;
    return toContentIndex(manifest);
  } catch (err) {
    warnFallbackOnce(err instanceof Error ? err.message : String(err));
    cachedManifest = null;
    return fetchIndexFromApi();
  }
}

export interface LoadPageBodyOptions {
  path: string;
  lang: 'en' | 'pt';
  forceApi?: boolean;
}

async function fetchBodyFromCdn(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`body HTTP ${res.status}`);
  }
  const data: unknown = await res.json();
  if (!isPageBodyPayload(data)) {
    throw new Error('invalid body schema');
  }
  return data.body;
}

async function fetchBodyFromApi(path: string, lang: 'en' | 'pt'): Promise<string> {
  const res = await api.get<PageBodyPayload | { body: string }>('/api/content/body', {
    params: { path, lang },
  });
  const payload = res.data;
  if (payload && typeof payload === 'object' && 'body' in payload && typeof payload.body === 'string') {
    return payload.body;
  }
  return '';
}

function resolveBodyUrl(manifest: ContentManifest, path: string, lang: 'en' | 'pt'): string | null {
  const page = manifest.pages.find((p) => p.path === path);
  if (!page) return null;
  return lang === 'pt' ? page.bodyPtUrl : page.bodyEnUrl;
}

export async function loadPageBody(options: LoadPageBodyOptions): Promise<string> {
  const { path, lang, forceApi } = options;
  const useApi = forceApi || shouldUseContentApi();

  if (!useApi) {
    let manifest = cachedManifest;
    if (!manifest) {
      try {
        manifest = await fetchManifestFromCdn();
        cachedManifest = manifest;
      } catch (err) {
        warnFallbackOnce(err instanceof Error ? err.message : String(err));
      }
    }

    if (manifest) {
      const bodyUrl = resolveBodyUrl(manifest, path, lang);
      if (bodyUrl) {
        try {
          return await fetchBodyFromCdn(bodyUrl);
        } catch (err) {
          warnFallbackOnce(err instanceof Error ? err.message : String(err));
        }
      }
    }
  }

  return fetchBodyFromApi(path, lang);
}

/** Clears cached manifest and forces API reads until the next full page load. */
export function reloadContentFromApi(): void {
  cachedManifest = null;
  setPreferContentApi(true);
}

export function getCachedManifestForTests(): ContentManifest | null {
  return cachedManifest;
}

export function resetContentDeliveryForTests(): void {
  cachedManifest = null;
  fallbackWarned = false;
}
