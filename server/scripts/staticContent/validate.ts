import { isValidTier } from './transform.js';
import type { ContentModuleRow, ContentPageRow, StaticContentSnapshot } from './types.js';

export class StaticContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StaticContentValidationError';
  }
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new StaticContentValidationError(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

export function validateSourceRows(modules: ContentModuleRow[], pages: ContentPageRow[]): void {
  for (const moduleRow of modules) {
    if (!moduleRow.key.trim()) {
      throw new StaticContentValidationError('Module key is required');
    }
    if (!moduleRow.label.trim()) {
      throw new StaticContentValidationError(`Module ${moduleRow.key} is missing a label`);
    }
    if (!moduleRow.base.trim()) {
      throw new StaticContentValidationError(`Module ${moduleRow.key} is missing a base path`);
    }
    if (!isValidTier(moduleRow.tier)) {
      throw new StaticContentValidationError(`Module ${moduleRow.key} has invalid tier ${moduleRow.tier}`);
    }
  }

  assertUnique(modules.map((m) => m.key), 'module key');

  for (const page of pages) {
    if (!page.slug.trim()) {
      throw new StaticContentValidationError('Page slug is required');
    }
    if (!page.path.trim()) {
      throw new StaticContentValidationError(`Page ${page.slug} is missing a path`);
    }
  }

  assertUnique(pages.map((p) => p.slug), 'page slug');
  assertUnique(pages.map((p) => p.path), 'page path');
}

export function validateSnapshot(snapshot: StaticContentSnapshot): void {
  if (snapshot.schemaVersion < 1) {
    throw new StaticContentValidationError('schemaVersion must be >= 1');
  }
  if (!snapshot.contentHash.trim()) {
    throw new StaticContentValidationError('contentHash is required');
  }
  if (!snapshot.generatedAt.trim()) {
    throw new StaticContentValidationError('generatedAt is required');
  }

  assertUnique(snapshot.modules.map((m) => m.id), 'manifest module id');
  assertUnique(snapshot.pages.map((p) => p.slug), 'manifest page slug');
  assertUnique(snapshot.pages.map((p) => p.path), 'manifest page path');

  const bodyPaths = new Set<string>();
  for (const file of snapshot.bodyFiles) {
    if (bodyPaths.has(file.relativePath)) {
      throw new StaticContentValidationError(`Duplicate body file path: ${file.relativePath}`);
    }
    bodyPaths.add(file.relativePath);

    if (!file.payload.slug.trim() || !file.payload.path.trim()) {
      throw new StaticContentValidationError('Body payload slug and path are required');
    }
    if (file.payload.lang !== 'en' && file.payload.lang !== 'pt') {
      throw new StaticContentValidationError(`Invalid body language: ${file.payload.lang}`);
    }
  }

  for (const page of snapshot.pages) {
    const expectedEn = `/content/${snapshot.contentHash}/pages/`;
    if (!page.bodyEnUrl.startsWith(expectedEn) || !page.bodyPtUrl.startsWith(expectedEn)) {
      throw new StaticContentValidationError(`Page ${page.slug} body URLs must reference ${snapshot.contentHash}`);
    }
  }
}
