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

const AUTH = { Authorization: 'Bearer t' };

// computeRankings awaits, in order: bestPerQuiz, totalCorrect, allUsers.
function rankingResults() {
  return [
    [
      { userId: 'u1', quizId: 1, best: 90 },
      { userId: 'u2', quizId: 1, best: 50 },
    ],
    [
      { userId: 'u1', total: 9 },
      { userId: 'u2', total: 5 },
    ],
    [
      { id: 'u1', nickname: 'One', avatarImage: null, tokens: 100, createdAt: new Date('2024-01-01') },
      { id: 'u2', nickname: 'Two', avatarImage: null, tokens: 10, createdAt: new Date('2024-01-02') },
      { id: 'u3', nickname: 'Inactive', avatarImage: null, tokens: 0, createdAt: new Date('2024-01-03') },
    ],
  ];
}

beforeEach(() => mockDb.reset());

describe('leaderboard routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/leaderboard')).status).toBe(401);
  });

  it('GET /api/leaderboard ranks active users and drops inactive ones', async () => {
    mockDb.setResults(rankingResults());
    const res = await app.request('/api/leaderboard?limit=10', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.leaderboard).toHaveLength(2);
    expect(body.leaderboard[0].user_id).toBe('u1');
    expect(body.leaderboard[0].rank).toBe(1);
    expect(body.leaderboard[1].user_id).toBe('u2');
  });

  it('GET /api/leaderboard/me returns the caller rank', async () => {
    mockDb.setResults(rankingResults());
    const res = await app.request('/api/leaderboard/me', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.user_id).toBe('u1');
    expect(body.rank).toBe(1);
  });

  it('GET /api/leaderboard/me returns a placeholder when unranked', async () => {
    // u1 is inactive here -> not in rankings
    mockDb.setResults([
      [],
      [],
      [{ id: 'u1', nickname: 'One', avatarImage: null, tokens: 0, createdAt: null }],
    ]);
    const res = await app.request('/api/leaderboard/me', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.rank).toBeNull();
    expect(body.message).toMatch(/leaderboard/i);
  });
});
