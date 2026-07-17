import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client.js';
import { gameSessions, gamePlayers, users } from '../db/schema.js';
import { getUserContext } from '../db/repo.js';
import { authRequired, optionalAuth, type AppVariables } from '../middleware/auth.js';
import { maxBodyBytes, rateLimit } from '../middleware/guardrails.js';
import { stableHash } from '../../src/components/SystemEditor/engine/stableHash.js';
import { generateJoinKey, generateMatchCode, generateStageToken, hashStageToken } from '../lib/game/crypto.js';
import { isStageTokenValid, stageTokenExpiresAt } from '../lib/game/stageToken.js';
import {
  assertArchitectureEditablePhase,
  assertCapacity,
  assertExistingPlayer,
  assertJoinAuthorized,
  assertMatchNotEnded,
  assertNotKicked,
  assertRoundIndexInRange,
  assertScoreWritePhase,
} from '../lib/game/guards.js';
import {
  clockFromSession,
  computeEligibilityWindow,
  secondsUntilDeadline,
} from '../lib/game/eligibility.js';
import { rankSessionPlayers } from '../lib/game/leaderboard.js';
import {
  applyHostLifecycleAction,
  LifecycleError,
  mapLegacyHostAction,
  lifecyclePatchToSessionUpdates,
  snapshotLateJoiner,
  recomputePlayerVerifiedScore,
} from '../lib/game/lifecycle/service.js';
import {
  activeRoundIndex,
  DEFAULT_LOAD_PROFILE,
  DEFAULT_MAX_PLAYERS,
  DEFAULT_SCORING,
  getRoundsFromSession,
  normalizeRound,
  publicRounds,
} from '../lib/game/rounds.js';
import {
  getPlayerArchSnapshot,
  readPlayerArchSnapshots,
  readVerifiedRoundScores,
} from '../lib/game/snapshots.js';
import { applyHostLifecycleToDb, syncSessionLifecycle } from '../lib/game/sync.js';
import {
  architecturesEqual,
  assertLockedNodesPreserved,
  architectureCompliant,
} from '../lib/game/validation/architecture.js';
import {
  assertClientScoreNotForged,
  computeVerifiedAggregate,
  emitVerifiedScoreComposition,
  requiresServerVerification,
} from '../lib/game/scoring/recompute.js';
import { isAuthoritativeScoringEnabled, isClientScoreTrustEnabled, isHostInCanary, isCanaryRestricted } from '../lib/game/config.js';
import { emitGameTelemetry } from '../lib/game/telemetry.js';
import type { RoundConfig } from '../../src/components/SystemEditor/game/types';

export const gameRouter = new Hono<{ Variables: AppVariables }>();

gameRouter.use('/api/games/host', authRequired);
gameRouter.use('/api/games/host/*', authRequired);
gameRouter.use('/api/game/*', async (c, next) => {
  if (c.req.path.endsWith('/spectate')) return next();
  return authRequired(c, next);
});

gameRouter.use(
  '/api/game/:code',
  rateLimit({ windowMs: 60_000, max: 120, keyPrefix: 'game-poll' }),
);
gameRouter.use(
  '/api/game/:code/architecture',
  maxBodyBytes(512_000),
  rateLimit({ windowMs: 60_000, max: 90, keyPrefix: 'game-arch' }),
);
gameRouter.use(
  '/api/game/:code/leaderboard',
  rateLimit({ windowMs: 60_000, max: 90, keyPrefix: 'game-lb' }),
);

type SessionRow = typeof gameSessions.$inferSelect;

function getRounds(session: SessionRow): RoundConfig[] {
  return getRoundsFromSession(session);
}

async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateMatchCode();
    const existing = await db
      .select({ id: gameSessions.id })
      .from(gameSessions)
      .where(eq(gameSessions.code, code))
      .limit(1);
    if (existing.length === 0) return code;
  }
  return `${generateMatchCode()}${generateMatchCode().slice(0, 2)}`;
}

async function getSessionByCode(code: string): Promise<SessionRow | null> {
  const rows = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.code, code))
    .limit(1);
  return rows[0] ?? null;
}

async function getSyncedSession(code: string): Promise<SessionRow | null> {
  const session = await getSessionByCode(code);
  if (!session) return null;
  const { session: synced } = await syncSessionLifecycle(session);
  return synced;
}

async function isAdmin(userId: string): Promise<boolean> {
  const ctx = await getUserContext(userId);
  const roleName = ctx?.role?.name ?? ctx?.user.role ?? '';
  return roleName === 'Admin';
}

