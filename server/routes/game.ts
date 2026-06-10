import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client.js';
import { gameSessions, gamePlayers, users } from '../db/schema.js';
import {
  authRequired,
  adminRequired,
  type AppVariables,
} from '../middleware/auth.js';

export const gameRouter = new Hono<{ Variables: AppVariables }>();

// Admin-only mutations live under /api/admin/game*.
gameRouter.use('/api/admin/game', authRequired, adminRequired);
gameRouter.use('/api/admin/game/*', authRequired, adminRequired);
// Player-facing routes only require a logged-in user.
gameRouter.use('/api/game/*', authRequired);

type SessionRow = typeof gameSessions.$inferSelect;

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
    intervalSec: Number(raw?.intervalSec ?? 60),
    durationSec: Number(raw?.durationSec ?? 120),
    loadProfile: raw?.loadProfile ?? DEFAULT_LOAD_PROFILE,
    chaosEvents: Array.isArray(raw?.chaosEvents) ? raw!.chaosEvents : [],
    scoringConfig: { ...DEFAULT_SCORING, ...(raw?.scoringConfig ?? {}) },
    weight: Number(raw?.weight ?? 1),
  };
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
    created_by: session.createdBy,
    created_at: toIso(session.createdAt),
    updated_at: toIso(session.updatedAt),
    server_time: new Date().toISOString(),
  };
}

// ==================== Admin endpoints ====================

// List recent matches for the admin console.
gameRouter.get('/api/admin/game', async (c) => {
  const rows = await db
    .select()
    .from(gameSessions)
    .orderBy(desc(gameSessions.createdAt))
    .limit(50);
  return c.json({ sessions: rows.map(adminSessionToDict) });
});

// Create a new match.
gameRouter.post('/api/admin/game', async (c) => {
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
      createdBy: user.uid,
    })
    .returning();

  return c.json(adminSessionToDict(inserted[0]), 201);
});

// Full admin view of a single match (config + live leaderboard).
gameRouter.get('/api/admin/game/:code', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  const leaderboard = await buildLeaderboard(session.id);
  return c.json({ ...adminSessionToDict(session), leaderboard });
});

// Update a match: status transitions, broadcast traffic, schedule, etc.
gameRouter.patch('/api/admin/game/:code', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });

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
  }>();

  const updates: Partial<typeof gameSessions.$inferInsert> = { updatedAt: new Date() };

  if (body.name !== undefined) updates.name = body.name;
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
gameRouter.post('/api/admin/game/:code/chaos', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });

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

// Live spectator view: every player's current architecture + activity stats.
gameRouter.get('/api/admin/game/:code/players', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });

  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id))
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

  const result = players.map((p, i) => {
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

  return c.json({ server_time: new Date().toISOString(), players: result });
});

// Broadcast (or clear) an announcement shown to all players in the match.
gameRouter.post('/api/admin/game/:code/announce', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });

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
gameRouter.delete('/api/admin/game/:code/players/:userId', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  const userId = c.req.param('userId');

  await db
    .delete(gamePlayers)
    .where(
      and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, userId))
    );

  return c.json({ ok: true });
});

// Delete (soft-end) a match.
gameRouter.delete('/api/admin/game/:code', async (c) => {
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
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
async function playerSessionToDict(session: SessionRow, userId: string) {
  const playerRows = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));
  const me = playerRows.find((p) => p.userId === userId) ?? null;

  return {
    code: session.code,
    name: session.name,
    status: session.status,
    seed: session.seed,
    starts_at: toIso(session.startsAt),
    started_at: toIso(session.startedAt),
    ends_at: toIso(session.endsAt),
    duration_sec: session.durationSec,
    server_time: new Date().toISOString(),
    load_profile: session.loadProfile ?? DEFAULT_LOAD_PROFILE,
    chaos_events: session.chaosEvents ?? [],
    locked_node_ids: session.lockedNodeIds ?? [],
    allow_delete_starting: session.allowDeleteStarting ?? true,
    scoring_config: session.scoringConfig ?? DEFAULT_SCORING,
    budget: session.budget ?? null,
    phase: session.phase ?? 'lobby',
    current_round: session.currentRound ?? 0,
    total_rounds: getRounds(session).length,
    round_started_at: toIso(session.roundStartedAt),
    round_ends_at: toIso(session.roundEndsAt),
    announcement: session.announcement ?? null,
    announcement_at: toIso(session.announcementAt),
    starting_architecture: session.startingArchitecture ?? null,
    player_count: playerRows.length,
    joined: !!me,
    my_architecture: me?.architecture ?? null,
    my_score: me?.score ?? 0,
    my_round_scores: me?.roundScores ?? {},
  };
}

// Poll the control state for a match.
gameRouter.get('/api/game/:code', async (c) => {
  const user = c.get('user');
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  return c.json(await playerSessionToDict(session, user.uid));
});

// Join a match (idempotent). Seeds the player's architecture from the start.
gameRouter.post('/api/game/:code/join', async (c) => {
  const user = c.get('user');
  const session = await getSessionByCode(c.req.param('code'));
  if (!session) throw new HTTPException(404, { message: 'Match not found' });
  if (session.status === 'ended')
    throw new HTTPException(409, { message: 'This match has already ended' });

  const existing = await db
    .select()
    .from(gamePlayers)
    .where(
      and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid))
    )
    .limit(1);

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

  // Merge the new round result into the per-round map.
  const prevRoundScores = (existing?.roundScores ?? {}) as Record<
    string,
    { score?: number; breakdown?: unknown; metrics?: unknown }
  >;
  let roundScores = prevRoundScores;
  let aggregate: number | null = null;
  if (body.round_index !== undefined && body.round_score !== undefined) {
    roundScores = {
      ...prevRoundScores,
      [String(body.round_index)]: {
        score: body.round_score,
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
    // Flat (legacy / non-round) submission.
    updates.score = body.score;
  }

  if (!existing) {
    await db.insert(gamePlayers).values({
      sessionId: session.id,
      userId: user.uid,
      architecture: (body.architecture ?? session.startingArchitecture ?? null) as
        | object
        | null,
      score: aggregate ?? body.score ?? 0,
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
