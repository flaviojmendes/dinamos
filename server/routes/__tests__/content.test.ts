import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = { getUserContext: vi.fn() };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'admin', email: 'a@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const page = {
  id: 1,
  slug: 'intro',
  path: '/intro',
  moduleId: 'mod1',
  orderIndex: 0,
  simulatorKey: null,
  published: true,
  titleEn: 'Intro',
  titlePt: 'Introducao',
  bodyEn: 'Hello',
  bodyPt: 'Ola',
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};
const indexPage = {
  slug: page.slug,
  path: page.path,
  moduleId: page.moduleId,
  orderIndex: page.orderIndex,
  simulatorKey: page.simulatorKey,
  titleEn: page.titleEn,
  titlePt: page.titlePt,
  hasEn: true,
  hasPt: true,
};
const moduleRow = {
  id: 1,
  key: 'mod1',
  label: 'Module 1',
  tier: 'CORE',
  base: '/mod1',
  paths: ['/intro'],
  orderIndex: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};

function asAdmin() {
  repo.getUserContext.mockResolvedValue({ user: { role: 'Admin' }, role: { name: 'Admin' }, permissionCodes: [] });
}

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
});

describe('content routes (public)', () => {
  it('GET /api/content returns the published index with CDN cache headers', async () => {
    mockDb.setResults([[indexPage]]);
    const res = await app.request('/api/content');
    const body = await res.json() as any;
    expect(body.pages[0].slug).toBe('intro');
    expect(body.pages[0].hasEn).toBe(true);
    expect(res.headers.get('cache-control')).toContain('max-age=300');
  });

  it('GET /api/content index query computes hasEn/hasPt in SQL without body columns', async () => {
    mockDb.setResults([[{ ...indexPage, hasEn: false, hasPt: true }]]);
    const res = await app.request('/api/content');
    const body = await res.json() as { pages: Record<string, unknown>[] };
    expect(body.pages[0]).toEqual({
      slug: 'intro',
      path: '/intro',
      moduleId: 'mod1',
      orderIndex: 0,
      simulatorKey: null,
      titleEn: 'Intro',
      titlePt: 'Introducao',
      hasEn: false,
      hasPt: true,
    });
    const selectCall = mockDb.calls.find((c) => c.op === 'select');
    const fields = selectCall?.args[0] as Record<string, unknown>;
    expect(fields).not.toHaveProperty('bodyEn');
    expect(fields).not.toHaveProperty('bodyPt');
    expect(fields).toHaveProperty('hasEn');
    expect(fields).toHaveProperty('hasPt');
  });

  it('GET /api/content/:slug returns the requested language', async () => {
    mockDb.setResults([[page]]);
    const res = await app.request('/api/content/intro?lang=pt');
    const body = await res.json() as any;
    expect(body.lang).toBe('pt');
    expect(body.body).toBe('Ola');
  });

  it('GET /api/content/:slug falls back when language body is empty', async () => {
    mockDb.setResults([[{ ...page, bodyPt: '   ' }]]);
    const res = await app.request('/api/content/intro?lang=pt');
    const body = await res.json() as any;
    expect(body.lang).toBe('en');
    expect(body.body).toBe('Hello');
  });

  it('GET /api/content/:slug 404 when unpublished', async () => {
    mockDb.setResults([[{ ...page, published: false }]]);
    const res = await app.request('/api/content/intro');
    expect(res.status).toBe(404);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('GET /api/content/body returns page by path query', async () => {
    mockDb.setResults([[page]]);
    const res = await app.request('/api/content/body?path=/intro&lang=en');
    const body = await res.json() as any;
    expect(body.slug).toBe('intro');
    expect(body.body).toBe('Hello');
  });

  it('GET /api/content/body 400 when path and slug missing', async () => {
    const res = await app.request('/api/content/body');
    expect(res.status).toBe(400);
  });

  it('GET /api/modules returns the public module list', async () => {
    mockDb.setResults([[moduleRow]]);
    const res = await app.request('/api/modules');
    expect((await res.json() as any).modules[0].id).toBe('mod1');
  });
});

describe('content routes (admin)', () => {
  it('403 for non-admins', async () => {
    repo.getUserContext.mockResolvedValue({ user: { role: 'Estudante' }, role: { name: 'Estudante' }, permissionCodes: [] });
    const res = await app.request('/api/admin/content', { headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/content lists index entries without bodies', async () => {
    asAdmin();
    mockDb.setResults([[page]]);
    const res = await app.request('/api/admin/content', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.pages).toHaveLength(1);
    expect(body.pages[0].has_en).toBe(true);
    expect(body.pages[0].body_en).toBeUndefined();
  });

  it('GET /api/admin/content/:id 404', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    const res = await app.request('/api/admin/content/1', { headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('POST /api/admin/content creates a page', async () => {
    asAdmin();
    mockDb.setResults([
      [], // slug check
      [], // path check
      [page], // inserted
    ]);
    const res = await app.request('/api/admin/content', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ slug: 'intro', path: '/intro', title_en: 'Intro', body_en: 'Hi' }),
    });
    expect(res.status).toBe(201);
  });

  it('POST /api/admin/content 400 missing slug/path', async () => {
    asAdmin();
    const res = await app.request('/api/admin/content', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ slug: 'intro' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/admin/content 400 duplicate slug', async () => {
    asAdmin();
    mockDb.setResults([[{ id: 2 }]]);
    const res = await app.request('/api/admin/content', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ slug: 'intro', path: '/intro' }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT /api/admin/content/:id updates fields', async () => {
    asAdmin();
    mockDb.setResults([
      [page], // current
      [], // slug dup check
      [], // path dup check
      [{ ...page, titleEn: 'New' }], // updated
    ]);
    const res = await app.request('/api/admin/content/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ slug: 'intro2', path: '/intro2', title_en: 'New', published: false, order_index: 2, body_pt: 'x', module_id: 'mod1', simulator_key: null }),
    });
    expect(res.status).toBe(200);
  });

  it('PUT /api/admin/content/:id 404', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    const res = await app.request('/api/admin/content/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ title_en: 'New' }),
    });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/admin/content/:id', async () => {
    asAdmin();
    mockDb.setResults([[{ id: 1 }]]);
    const res = await app.request('/api/admin/content/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('PUT /api/admin/content-tree reorders modules and pages', async () => {
    asAdmin();
    mockDb.setResults([undefined, undefined]);
    const res = await app.request('/api/admin/content-tree', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ modules: [{ id: 1, order_index: 0 }], pages: [{ id: 1, module_id: 'mod1', order_index: 0 }] }),
    });
    const body = await res.json() as any;
    expect(body.modules).toBe(1);
    expect(body.pages).toBe(1);
  });

  it('GET /api/admin/modules lists modules', async () => {
    asAdmin();
    mockDb.setResults([[moduleRow]]);
    const res = await app.request('/api/admin/modules', { headers: AUTH });
    expect((await res.json() as any).modules[0].key).toBe('mod1');
  });

  it('POST /api/admin/modules creates a module', async () => {
    asAdmin();
    mockDb.setResults([[], [moduleRow]]);
    const res = await app.request('/api/admin/modules', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ key: 'mod1', label: 'Module 1', base: '/mod1', tier: 'CORE', paths: ['/a'] }),
    });
    expect(res.status).toBe(201);
  });

  it('POST /api/admin/modules 400 invalid tier', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    const res = await app.request('/api/admin/modules', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ key: 'mod1', label: 'M', base: '/m', tier: 'WRONG' }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT /api/admin/modules/:id updates', async () => {
    asAdmin();
    mockDb.setResults([
      [moduleRow], // current
      [], // key dup
      [{ ...moduleRow, label: 'New' }], // updated
    ]);
    const res = await app.request('/api/admin/modules/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ key: 'mod1b', label: 'New', base: '/m', tier: 'ADVANCED', paths: ['/a'], order_index: 1 }),
    });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/admin/modules/:id 404', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    const res = await app.request('/api/admin/modules/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(404);
  });
});