async function getManagedSession(code: string, userId: string): Promise<SessionRow> {
  const session = await getSyncedSession(code);
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  if (session.createdBy !== userId && !(await isAdmin(userId))) {
    throw new HTTPException(403, { message: 'Only the match host can manage it' });
  }
  return session;
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function lifecycleFields(session: SessionRow, nowMs = Date.now()) {
  const clock = clockFromSession({
    nowMs,
    intervalStartedAt: session.intervalStartedAt,
    intervalEndsAt: session.intervalEndsAt,
    roundStartedAt: session.roundStartedAt,
    roundEndsAt: session.roundEndsAt,
    pausedAt: session.pausedAt,
    totalPausedMs: session.totalPausedMs,
  });
  const phase = session.phase ?? 'lobby';
  return {
    interval_started_at: toIso(session.intervalStartedAt),
    interval_ends_at: toIso(session.intervalEndsAt),
    paused_at: toIso(session.pausedAt),
    total_paused_ms: session.totalPausedMs ?? 0,
    lifecycle_version: session.lifecycleVersion ?? 0,
    auto_transitions: session.autoTransitions ?? true,
    seconds_until_deadline: secondsUntilDeadline(phase, clock),
    is_paused: session.pausedAt != null,
  };
}

function adminSessionToDict(session: SessionRow) {
  return {
    id: session.id,
    code: session.code,
    name: session.name,
    status: session.status,
    seed: session.seed,
    starts_at: toIso(session.startsAt),
    started_at: toIso(session.startedAt),
    ends_at: toIso(session.endsAt),
    duration_sec: session.durationSec,
    starting_architecture: session.startingArchitecture ?? null,
    locked_node_ids: session.lockedNodeIds ?? [],
    allow_delete_starting: session.allowDeleteStarting ?? true,
    load_profile: session.loadProfile ?? DEFAULT_LOAD_PROFILE,
    chaos_events: session.chaosEvents ?? [],
    scoring_config: session.scoringConfig ?? DEFAULT_SCORING,
    budget: session.budget ?? null,
    rounds: session.rounds ?? [],
    phase: session.phase ?? 'lobby',
    current_round: session.currentRound ?? 0,
    total_rounds: getRounds(session).length,
    round_started_at: toIso(session.roundStartedAt),
    round_ends_at: toIso(session.roundEndsAt),
    announcement: session.announcement ?? null,
    announcement_at: toIso(session.announcementAt),
    join_open: session.joinOpen ?? true,
    listed: session.listed ?? true,
    join_key: session.joinKey ?? null,
    max_players: session.maxPlayers ?? DEFAULT_MAX_PLAYERS,
    kicked_user_ids: session.kickedUserIds ?? [],
    stage_token_expires_at: toIso(session.stageTokenExpiresAt),
    has_stage_token: Boolean(session.stageTokenHash),
    created_by: session.createdBy,
    created_at: toIso(session.createdAt),
    updated_at: toIso(session.updatedAt),
    server_time: new Date().toISOString(),
    ...lifecycleFields(session),
  };
}

function assertSpectateAccess(
  c: { req: { query: (k: string) => string | undefined }; get: (k: 'user') => { uid: string } | undefined },
  session: SessionRow,
) {
  const token = c.req.query('token');
  if (token) {
    if (!isStageTokenValid(token, session.stageTokenHash, session.stageTokenExpiresAt)) {
      throw new HTTPException(403, { message: 'Invalid or expired stage token' });
    }
    return;
  }
  if (!c.get('user')) {
    throw new HTTPException(401, { message: 'Stage token or authorization required' });
  }
}

function roundElapsedSec(session: SessionRow): number {
  const anchor = session.roundStartedAt ?? session.startedAt;
  if (!anchor) return 0;
  const started = new Date(anchor).getTime();
  const pausedMs = session.pausedAt ? Date.now() - new Date(session.pausedAt).getTime() : 0;
  const totalPaused = (session.totalPausedMs ?? 0) + (session.pausedAt ? pausedMs : 0);
  return Math.max(0, Math.floor((Date.now() - started - totalPaused) / 1000));
}

// ==================== Public discovery ====================

gameRouter.get('/api/games/live', async (c) => {
  const rows = await db
    .select()
    .from(gameSessions)
    .where(
      and(
        inArray(gameSessions.status, ['lobby', 'running', 'paused']),
        eq(gameSessions.listed, true),
      ),
    )
    .orderBy(desc(gameSessions.createdAt))
    .limit(24);

  const ids = rows.map((s) => s.id);
  const playerRows = ids.length
    ? await db
        .select({ sessionId: gamePlayers.sessionId })
        .from(gamePlayers)
        .where(inArray(gamePlayers.sessionId, ids))
    : [];
  const counts = new Map<number, number>();
  for (const p of playerRows) {
    counts.set(p.sessionId, (counts.get(p.sessionId) ?? 0) + 1);
  }

  return c.json({
    server_time: new Date().toISOString(),
    matches: rows.map((s) => ({
      code: s.code,
      name: s.name,
      status: s.status,
      phase: s.phase ?? 'lobby',
      join_open: s.joinOpen ?? true,
      current_round: s.currentRound ?? 0,
      total_rounds: getRounds(s).length,
      player_count: counts.get(s.id) ?? 0,
      starts_at: toIso(s.startsAt),
      round_ends_at: toIso(s.roundEndsAt),
      interval_ends_at: toIso(s.intervalEndsAt),
      created_at: toIso(s.createdAt),
    })),
  });
});

// ==================== Host endpoints ====================

gameRouter.get('/api/games/host', async (c) => {
  const user = c.get('user');
  const admin = await isAdmin(user.uid);
  const rows = await db
    .select()
    .from(gameSessions)
    .where(admin ? undefined : eq(gameSessions.createdBy, user.uid))
    .orderBy(desc(gameSessions.createdAt))
    .limit(50);
  return c.json({ sessions: rows.map(adminSessionToDict) });
});

gameRouter.post('/api/games/host', async (c) => {
  const user = c.get('user');
  if (isCanaryRestricted() && !isHostInCanary(user.uid)) {
    throw new HTTPException(403, {
      message: 'Arena authoritative scoring is in canary rollout for selected hosts only',
    });
  }
  const body = await c.req.json<{
    name?: string;
    seed?: number;
    starting_architecture?: unknown;
    locked_node_ids?: string[];
    allow_delete_starting?: boolean;
    load_profile?: { type: string };
    scoring_config?: Record<string, number>;
    budget?: unknown;
    duration_sec?: number | null;
    starts_at?: string | null;
    rounds?: Partial<RoundConfig>[];
    join_open?: boolean;
    listed?: boolean;
    max_players?: number;
  }>();

  const rawRounds =
    Array.isArray(body.rounds) && body.rounds.length > 0
      ? body.rounds
      : [
          {
            intervalSec: 60,
            durationSec: body.duration_sec ?? 120,
            loadProfile: (body.load_profile ?? DEFAULT_LOAD_PROFILE) as RoundConfig['loadProfile'],
            chaosEvents: [],
            scoringConfig: body.scoring_config ?? DEFAULT_SCORING,
            weight: 1,
          },
        ];
  const rounds = rawRounds.map((r, i) => normalizeRound(r as Partial<RoundConfig>, i));

  const code = await generateUniqueCode();
  const stageRaw = generateStageToken();
  const stageExpires = stageTokenExpiresAt();
  const inserted = await db
    .insert(gameSessions)
    .values({
      code,
      stageTokenHash: hashStageToken(stageRaw),
      stageTokenExpiresAt: stageExpires,
      name: body.name ?? null,
      status: 'lobby',
      phase: 'lobby',
      currentRound: 0,
      seed: body.seed ?? 1,
      startsAt: body.starts_at ? new Date(body.starts_at) : null,
      startingArchitecture: (body.starting_architecture ?? null) as object | null,
      lockedNodeIds: (body.locked_node_ids ?? []) as object,
      allowDeleteStarting: body.allow_delete_starting ?? true,
      loadProfile: (rounds[0].loadProfile ?? DEFAULT_LOAD_PROFILE) as object,
      chaosEvents: [] as object,
      scoringConfig: (rounds[0].scoringConfig ?? DEFAULT_SCORING) as object,
      budget: (body.budget ?? null) as object | null,
      durationSec: body.duration_sec ?? null,
      rounds: rounds as object,
      joinOpen: body.join_open ?? true,
      listed: body.listed ?? true,
      joinKey: generateJoinKey(),
      maxPlayers: body.max_players ?? DEFAULT_MAX_PLAYERS,
      kickedUserIds: [] as object,
      autoTransitions: true,
      lifecycleVersion: 0,
      totalPausedMs: 0,
      createdBy: user.uid,
    })
    .returning();

  return c.json(
    {
      ...adminSessionToDict(inserted[0]),
      stage_token: stageRaw,
      stage_url: null,
      authoritative_scoring: isAuthoritativeScoringEnabled(),
      client_score_trust: isClientScoreTrustEnabled(),
    },
    201,
  );
});

gameRouter.post('/api/games/host/:code/stage-token', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const raw = generateStageToken();
  const expiresAt = stageTokenExpiresAt();
  await db
    .update(gameSessions)
    .set({
      stageTokenHash: hashStageToken(raw),
      stageTokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(gameSessions.id, session.id));
  return c.json({
    stage_token: raw,
    stage_token_expires_at: expiresAt.toISOString(),
  });
});

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  score: number;
  score_breakdown: unknown;
  last_submitted_at: string | null;
  verified: boolean;
}

