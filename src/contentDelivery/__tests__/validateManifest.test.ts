import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateContentManifest, isPageBodyPayload } from '../validateManifest';

const validManifest = {
  schemaVersion: 1,
  contentHash: 'abc123',
  generatedAt: '2026-01-01T00:00:00.000Z',
  modules: [{ id: 'm1', label: 'M1', tier: 'CORE', base: '/m1', orderIndex: 0 }],
  pages: [
    {
      slug: 's1',
      path: '/p1',
      moduleId: 'm1',
      orderIndex: 0,
      simulatorKey: null,
      titleEn: 'T',
      titlePt: 'T',
      hasEn: true,
      hasPt: false,
      bodyEnUrl: '/content/abc123/pages/hash-en.json',
      bodyPtUrl: '/content/abc123/pages/hash-pt.json',
    },
  ],
};

describe('validateContentManifest', () => {
  it('accepts a valid manifest', () => {
    expect(validateContentManifest(validManifest)).toEqual(validManifest);
  });

  it('rejects unsupported schema versions', () => {
    expect(validateContentManifest({ ...validManifest, schemaVersion: 0 })).toBeNull();
  });

  it('rejects manifests missing body URLs', () => {
    const { bodyEnUrl: _a, ...page } = validManifest.pages[0];
    expect(
      validateContentManifest({ ...validManifest, pages: [page] })
    ).toBeNull();
  });

  it('rejects non-object payloads', () => {
    expect(validateContentManifest(null)).toBeNull();
    expect(validateContentManifest('manifest')).toBeNull();
  });
});

describe('isPageBodyPayload', () => {
  it('accepts CDN body payloads', () => {
    expect(
      isPageBodyPayload({
        slug: 's1',
        path: '/p1',
        lang: 'en',
        title: 'T',
        simulator_key: null,
        body: '# Hello',
      })
    ).toBe(true);
  });

  it('rejects invalid body payloads', () => {
    expect(isPageBodyPayload({ slug: 's1' })).toBe(false);
    expect(isPageBodyPayload({ ...validManifest, lang: 'fr' })).toBe(false);
  });
});
