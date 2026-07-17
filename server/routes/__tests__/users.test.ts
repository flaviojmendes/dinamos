import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = {
  getUserRow: vi.fn(),
  createUser: vi.fn(),
  ensureUser: vi.fn(),
  getUserContext: vi.fn(),
};

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

const userRow = {
  id: 'u1',
  email: 'u1@example.com',
  nickname: 'Uno',
  role: null,
  roleId: 2,
  avatarImage: null,
  githubUsername: null,
  tokens: 5,
  onboardingCompleted: false,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: null,
};
const ctx = { user: userRow, role: null, permissionCodes: ['X'] };

beforeEach(() => {
  mockDb.reset();
  repo.getUserRow.mockReset();
  repo.createUser.mockReset();
  repo.ensureUser.mockReset();
  repo.getUserContext.mockReset();
  repo.getUserContext.mockResolvedValue(ctx);
});

describe('users routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/users/me')).status).toBe(401);
  });

  it('GET /api/users/me returns existing user', async () => {
    repo.getUserRow.mockResolvedValue(userRow);
    const res = await app.request('/api/users/me', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.id).toBe('u1');
    expect(repo.ensureUser).not.toHaveBeenCalled();
  });

  it('GET /api/users/me creates the user on first sign-in', async () => {
    repo.getUserRow.mockResolvedValue(null);
    const res = await app.request('/api/users/me', { headers: AUTH });
    expect(res.status).toBe(200);
    expect(repo.ensureUser).toHaveBeenCalled();
  });

  it('PUT onboarding-complete updates the row', async () => {
    repo.getUserRow.mockResolvedValue(userRow);
    const res = await app.request('/api/users/me/onboarding-complete', {
      method: 'PUT',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    expect(mockDb.calls.some((c) => c.op === 'update')).toBe(true);
  });

  it('PUT onboarding-complete 404 when user missing', async () => {
    repo.getUserRow.mockResolvedValue(null);
    const res = await app.request('/api/users/me/onboarding-complete', {
      method: 'PUT',
      headers: AUTH,
    });
    expect(res.status).toBe(404);
  });

  it('PUT /api/users/me applies provided fields', async () => {
    repo.getUserRow.mockResolvedValue({ ...userRow, email: '' });
    const res = await app.request('/api/users/me', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ nickname: 'New', avatar_image: 'img', github_username: 'gh', email: 'set@x.com' }),
    });
    expect(res.status).toBe(200);
    expect(mockDb.calls.some((c) => c.op === 'update')).toBe(true);
  });

  it('PUT /api/users/me creates the user when missing then updates nothing', async () => {
    repo.getUserRow.mockResolvedValue(null);
    repo.ensureUser.mockResolvedValue(userRow);
    const res = await app.request('/api/users/me', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    expect(repo.ensureUser).toHaveBeenCalled();
  });

  it('GET /api/user/solutions lists serialized solutions', async () => {
    mockDb.setResults([
      [{ id: 1, challengeId: 'c1', userId: 'u1', diagramData: null, feedback: null, createdAt: null, updatedAt: null }],
    ]);
    const res = await app.request('/api/user/solutions', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.solutions).toHaveLength(1);
  });

  it('GET /api/user/solutions/:id returns the owner solution', async () => {
    mockDb.setResults([[{ id: 9, challengeId: 'c1', userId: 'u1', createdAt: null, updatedAt: null }]]);
    const res = await app.request('/api/user/solutions/9', { headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('GET /api/user/solutions/:id 404 when not found', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/user/solutions/9', { headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('GET /api/user/solutions/:id 403 for another owner', async () => {
    mockDb.setResults([[{ id: 9, challengeId: 'c1', userId: 'someone-else', createdAt: null, updatedAt: null }]]);
    const res = await app.request('/api/user/solutions/9', { headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('GET /api/user/scores aggregates best scores', async () => {
    mockDb.setResults([[{ challenge_id: 'c1', best_score: 80 }]]);
    const res = await app.request('/api/user/scores', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.scores[0].best_score).toBe(80);
  });
});