async function buildLeaderboard(session: SessionRow): Promise<LeaderboardEntry[]> {
  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));

  const userIds = players.map((p) => p.userId);
  const userRows = userIds.length
    ? await db
        .select({
          id: users.id,
          nickname: users.nickname,
          avatarImage: users.avatarImage,
        })
        .from(users)
        .where(inArray(users.id, userIds))
    : [];
  const userMap = new Map(userRows.map((u) => [u.id, u]));
  const ranked = rankSessionPlayers(session, players, { provisionalOk: session.phase === 'round' });
  const playerMap = new Map(players.map((p) => [p.userId, p]));
  return ranked.map((r) => {
    const p = playerMap.get(r.user_id);
    return {
      rank: r.rank,
      user_id: r.user_id,
      nickname: userMap.get(r.user_id)?.nickname ?? null,
      avatar_image: userMap.get(r.user_id)?.avatarImage ?? null,
      score: r.score,
      score_breakdown: p?.scoreBreakdown ?? null,
      last_submitted_at: toIso(p?.lastSubmittedAt ?? null),
      verified: r.verified,
    };
  });
}

gameRouter.get('/api/games/host/:code', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const leaderboard = await buildLeaderboard(session);
  return c.json({ ...adminSessionToDict(session), leaderboard });
});

