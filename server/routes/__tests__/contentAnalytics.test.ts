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

const AUTH = { Authorization: 'Bearer t' };

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
});

describe('content analytics route', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/admin/content-analytics')).status).toBe(401);
  });

  it('403 for non-admins', async () => {
    repo.getUserContext.mockResolvedValue({
      user: { role: 'Estudante' },
      role: { name: 'Estudante' },
      permissionCodes: [],
    });
    const res = await app.request('/api/admin/content-analytics', { headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('returns the anonymized analytics payload for admins', async () => {
    repo.getUserContext.mockResolvedValue({
      user: { role: 'Admin' },
      role: { name: 'Admin' },
      permissionCodes: [],
    });
    mockDb.setResults([
      [{ key: 'mod1', label: 'Module 1', tier: 1, orderIndex: 0 }], // moduleRows
      [{ moduleId: 'mod1', total: 5 }], // lessonsByModule
      [{ moduleId: 'mod1', views: 10, uniqueVisitors: 4 }], // viewsByModule
      [{ path: '/p', titlePt: 'Pagina', titleEn: 'Page', moduleId: 'mod1', views: 7, uniqueVisitors: 3 }], // viewsByPage
      [{ totalViews: 17, uniqueVisitors: 6 }], // viewTotals
      [{ moduleId: 'mod1', completions: 8, distinctUsers: 2 }], // progByModule
      [{ totalCompletions: 8, distinctPages: 3, distinctUsers: 2 }], // readTotals
      [{ path: '/p', titlePt: 'Pagina', titleEn: 'Page', moduleId: 'mod1', completions: 4 }], // readByPage
      [{ d: new Date().toISOString().slice(0, 10), c: 4 }], // readByDay
    ]);
    const res = await app.request('/api/admin/content-analytics?days=7', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.range_days).toBe(7);
    expect(body.views.total).toBe(17);
    expect(body.progress.modules[0].moduleId).toBe('mod1');
    expect(body.marked_as_read.total_completions).toBe(8);
    expect(body.marked_as_read.timeline).toHaveLength(7);
  });
});
