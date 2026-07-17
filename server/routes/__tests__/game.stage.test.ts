import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';
import { hashStageToken } from '../../lib/game/crypto.js';
import { stageTokenExpiresAt } from '../../lib/game/stageToken.js';

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
const STAGE_TOKEN = 'public-stage-token-value';
const STAGE_HASH = hashStageToken(STAGE_TOKEN);

const baseSession = {
  id: 1,
  code: 'STAGE1',
  name: 'Stage match',
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
  rounds: [{ durationSec: 120, weight: 1, intervalSec: 60, loadProfile: { type: 'constant' }, chaosEvents: [], scoringConfig: {} }],
  phase: 'lobby',
  currentRound: 0,
  roundStartedAt: null,
  roundEndsAt: null,
  announcement: null,
  announcementAt: null,
  joinOpen: true,
  listed: true,
  joinKey: 'abc',
  maxPlayers: 32,
  kickedUserIds: [],
  stageTokenHash: STAGE_HASH,
  stageTokenExpiresAt: stageTokenExpiresAt(),
  intervalStartedAt: null,
  intervalEndsAt: null,
  pausedAt: null,
  totalPausedMs: 0,
  autoTransitions: true,
  lifecycleVersion: 0,
  createdBy: 'admin',
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};

const player = {
  sessionId: 1,
  userId: 'player-a',
  architecture: { nodes: [{ id: 'n1' }], edges: [] },
  score: 10,
  scoreBreakdown: null,
  roundScores: {},
  metrics: null,
  joinedAt: new Date('2024-01-01'),
  lastSubmittedAt: null,
};

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
});

describe('public stage access', () => {
  it('GET /api/game/:code/spectate accepts a valid stage token without auth', async () => {
    mockDb.setResults([
      [baseSession],
      [player],
      [{ id: 'player-a', nickname: 'A', avatarImage: null }],
    ]);
    const res = await app.request(`/api/game/STAGE1/spectate?token=${STAGE_TOKEN}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { code: string; players: unknown[] };
    expect(body.code).toBe('STAGE1');
    expect(body.players).toHaveLength(1);
  });

  it('GET /api/game/:code/spectate rejects missing token and auth', async () => {
    mockDb.setResults([[baseSession]]);
    expect((await app.request('/api/game/STAGE1/spectate')).status).toBe(401);
  });

  it('GET /api/game/:code/spectate rejects invalid stage token', async () => {
    mockDb.setResults([[baseSession]]);
    expect((await app.request('/api/game/STAGE1/spectate?token=wrong')).status).toBe(403);
  });

  it('POST /api/games/host/:code/stage-token rotates token for the host', async () => {
    repo.getUserContext.mockResolvedValue({
      user: { role: 'Admin' },
      role: { name: 'Admin' },
      permissionCodes: [],
    });
    mockDb.setResults([[baseSession], undefined]);
    const res = await app.request('/api/games/host/STAGE1/stage-token', {
      method: 'POST',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { stage_token: string; stage_token_expires_at: string };
    expect(body.stage_token).toBeTruthy();
    expect(body.stage_token_expires_at).toBeTruthy();
  });

  it('redacts live architectures for token-based stage access during rounds', async () => {
    mockDb.setResults([
      [{ ...baseSession, phase: 'round', status: 'running', currentRound: 1, roundStartedAt: new Date() }],
      [player],
      [{ id: 'player-a', nickname: 'A', avatarImage: null }],
    ]);
    const res = await app.request(`/api/game/STAGE1/spectate?token=${STAGE_TOKEN}`);
    const body = (await res.json()) as { players: { architecture?: unknown }[] };
    expect(body.players[0].architecture).toBeUndefined();
  });
});