gameRouter.patch('/api/games/host/:code', async (c) => {
  let session = await getManagedSession(c.req.param('code'), c.get('user').uid);

  const body = await c.req.json<{
    action?:
      | 'start'
      | 'pause'
      | 'resume'
      | 'end'
      | 'open_interval'
      | 'start_round'
      | 'end_round';
    name?: string;
    seed?: number;
    starts_at?: string | null;
    duration_sec?: number | null;
    add_sec?: number;
    load_profile?: { type: string };
    scoring_config?: Record<string, number>;
    allow_delete_starting?: boolean;
    locked_node_ids?: string[];
    rounds?: Partial<RoundConfig>[];
    join_open?: boolean;
    listed?: boolean;
    max_players?: number;
  }>();

  const updates: Partial<typeof gameSessions.$inferInsert> = { updatedAt: new Date() };

  if (body.name !== undefined) updates.name = body.name;
  if (body.join_open !== undefined) updates.joinOpen = body.join_open;
  if (body.listed !== undefined) updates.listed = body.listed;
  if (body.seed !== undefined) updates.seed = body.seed;
  if (body.max_players !== undefined) updates.maxPlayers = body.max_players;
  if (body.starts_at !== undefined)
    updates.startsAt = body.starts_at ? new Date(body.starts_at) : null;
  if (body.duration_sec !== undefined) updates.durationSec = body.duration_sec;
  if (body.load_profile !== undefined) updates.loadProfile = body.load_profile as object;
  if (body.scoring_config !== undefined)
    updates.scoringConfig = body.scoring_config as object;
  if (body.allow_delete_starting !== undefined)
    updates.allowDeleteStarting = body.allow_delete_starting;
  if (body.locked_node_ids !== undefined)
    updates.lockedNodeIds = body.locked_node_ids as object;
  if (body.rounds !== undefined)
    updates.rounds = body.rounds.map((r, i) => normalizeRound(r, i)) as object;

  const phase = session.phase ?? 'lobby';
  const action = body.action;
  let enteredRound = false;
  let enteredRoundIndex: number | null = null;

  if (action) {
    const mapped = mapLegacyHostAction(action, phase, body.add_sec);

    if (action === 'start_round' && phase === 'lobby') {
      throw new HTTPException(400, {
        message: 'Lobby must enter a build interval before starting a round',
      });
    }

    if (mapped) {
      try {
        const prevPhase = phase;
        const nextState = applyHostLifecycleAction(session, mapped);
        Object.assign(updates, lifecyclePatchToSessionUpdates(nextState, session));
        emitGameTelemetry({
          type: 'lifecycle_transition',
          sessionCode: session.code,
          fromPhase: phase,
          toPhase: nextState.phase,
          lifecycleVersion: nextState.lifecycleVersion,
          trigger: 'host',
        });
        enteredRound = prevPhase !== 'round' && nextState.phase === 'round';
        if (enteredRound) enteredRoundIndex = activeRoundIndex(nextState.currentRound);
      } catch (err) {
        if (err instanceof LifecycleError) {
          throw new HTTPException(400, { message: err.message });
        }
        throw err;
      }
    } else if (action === 'start' && getRounds(session).length === 0) {
      updates.status = 'running';
      const startedAt = new Date();
      updates.startedAt = startedAt;
      if (!body.starts_at) updates.startsAt = startedAt;
    }
  }

  if (body.add_sec !== undefined && body.add_sec !== 0) {
    const effectivePhase = (updates.phase ?? session.phase) as string;
    if (!action) {
      const extendAction =
        effectivePhase === 'interval'
          ? ({ type: 'extend_interval', addSec: body.add_sec } as const)
          : effectivePhase === 'round'
            ? ({ type: 'extend_round', addSec: body.add_sec } as const)
            : null;
      if (extendAction) {
        const nextState = applyHostLifecycleAction(session, extendAction);
        Object.assign(updates, lifecyclePatchToSessionUpdates(nextState, session));
      } else if (effectivePhase === 'round') {
        const base = updates.roundEndsAt ?? session.roundEndsAt;
        const baseMs = base ? new Date(base).getTime() : Date.now();
        updates.roundEndsAt = new Date(baseMs + body.add_sec * 1000);
      } else {
        const baseEnds = updates.endsAt ?? session.endsAt;
        const baseMs = baseEnds ? new Date(baseEnds).getTime() : Date.now();
        updates.endsAt = new Date(baseMs + body.add_sec * 1000);
      }
    } else if (action === 'end_round') {
      const baseEnds = updates.endsAt ?? session.endsAt;
      const baseMs = baseEnds ? new Date(baseEnds).getTime() : Date.now();
      updates.endsAt = new Date(baseMs + body.add_sec * 1000);
    }
  }

  session = await applyHostLifecycleToDb(session, updates, enteredRound, enteredRoundIndex);
  return c.json(adminSessionToDict(session));
});

