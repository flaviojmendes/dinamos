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

function asStudent() {
  repo.getUserContext.mockResolvedValue({ user: { role: 'Estudante' }, role: { name: 'Estudante' }, permissionCodes: [] });
}

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
});

describe('game host routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/games/host')).status).toBe(401);
  });

  it('GET /api/games/host lists sessions for a regular user', async () => {
    asStudent();
    mockDb.setResults([[session]]);
    const res = await app.request('/api/games/host', { headers: AUTH });
    expect(res.status).toBe(200);
    expect((await res.json() as any).sessions).toHaveLength(1);
  });

  it('GET /api/games/host lists all sessions for admins', async () => {
    asAdmin();
    mockDb.setResults([[session]]);
    const res = await app.request('/api/games/host', { headers: AUTH });
    expect((await res.json() as any).sessions).toHaveLength(1);
  });

  it('POST /api/games/host creates a match for a regular user', async () => {
    asStudent();
    mockDb.setResults([[], [session]]);
    const res = await app.request('/api/games/host', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ name: 'Match', rounds: [{ durationSec: 60, weight: 2 }] }),
    });
    expect(res.status).toBe(201);
  });

  it('POST /api/games/host creates a single-round fallback', async () => {
    asStudent();
    mockDb.setResults([[], [session]]);
    const res = await app.request('/api/games/host', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ duration_sec: 90 }),
    });
    expect(res.status).toBe(201);
  });

  it('GET /api/games/host/:code with leaderboard (creator)', async () => {
    asStudent();
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/games/host/ABC123', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.code).toBe('ABC123');
    expect(body.leaderboard).toHaveLength(1);
  });

  it('GET /api/games/host/:code 403 for a non-creator non-admin', async () => {
    asStudent();
    mockDb.setResults([[{ ...session, createdBy: 'someone-else' }]]);
    const res = await app.request('/api/games/host/ABC123', { headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('GET /api/games/host/:code allowed for non-creator admin', async () => {
    asAdmin();
    mockDb.setResults([[{ ...session, createdBy: 'someone-else' }], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/games/host/ABC123', { headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('GET /api/games/host/:code 404', async () => {
    asStudent();
    mockDb.setResults([[]]);
    expect((await app.request('/api/games/host/NOPE', { headers: AUTH })).status).toBe(404);
  });

  it('PATCH /api/games/host/:code start_round', async () => {
    asStudent();
    mockDb.setResults([[session], [{ ...session, phase: 'round', status: 'running', currentRound: 1 }]]);
    const res = await app.request('/api/games/host/ABC123', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'start_round' }),
    });
    expect(res.status).toBe(200);
  });

  it('PATCH /api/games/host/:code end action with add_sec', async () => {
    asStudent();
    mockDb.setResults([[{ ...session, phase: 'round', roundEndsAt: new Date() }], [session]]);
    const res = await app.request('/api/games/host/ABC123', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'end_round', add_sec: 30, name: 'Renamed', seed: 7, rounds: [{ durationSec: 30, weight: 1 }] }),
    });
    expect(res.status).toBe(200);
  });

  it('PATCH /api/games/host/:code 403 for a non-creator non-admin', async () => {
    asStudent();
    mockDb.setResults([[{ ...session, createdBy: 'someone-else' }]]);
    const res = await app.request('/api/games/host/ABC123', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'start_round' }),
    });
    expect(res.status).toBe(403);
  });

  it('POST /api/games/host/:code/chaos schedules an event', async () => {
    asStudent();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/games/host/ABC123/chaos', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ type: 'killNode', targetId: 'n1' }),
    });
    const body = await res.json() as any;
    expect(body.chaos_events).toHaveLength(1);
  });

  it('POST chaos 400 without type/targetId', async () => {
    asStudent();
    mockDb.setResults([[session]]);
    const res = await app.request('/api/games/host/ABC123/chaos', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/games/host/:code/players (spectator)', async () => {
    asStudent();
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/games/host/ABC123/players', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.players[0].node_count).toBe(1);
  });

  it('POST /api/games/host/:code/announce', async () => {
    asStudent();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/games/host/ABC123/announce', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ message: 'Hello' }),
    });
    expect((await res.json() as any).announcement).toBe('Hello');
  });

  it('DELETE /api/games/host/:code/players/:userId', async () => {
    asStudent();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/games/host/ABC123/players/u9', { method: 'DELETE', headers: AUTH });
    expect((await res.json() as any).ok).toBe(true);
  });

  it('DELETE /api/games/host/:code', async () => {
    asStudent();
    mockDb.setResults([[session], undefined]);
    const res = await app.request('/api/games/host/ABC123', { method: 'DELETE', headers: AUTH });
    expect((await res.json() as any).ok).toBe(true);
  });
});

