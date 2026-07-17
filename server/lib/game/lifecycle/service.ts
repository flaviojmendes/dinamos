import type { gameSessions, gamePlayers } from '../../../db/schema';
import {
  applyHostAction,
  catchUpAutoTransitions,
  lobbyMustStartIntervalFirst,
  validateHostAction,
  LifecycleError,
  type HostLifecycleAction,
  type LifecycleState,
} from './fsm';
import { activeRoundIndex, getRoundsFromSession, roundConfigAt } from '../rounds';
import {
  capturePlayerArchSnapshot,
  captureRoundSnapshot,
  getPlayerArchSnapshot,
  getRoundSnapshot,
  mergePlayerArchSnapshot,
  mergeRoundSnapshot,
  mergeVerifiedRoundScore,
  readPlayerArchSnapshots,
  readRoundSnapshots,
  readVerifiedRoundScores,
} from '../snapshots';
import { computeEligibilityWindow } from '../eligibility';
import {
  computeVerifiedAggregate,
  recomputeVerifiedRoundScore,
  shouldFinalizeRound,
  shouldRunCheckpoint,
} from '../scoring/recompute';
import type { GameArchitecture } from '../../../../src/components/SystemEditor/game/types';

type SessionRow = typeof gameSessions.$inferSelect;
type PlayerRow = typeof gamePlayers.$inferSelect;

export { LifecycleError, lobbyMustStartIntervalFirst };

function toMs(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  return new Date(value).getTime();
}

export function sessionToLifecycleState(session: SessionRow, nowMs = Date.now()): LifecycleState {
  const rounds = getRoundsFromSession(session);
  return {
    phase: (session.phase ?? 'lobby') as LifecycleState['phase'],
    currentRound: session.currentRound ?? 0,
    totalRounds: rounds.length,
    autoTransitions: session.autoTransitions ?? true,
    lifecycleVersion: session.lifecycleVersion ?? 0,
    clock: {
      nowMs,
      intervalStartedAtMs: toMs(session.intervalStartedAt),
      intervalEndsAtMs: toMs(session.intervalEndsAt),
      roundStartedAtMs: toMs(session.roundStartedAt),
      roundEndsAtMs: toMs(session.roundEndsAt),
      pausedAtMs: toMs(session.pausedAt),
      totalPausedMs: session.totalPausedMs ?? 0,
    },
  };
}

export function lifecyclePatchToSessionUpdates(
  state: LifecycleState,
  prev: SessionRow,
): Partial<typeof gameSessions.$inferInsert> {
  const updates: Partial<typeof gameSessions.$inferInsert> = {
    phase: state.phase,
    currentRound: state.currentRound,
    lifecycleVersion: state.lifecycleVersion,
    intervalStartedAt: state.clock.intervalStartedAtMs
      ? new Date(state.clock.intervalStartedAtMs)
      : null,
    intervalEndsAt: state.clock.intervalEndsAtMs
      ? new Date(state.clock.intervalEndsAtMs)
      : null,
    roundStartedAt: state.clock.roundStartedAtMs
      ? new Date(state.clock.roundStartedAtMs)
      : null,
    roundEndsAt: state.clock.roundEndsAtMs ? new Date(state.clock.roundEndsAtMs) : null,
    pausedAt: state.clock.pausedAtMs ? new Date(state.clock.pausedAtMs) : null,
    totalPausedMs: state.clock.totalPausedMs,
    updatedAt: new Date(),
  };

  if (state.phase === 'round') {
    updates.status = 'running';
  } else if (state.phase === 'interval') {
    updates.status = 'paused';
  } else if (state.phase === 'ended') {
    updates.status = 'ended';
    updates.endsAt = new Date(state.clock.nowMs);
    updates.roundEndsAt = null;
  } else if (state.phase === 'lobby') {
    updates.status = prev.status === 'ended' ? 'ended' : 'lobby';
  }

  const roundIdx = activeRoundIndex(state.currentRound);
  const round = roundConfigAt(getRoundsFromSession(prev), roundIdx);
  if (state.phase === 'round' && round) {
    updates.loadProfile = round.loadProfile as object;
    updates.chaosEvents = round.chaosEvents as object;
    updates.scoringConfig = round.scoringConfig as object;
    if (!prev.startedAt) updates.startedAt = new Date(state.clock.roundStartedAtMs ?? state.clock.nowMs);
  }

  return updates;
}