gameRouter.post('/api/games/host/:code/chaos', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);

  const body = await c.req.json<{
    type: 'killNode' | 'latencyInjection' | 'partition';
    targetId: string;
    durationSec?: number;
    magnitude?: number;
  }>();
  if (!body.type || !body.targetId)
    throw new HTTPException(400, { message: 'type and targetId are required' });

  const startSec = roundElapsedSec(session) + 2;
  const event = {
    id: `chaos-${Date.now()}`,
    type: body.type,
    targetId: body.targetId,
    startSec,
    durationSec: body.durationSec ?? 15,
    magnitude: body.magnitude,
  };

  const existing = Array.isArray(session.chaosEvents)
    ? (session.chaosEvents as unknown[])
    : [];
  const chaosEvents = [...existing, event];

  await db
    .update(gameSessions)
    .set({ chaosEvents: chaosEvents as object, updatedAt: new Date() })
    .where(eq(gameSessions.id, session.id));

  return c.json({ chaos_events: chaosEvents });
});

async function buildSpectatorPlayers(session: SessionRow, redactLiveArch: boolean) {
  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));

  const ranked = rankSessionPlayers(session, players, { provisionalOk: true });
  const rankMap = new Map(ranked.map((r) => [r.user_id, r]));

  const userIds = players.map((p) => p.userId);
  const userRows = userIds.length
    ? await db
        .select({
          id: users.id,
          nickname: users.nickname,
          avatarImage: users.avatarImage,
        })
        .from(users)
        .where(inArray(users.id, userIds))
    : [];
  const userMap = new Map(userRows.map((u) => [u.id, u]));

  return players.map((p) => {
    const arch = (p.architecture ?? null) as {
      nodes?: unknown[];
      edges?: unknown[];
    } | null;
    const nodeCount = Array.isArray(arch?.nodes) ? arch!.nodes.length : 0;
    const edgeCount = Array.isArray(arch?.edges) ? arch!.edges.length : 0;
    const rank = rankMap.get(p.userId);
    const hideArch = redactLiveArch && session.phase === 'round';
    return {
      rank: rank?.rank ?? 0,
      user_id: p.userId,
      nickname: userMap.get(p.userId)?.nickname ?? null,
      avatar_image: userMap.get(p.userId)?.avatarImage ?? null,
      score: rank?.score ?? p.score ?? 0,
      score_verified: rank?.verified ?? false,
      score_breakdown: p.scoreBreakdown ?? null,
      round_scores: p.roundScores ?? {},
      metrics: p.metrics ?? null,
      architecture: hideArch ? undefined : (p.architecture ?? null),
      node_count: nodeCount,
      edge_count: edgeCount,
      joined_at: toIso(p.joinedAt),
      last_submitted_at: toIso(p.lastSubmittedAt),
    };
  }).sort((a, b) => a.rank - b.rank);
}

gameRouter.get('/api/games/host/:code/players', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const result = await buildSpectatorPlayers(session, false);
  return c.json({ server_time: new Date().toISOString(), players: result });
});

