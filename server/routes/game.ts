import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client.js';
import { gameSessions, gamePlayers, users } from '../db/schema.js';
import { getUserContext } from '../db/repo.js';
import { authRequired, type AppVariables } from '../middleware/auth.js';
import { maxBodyBytes, rateLimit } from '../middleware/guardrails.js';
// Shared with the client engine: the module is dependency-free on purpose.
import { evaluateCompliance } from '../../src/components/SystemEditor/engine/compliance.js';
import { stableHash } from '../../src/components/SystemEditor/engine/stableHash.js';

export const gameRouter = new Hono<{ Variables: AppVariables }>();

// /api/games/live is public (the arena landing page lists running matches
// without a login). Everything else requires a signed-in user; host mutations
// additionally require being the match creator (or a platform Admin).
gameRouter.use('/api/games/host', authRequired);
gameRouter.use('/api/games/host/*', authRequired);
// Player-facing routes only require a logged-in user.
gameRouter.use('/api/game/*', authRequired);

// Guard expensive polling and large architecture writes before DB work.
gameRouter.use(
  '/api/game/:code',
  rateLimit({ windowMs: 60_000, max: 120, keyPrefix: 'game-poll' })
);
gameRouter.use(
  '/api/game/:code/architecture',
  maxBodyBytes(512_000),
  rateLimit({ windowMs: 60_000, max: 90, keyPrefix: 'game-arch' })
);
gameRouter.use(
  '/api/game/:code/leaderboard',
  rateLimit({ windowMs: 60_000, max: 90, keyPrefix: 'game-lb' })
);

type SessionRow = typeof gameSessions.$inferSelect;

/**
 * Server-side mirror of the client's house-rules gate. A submission whose
 * architecture breaks the rules (no database, cache-only, client wired into
 * the DB, ...) can never raise the recorded score, so tampering with the
 * client-side check gains nothing.
 */
function architectureCompliant(arch: unknown): boolean {
  const a = arch as {
    nodes?: { id?: unknown; config?: { kind?: unknown } }[];
    edges?: { source?: unknown; target?: unknown }[];
  } | null;
  if (!a || !Array.isArray(a.nodes) || a.nodes.length === 0) return false;
  const nodes = a.nodes
    .filter((n) => n && typeof n.id === 'string' && typeof n.config?.kind === 'string')
    .map((n) => ({ id: n.id as string, kind: n.config!.kind as string }));
  const edges = (Array.isArray(a.edges) ? a.edges : [])
    .filter((e) => e && typeof e.source === 'string' && typeof e.target === 'string')
    .map((e) => ({ source: e.source as string, target: e.target as string }));
  return evaluateCompliance(nodes, edges).ok;
}

const DEFAULT_SCORING = {
  wThroughput: 1,
  wSuccess: 2,
  wLatency: 1,
  wCost: 1,
  latencyTargetMs: 250,
  budgetPerHour: 0,
};

const DEFAULT_LOAD_PROFILE = { type: 'constant' as const };

interface RoundConfig {
  name?: string;
  /** Player-facing one-liner describing the round's scenario beat. */
  story?: string;
  /** Build window (seconds) before this round goes live. Informational. */
  intervalSec: number;
  /** Live round length in seconds. */
  durationSec: number;
  loadProfile: { type: string };
  chaosEvents: unknown[];
  scoringConfig: Record<string, number>;
  /** Multiplier applied to this round's score in the weighted aggregate. */
  weight: number;
}

function normalizeRound(raw: Partial<RoundConfig> | undefined, idx: number): RoundConfig {
  return {
    name: raw?.name ?? `Round ${idx + 1}`,
    story: raw?.story,
    intervalSec: Number(raw?.intervalSec ?? 60),
    durationSec: Number(raw?.durationSec ?? 120),
    loadProfile: raw?.loadProfile ?? DEFAULT_LOAD_PROFILE,
    chaosEvents: Array.isArray(raw?.chaosEvents) ? raw!.chaosEvents : [],
    scoringConfig: { ...DEFAULT_SCORING, ...(raw?.scoringConfig ?? {}) },
    weight: Number(raw?.weight ?? 1),
  };
}

