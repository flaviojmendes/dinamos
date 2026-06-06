import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client';
import { gameSessions, gamePlayers, users } from '../db/schema';
import {
  authRequired,
  adminRequired,
  type AppVariables,
} from '../middleware/auth';

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

/** Seconds of match-time elapsed since the match started running. */
function matchElapsedSec(session: SessionRow): number {
  if (!session.startedAt) return 0;
  const started = new Date(session.startedAt).getTime();
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
  }>();

  const code = await generateUniqueCode();
  const inserted = await db
    .insert(gameSessions)
    .values({
      code,
      name: body.name ?? null,
      status: 'lobby',
      seed: body.seed ?? 1,
      startsAt: body.starts_at ? new Date(body.starts_at) : null,
      startingArchitecture: (body.starting_architecture ?? null) as object | null,
      lockedNodeIds: (body.locked_node_ids ?? []) as object,
      allowDeleteStarting: body.allow_delete_starting ?? true,
      loadProfile: (body.load_profile ?? DEFAULT_LOAD_PROFILE) as object,
      chaosEvents: [] as object,
      scoringConfig: (body.scoring_config ?? DEFAULT_SCORING) as object,
      budget: (body.budget ?? null) as object | null,
      durationSec: body.duration_sec ?? null,
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
    action?: 'start' | 'pause' | 'resume' | 'end';
    name?: string;
    seed?: number;
    starts_at?: string | null;
    duration_sec?: number | null;
    // Shift the running match's end time by this many seconds (+/-).
    add_sec?: number;
    load_profile?: { type: string };
    scoring_config?: Record<string, number>;
    allow_delete_starting?: boolean;
    locked_node_ids?: string[];
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

  if (body.action === 'start') {
    updates.status = 'running';
    const startedAt = new Date();
    updates.startedAt = startedAt;
    if (!body.starts_at) updates.startsAt = startedAt;
  } else if (body.action === 'pause') {
    updates.status = 'paused';
  } else if (body.action === 'resume') {
    updates.status = 'running';
  } else if (body.action === 'end') {
    updates.status = 'ended';
    updates.endsAt = new Date();
  }

  // ----- Time math (kept consistent across start / duration / add_sec) -----
  if (body.action !== 'end') {
    const startedAt = updates.startedAt ?? session.startedAt;
    const effectiveDuration =
      body.duration_sec !== undefined ? body.duration_sec : session.durationSec;

    // Recompute ends_at whenever we know a start time and a duration.
    if (startedAt && effectiveDuration) {
      updates.endsAt = new Date(
        new Date(startedAt).getTime() + effectiveDuration * 1000
      );
    } else if (body.duration_sec === null) {
      updates.endsAt = null; // duration cleared => open-ended match
    }

    // Extend/shorten relative to the (possibly just recomputed) end time.
    if (body.add_sec !== undefined && body.add_sec !== 0) {
      const baseEnds = updates.endsAt ?? session.endsAt;
      const baseMs = baseEnds ? new Date(baseEnds).getTime() : Date.now();
      const newEnds = new Date(baseMs + body.add_sec * 1000);
      updates.endsAt = newEnds;
      if (startedAt) {
        updates.durationSec = Math.max(
          0,
          Math.round((newEnds.getTime() - new Date(startedAt).getTime()) / 1000)
        );
      }
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
  const startSec = matchElapsedSec(session) + 2;
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
    announcement: session.announcement ?? null,
    announcement_at: toIso(session.announcementAt),
    starting_architecture: session.startingArchitecture ?? null,
    player_count: playerRows.length,
    joined: !!me,
    my_architecture: me?.architecture ?? null,
    my_score: me?.score ?? 0,
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
  }>();

  const updates: Partial<typeof gamePlayers.$inferInsert> = {
    lastSubmittedAt: new Date(),
  };
  if (body.architecture !== undefined)
    updates.architecture = body.architecture as object;
  if (body.score !== undefined) updates.score = body.score;
  if (body.score_breakdown !== undefined)
    updates.scoreBreakdown = body.score_breakdown as object;
  if (body.metrics !== undefined) updates.metrics = body.metrics as object;

  // Upsert: create the player row if they submit before an explicit join.
  const existing = await db
    .select({ id: gamePlayers.id })
    .from(gamePlayers)
    .where(
      and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, user.uid))
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(gamePlayers).values({
      sessionId: session.id,
      userId: user.uid,
      architecture: (body.architecture ?? session.startingArchitecture ?? null) as
        | object
        | null,
      score: body.score ?? 0,
      scoreBreakdown: (body.score_breakdown ?? null) as object | null,
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