gameRouter.post('/api/games/host/:code/announce', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);

  const body = await c.req.json<{ message?: string }>();
  const message = (body.message ?? '').trim();

  await db
    .update(gameSessions)
    .set({
      announcement: message || null,
      announcementAt: message ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(gameSessions.id, session.id));

  return c.json({ announcement: message || null });
});

gameRouter.delete('/api/games/host/:code/players/:userId', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const userId = c.req.param('userId');

  const kicked = (session.kickedUserIds ?? []) as string[];
  const nextKicked = kicked.includes(userId) ? kicked : [...kicked, userId];

  await db
    .update(gameSessions)
    .set({ kickedUserIds: nextKicked as object, updatedAt: new Date() })
    .where(eq(gameSessions.id, session.id));

  await db
    .delete(gamePlayers)
    .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, userId)));

  return c.json({ ok: true });
});

gameRouter.delete('/api/games/host/:code', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  await db.delete(gameSessions).where(eq(gameSessions.id, session.id));
  return c.json({ ok: true });
});

// ==================== Player endpoints ====================

async function playerSessionToDict(
  session: SessionRow,
  userId: string,
  thin?: { archHash?: string; startingArchHash?: string },
) {
  const playerRows = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));
  const me = playerRows.find((p) => p.userId === userId) ?? null;
  const phase = session.phase ?? 'lobby';
  const nowMs = Date.now();
  const rounds = getRounds(session);

  const verified = readVerifiedRoundScores(me?.verifiedRoundScores);
  const hasVerified = Object.keys(verified).length > 0;
  const provisionalScore = me?.roundScores
    ? Object.entries(me.roundScores as Record<string, { score?: number }>).reduce(
        (sum, [key, val]) => sum + (rounds[Number(key)]?.weight ?? 1) * (val?.score ?? 0),
        0,
      )
    : 0;

  let simTiming: Record<string, number> = {};
  if (phase === 'round' && me) {
    const roundIndex = activeRoundIndex(session.currentRound ?? 0);
    const round = rounds[roundIndex];
    const window = computeEligibilityWindow({
      roundStartedAt: session.roundStartedAt,
      joinedAt: me.joinedAt,
      nowMs,
      pausedAt: session.pausedAt,
      totalPausedMs: session.totalPausedMs ?? 0,
      roundDurationSec: round?.durationSec ?? 120,
    });
    simTiming = {
      sim_elapsed_sec: window.simElapsedSec,
      eligible_from_sec: window.eligibleFromSec,
    };
  }

  const payload: Record<string, unknown> = {
    code: session.code,
    name: session.name,
    status: session.status,
    seed: session.seed,
    starts_at: toIso(session.startsAt),
    started_at: toIso(session.startedAt),
    ends_at: toIso(session.endsAt),
    duration_sec: session.durationSec,
    server_time: new Date().toISOString(),
    locked_node_ids: session.lockedNodeIds ?? [],
    allow_delete_starting: session.allowDeleteStarting ?? true,
    phase,
    join_open: session.joinOpen ?? true,
    max_players: session.maxPlayers ?? DEFAULT_MAX_PLAYERS,
    current_round: session.currentRound ?? 0,
    total_rounds: rounds.length,
    rounds_public: publicRounds(rounds),
    round_started_at: toIso(session.roundStartedAt),
    round_ends_at: toIso(session.roundEndsAt),
    announcement: session.announcement ?? null,
    announcement_at: toIso(session.announcementAt),
    player_count: playerRows.length,
    joined: !!me,
    my_score: hasVerified ? computeVerifiedAggregate(rounds, verified) : me?.score ?? 0,
    my_provisional_score: provisionalScore,
    scores_verified: hasVerified,
    my_round_scores: me?.roundScores ?? {},
    my_verified_round_scores: verified,
    ...lifecycleFields(session, nowMs),
    ...simTiming,
  };

  if (phase === 'round' || phase === 'interval') {
    payload.load_profile = session.loadProfile ?? DEFAULT_LOAD_PROFILE;
    payload.scoring_config = session.scoringConfig ?? DEFAULT_SCORING;
    payload.budget = session.budget ?? null;
  }
  if (phase === 'round') {
    payload.chaos_events = session.chaosEvents ?? [];
  } else {
    payload.chaos_events = [];
  }

  const myArch = me?.architecture ?? null;
  if (myArch) {
    const hash = stableHash(myArch);
    payload.arch_hash = hash;
    if (thin?.archHash !== hash) payload.my_architecture = myArch;
    else payload.my_architecture_unchanged = true;
  } else {
    payload.my_architecture = null;
  }

  const startingArch = session.startingArchitecture ?? null;
  if (startingArch && !me) {
    const sHash = stableHash(startingArch);
    payload.starting_arch_hash = sHash;
    if (thin?.startingArchHash !== sHash) payload.starting_architecture = startingArch;
    else payload.starting_architecture_unchanged = true;
  }

  return payload;
}