describe('public game discovery', () => {
  it('GET /api/games/live works without auth', async () => {
    mockDb.setResults([[session], [{ sessionId: 1 }, { sessionId: 1 }]]);
    const res = await app.request('/api/games/live');
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.matches).toHaveLength(1);
    expect(body.matches[0].code).toBe('ABC123');
    expect(body.matches[0].player_count).toBe(2);
    // Only non-sensitive metadata is exposed.
    expect(body.matches[0].starting_architecture).toBeUndefined();
    expect(body.matches[0].created_by).toBeUndefined();
    expect(body.matches[0].join_key).toBeUndefined();
    // Join policy is exposed so the arena can hide the Join button.
    expect(body.matches[0].join_open).toBe(true);
  });

  it('GET /api/games/live returns empty list when nothing is live', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/games/live');
    expect((await res.json() as any).matches).toHaveLength(0);
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

  const privateSession = {
    ...session,
    joinOpen: false,
    joinKey: 'secretkey1234567',
    createdBy: 'someone-else',
  };

  it('POST /api/game/:code/join 403 on private match without key', async () => {
    mockDb.setResults([[privateSession], []]);
    const res = await app.request('/api/game/ABC123/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('POST /api/game/:code/join 403 on private match with wrong key', async () => {
    mockDb.setResults([[privateSession], []]);
    const res = await app.request('/api/game/ABC123/join', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ key: 'wrong' }),
    });
    expect(res.status).toBe(403);
  });

  it('POST /api/game/:code/join joins a private match with the invite key', async () => {
    mockDb.setResults([[privateSession], [], undefined, [player]]);
    const res = await app.request('/api/game/ABC123/join', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ key: 'secretkey1234567' }),
    });
    expect(res.status).toBe(200);
  });

  it('POST /api/game/:code/join lets an existing player rejoin a private match without the key', async () => {
    mockDb.setResults([[privateSession], [player], [player]]);
    const res = await app.request('/api/game/ABC123/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST /api/game/:code/join lets the host join their private match without the key', async () => {
    mockDb.setResults([[{ ...privateSession, createdBy: 'admin' }], [], undefined, [player]]);
    const res = await app.request('/api/game/ABC123/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(200);
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

  // House-rules guard: a tampered client submitting a rule-breaking topology
  // (here: client wired straight into a cache, no database/server) must not be
  // able to raise its recorded score.
  const compliantArch = {
    nodes: [
      { id: 'c', position: { x: 0, y: 0 }, config: { id: 'c', kind: 'client' } },
      { id: 's', position: { x: 0, y: 0 }, config: { id: 's', kind: 'server' } },
      { id: 'db', position: { x: 0, y: 0 }, config: { id: 'db', kind: 'database' } },
    ],
    edges: [
      { id: 'e1', source: 'c', target: 's' },
      { id: 'e2', source: 's', target: 'db' },
    ],
  };
  const cacheOnlyArch = {
    nodes: [
      { id: 'c', position: { x: 0, y: 0 }, config: { id: 'c', kind: 'client' } },
      { id: 'cache', position: { x: 0, y: 0 }, config: { id: 'cache', kind: 'cache' } },
    ],
    edges: [{ id: 'e1', source: 'c', target: 'cache' }],
  };
  const playerWithRound = { ...player, roundScores: { '0': { score: 100 } } };

  it('PUT architecture clamps round score gains when the architecture breaks the rules', async () => {
    mockDb.setResults([[session], [playerWithRound], undefined]);
    const res = await app.request('/api/game/ABC123/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: cacheOnlyArch, round_index: 0, round_score: 500 }),
    });
    expect((await res.json() as any).ok).toBe(true);
    const set = mockDb.calls.find((c) => c.op === 'set');
    const updates = set?.args[0] as any;
    expect(updates.roundScores['0'].score).toBe(100);
  });

  it('PUT architecture accepts round score gains when the architecture is compliant', async () => {
    mockDb.setResults([[session], [playerWithRound], undefined]);
    const res = await app.request('/api/game/ABC123/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: compliantArch, round_index: 0, round_score: 500 }),
    });
    expect((await res.json() as any).ok).toBe(true);
    const set = mockDb.calls.find((c) => c.op === 'set');
    const updates = set?.args[0] as any;
    expect(updates.roundScores['0'].score).toBe(500);
  });

  it('PUT architecture clamps flat score gains when non-compliant', async () => {
    mockDb.setResults([[session], [player], undefined]);
    const res = await app.request('/api/game/ABC123/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: cacheOnlyArch, score: 9999 }),
    });
    expect((await res.json() as any).ok).toBe(true);
    const set = mockDb.calls.find((c) => c.op === 'set');
    const updates = set?.args[0] as any;
    expect(updates.score).toBe(player.score);
  });

  it('GET /api/game/:code/leaderboard', async () => {
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/game/ABC123/leaderboard', { headers: AUTH });
    expect((await res.json() as any).leaderboard).toHaveLength(1);
  });

  it('GET /api/game/:code/spectate returns the audience stage state', async () => {
    mockDb.setResults([[session], [player], [{ id: 'admin', nickname: 'A', avatarImage: null }]]);
    const res = await app.request('/api/game/ABC123/spectate', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.code).toBe('ABC123');
    expect(body.total_rounds).toBe(1);
    expect(body.rounds_public).toHaveLength(1);
    expect(body.players).toHaveLength(1);
    expect(body.players[0].rank).toBe(1);
    expect(body.players[0].node_count).toBe(1);
  });

  it('GET /api/game/:code/spectate requires auth', async () => {
    expect((await app.request('/api/game/ABC123/spectate')).status).toBe(401);
  });

  it('GET /api/game/:code/spectate 404', async () => {
    mockDb.setResults([[]]);
    expect((await app.request('/api/game/NOPE/spectate', { headers: AUTH })).status).toBe(404);
  });
});
