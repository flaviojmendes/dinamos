import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));

const AUTH = { Authorization: 'Bearer token' } as const;

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

beforeEach(() => {
  mockDb.reset();
});

describe('notifications routes', () => {
  it('401s without an auth header', async () => {
    const res = await app.request('/api/notifications');
    expect(res.status).toBe(401);
  });

  it('GET /api/notifications returns paginated list + counts', async () => {
    mockDb.setResults([
      [{ count: 3 }], // total
      [
        { id: 1, userId: 'u1', title: 'A', body: 'b', isRead: false, createdAt: new Date('2024-01-01') },
      ], // rows
      [{ count: 2 }], // unread count
    ]);
    const res = await app.request('/api/notifications?skip=0&limit=10', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.total).toBe(3);
    expect(body.unread_count).toBe(2);
    expect(body.notifications).toHaveLength(1);
  });

  it('GET supports unread_only filter', async () => {
    mockDb.setResults([[{ count: 0 }], [], [{ count: 0 }]]);
    const res = await app.request('/api/notifications?unread_only=true', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.total).toBe(0);
  });

  it('GET /api/notifications/unread-count', async () => {
    mockDb.setResults([[{ count: 5 }]]);
    const res = await app.request('/api/notifications/unread-count', { headers: AUTH });
    expect(await res.json() as any).toEqual({ unread_count: 5 });
  });

  it('PUT /api/notifications/read-all reports the number updated', async () => {
    mockDb.setResults([[{ id: 1 }, { id: 2 }]]);
    const res = await app.request('/api/notifications/read-all', { method: 'PUT', headers: AUTH });
    const body = await res.json() as any;
    expect(body.count).toBe(2);
  });

  it('PUT /api/notifications/:id/read returns the updated row', async () => {
    mockDb.setResults([[{ id: 7, userId: 'u1', title: 'T', isRead: true, createdAt: new Date('2024-01-01') }]]);
    const res = await app.request('/api/notifications/7/read', { method: 'PUT', headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.id).toBe(7);
  });

  it('PUT /api/notifications/:id/read 404s when missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/notifications/99/read', { method: 'PUT', headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/notifications/:id removes it', async () => {
    mockDb.setResults([[{ id: 3 }]]);
    const res = await app.request('/api/notifications/3', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/notifications/:id 404s when missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/notifications/3', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(404);
  });
});
