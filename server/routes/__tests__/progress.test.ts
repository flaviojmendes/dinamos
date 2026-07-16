import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const row = (path: string) => ({ path, completed: true, completedAt: new Date('2024-01-01') });

beforeEach(() => mockDb.reset());

describe('progress routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/progress')).status).toBe(401);
  });

  it('GET /api/progress maps rows by path', async () => {
    mockDb.setResults([[row('/a'), { path: '/b', completed: false, completedAt: null }]]);
    const res = await app.request('/api/progress', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.progress['/a'].completed).toBe(true);
    expect(body.progress['/b'].completedAt).toBeNull();
  });

  it('PUT /api/progress upserts target + descendants and returns delta', async () => {
    // one upsert per target (insert)
    mockDb.setResults([undefined, undefined]);
    const res = await app.request('/api/progress', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ path: '/a', completed: true, paths: ['/a/b'] }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.updated['/a'].completed).toBe(true);
    expect(body.updated['/a/b'].completed).toBe(true);
    expect(body.progress).toBeUndefined();
  });

  it('PUT /api/progress can return full map when requested', async () => {
    mockDb.setResults([undefined, undefined, [row('/a'), row('/a/b')]]);
    const res = await app.request('/api/progress?full=true', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ path: '/a', completed: true, paths: ['/a/b'] }),
    });
    const body = await res.json() as any;
    expect(body.progress['/a'].completed).toBe(true);
    expect(body.updated['/a/b'].completed).toBe(true);
  });

  it('PUT /api/progress 400 without a path', async () => {
    const res = await app.request('/api/progress', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/progress/migrate inserts only unknown paths', async () => {
    mockDb.setResults([
      [{ path: '/known' }], // existing
      undefined, // insert of /new
      [row('/known'), row('/new')], // final select
    ]);
    const res = await app.request('/api/progress/migrate', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({
        progress: {
          '/known': { completed: true },
          '/new': { completed: true, completedAt: '2024-02-02T00:00:00Z' },
          '': { completed: true },
        },
      }),
    });
    const body = await res.json() as any;
    expect(body.migrated).toBe(1);
  });

  it('DELETE /api/progress clears a path', async () => {
    mockDb.setResults([undefined]);
    const res = await app.request('/api/progress?path=/a', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/progress 400 without a path', async () => {
    const res = await app.request('/api/progress', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(400);
  });
});
