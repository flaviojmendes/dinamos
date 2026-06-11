import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = { getUserContext: vi.fn() };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const announcement = {
  id: 7,
  titleEn: 'New content',
  titlePt: 'Novo conteúdo',
  bodyEn: 'Body **EN**',
  bodyPt: 'Corpo **PT**',
  published: true,
  publishedAt: new Date('2024-03-01'),
  createdAt: new Date('2024-03-01'),
  updatedAt: null,
};

function asAdmin() {
  repo.getUserContext.mockResolvedValue({ user: { role: 'Admin' }, role: { name: 'Admin' }, permissionCodes: [] });
}

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
});

describe('announcements (public)', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/announcements/active')).status).toBe(401);
  });

  it('returns the active announcement in the requested language', async () => {
    // 1) acked ids query → none acked, 2) latest published announcement
    mockDb.setResults([[], [announcement]]);
    const res = await app.request('/api/announcements/active?lang=pt', { headers: AUTH });
    const body = (await res.json()) as any;
    expect(body.announcement.id).toBe(7);
    expect(body.announcement.title).toBe('Novo conteúdo');
    expect(body.announcement.body).toBe('Corpo **PT**');
  });

  it('falls back to the other language when one body is empty', async () => {
    mockDb.setResults([[], [{ ...announcement, bodyPt: '   ' }]]);
    const res = await app.request('/api/announcements/active?lang=pt', { headers: AUTH });
    const body = (await res.json()) as any;
    expect(body.announcement.body).toBe('Body **EN**');
  });

  it('returns null when nothing is published/unacked', async () => {
    mockDb.setResults([[{ announcementId: 1 }], []]);
    const res = await app.request('/api/announcements/active', { headers: AUTH });
    expect((await res.json() as any).announcement).toBeNull();
  });

  it('returns null when the active row has no renderable body', async () => {
    mockDb.setResults([[], [{ ...announcement, bodyEn: '', bodyPt: '' }]]);
    const res = await app.request('/api/announcements/active', { headers: AUTH });
    expect((await res.json() as any).announcement).toBeNull();
  });

  it('POST /:id/ack records the acknowledgement', async () => {
    // 1) existence check, 2) insert ... onConflictDoNothing
    mockDb.setResults([[{ id: 7 }], undefined]);
    const res = await app.request('/api/announcements/7/ack', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST /:id/ack 404 for an unknown announcement', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/announcements/999/ack', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(404);
  });
});

describe('announcements (admin)', () => {
  it('403 for non-admins', async () => {
    repo.getUserContext.mockResolvedValue({ user: { role: 'Estudante' }, role: { name: 'Estudante' }, permissionCodes: [] });
    const res = await app.request('/api/admin/announcements', { headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('GET lists all announcements', async () => {
    asAdmin();
    mockDb.setResults([[announcement]]);
    const res = await app.request('/api/admin/announcements', { headers: AUTH });
    expect((await res.json() as any).announcements).toHaveLength(1);
  });

  it('POST creates an announcement and stamps published_at when published', async () => {
    asAdmin();
    mockDb.setResults([[{ ...announcement }]]);
    const res = await app.request('/api/admin/announcements', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ title_pt: 'Novo', body_pt: 'Olá', published: true }),
    });
    expect(res.status).toBe(201);
    const values = mockDb.calls.find((c) => c.op === 'values')?.args[0] as any;
    expect(values.published).toBe(true);
    expect(values.publishedAt).toBeInstanceOf(Date);
  });

  it('PUT updates an announcement', async () => {
    asAdmin();
    // 1) current row, 2) returning() updated row
    mockDb.setResults([[announcement], [{ ...announcement, titlePt: 'Editado' }]]);
    const res = await app.request('/api/admin/announcements/7', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ title_pt: 'Editado' }),
    });
    expect(res.status).toBe(200);
    expect((await res.json() as any).title_pt).toBe('Editado');
  });

  it('DELETE removes an announcement', async () => {
    asAdmin();
    mockDb.setResults([[announcement]]);
    const res = await app.request('/api/admin/announcements/7', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST /:id/reset-acks clears acknowledgements', async () => {
    asAdmin();
    // 1) existence check, 2) delete ... returning()
    mockDb.setResults([[{ id: 7 }], [{ id: 1 }, { id: 2 }]]);
    const res = await app.request('/api/admin/announcements/7/reset-acks', { method: 'POST', headers: AUTH });
    const body = (await res.json()) as any;
    expect(body.cleared).toBe(2);
  });
});
