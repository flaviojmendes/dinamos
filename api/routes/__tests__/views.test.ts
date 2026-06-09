import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'viewer', email: 'v@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

beforeEach(() => mockDb.reset());

function post(body: unknown, headers: Record<string, string> = {}) {
  return app.request('/api/views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

describe('views route', () => {
  it('records an anonymous view', async () => {
    const res = await post({ path: '/content/intro', visitorId: 'abc' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockDb.calls.some((c) => c.op === 'insert')).toBe(true);
  });

  it('records an authenticated view (isAuthed=true path)', async () => {
    const res = await post({ path: '/content/auth' }, { Authorization: 'Bearer t' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('rejects an empty path with ok:false (no insert)', async () => {
    const res = await post({ path: '   ' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: false });
    expect(mockDb.calls.some((c) => c.op === 'insert')).toBe(false);
  });

  it('rejects an over-long path', async () => {
    const res = await post({ path: 'x'.repeat(256) });
    expect(await res.json()).toEqual({ ok: false });
  });

  it('tolerates an invalid JSON body', async () => {
    const res = await app.request('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: false });
  });

  it('still returns ok:true even if the insert throws', async () => {
    mockDb.db.insert = () => ({
      values: () => Promise.reject(new Error('db down')),
    });
    const res = await post({ path: '/content/x' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