export function roundTimingForState(
  state: LifecycleState,
  session: SessionRow,
): { intervalSec: number; durationSec: number } {
  const rounds = getRoundsFromSession(session);
  const idx =
    state.phase === 'interval'
      ? activeRoundIndex(state.currentRound)
      : Math.max(0, activeRoundIndex(state.currentRound) - (state.phase === 'round' ? 0 : 1));
  const round = roundConfigAt(rounds, idx) ?? rounds[0];
  return {
    intervalSec: round?.intervalSec ?? 60,
    durationSec: round?.durationSec ?? 120,
  };
}

/** Map legacy host route actions to the pure FSM vocabulary. */
export function mapLegacyHostAction(
  action: string,
  phase: string,
  addSec?: number,
): HostLifecycleAction | null {
  switch (action) {
    case 'open_interval':
      return { type: 'start_interval' };
    case 'start_round':
      if (phase === 'lobby') return null;
      return { type: 'start_round_early' };
    case 'start':
      if (phase === 'lobby') return { type: 'start_interval' };
      if (phase === 'interval') return { type: 'start_round_early' };
      return null;
    case 'pause':
      return { type: 'pause' };
    case 'resume':
      return { type: 'resume' };
    case 'end_round':
      return { type: 'end_round' };
    case 'end':
      return { type: 'end_match' };
    default:
      if (addSec !== undefined && addSec > 0) {
        if (phase === 'interval') return { type: 'extend_interval', addSec };
        if (phase === 'round') return { type: 'extend_round', addSec };
      }
      return null;
  }
}

export interface CatchUpResult {
  state: LifecycleState;
  changed: boolean;
  enteringRound: boolean;
  leavingRound: boolean;
  finalizedRoundIndex: number | null;
}

/** Advance overdue automatic transitions and detect round boundary crossings. */
export function catchUpSessionLifecycle(
  session: SessionRow,
  nowMs = Date.now(),
): CatchUpResult {
  const prev = sessionToLifecycleState(session, nowMs);
  const timing = roundTimingForState(prev, session);
  const { state, changed } = catchUpAutoTransitions(
    prev,
    timing.intervalSec,
    timing.durationSec,
  );

  const enteringRound = prev.phase !== 'round' && state.phase === 'round';
  const leavingRound = prev.phase === 'round' && state.phase !== 'round';
  const finalizedRoundIndex = leavingRound ? activeRoundIndex(prev.currentRound) : null;

  return { state, changed, enteringRound, leavingRound, finalizedRoundIndex };
}

export function applyHostLifecycleAction(
  session: SessionRow,
  action: HostLifecycleAction,
  nowMs = Date.now(),
): LifecycleState {
  const base = sessionToLifecycleState(session, nowMs);
  const timing = roundTimingForState(base, session);
  if (base.phase === 'lobby' && !lobbyMustStartIntervalFirst(action)) {
    throw new LifecycleError('Lobby must enter a build interval before starting a round');
  }
  validateHostAction(base, action);
  return applyHostAction(base, action, timing.intervalSec, timing.durationSec);
}

/** Capture immutable round config when a round begins. */
export function snapshotRoundConfig(
  session: SessionRow,
  roundIndex: number,
): Record<string, import('../types').RoundSnapshot> {
  const rounds = getRoundsFromSession(session);
  const round = roundConfigAt(rounds, roundIndex);
  if (!round) return readRoundSnapshots(session.roundSnapshots);
  const existing = readRoundSnapshots(session.roundSnapshots);
  return mergeRoundSnapshot(existing, captureRoundSnapshot(round, roundIndex));
}

