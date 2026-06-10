import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

// Mirror server/routes/views.ts: the default salt used when ANALYTICS_SALT is
// unset (as in tests). The recorder must hash the anonymous visitor id only.
const SALT = process.env.ANALYTICS_SALT ?? 'dinamos-analytics-default-salt';
const expectedHash = (visitorKey: string) =>
  createHash('sha256').update(`${SALT}:${visitorKey}`).digest('hex');

function lastInsertedView(mock: ReturnType<typeof createDbMock>) {
  const valuesCall = [...mock.calls].reverse().find((c) => c.op === 'values');
  return valuesCall?.args[0] as
    | { path: string; visitorHash: string; isAuthed: boolean }
    | undefined;
}

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

  it('hashes the anonymous visitor id, never the Firebase uid', async () => {
    // Same request authed vs anonymous, with the same visitor id, must produce
    // an identical hash — proving the uid ('viewer') never feeds the hash.
    await post({ path: '/content/x', visitorId: 'abc' }, { Authorization: 'Bearer t' });
    const authed = lastInsertedView(mockDb);
    mockDb.reset();
    await post({ path: '/content/x', visitorId: 'abc' });
    const anon = lastInsertedView(mockDb);

    expect(authed?.visitorHash).toBe(expectedHash('abc'));
    expect(authed?.visitorHash).toBe(anon?.visitorHash);
    expect(authed?.visitorHash).not.toBe(expectedHash('viewer'));
    expect(authed?.isAuthed).toBe(true);
    expect(anon?.isAuthed).toBe(false);
  });

  it('falls back to the anon key (not the uid) when no visitor id is sent', async () => {
    await post({ path: '/content/auth' }, { Authorization: 'Bearer t' });
    const view = lastInsertedView(mockDb);
    expect(view?.visitorHash).toBe(expectedHash('anon'));
    expect(view?.visitorHash).not.toBe(expectedHash('viewer'));
    expect(view?.isAuthed).toBe(true);
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
