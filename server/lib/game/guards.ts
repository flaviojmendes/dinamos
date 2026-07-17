import { HTTPException } from 'hono/http-exception';
import type { gamePlayers, gameSessions } from '../../db/schema';
import { emitGameTelemetry } from './telemetry.js';

type SessionRow = typeof gameSessions.$inferSelect;
type PlayerRow = typeof gamePlayers.$inferSelect;

/** @deprecated Use throwGuard — kept for imports that reference the type name. */
export class GameGuardError extends HTTPException {
  constructor(status: 400 | 403 | 409, message: string) {
    super(status, { message });
  }
}

function throwGuard(
  status: 400 | 403 | 409,
  message: string,
  meta?: { sessionCode?: string; userId?: string; phase?: string },
): never {
  if (meta?.sessionCode) {
    emitGameTelemetry({
      type: 'rejected_write',
      sessionCode: meta.sessionCode,
      userId: meta.userId ?? 'unknown',
      reason: message,
      status,
      phase: meta.phase,
    });
  }
  throw new HTTPException(status, { message });
}

export function assertMatchNotEnded(
  session: SessionRow,
  meta?: { sessionCode?: string; userId?: string },
): void {
  if (session.phase === 'ended' || session.status === 'ended') {
    throwGuard(409, 'This match has already ended', {
      sessionCode: meta?.sessionCode ?? session.code,
      userId: meta?.userId,
      phase: session.phase ?? undefined,
    });
  }
}

export function assertExistingPlayer(
  player: PlayerRow | null | undefined,
  userId: string,
  session?: SessionRow,
): asserts player is PlayerRow {
  if (!player) {
    throwGuard(403, 'Join the match before submitting', {
      sessionCode: session?.code,
      userId,
      phase: session?.phase ?? undefined,
    });
  }
}

export function assertScoreWritePhase(session: SessionRow): void {
  if (session.phase !== 'round') {
    throwGuard(409, 'Scores can only be submitted during a live round', {
      sessionCode: session.code,
      phase: session.phase ?? undefined,
    });
  }
}

export function assertRoundIndexInRange(
  roundIndex: number,
  totalRounds: number,
  session?: SessionRow,
  userId?: string,
): void {
  if (!Number.isInteger(roundIndex) || roundIndex < 0 || roundIndex >= totalRounds) {
    throwGuard(400, 'Invalid round_index', {
      sessionCode: session?.code,
      userId,
      phase: session?.phase ?? undefined,
    });
  }
}

export function assertArchitectureEditablePhase(session: SessionRow, userId?: string): void {
  if (session.phase === 'round') {
    throwGuard(409, 'Architecture is frozen during a live round', {
      sessionCode: session.code,
      userId,
      phase: session.phase ?? undefined,
    });
  }
  if (session.phase === 'ended') {
    throwGuard(409, 'This match has already ended', {
      sessionCode: session.code,
      userId,
      phase: session.phase ?? undefined,
    });
  }
}

export function assertNotKicked(session: SessionRow, userId: string): void {
  const kicked = (session.kickedUserIds ?? []) as string[];
  if (kicked.includes(userId)) {
    throwGuard(403, 'You were removed from this match', {
      sessionCode: session.code,
      userId,
      phase: session.phase ?? undefined,
    });
  }
}

export function assertCapacity(session: SessionRow, currentCount: number): void {
  const max = session.maxPlayers ?? 32;
  if (currentCount >= max) {
    throwGuard(409, 'This match is full', {
      sessionCode: session.code,
      phase: session.phase ?? undefined,
    });
  }
}

export function assertJoinAuthorized(
  session: SessionRow,
  userId: string,
  isExisting: boolean,
  inviteKey?: string,
): void {
  assertNotKicked(session, userId);
  if (isExisting || session.createdBy === userId) return;
  if (session.joinOpen === false && (!session.joinKey || inviteKey !== session.joinKey)) {
    throwGuard(403, 'This match is invite-only', {
      sessionCode: session.code,
      userId,
      phase: session.phase ?? undefined,
    });
  }
}
