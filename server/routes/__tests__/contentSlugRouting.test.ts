import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => ({ getUserContext: vi.fn() }));
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'admin', email: 'a@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const nestedPage = {
  slug: 'theoretical-foundations/distributed-challenges',
  path: '/theoretical-foundations/distributed-challenges',
  published: true,
  simulatorKey: null,
  titleEn: 'Distributed Systems Challenges',
  titlePt: 'Desafios de Sistemas Distribuídos',
  bodyEn: '# Distributed Systems Challenges',
  bodyPt: '# Desafios de Sistemas Distribuídos',
};
const nestedIndexPage = {
  slug: nestedPage.slug,
  path: nestedPage.path,
  moduleId: null as string | null,
  orderIndex: 0,
  simulatorKey: nestedPage.simulatorKey,
  titleEn: nestedPage.titleEn,
  titlePt: nestedPage.titlePt,
  hasEn: true,
  hasPt: true,
};

beforeEach(() => {
  mockDb.reset();
});

describe('GET /api/content/:slug nested paths', () => {
  it('returns body when slug contains slashes', async () => {
    mockDb.setResults([[nestedPage]]);
    const res = await app.request(
      '/api/content/theoretical-foundations/distributed-challenges?lang=en'
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { slug: string; body: string };
    expect(body.slug).toBe('theoretical-foundations/distributed-challenges');
    expect(body.body).toContain('Distributed Systems Challenges');
  });

  it('GET /api/content/body loads distributed-challenges by public path', async () => {
    mockDb.setResults([[nestedPage]]);
    const res = await app.request(
      '/api/content/body?path=/theoretical-foundations/distributed-challenges&lang=en'
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { slug: string; body: string };
    expect(body.slug).toBe('theoretical-foundations/distributed-challenges');
    expect(body.body).toContain('Distributed Systems Challenges');
    expect(res.headers.get('cache-control')).toContain('max-age=300');
  });

  it('GET /api/content/body 404 sets no-store (CDN miss must not stick)', async () => {
    mockDb.setResults([[]]);
    const res = await app.request(
      '/api/content/body?path=/theoretical-foundations/distributed-challenges&lang=en'
    );
    expect(res.status).toBe(404);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('includes the full slug in the index entry', async () => {
    mockDb.setResults([[nestedIndexPage]]);
    const res = await app.request('/api/content');
    const json = (await res.json()) as { pages: { slug: string }[] };
    expect(json.pages[0].slug).toBe('theoretical-foundations/distributed-challenges');
  });
});
