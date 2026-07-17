/** Matches the static exporter manifest contract (server/scripts/staticContent/types.ts). */
export const STATIC_CONTENT_SCHEMA_VERSION = 1;

export interface PublicModuleEntry {
  id: string;
  label: string;
  tier: string;
  base: string;
  paths?: string[];
  orderIndex: number;
}

export interface ManifestPageEntry {
  slug: string;
  path: string;
  moduleId: string | null;
  orderIndex: number;
  simulatorKey: string | null;
  titleEn: string | null;
  titlePt: string | null;
  hasEn: boolean;
  hasPt: boolean;
  bodyEnUrl: string;
  bodyPtUrl: string;
}

export interface ContentManifest {
  schemaVersion: number;
  contentHash: string;
  generatedAt: string;
  modules: PublicModuleEntry[];
  pages: ManifestPageEntry[];
}

/** CDN body file payload — mirrors GET /api/content/body response fields. */
export interface PageBodyPayload {
  slug: string;
  path: string;
  lang: 'en' | 'pt';
  title: string | null;
  simulator_key: string | null;
  body: string;
}

export interface ContentIndex {
  modules: PublicModuleEntry[];
  pages: Omit<ManifestPageEntry, 'bodyEnUrl' | 'bodyPtUrl'>[];
}