/** Non-sensitive round metadata safe to show players and the audience. */
function publicRounds(rounds: RoundConfig[]) {
  return rounds.map((r) => ({
    name: r.name ?? null,
    story: r.story ?? null,
    interval_sec: r.intervalSec,
    duration_sec: r.durationSec,
    weight: r.weight,
  }));
}

/** Read the (possibly null) rounds column as a typed array. */
function getRounds(session: SessionRow): RoundConfig[] {
  const raw = session.rounds;
  if (!Array.isArray(raw)) return [];
  return raw.map((r, i) => normalizeRound(r as Partial<RoundConfig>, i));
}

/**
 * Weighted aggregate across rounds: total = Σ weight_i * roundScore_i.
 * `roundScores` is the per-player map { [roundIndex]: { score, ... } }.
 */
function computeAggregate(
  rounds: RoundConfig[],
  roundScores: Record<string, { score?: number }> | null | undefined
): number {
  if (!roundScores) return 0;
  let total = 0;
  for (const [key, val] of Object.entries(roundScores)) {
    const idx = Number(key);
    const weight = rounds[idx]?.weight ?? 1;
    total += weight * (val?.score ?? 0);
  }
  return total;
}

/** Short, unambiguous, URL-friendly match code (no easily confused chars). */
function generateCode(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/** Secret for private-match invite links. */
function generateJoinKey(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 16; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateCode();
    const existing = await db
      .select({ id: gameSessions.id })
      .from(gameSessions)
      .where(eq(gameSessions.code, code))
      .limit(1);
    if (existing.length === 0) return code;
  }
  // Fall back to a longer code if we keep colliding.
  return `${generateCode()}${Math.floor(Math.random() * 90 + 10)}`;
}

async function getSessionByCode(code: string): Promise<SessionRow | null> {
  const rows = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.code, code))
    .limit(1);
  return rows[0] ?? null;
}

async function isAdmin(userId: string): Promise<boolean> {
  const ctx = await getUserContext(userId);
  const roleName = ctx?.role?.name ?? ctx?.user.role ?? '';
  return roleName === 'Admin';
}

/**
 * Load a match for host-side management: 404 when missing, 403 unless the
 * requester created it (or is a platform Admin).
 */
async function getManagedSession(code: string, userId: string): Promise<SessionRow> {
  const session = await getSessionByCode(code);
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

/**
 * Seconds elapsed within the current round. The player's sim restarts at t=0
 * each round, so chaos must be scheduled relative to the round start (not the
 * match start) or it would never fire.
 */
function roundElapsedSec(session: SessionRow): number {
  const anchor = session.roundStartedAt ?? session.startedAt;
  if (!anchor) return 0;
  const started = new Date(anchor).getTime();
  return Math.max(0, Math.floor((Date.now() - started) / 1000));
}

/** Admin-facing serialization (includes everything). */
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
    created_by: session.createdBy,
    created_at: toIso(session.createdAt),
    updated_at: toIso(session.updatedAt),
    server_time: new Date().toISOString(),
  };
}

// ==================== Public discovery ====================

// Live matches for the arena landing page. Public (no auth): exposes only
// non-sensitive metadata so a marketing page can show what's happening now.
gameRouter.get('/api/games/live', async (c) => {
  const rows = await db
    .select()
    .from(gameSessions)
    .where(
      and(
        inArray(gameSessions.status, ['lobby', 'running', 'paused']),
        eq(gameSessions.listed, true)
      )
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
      created_at: toIso(s.createdAt),
    })),
  });
});

// ==================== Host endpoints ====================

// List the requester's matches (platform Admins see everything).
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

