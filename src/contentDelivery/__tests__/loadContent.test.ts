import { describe, it, expect, beforeEach, vi } from 'vitest';

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('../../app/utils/api', () => ({ default: api }));

const forceApi = vi.hoisted(() => ({ enabled: false }));
vi.mock('../config', () => ({
  MANIFEST_URL: '/content/manifest.json',
  isForceContentApi: () => forceApi.enabled,
}));

import {
  loadContentIndex,
  loadPageBody,
  reloadContentFromApi,
  resetContentDeliveryForTests,
  getCachedManifestForTests,
} from '../loadContent';
import { resetContentSessionForTests } from '../session';

const manifest = {
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
      hasPt: true,
      bodyEnUrl: '/content/abc123/pages/hash-en.json',
      bodyPtUrl: '/content/abc123/pages/hash-pt.json',
    },
  ],
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  forceApi.enabled = false;
  resetContentDeliveryForTests();
  resetContentSessionForTests();
  vi.stubGlobal('fetch', vi.fn());
});

describe('loadContentIndex', () => {
  it('loads modules and pages from the CDN manifest', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(manifest));

    const index = await loadContentIndex();
    expect(index.modules).toHaveLength(1);
    expect(index.pages[0]).toMatchObject({ slug: 's1', path: '/p1' });
    expect(index.pages[0]).not.toHaveProperty('bodyEnUrl');
    expect(getCachedManifestForTests()?.contentHash).toBe('abc123');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('falls back to the API once when the manifest is invalid', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ schemaVersion: 0 }));
    api.get.mockImplementation((url: string) => {
      if (url === '/api/modules') {
        return Promise.resolve({ data: { modules: manifest.modules } });
      }
      return Promise.resolve({ data: { pages: [{ slug: 's1', path: '/p1', moduleId: 'm1', orderIndex: 0, simulatorKey: null, titleEn: 'T', titlePt: 'T' }] } });
    });

    const index = await loadContentIndex();
    expect(index.pages).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('uses the API when force mode is enabled', async () => {
    forceApi.enabled = true;
    api.get.mockImplementation((url: string) => {
      if (url === '/api/modules') {
        return Promise.resolve({ data: { modules: manifest.modules } });
      }
      return Promise.resolve({ data: { pages: [{ slug: 's1', path: '/p1', moduleId: 'm1', orderIndex: 0, simulatorKey: null, titleEn: 'T', titlePt: 'T' }] } });
    });

    await loadContentIndex();
    expect(fetch).not.toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('honours explicit forceApi for admin reload', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(manifest));
    await loadContentIndex();
    api.get.mockImplementation((url: string) => {
      if (url === '/api/modules') {
        return Promise.resolve({ data: { modules: manifest.modules } });
      }
      return Promise.resolve({ data: { pages: [{ slug: 's1', path: '/p1', moduleId: 'm1', orderIndex: 0, simulatorKey: null, titleEn: 'T', titlePt: 'T' }] } });
    });

    await loadContentIndex({ forceApi: true });
    expect(api.get).toHaveBeenCalledTimes(2);
    expect(getCachedManifestForTests()).toBeNull();
  });
});

describe('loadPageBody', () => {
  beforeEach(async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(manifest));
    await loadContentIndex();
    vi.mocked(fetch).mockReset();
  });

  it('loads the body from the manifest URL for the requested locale', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        slug: 's1',
        path: '/p1',
        lang: 'pt',
        title: 'T',
        simulator_key: null,
        body: '# PT body',
      })
    );

    const body = await loadPageBody({ path: '/p1', lang: 'pt' });
    expect(body).toBe('# PT body');
    expect(fetch).toHaveBeenCalledWith('/content/abc123/pages/hash-pt.json');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('falls back to the API when the CDN body fetch fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce(new Response('', { status: 404 }));
    api.get.mockResolvedValueOnce({ data: { body: '# API body' } });

    const body = await loadPageBody({ path: '/p1', lang: 'en' });
    expect(body).toBe('# API body');
    expect(api.get).toHaveBeenCalledWith('/api/content/body', {
      params: { path: '/p1', lang: 'en' },
    });
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('uses manifest body URLs rather than deriving paths from slug', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        slug: 'nested/slug',
        path: '/p1',
        lang: 'en',
        title: 'T',
        simulator_key: null,
        body: '# CDN',
      })
    );

    await loadPageBody({ path: '/p1', lang: 'en' });
    expect(fetch).toHaveBeenCalledWith('/content/abc123/pages/hash-en.json');
  });
});

describe('reloadContentFromApi', () => {
  it('clears cached manifest and forces API reads', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(manifest));
    await loadContentIndex();
    reloadContentFromApi();

    api.get.mockImplementation((url: string) => {
      if (url === '/api/modules') {
        return Promise.resolve({ data: { modules: manifest.modules } });
      }
      if (url === '/api/content/body') {
        return Promise.resolve({ data: { body: '# API' } });
      }
      return Promise.resolve({ data: { pages: [] } });
    });

    await loadContentIndex();
    const body = await loadPageBody({ path: '/p1', lang: 'en' });
    expect(getCachedManifestForTests()).toBeNull();
    expect(body).toBe('# API');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
