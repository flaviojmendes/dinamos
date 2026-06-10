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

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };

const session = {
  id: 1,
  code: 'ABC123',
  name: 'Match',
  status: 'lobby',
  seed: 1,
  startsAt: null,
  startedAt: null,
  endsAt: null,
  durationSec: 120,
  startingArchitecture: null,
  lockedNodeIds: [],
  allowDeleteStarting: true,
  loadProfile: { type: 'constant' },
  chaosEvents: [],
  scoringConfig: {},
  budget: null,
  rounds: [{ durationSec: 120, weight: 1 }],
  phase: 'lobby',
  currentRound: 0,
  roundStartedAt: null,
  roundEndsAt: null,
  announcement: null,
  announcementAt: null,
  createdBy: 'admin',
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};
const player = {
  sessionId: 1,
  userId: 'admin',
  architecture: { nodes: [1], edges: [] },
  score: 10,
  scoreBreakdown: null,
  roundScores: {},
  metrics: null,
  joinedAt: new Date('2024-01-01'),
  lastSubmittedAt: null,
};

function asAdmin() {
  repo.getUserContext.mockResolvedValue({ user: { role: 'Admin' }, role: { name: 'Admin' }, permissionCodes: [] });
}

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
});

describe('game admin routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/admin/game')).status).toBe(401);
  });

  it('403 for non-admins', async () => {
    repo.getUserContext.mockResolvedValue({ user: { role: 'Estudante' }, role: { name: 'Estudante' }, permissionCodes: [] });
    expect((await app.request('/api/admin/game', { headers: AUTH })).status).toBe(403);
  });

  it('GET /api/admin/game lists sessions', async () => {
    asAdmin();
    mockDb.setResults([[session]]);
    const res = await app.request('/api/admin/game', { headers: AUTH });
    expect((await res.json() as any).sessions).toHaveLength(1);
  });

  it('POST /api/admin/game creates a match', async () => {
    asAdmin();
    mockDb.setResults([[], [session]]);
    const res = await app.request('/api/admin/game', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ name: 'Match', rounds: [{ durationSec: 60, weight: 2 }] }),
    });
    expect(res.status).toBe(201);
  });

  it('POST /api/admin/game creates a single-round fallback', async () => {
    asAdmin();
    mockDb.setResults([[], [session]]);
    const res = await app.request('/api/admin/game', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ duration_sec: 90 }),
    });
    expect(res.status).toBe(201);
  });

  it('GET /api/admin/game/:code with leaderboard', async () => {
    asAdmin();
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/admin/game/ABC123', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.code).toBe('ABC123');
    expect(body.leaderboard).toHaveLength(1);
  });

  it('GET /api/admin/game/:code 404', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    expect((await app.request('/api/admin/game/NOPE', { headers: AUTH })).status).toBe(404);
  });

  it('PATCH /api/admin/game/:code start_round', async () => {
    asAdmin();
    mockDb.setResults([[session], [{ ...session, phase: 'round', status: 'running', currentRound: 1 }]]);
    const res = await app.request('/api/admin/game/ABC123', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'start_round' }),
    });
    expect(res.status).toBe(200);
  });

  it('PATCH /api/admin/game/:code end action with add_sec', async () => {
    asAdmin();
    mockDb.setResults([[{ ...session, phase: 'round', roundEndsAt: new Date() }], [session]]);
    const res = await app.request('/api/admin/game/ABC123', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'end_round', add_sec: 30, name: 'Renamed', seed: 7, rounds: [{ durationSec: 30, weight: 1 }] }),
    });
    expect(res.status).toBe(200);
  });

  it('POST /api/admin/game/:code/chaos schedules an event', async () => {
    asAdmin();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/admin/game/ABC123/chaos', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ type: 'killNode', targetId: 'n1' }),
    });
    const body = await res.json() as any;
    expect(body.chaos_events).toHaveLength(1);
  });

  it('POST chaos 400 without type/targetId', async () => {
    asAdmin();
    mockDb.setResults([[session]]);
    const res = await app.request('/api/admin/game/ABC123/chaos', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/admin/game/:code/players (spectator)', async () => {
    asAdmin();
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/admin/game/ABC123/players', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.players[0].node_count).toBe(1);
  });

  it('POST /api/admin/game/:code/announce', async () => {
    asAdmin();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/admin/game/ABC123/announce', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ message: 'Hello' }),
    });
    expect((await res.json() as any).announcement).toBe('Hello');
  });

  it('DELETE /api/admin/game/:code/players/:userId', async () => {
    asAdmin();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/admin/game/ABC123/players/u9', { method: 'DELETE', headers: AUTH });
    expect((await res.json() as any).ok).toBe(true);
  });

  it('DELETE /api/admin/game/:code', async () => {
    asAdmin();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/admin/game/ABC123', { method: 'DELETE', headers: AUTH });
    expect((await res.json() as any).ok).toBe(true);
  });
});

describe('game player routes', () => {
  it('GET /api/game/:code returns the control state', async () => {
    mockDb.setResults([[session], [player]]);
    const res = await app.request('/api/game/ABC123', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.code).toBe('ABC123');
    expect(body.joined).toBe(true);
  });

  it('GET /api/game/:code 404', async () => {
    mockDb.setResults([[]]);
    expect((await app.request('/api/game/NOPE', { headers: AUTH })).status).toBe(404);
  });

  it('POST /api/game/:code/join (new player)', async () => {
    mockDb.setResults([[session], [], undefined, [player]]);
    const res = await app.request('/api/game/ABC123/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST /api/game/:code/join 409 when ended', async () => {
    mockDb.setResults([[{ ...session, status: 'ended' }]]);
    const res = await app.request('/api/game/ABC123/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(409);
  });

  it('PUT /api/game/:code/architecture (new player, round submission)', async () => {
    mockDb.setResults([[session], [], undefined]);
    const res = await app.request('/api/game/ABC123/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: { nodes: [], edges: [] }, round_index: 0, round_score: 50, metrics: {}, score_breakdown: {} }),
    });
    expect((await res.json() as any).ok).toBe(true);
  });

  it('PUT /api/game/:code/architecture (existing player, flat score)', async () => {
    mockDb.setResults([[session], [player], undefined]);
    const res = await app.request('/api/game/ABC123/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ score: 42 }),
    });
    expect((await res.json() as any).ok).toBe(true);
  });

  it('GET /api/game/:code/leaderboard', async () => {
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/game/ABC123/leaderboard', { headers: AUTH });
    expect((await res.json() as any).leaderboard).toHaveLength(1);
  });
});