// Create a new match. Any signed-in user can host.
gameRouter.post('/api/games/host', async (c) => {
  const user = c.get('user');
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
  }>();

  // Normalize the rounds. If none provided, derive a single round from the
  // flat config so older clients keep working.
  const rawRounds = Array.isArray(body.rounds) && body.rounds.length > 0
    ? body.rounds
    : [
        {
          intervalSec: 60,
          durationSec: body.duration_sec ?? 120,
          loadProfile: body.load_profile ?? DEFAULT_LOAD_PROFILE,
          chaosEvents: [],
          scoringConfig: body.scoring_config ?? DEFAULT_SCORING,
          weight: 1,
        },
      ];
  const rounds = rawRounds.map((r, i) => normalizeRound(r, i));

  const code = await generateUniqueCode();
  const inserted = await db
    .insert(gameSessions)
    .values({
      code,
      name: body.name ?? null,
      status: 'lobby',
      phase: 'lobby',
      currentRound: 0,
      seed: body.seed ?? 1,
      startsAt: body.starts_at ? new Date(body.starts_at) : null,
      startingArchitecture: (body.starting_architecture ?? null) as object | null,
      lockedNodeIds: (body.locked_node_ids ?? []) as object,
      allowDeleteStarting: body.allow_delete_starting ?? true,
      // Mirror the first round's live config so the lobby preview is correct.
      loadProfile: (rounds[0].loadProfile ?? DEFAULT_LOAD_PROFILE) as object,
      chaosEvents: [] as object,
      scoringConfig: (rounds[0].scoringConfig ?? DEFAULT_SCORING) as object,
      budget: (body.budget ?? null) as object | null,
      durationSec: body.duration_sec ?? null,
      rounds: rounds as object,
      joinOpen: body.join_open ?? true,
      listed: body.listed ?? true,
      // Every match gets a key; it is only enforced when joinOpen is false.
      joinKey: generateJoinKey(),
      createdBy: user.uid,
    })
    .returning();

  return c.json(adminSessionToDict(inserted[0]), 201);
});

// Full host view of a single match (config + live leaderboard).
gameRouter.get('/api/games/host/:code', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const leaderboard = await buildLeaderboard(session.id);
  return c.json({ ...adminSessionToDict(session), leaderboard });
});

