import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

const verifyIdToken = vi.fn();
const getUserContext = vi.fn();

vi.mock('../../lib/firebaseAdmin.js', () => ({
  verifyIdToken: (token: string) => verifyIdToken(token),
}));

vi.mock('../../db/repo.js', () => ({
  getUserContext: (uid: string) => getUserContext(uid),
}));

import {
  authRequired,
  optionalAuth,
  adminRequired,
  hasPermission,
  type AppVariables,
} from '../auth';

function makeApp() {
  const app = new Hono<{ Variables: AppVariables }>();
  app.get('/protected', authRequired, (c) => c.json({ uid: c.get('user').uid }));
  app.get('/maybe', optionalAuth, (c) => c.json({ uid: c.get('user')?.uid ?? null }));
  app.get('/admin', authRequired, adminRequired, (c) => c.json({ ok: true }));
  app.onError((err, c) =>
    c.json({ detail: (err as Error).message }, (err as any).status ?? 500)
  );
  return app;
}

beforeEach(() => {
  verifyIdToken.mockReset();
  getUserContext.mockReset();
});

describe('hasPermission', () => {
  const ctx = { user: {}, role: null, permissionCodes: ['EDIT', 'DELETE'] } as any;
  it('is true when the code is present', () => {
    expect(hasPermission(ctx, 'EDIT')).toBe(true);
  });
  it('is false when the code is absent', () => {
    expect(hasPermission(ctx, 'PUBLISH')).toBe(false);
  });
});

describe('authRequired', () => {
  it('rejects requests without an Authorization header', async () => {
    const res = await makeApp().request('/protected');
    expect(res.status).toBe(401);
    expect(((await res.json()) as { detail: string }).detail).toMatch(/missing/i);
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it('rejects malformed (non-bearer) Authorization headers', async () => {
    const res = await makeApp().request('/protected', {
      headers: { Authorization: 'Basic abc' },
    });
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    verifyIdToken.mockRejectedValueOnce(new Error('bad token'));
    const res = await makeApp().request('/protected', {
      headers: { Authorization: 'Bearer xyz' },
    });
    expect(res.status).toBe(401);
    expect(((await res.json()) as { detail: string }).detail).toMatch(/invalid/i);
  });

  it('passes through with a valid bearer token', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'u1', email: 'a@b.com' });
    const res = await makeApp().request('/protected', {
      headers: { Authorization: 'Bearer good' },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ uid: 'u1' });
  });
});

describe('optionalAuth', () => {
  it('continues anonymously when no token is provided', async () => {
    const res = await makeApp().request('/maybe');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ uid: null });
  });

  it('continues anonymously when the token is invalid (swallows error)', async () => {
    verifyIdToken.mockRejectedValueOnce(new Error('bad'));
    const res = await makeApp().request('/maybe', {
      headers: { Authorization: 'Bearer nope' },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ uid: null });
  });

  it('attaches the user when the token is valid', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'u2', email: 'c@d.com' });
    const res = await makeApp().request('/maybe', {
      headers: { Authorization: 'Bearer good' },
    });
    expect(await res.json()).toEqual({ uid: 'u2' });
  });
});

describe('adminRequired', () => {
  it('returns 403 for a non-admin user', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'u1', email: 'a@b.com' });
    getUserContext.mockResolvedValueOnce({
      user: { role: 'Estudante' },
      role: { name: 'Estudante' },
      permissionCodes: [],
    });
    const res = await makeApp().request('/admin', {
      headers: { Authorization: 'Bearer good' },
    });
    expect(res.status).toBe(403);
  });

  it('allows an Admin user through', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'admin', email: 'a@b.com' });
    getUserContext.mockResolvedValueOnce({
      user: { role: 'Admin' },
      role: { name: 'Admin' },
      permissionCodes: ['*'],
    });
    const res = await makeApp().request('/admin', {
      headers: { Authorization: 'Bearer good' },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