/** Snapshot every joined player's architecture at round entry. */
export function snapshotPlayerArchitecturesForRound(
  players: PlayerRow[],
  roundIndex: number,
  origin: 'round_start' | 'late_join' = 'round_start',
): Array<{ userId: string; roundArchSnapshots: Record<string, import('../types').PlayerRoundArchSnapshot> }> {
  return players
    .filter((p) => p.architecture)
    .map((p) => {
      const existing = readPlayerArchSnapshots(p.roundArchSnapshots);
      const snap = capturePlayerArchSnapshot(
        p.architecture as GameArchitecture,
        roundIndex,
        origin,
      );
      return {
        userId: p.userId,
        roundArchSnapshots: mergePlayerArchSnapshot(existing, snap),
      };
    });
}

export function snapshotLateJoiner(
  player: PlayerRow,
  roundIndex: number,
): Record<string, import('../types').PlayerRoundArchSnapshot> {
  if (!player.architecture) return readPlayerArchSnapshots(player.roundArchSnapshots);
  const existing = readPlayerArchSnapshots(player.roundArchSnapshots);
  if (getPlayerArchSnapshot(existing, roundIndex)) return existing;
  return mergePlayerArchSnapshot(
    existing,
    capturePlayerArchSnapshot(player.architecture as GameArchitecture, roundIndex, 'late_join'),
  );
}

export interface PlayerScoreUpdate {
  userId: string;
  verifiedRoundScores: Record<string, import('../types').VerifiedRoundScore>;
  score: number;
  eligibleFromSec: number;
}

/** Recompute verified scores for one player during a live or ending round. */
export function recomputePlayerVerifiedScore(
  session: SessionRow,
  player: PlayerRow,
  roundIndex: number,
  nowMs: number,
  force = false,
): PlayerScoreUpdate | null {
  const roundSnapshots = readRoundSnapshots(session.roundSnapshots);
  const roundSnapshot = getRoundSnapshot(roundSnapshots, roundIndex);
  const archSnapshots = readPlayerArchSnapshots(player.roundArchSnapshots);
  const archSnapshot = getPlayerArchSnapshot(archSnapshots, roundIndex);
  if (!roundSnapshot || !archSnapshot) return null;

  const eligibility = computeEligibilityWindow({
    roundStartedAt: session.roundStartedAt,
    joinedAt: player.joinedAt,
    nowMs,
    pausedAt: session.pausedAt,
    totalPausedMs: session.totalPausedMs ?? 0,
    roundDurationSec: roundSnapshot.durationSec,
  });

  const verified = readVerifiedRoundScores(player.verifiedRoundScores);
  const prev = verified[String(roundIndex)];

  const phase = session.phase ?? 'lobby';
  const atEnd = phase !== 'round';
  if (!force && !atEnd && !shouldRunCheckpoint(eligibility.simElapsedSec, prev)) {
    return null;
  }
  if (!force && atEnd && !shouldFinalizeRound(phase, roundIndex, verified, session.lifecycleVersion ?? 0)) {
    return null;
  }

  const entry = recomputeVerifiedRoundScore({
    architecture: archSnapshot.architecture,
    seed: session.seed,
    roundSnapshot,
    eligibility,
    roundIndex,
    lifecycleVersion: session.lifecycleVersion ?? 0,
  });

  const merged = mergeVerifiedRoundScore(verified, entry);
  const rounds = getRoundsFromSession(session);
  return {
    userId: player.userId,
    verifiedRoundScores: merged,
    score: computeVerifiedAggregate(rounds, merged),
    eligibleFromSec: eligibility.eligibleFromSec,
  };
}

/** Finalize all players for the round that just ended. */
export function finalizeRoundScores(
  session: SessionRow,
  players: PlayerRow[],
  roundIndex: number,
  nowMs: number,
): PlayerScoreUpdate[] {
  return players
    .map((p) => recomputePlayerVerifiedScore(session, p, roundIndex, nowMs, true))
    .filter((u): u is PlayerScoreUpdate => u != null);
}

export function recomputeLiveCheckpoints(
  session: SessionRow,
  players: PlayerRow[],
  nowMs: number,
): PlayerScoreUpdate[] {
  if (session.phase !== 'round') return [];
  const roundIndex = activeRoundIndex(session.currentRound ?? 0);
  return players
    .map((p) => recomputePlayerVerifiedScore(session, p, roundIndex, nowMs, false))
    .filter((u): u is PlayerScoreUpdate => u != null);
}