// Update a match: status transitions, broadcast traffic, schedule, etc.
gameRouter.patch('/api/games/host/:code', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);

  const body = await c.req.json<{
    // 'start'/'pause'/'resume'/'end' are legacy flat-match controls.
    // 'open_interval'/'start_round'/'end_round' drive the round state machine.
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
    // Shift the active round's end time by this many seconds (+/-).
    add_sec?: number;
    load_profile?: { type: string };
    scoring_config?: Record<string, number>;
    allow_delete_starting?: boolean;
    locked_node_ids?: string[];
    rounds?: Partial<RoundConfig>[];
    join_open?: boolean;
    listed?: boolean;
  }>();

  const updates: Partial<typeof gameSessions.$inferInsert> = { updatedAt: new Date() };

  if (body.name !== undefined) updates.name = body.name;
  if (body.join_open !== undefined) updates.joinOpen = body.join_open;
  if (body.listed !== undefined) updates.listed = body.listed;
  if (body.seed !== undefined) updates.seed = body.seed;
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

  const rounds = body.rounds
    ? body.rounds.map((r, i) => normalizeRound(r, i))
    : getRounds(session);
  const totalRounds = rounds.length;
  const curRound = session.currentRound ?? 0;
  const action = body.action;

  // Begin the next round: freeze players, mirror the round's config into the
  // live columns the client engine reads, and time-box it.
  const beginRound = (next: number) => {
    const round = rounds[next - 1];
    if (!round) throw new HTTPException(400, { message: 'No such round' });
    const now = new Date();
    updates.currentRound = next;
    updates.phase = 'round';
    updates.status = 'running';
    updates.roundStartedAt = now;
    updates.roundEndsAt = new Date(now.getTime() + round.durationSec * 1000);
    updates.loadProfile = round.loadProfile as object;
    updates.chaosEvents = round.chaosEvents as object;
    updates.scoringConfig = round.scoringConfig as object;
    if (!session.startedAt) updates.startedAt = now;
  };

  if (action === 'start_round') {
    beginRound(Math.min(totalRounds, curRound + 1));
  } else if (action === 'start') {
    // Legacy "start now": route to round 1 when the match has rounds.
    if (totalRounds > 0) {
      beginRound(curRound > 0 ? curRound : 1);
    } else {
      updates.status = 'running';
      const startedAt = new Date();
      updates.startedAt = startedAt;
      if (!body.starts_at) updates.startsAt = startedAt;
    }
  } else if (action === 'open_interval') {
    // Build window before the next round; sim paused, editing enabled.
    updates.phase = 'interval';
    updates.status = 'paused';
    updates.roundEndsAt = null;
  } else if (action === 'end_round') {
    const now = new Date();
    if (curRound >= totalRounds) {
      updates.phase = 'ended';
      updates.status = 'ended';
      updates.endsAt = now;
      updates.roundEndsAt = null;
    } else {
      updates.phase = 'interval';
      updates.status = 'paused';
      updates.roundEndsAt = null;
    }
  } else if (action === 'pause') {
    updates.status = 'paused';
  } else if (action === 'resume') {
    updates.status = 'running';
  } else if (action === 'end') {
    updates.status = 'ended';
    updates.phase = 'ended';
    updates.endsAt = new Date();
    updates.roundEndsAt = null;
  }

  // Adjust the active round's end time (admin fine-tuning during a round).
  if (body.add_sec !== undefined && body.add_sec !== 0) {
    const effectivePhase = (updates.phase ?? session.phase) as string;
    if (effectivePhase === 'round') {
      const base = updates.roundEndsAt ?? session.roundEndsAt;
      const baseMs = base ? new Date(base).getTime() : Date.now();
      updates.roundEndsAt = new Date(baseMs + body.add_sec * 1000);
    } else {
      // Legacy flat-match end-time shift.
      const baseEnds = updates.endsAt ?? session.endsAt;
      const baseMs = baseEnds ? new Date(baseEnds).getTime() : Date.now();
      updates.endsAt = new Date(baseMs + body.add_sec * 1000);
    }
  }

  const updated = await db
    .update(gameSessions)
    .set(updates)
    .where(eq(gameSessions.id, session.id))
    .returning();

  return c.json(adminSessionToDict(updated[0]));
});

// Inject a chaos event into the live broadcast timeline.
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

  // Schedule a couple of seconds into the future so every client picks it up.
  // Round-relative: clients reset the sim clock to 0 at the start of each round.
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

/** Per-player live state shared by the admin spectator and the audience stage. */
async function buildSpectatorPlayers(sessionId: number) {
  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, sessionId))
    .orderBy(desc(gamePlayers.score));

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

  return players.map((p, i) => {
    const arch = (p.architecture ?? null) as {
      nodes?: unknown[];
      edges?: unknown[];
    } | null;
    const nodeCount = Array.isArray(arch?.nodes) ? arch!.nodes.length : 0;
    const edgeCount = Array.isArray(arch?.edges) ? arch!.edges.length : 0;
    return {
      rank: i + 1,
      user_id: p.userId,
      nickname: userMap.get(p.userId)?.nickname ?? null,
      avatar_image: userMap.get(p.userId)?.avatarImage ?? null,
      score: p.score ?? 0,
      score_breakdown: p.scoreBreakdown ?? null,
      round_scores: p.roundScores ?? {},
      metrics: p.metrics ?? null,
      architecture: p.architecture ?? null,
      node_count: nodeCount,
      edge_count: edgeCount,
      joined_at: toIso(p.joinedAt),
      last_submitted_at: toIso(p.lastSubmittedAt),
    };
  });
}

