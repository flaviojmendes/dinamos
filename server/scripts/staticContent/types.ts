export const STATIC_CONTENT_SCHEMA_VERSION = 1;

export interface ContentModuleRow {
  key: string;
  label: string;
  tier: string;
  base: string;
  paths: string[] | null;
  orderIndex: number;
}

export interface ContentPageRow {
  slug: string;
  path: string;
  moduleId: string | null;
  orderIndex: number;
  simulatorKey: string | null;
  published: boolean;
  titleEn: string | null;
  titlePt: string | null;
  bodyEn: string | null;
  bodyPt: string | null;
}

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

export interface PageBodyPayload {
  slug: string;
  path: string;
  lang: 'en' | 'pt';
  title: string | null;
  simulator_key: string | null;
  body: string;
}

export interface StaticBodyFile {
  relativePath: string;
  payload: PageBodyPayload;
}

export interface StaticContentSnapshot {
  schemaVersion: number;
  contentHash: string;
  generatedAt: string;
  modules: PublicModuleEntry[];
  pages: ManifestPageEntry[];
  bodyFiles: StaticBodyFile[];
}

export interface ContentManifest {
  schemaVersion: number;
  contentHash: string;
  generatedAt: string;
  modules: PublicModuleEntry[];
  pages: ManifestPageEntry[];
}
