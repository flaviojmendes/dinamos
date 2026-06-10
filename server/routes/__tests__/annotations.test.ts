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
const annotation = {
  id: 1,
  slug: 'intro',
  path: '/p',
  kind: 'text',
  body: 'note',
  drawing: null,
  anchor: null,
  color: '#fff',
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};

beforeEach(() => mockDb.reset());

describe('annotations routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/annotations')).status).toBe(401);
  });

  it('GET lists annotations, optionally filtered by slug', async () => {
    mockDb.setResults([[annotation]]);
    const res = await app.request('/api/annotations?slug=intro', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.annotations[0].slug).toBe('intro');
  });

  it('POST creates a text annotation', async () => {
    mockDb.setResults([[annotation]]);
    const res = await app.request('/api/annotations', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ slug: 'intro', body: 'hello' }),
    });
    expect(res.status).toBe(201);
  });

  it('POST 400 without slug', async () => {
    const res = await app.request('/api/annotations', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ body: 'x' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST 400 without text or drawing', async () => {
    const res = await app.request('/api/annotations', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ slug: 'intro' }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT updates an annotation', async () => {
    mockDb.setResults([[{ ...annotation, body: 'updated' }]]);
    const res = await app.request('/api/annotations/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ body: 'updated', kind: 'drawing', color: '#000', anchor: null, drawing: { x: 1 } }),
    });
    const body = await res.json() as any;
    expect(body.body).toBe('updated');
  });

  it('PUT 404 when not found', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/annotations/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ body: 'x' }),
    });
    expect(res.status).toBe(404);
  });

  it('DELETE removes an annotation', async () => {
    mockDb.setResults([[{ id: 1 }]]);
    const res = await app.request('/api/annotations/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('DELETE 404 when not found', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/annotations/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(404);
  });
});