gameRouter.get('/api/game/:code', async (c) => {
  const user = c.get('user');
  const session = await getSyncedSession(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  const thin = {
    archHash: c.req.query('arch_hash') || undefined,
    startingArchHash: c.req.query('starting_arch_hash') || undefined,
  };
  return c.json(await playerSessionToDict(session, user.uid, thin));
});

gameRouter.post('/api/game/:code/join', async (c) => {
  const user = c.get('user');
  let session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  assertMatchNotEnded(session, { sessionCode: session.code, userId: user.uid });

  const body = await c.req
    .json<{ key?: string }>()
    .catch(() => ({}) as { key?: string });

  const existing = await db
    .select()
    .from(gamePlayers)
    .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)))
    .limit(1);

  assertJoinAuthorized(session, user.uid, existing.length > 0, body.key);

  if (existing.length === 0) {
    const countRows = await db
      .select()
      .from(gamePlayers)
      .where(eq(gamePlayers.sessionId, session.id));
    assertCapacity(session, countRows.length);

    await db
      .insert(gamePlayers)
      .values({
        sessionId: session.id,
        userId: user.uid,
        architecture: (session.startingArchitecture ?? null) as object | null,
        score: 0,
      })
      .onConflictDoNothing();

    if (session.phase === 'round') {
      const roundIndex = activeRoundIndex(session.currentRound ?? 0);
      const [player] = await db
        .select()
        .from(gamePlayers)
        .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)))
        .limit(1);
      if (player) {
        const snaps = snapshotLateJoiner(player, roundIndex);
        const round = getRounds(session)[roundIndex];
        emitGameTelemetry({
          type: 'late_join',
          sessionCode: session.code,
          userId: user.uid,
          roundIndex,
          eligibleFromSec: round?.durationSec ?? 120,
        });
        await db
          .update(gamePlayers)
          .set({ roundArchSnapshots: snaps as object })
          .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)));
      }
    }
  }

  const { session: synced } = await syncSessionLifecycle(session).catch(() => ({
    session,
    lifecycleChanged: false,
    scoreUpdates: 0,
  }));
  return c.json(await playerSessionToDict(synced, user.uid));
});

