import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();

vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));
vi.mock('../../lib/rateLimitStore.js', () => ({
  incrementRateLimitBucket: vi.fn(async () => ({ allowed: true, count: 1 })),
  resetMemoryRateLimitBuckets: vi.fn(),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };

import { defaultsForKind } from '../../../src/components/SystemEditor/engine/types';

const validDesign = {
  version: '2.0',
  seed: 1,
  profileType: 'constant',
  chaos: [],
  nodes: [
    {
      id: 'c1',
      position: { x: 0, y: 0 },
      config: defaultsForKind('client', 'c1', 'Client'),
    },
  ],
  edges: [],
};

const savedRow = {
  id: '11111111-1111-1111-1111-111111111111',
  userId: 'u1',
  title: 'Mine',
  visibility: 'private',
  design: validDesign,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
};

beforeEach(() => mockDb.reset());

describe('architectures routes', () => {
  it('401 without token on list', async () => {
    expect((await app.request('/api/architectures')).status).toBe(401);
  });

  it('GET /api/architectures lists owner rows', async () => {
    mockDb.setResults([[{ ...savedRow, design: undefined }]]);
    const res = await app.request('/api/architectures', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { architectures: { id: string }[] };
    expect(body.architectures[0].id).toBe(savedRow.id);
  });

  it('POST /api/architectures rejects invalid design payloads', async () => {
    const res = await app.request('/api/architectures', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ design: { nodes: 'bad', edges: [] } }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/architectures creates a validated design', async () => {
    mockDb.setResults([[savedRow]]);
    const res = await app.request('/api/architectures', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ title: 'Mine', visibility: 'private', design: validDesign }),
    });
    expect(res.status).toBe(201);
  });

  it('GET /api/architectures/:id hides private rows from strangers', async () => {
    mockDb.setResults([[savedRow]]);
    const res = await app.request(`/api/architectures/${savedRow.id}`);
    expect(res.status).toBe(404);
  });

  it('GET /api/architectures/:id allows unlisted reads', async () => {
    mockDb.setResults([[{ ...savedRow, visibility: 'unlisted' }]]);
    const res = await app.request(`/api/architectures/${savedRow.id}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/architectures/:id allows owner reads on private rows', async () => {
    mockDb.setResults([[savedRow]]);
    const res = await app.request(`/api/architectures/${savedRow.id}`, { headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('PUT /api/architectures/:id 403 for non-owner', async () => {
    mockDb.setResults([[{ ...savedRow, userId: 'other' }]]);
    const res = await app.request(`/api/architectures/${savedRow.id}`, {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ title: 'Nope' }),
    });
    expect(res.status).toBe(403);
  });

  it('PUT /api/architectures/:id updates visibility for owner', async () => {
    mockDb.setResults([
      [savedRow],
      [{ ...savedRow, visibility: 'public' }],
    ]);
    const res = await app.request(`/api/architectures/${savedRow.id}`, {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ visibility: 'public' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { visibility: string };
    expect(body.visibility).toBe('public');
  });

  it('DELETE /api/architectures/:id 404 when not owner', async () => {
    mockDb.setResults([[]]);
    const res = await app.request(`/api/architectures/${savedRow.id}`, {
      method: 'DELETE',
      headers: AUTH,
    });
    expect(res.status).toBe(404);
  });
});