// Live spectator view: every player's current architecture + activity stats.
gameRouter.get('/api/games/host/:code/players', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const result = await buildSpectatorPlayers(session.id);
  return c.json({ server_time: new Date().toISOString(), players: result });
});

// Broadcast (or clear) an announcement shown to all players in the match.
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

// Remove a player from a match (kick). They can re-join unless the match ended.
gameRouter.delete('/api/games/host/:code/players/:userId', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  const userId = c.req.param('userId');

  await db
    .delete(gamePlayers)
    .where(
      and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, userId))
    );

  return c.json({ ok: true });
});

// Delete a match.
gameRouter.delete('/api/games/host/:code', async (c) => {
  const session = await getManagedSession(c.req.param('code'), c.get('user').uid);
  await db.delete(gameSessions).where(eq(gameSessions.id, session.id));
  return c.json({ ok: true });
});

// ==================== Player endpoints ====================

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  score: number;
  score_breakdown: unknown;
  last_submitted_at: string | null;
}

async function buildLeaderboard(sessionId: number): Promise<LeaderboardEntry[]> {
  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, sessionId));

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

  return players
    .map((p) => ({
      user_id: p.userId,
      nickname: userMap.get(p.userId)?.nickname ?? null,
      avatar_image: userMap.get(p.userId)?.avatarImage ?? null,
      score: p.score ?? 0,
      score_breakdown: p.scoreBreakdown ?? null,
      last_submitted_at: toIso(p.lastSubmittedAt),
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry, i) => ({ rank: i + 1, ...entry }));
}

/** Player-facing control state for the polling client. */
async function playerSessionToDict(
  session: SessionRow,
  userId: string,
  thin?: { archHash?: string; startingArchHash?: string }
) {
  const playerRows = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));
  const me = playerRows.find((p) => p.userId === userId) ?? null;
  const phase = session.phase ?? 'lobby';

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
    current_round: session.currentRound ?? 0,
    total_rounds: getRounds(session).length,
    rounds_public: publicRounds(getRounds(session)),
    round_started_at: toIso(session.roundStartedAt),
    round_ends_at: toIso(session.roundEndsAt),
    announcement: session.announcement ?? null,
    announcement_at: toIso(session.announcementAt),
    player_count: playerRows.length,
    joined: !!me,
    my_score: me?.score ?? 0,
    my_round_scores: me?.roundScores ?? {},
  };

  // Live-round fields only — omit during lobby to shrink poll payloads.
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

// Poll the control state for a match.
gameRouter.get('/api/game/:code', async (c) => {
  const user = c.get('user');
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  const thin = {
    archHash: c.req.query('arch_hash') || undefined,
    startingArchHash: c.req.query('starting_arch_hash') || undefined,
  };
  return c.json(await playerSessionToDict(session, user.uid, thin));
});

// Join a match (idempotent). Seeds the player's architecture from the start.
gameRouter.post('/api/game/:code/join', async (c) => {
  const user = c.get('user');
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  if (session.status === 'ended')
    throw new HTTPException(409, { message: 'This match has already ended' });

  const body = await c.req
    .json<{ key?: string }>()
    .catch(() => ({}) as { key?: string });

  const existing = await db
    .select()
    .from(gamePlayers)
    .where(
      and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid))
    )
    .limit(1);

  // Private matches require the invite key. Players already in the match (and
  // the host) can always rejoin, e.g. after a refresh without the key.
  if (
    existing.length === 0 &&
    session.joinOpen === false &&
    session.createdBy !== user.uid &&
    (!session.joinKey || body.key !== session.joinKey)
  ) {
    throw new HTTPException(403, { message: 'This match is invite-only' });
  }

  if (existing.length === 0) {
    await db
      .insert(gamePlayers)
      .values({
        sessionId: session.id,
        userId: user.uid,
        architecture: (session.startingArchitecture ?? null) as object | null,
        score: 0,
      })
      .onConflictDoNothing();
  }

  return c.json(await playerSessionToDict(session, user.uid));
});