gameRouter.put('/api/game/:code/architecture', async (c) => {
  const user = c.get('user');
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  assertMatchNotEnded(session, { sessionCode: session.code, userId: user.uid });

  const body = await c.req.json<{
    architecture?: unknown;
    score?: number;
    score_breakdown?: unknown;
    metrics?: unknown;
    round_index?: number;
    round_score?: number;
    round_breakdown?: unknown;
  }>();

  const rounds = getRounds(session);
  const existingRows = await db
    .select()
    .from(gamePlayers)
    .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)))
    .limit(1);
  const existing = existingRows[0] ?? null;
  assertExistingPlayer(existing, user.uid, session);

  const phase = session.phase ?? 'lobby';
  const lockedIds = (session.lockedNodeIds ?? []) as string[];

  if (body.round_index !== undefined || body.round_score !== undefined) {
    assertScoreWritePhase(session);
    assertRoundIndexInRange(body.round_index ?? -1, rounds.length, session, user.uid);

    const roundIndex = body.round_index!;
    const archSnapshots = readPlayerArchSnapshots(existing.roundArchSnapshots);
    const archSnapshot = getPlayerArchSnapshot(archSnapshots, roundIndex);
    if (!archSnapshot) {
      throw new HTTPException(403, { message: 'No architecture snapshot for this round' });
    }

    if (body.architecture !== undefined && !architecturesEqual(body.architecture, archSnapshot.architecture)) {
      throw new HTTPException(409, { message: 'Architecture is frozen during a live round' });
    }

    const nowMs = Date.now();
    const useLegacyClientTrust =
      isClientScoreTrustEnabled() && !isAuthoritativeScoringEnabled();

    let verifiedScore: number;
    let verifiedRoundScores: Record<string, import('../lib/game/types.js').VerifiedRoundScore>;
    let aggregateScore: number;
    let eligibleFromSec: number;

    if (useLegacyClientTrust) {
      verifiedScore = body.round_score ?? 0;
      verifiedRoundScores = {
        ...(existing.verifiedRoundScores as object ?? {}),
        [String(roundIndex)]: {
          roundIndex,
          score: verifiedScore,
          breakdown: body.round_breakdown ?? null,
          verifiedAt: new Date().toISOString(),
          lifecycleVersion: session.lifecycleVersion ?? 0,
          simElapsedSec: 0,
          eligibleFromSec: existing.eligibleFromSec ?? 0,
        },
      } as Record<string, import('../lib/game/types.js').VerifiedRoundScore>;
      aggregateScore = computeVerifiedAggregate(rounds, verifiedRoundScores);
      eligibleFromSec = existing.eligibleFromSec ?? 0;
    } else {
      const t0 = Date.now();
      const verifiedUpdate = recomputePlayerVerifiedScore(session, existing, roundIndex, nowMs, true);
      if (!verifiedUpdate) {
        throw new HTTPException(403, { message: 'Unable to verify score for this round' });
      }
      emitGameTelemetry({
        type: 'recompute_duration',
        sessionCode: session.code,
        roundIndex,
        playerCount: 1,
        durationMs: Date.now() - t0,
        trigger: 'submit',
      });
      verifiedRoundScores = verifiedUpdate.verifiedRoundScores;
      verifiedScore = verifiedUpdate.verifiedRoundScores[String(roundIndex)].score;
      aggregateScore = verifiedUpdate.score;
      eligibleFromSec = verifiedUpdate.eligibleFromSec;
      emitVerifiedScoreComposition(session.code, user.uid, roundIndex, verifiedUpdate.verifiedRoundScores[String(roundIndex)]);
      assertClientScoreNotForged(body.round_score, verifiedScore, {
        sessionCode: session.code,
        userId: user.uid,
        roundIndex,
      });
    }

    const prevRoundScores = (existing.roundScores ?? {}) as Record<
      string,
      { score?: number; clientScore?: number; breakdown?: unknown; metrics?: unknown }
    >;
    const roundScores = {
      ...prevRoundScores,
      [String(roundIndex)]: {
        score: verifiedScore,
        clientScore: body.round_score,
        breakdown: body.round_breakdown ?? null,
        metrics: body.metrics ?? null,
      },
    };

    await db
      .update(gamePlayers)
      .set({
        lastSubmittedAt: new Date(),
        verifiedRoundScores: verifiedRoundScores as object,
        score: aggregateScore,
        eligibleFromSec,
        roundScores: roundScores as object,
        scoreBreakdown: (body.score_breakdown ?? existing.scoreBreakdown ?? null) as object | null,
        metrics: (body.metrics ?? existing.metrics ?? null) as object | null,
      })
      .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)));

    return c.json({
      ok: true,
      verified: requiresServerVerification(),
      legacy_client_trust: useLegacyClientTrust,
      score: aggregateScore,
    });
  }

  if (body.architecture !== undefined) {
    assertArchitectureEditablePhase(session, user.uid);
    assertLockedNodesPreserved(body.architecture, lockedIds);
    if (!architectureCompliant(body.architecture)) {
      // Allow saving non-compliant builds during interval; they score zero when live.
    }

    await db
      .update(gamePlayers)
      .set({
        architecture: body.architecture as object,
        lastSubmittedAt: new Date(),
        scoreBreakdown: (body.score_breakdown ?? existing.scoreBreakdown ?? null) as object | null,
        metrics: (body.metrics ?? existing.metrics ?? null) as object | null,
      })
      .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)));
  } else if (body.metrics !== undefined || body.score_breakdown !== undefined) {
    await db
      .update(gamePlayers)
      .set({
        lastSubmittedAt: new Date(),
        scoreBreakdown: (body.score_breakdown ?? existing.scoreBreakdown ?? null) as object | null,
        metrics: (body.metrics ?? existing.metrics ?? null) as object | null,
      })
      .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid)));
  }

  return c.json({ ok: true });
});

gameRouter.get('/api/game/:code/leaderboard', async (c) => {
  const session = await getSyncedSession(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  const leaderboard = await buildLeaderboard(session);
  return c.json({
    leaderboard,
    scores_verified: session.phase !== 'round',
    lifecycle_version: session.lifecycleVersion ?? 0,
  });
});

gameRouter.get('/api/game/:code/spectate', optionalAuth, async (c) => {
  const session = await getSyncedSession(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  assertSpectateAccess(c, session);

  const players = await buildSpectatorPlayers(session, true);
  const rounds = getRounds(session);

  return c.json({
    code: session.code,
    name: session.name,
    status: session.status,
    phase: session.phase ?? 'lobby',
    current_round: session.currentRound ?? 0,
    total_rounds: rounds.length,
    rounds_public: publicRounds(rounds),
    starts_at: toIso(session.startsAt),
    round_started_at: toIso(session.roundStartedAt),
    round_ends_at: toIso(session.roundEndsAt),
    load_profile: session.loadProfile ?? DEFAULT_LOAD_PROFILE,
    announcement: session.announcement ?? null,
    announcement_at: toIso(session.announcementAt),
    player_count: players.length,
    server_time: new Date().toISOString(),
    scores_verified: session.phase !== 'round',
    ...lifecycleFields(session),
    players,
  });
});
