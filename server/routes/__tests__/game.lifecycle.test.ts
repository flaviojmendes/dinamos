import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = { getUserContext: vi.fn() };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'host', email: 'host@example.com' })),
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

function lobbySession() {
  const now = Date.now();
  return {
    id: 1,
    code: 'LIFE1',
    name: 'Lifecycle',
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
    rounds: [{ intervalSec: 30, durationSec: 40, weight: 1, loadProfile: { type: 'constant' }, chaosEvents: [], scoringConfig: {} }],
    phase: 'lobby',
    currentRound: 0,
    roundStartedAt: null,
    roundEndsAt: null,
    intervalStartedAt: null,
    intervalEndsAt: null,
    pausedAt: null,
    totalPausedMs: 0,
    autoTransitions: true,
    lifecycleVersion: 0,
    roundSnapshots: null,
    kickedUserIds: [],
    maxPlayers: 32,
    stageTokenHash: null,
    stageTokenExpiresAt: null,
    announcement: null,
    announcementAt: null,
    joinOpen: true,
    listed: true,
    joinKey: 'secret',
    createdBy: 'host',
    createdAt: new Date(now),
    updatedAt: null,
  };
}

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockResolvedValue({
    user: { role: 'Estudante' },
    role: { name: 'Estudante' },
    permissionCodes: [],
  });
});

describe('Arena lifecycle route contract', () => {
  it('blocks direct round start from lobby (requires build interval first)', async () => {
    mockDb.setResults([[lobbySession()]]);
    const res = await app.request('/api/games/host/LIFE1', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'start_round' }),
    });
    expect(res.status).toBe(400);
  });

  it('starts the first build interval from lobby via open_interval', async () => {
    const session = lobbySession();
    const now = Date.now();
    mockDb.setResults([
      [session],
      [{ ...session, phase: 'interval', status: 'paused', currentRound: 1, intervalStartedAt: new Date(now), intervalEndsAt: new Date(now + 30_000), lifecycleVersion: 1 }],
      [session],
    ]);
    const res = await app.request('/api/games/host/LIFE1', {
      method: 'PATCH',
      headers: AUTH,
      body: JSON.stringify({ action: 'open_interval' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { phase: string; current_round: number };
    expect(body.phase).toBe('interval');
    expect(body.current_round).toBe(1);
  });

  it('poll sync exposes truthful lifecycle timer fields', async () => {
    const now = Date.now();
    const session = {
      ...lobbySession(),
      phase: 'interval',
      status: 'paused',
      currentRound: 1,
      intervalStartedAt: new Date(now - 5_000),
      intervalEndsAt: new Date(now + 25_000),
      lifecycleVersion: 1,
    };
    mockDb.setResults([[session], []]);
    const res = await app.request('/api/game/LIFE1', { headers: AUTH });
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.interval_ends_at).toBeTruthy();
    expect(body.seconds_until_deadline).toBeTypeOf('number');
    expect(body.lifecycle_version).toBe(1);
  });
});
