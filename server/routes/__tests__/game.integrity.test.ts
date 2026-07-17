import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';
import type { GameArchitecture } from '../../../src/components/SystemEditor/game/types';
import { DEFAULT_SCORING } from '../../lib/game/rounds';

const golden = JSON.parse(
  readFileSync(
    resolve(
      import.meta.dirname,
      '../../../src/components/SystemEditor/engine/__fixtures__/golden/three-tier-constant-30s.json',
    ),
    'utf8',
  ),
) as { architecture: GameArchitecture };

const mockDb = createDbMock();
const repo = { getUserContext: vi.fn() };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'player-a', email: 'a@example.com' })),
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

const compliantArch = golden.architecture;

function liveRoundSession(overrides: Record<string, unknown> = {}) {
  const now = Date.now();
  return {
    id: 1,
    code: 'ARENA1',
    name: 'Arena',
    status: 'running',
    seed: 42,
    startsAt: null,
    startedAt: new Date(now - 120_000),
    endsAt: null,
    durationSec: 120,
    startingArchitecture: null,
    lockedNodeIds: [],
    allowDeleteStarting: true,
    loadProfile: { type: 'constant' },
    chaosEvents: [],
    scoringConfig: {},
    budget: null,
    rounds: [
      {
        intervalSec: 60,
        durationSec: 120,
        weight: 1,
        loadProfile: { type: 'constant' },
        chaosEvents: [],
        scoringConfig: DEFAULT_SCORING,
      },
    ],
    phase: 'round',
    currentRound: 1,
    roundStartedAt: new Date(now - 5_000),
    roundEndsAt: new Date(now + 115_000),
    intervalStartedAt: null,
    intervalEndsAt: null,
    pausedAt: null,
    totalPausedMs: 0,
    autoTransitions: true,
    lifecycleVersion: 2,
    roundSnapshots: {
      '0': {
        roundIndex: 0,
        capturedAt: new Date(now - 5_000).toISOString(),
        loadProfile: { type: 'constant' },
        chaosEvents: [],
        scoringConfig: DEFAULT_SCORING,
        weight: 1,
        durationSec: 120,
        intervalSec: 60,
      },
    },
    kickedUserIds: [],
    maxPlayers: 32,
    stageTokenHash: null,
    stageTokenExpiresAt: null,
    announcement: null,
    announcementAt: null,
    joinOpen: true,
    listed: true,
    joinKey: null,
    createdBy: 'host',
    createdAt: new Date(now - 300_000),
    updatedAt: null,
    ...overrides,
  };
}

function livePlayer(overrides: Record<string, unknown> = {}) {
  const now = Date.now();
  return {
    sessionId: 1,
    userId: 'player-a',
    architecture: compliantArch,
    score: 0,
    scoreBreakdown: null,
    roundScores: {},
    verifiedRoundScores: {},
    roundArchSnapshots: {
      '0': {
        roundIndex: 0,
        capturedAt: new Date(now - 5_000).toISOString(),
        architecture: compliantArch,
        origin: 'round_start',
      },
    },
    eligibleFromSec: 0,
    metrics: null,
    joinedAt: new Date(now - 60_000),
    lastSubmittedAt: null,
    ...overrides,
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

describe('Arena integrity adversarial contract', () => {
  it('rejects forged round_score higher than server recomputation', async () => {
    mockDb.setResults([[liveRoundSession()], [livePlayer()], undefined]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({
        round_index: 0,
        round_score: 999_999,
      }),
    });
    expect(res.status).toBe(403);
  });

  it('rejects score-only submissions without a stored round architecture', async () => {
    mockDb.setResults([
      [liveRoundSession()],
      [livePlayer({ roundArchSnapshots: {} })],
      undefined,
    ]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ round_index: 0, round_score: 100 }),
    });
    expect(res.status).toBe(403);
  });

  it('rejects private-match join without invite key for new players', async () => {
    mockDb.setResults([[{ ...liveRoundSession({ phase: 'lobby', joinOpen: false, joinKey: 'secret' }) }], []]);
    const res = await app.request('/api/game/ARENA1/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('rejects architecture writes after match end', async () => {
    mockDb.setResults([
      [{ ...liveRoundSession({ phase: 'ended', status: 'ended' }) }],
      [livePlayer()],
      undefined,
    ]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: compliantArch, round_index: 0, round_score: 1 }),
    });
    expect(res.status).toBe(409);
  });

  it('rejects score writes outside an active round phase', async () => {
    mockDb.setResults([[{ ...liveRoundSession({ phase: 'interval', status: 'paused' }) }], [livePlayer()], undefined]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ round_index: 0, round_score: 50 }),
    });
    expect(res.status).toBe(409);
  });

  it('rejects out-of-range round_index', async () => {
    mockDb.setResults([[liveRoundSession()], [livePlayer()], undefined]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ round_index: 99, round_score: 1 }),
    });
    expect(res.status).toBe(400);
  });

  it('rejects architecture mutation during a live round', async () => {
    mockDb.setResults([[liveRoundSession()], [livePlayer()], undefined]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({
        architecture: {
          nodes: [{ id: 'n', position: { x: 0, y: 0 }, config: { id: 'n', kind: 'server' } }],
          edges: [],
        },
        round_index: 0,
        round_score: 10,
      }),
    });
    expect(res.status).toBe(409);
  });

  it('rejects removal of locked seed nodes during build interval', async () => {
    mockDb.setResults([
      [{ ...liveRoundSession({ phase: 'interval', status: 'paused', lockedNodeIds: ['db'] }) }],
      [livePlayer()],
      undefined,
    ]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: { nodes: [], edges: [] } }),
    });
    expect(res.status).toBe(409);
  });

  it('redacts live architectures from public spectator payloads', async () => {
    mockDb.setResults([
      [liveRoundSession()],
      [livePlayer()],
      [{ id: 'player-a', nickname: 'A', avatarImage: null }],
    ]);
    const res = await app.request('/api/game/ARENA1/spectate', { headers: AUTH });
    const body = (await res.json()) as { players: { architecture: unknown }[] };
    expect(body.players[0].architecture).toBeUndefined();
  });

  it('enforces max_players capacity on join', async () => {
    mockDb.setResults([
      [{ ...liveRoundSession({ phase: 'lobby', maxPlayers: 1 }) }],
      [],
      [{ sessionId: 1, userId: 'other' }],
    ]);
    const res = await app.request('/api/game/ARENA1/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(409);
  });

  it('blocks rejoin for kicked users', async () => {
    mockDb.setResults([[{ ...liveRoundSession({ phase: 'lobby', kickedUserIds: ['player-a'] }) }], []]);
    const res = await app.request('/api/game/ARENA1/join', { method: 'POST', headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('requires join before architecture submission', async () => {
    mockDb.setResults([[liveRoundSession({ phase: 'interval', status: 'paused' })], []]);
    const res = await app.request('/api/game/ARENA1/architecture', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ architecture: compliantArch }),
    });
    expect(res.status).toBe(403);
  });
});