// Submit the player's current architecture and computed score.
gameRouter.put('/api/game/:code/architecture', async (c) => {
  const user = c.get('user');
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });

  const body = await c.req.json<{
    architecture?: unknown;
    score?: number;
    score_breakdown?: unknown;
    metrics?: unknown;
    // Round-based submission: per-round score recorded under round_index, with
    // the aggregate recomputed server-side from all rounds' weights.
    round_index?: number;
    round_score?: number;
    round_breakdown?: unknown;
  }>();

  const rounds = getRounds(session);

  // Load the existing player row so we can merge round scores.
  const existingRows = await db
    .select()
    .from(gamePlayers)
    .where(
      and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid))
    )
    .limit(1);
  const existing = existingRows[0] ?? null;

  // House-rules guard: submissions with a non-compliant architecture cannot
  // raise any recorded score (they may still lower it, e.g. via penalties).
  // Submissions without an architecture are trusted; our client always sends it.
  const compliant =
    body.architecture === undefined || architectureCompliant(body.architecture);

  // Merge the new round result into the per-round map.
  const prevRoundScores = (existing?.roundScores ?? {}) as Record<
    string,
    { score?: number; breakdown?: unknown; metrics?: unknown }
  >;
  let roundScores = prevRoundScores;
  let aggregate: number | null = null;
  if (body.round_index !== undefined && body.round_score !== undefined) {
    const prevRound = prevRoundScores[String(body.round_index)]?.score ?? 0;
    const roundScore = compliant
      ? body.round_score
      : Math.min(body.round_score, prevRound);
    roundScores = {
      ...prevRoundScores,
      [String(body.round_index)]: {
        score: roundScore,
        breakdown: body.round_breakdown ?? null,
        metrics: body.metrics ?? null,
      },
    };
    aggregate = computeAggregate(rounds, roundScores);
  }

  const updates: Partial<typeof gamePlayers.$inferInsert> = {
    lastSubmittedAt: new Date(),
  };
  if (body.architecture !== undefined)
    updates.architecture = body.architecture as object;
  if (body.score_breakdown !== undefined)
    updates.scoreBreakdown = body.score_breakdown as object;
  if (body.metrics !== undefined) updates.metrics = body.metrics as object;
  if (aggregate !== null) {
    updates.score = aggregate;
    updates.roundScores = roundScores as object;
  } else if (body.score !== undefined) {
    // Flat (legacy / non-round) submission, same no-gains-while-invalid rule.
    updates.score = compliant
      ? body.score
      : Math.min(body.score, existing?.score ?? 0);
  }

  if (!existing) {
    await db.insert(gamePlayers).values({
      sessionId: session.id,
      userId: user.uid,
      architecture: (body.architecture ?? session.startingArchitecture ?? null) as
        | object
        | null,
      score: aggregate ?? (compliant ? body.score ?? 0 : 0),
      scoreBreakdown: (body.score_breakdown ?? null) as object | null,
      roundScores: roundScores as object,
      metrics: (body.metrics ?? null) as object | null,
      lastSubmittedAt: new Date(),
    });
  } else {
    await db
      .update(gamePlayers)
      .set(updates)
      .where(
        and(
          eq(gamePlayers.sessionId, session.id),
          eq(gamePlayers.userId, user.uid)
        )
      );
  }

  return c.json({ ok: true });
});

// Ranked leaderboard for a match.
gameRouter.get('/api/game/:code/leaderboard', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  const leaderboard = await buildLeaderboard(session.id);
  return c.json({ leaderboard });
});

// Audience stage view: full live state for projecting scores to a room.
// Requires login (any user), not admin, so a venue screen can stay open on a
// regular account while the host drives the match from the admin console.
gameRouter.get('/api/game/:code/spectate', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });

  const players = await buildSpectatorPlayers(session.id);
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
    players,
  });
});
