import { and, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { gamePlayers, gameSessions } from '../../db/schema.js';
import {
  catchUpSessionLifecycle,
  finalizeRoundScores,
  lifecyclePatchToSessionUpdates,
  recomputeLiveCheckpoints,
  snapshotPlayerArchitecturesForRound,
  snapshotRoundConfig,
} from './lifecycle/service';
import { recordArenaProgression } from './progression.js';
import { emitGameTelemetry } from './telemetry.js';
import { activeRoundIndex } from './rounds';

type SessionRow = typeof gameSessions.$inferSelect;

export interface SyncSessionResult {
  session: SessionRow;
  lifecycleChanged: boolean;
  scoreUpdates: number;
}

async function persistPlayerScoreUpdates(
  sessionId: number,
  updates: Array<{
    userId: string;
    verifiedRoundScores: object;
    score: number;
    eligibleFromSec: number;
  }>,
): Promise<number> {
  let count = 0;
  for (const u of updates) {
    await db
      .update(gamePlayers)
      .set({
        verifiedRoundScores: u.verifiedRoundScores,
        score: u.score,
        eligibleFromSec: u.eligibleFromSec,
      })
      .where(and(eq(gamePlayers.sessionId, sessionId), eq(gamePlayers.userId, u.userId)));
    count++;
  }
  return count;
}

async function snapshotRoundEntry(session: SessionRow, roundIndex: number): Promise<void> {
  const roundSnapshots = snapshotRoundConfig(session, roundIndex);
  await db
    .update(gameSessions)
    .set({ roundSnapshots: roundSnapshots as object })
    .where(eq(gameSessions.id, session.id));

  const players = await db
    .select()
    .from(gamePlayers)
    .where(eq(gamePlayers.sessionId, session.id));
  const snaps = snapshotPlayerArchitecturesForRound(players, roundIndex);
  for (const s of snaps) {
    await db
      .update(gamePlayers)
      .set({ roundArchSnapshots: s.roundArchSnapshots as object })
      .where(and(eq(gamePlayers.sessionId, session.id), eq(gamePlayers.userId, s.userId)));
  }
}

/**
 * Idempotent lifecycle catch-up, round-entry snapshots, live checkpoints, and
 * round-end finalization. Invoked from poll and mutation routes.
 */
export async function syncSessionLifecycle(
  session: SessionRow,
  nowMs = Date.now(),
): Promise<SyncSessionResult> {
  let current = session;
  let lifecycleChanged = false;
  let scoreUpdates = 0;

  const catchUp = catchUpSessionLifecycle(current, nowMs);

  if (catchUp.changed) {
    emitGameTelemetry({
      type: 'lifecycle_transition',
      sessionCode: current.code,
      fromPhase: session.phase ?? 'lobby',
      toPhase: catchUp.state.phase,
      lifecycleVersion: catchUp.state.lifecycleVersion,
      trigger: 'auto',
    });
    const updates = lifecyclePatchToSessionUpdates(catchUp.state, current);
    const [updated] = await db
      .update(gameSessions)
      .set(updates)
      .where(eq(gameSessions.id, current.id))
      .returning();
    if (updated) current = updated;
    lifecycleChanged = true;

    if (catchUp.enteringRound) {
      await snapshotRoundEntry(current, activeRoundIndex(current.currentRound));
    }
  }

  if (catchUp.leavingRound && catchUp.finalizedRoundIndex != null) {
    const players = await db
      .select()
      .from(gamePlayers)
      .where(eq(gamePlayers.sessionId, current.id));
    const finalized = finalizeRoundScores(
      current,
      players,
      catchUp.finalizedRoundIndex,
      nowMs,
    );
    scoreUpdates += await persistPlayerScoreUpdates(
      current.id,
      finalized.map((u) => ({
        userId: u.userId,
        verifiedRoundScores: u.verifiedRoundScores as object,
        score: u.score,
        eligibleFromSec: u.eligibleFromSec,
      })),
    );
  } else if (current.phase === 'round') {
    const players = await db
      .select()
      .from(gamePlayers)
      .where(eq(gamePlayers.sessionId, current.id));
    const t0 = Date.now();
    const checkpoints = recomputeLiveCheckpoints(current, players, nowMs);
    if (checkpoints.length > 0) {
      emitGameTelemetry({
        type: 'recompute_duration',
        sessionCode: current.code,
        roundIndex: activeRoundIndex(current.currentRound ?? 0),
        playerCount: checkpoints.length,
        durationMs: Date.now() - t0,
        trigger: 'checkpoint',
      });
    }
    scoreUpdates += await persistPlayerScoreUpdates(
      current.id,
      checkpoints.map((u) => ({
        userId: u.userId,
        verifiedRoundScores: u.verifiedRoundScores as object,
        score: u.score,
        eligibleFromSec: u.eligibleFromSec,
      })),
    );
  }

  if (lifecycleChanged || scoreUpdates > 0) {
    const rows = await db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.id, current.id))
      .limit(1);
    current = rows[0] ?? current;
  }

  if (current.phase === 'ended') {
    try {
      await recordArenaProgression(current);
    } catch (err) {
      emitGameTelemetry({
        type: 'sync_failure',
        sessionCode: current.code,
        operation: 'record_arena_progression',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { session: current, lifecycleChanged, scoreUpdates };
}

/** Snapshot round config + player architectures after a host-driven round start. */
export async function onRoundEntered(sessionId: number, roundIndex: number): Promise<void> {
  const [session] = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.id, sessionId))
    .limit(1);
  if (!session) return;
  await snapshotRoundEntry(session, roundIndex);
}

export async function applyHostLifecycleToDb(
  session: SessionRow,
  updates: Partial<typeof gameSessions.$inferInsert>,
  enteredRound: boolean,
  roundIndex: number | null,
): Promise<SessionRow> {
  const [updated] = await db
    .update(gameSessions)
    .set(updates)
    .where(eq(gameSessions.id, session.id))
    .returning();

  if (enteredRound && roundIndex != null) {
    await onRoundEntered(session.id, roundIndex);
  }

  const { session: synced } = await syncSessionLifecycle(updated);
  return synced;
}

export type { SessionRow };
