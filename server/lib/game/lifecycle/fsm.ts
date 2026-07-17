// Pure lifecycle state machine for Arena matches. Route handlers will invoke
// catchUpAutoTransitions and applyHostAction in a later phase; tests lock the
// contract here first.

export type GamePhase = 'lobby' | 'interval' | 'round' | 'ended';

export interface LifecycleClock {
  nowMs: number;
  intervalStartedAtMs: number | null;
  intervalEndsAtMs: number | null;
  roundStartedAtMs: number | null;
  roundEndsAtMs: number | null;
  pausedAtMs: number | null;
  totalPausedMs: number;
}

export interface LifecycleState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  autoTransitions: boolean;
  lifecycleVersion: number;
  clock: LifecycleClock;
}

export type HostLifecycleAction =
  | { type: 'start_interval' }
  | { type: 'start_round_early' }
  | { type: 'extend_interval'; addSec: number }
  | { type: 'extend_round'; addSec: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'end_round' }
  | { type: 'end_match' };

export interface LifecyclePatch {
  phase?: GamePhase;
  currentRound?: number;
  lifecycleVersion?: number;
  clock?: Partial<LifecycleClock>;
}

export class LifecycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LifecycleError';
  }
}

/** Effective "now" for deadline comparisons while paused. */
export function effectiveNowMs(clock: LifecycleClock): number {
  if (clock.pausedAtMs == null) return clock.nowMs;
  return clock.pausedAtMs;
}

function msFromSec(sec: number): number {
  return sec * 1000;
}

function cloneState(state: LifecycleState): LifecycleState {
  return {
    ...state,
    clock: { ...state.clock },
  };
}

function applyPatch(state: LifecycleState, patch: LifecyclePatch): LifecycleState {
  const next = cloneState(state);
  if (patch.phase !== undefined) next.phase = patch.phase;
  if (patch.currentRound !== undefined) next.currentRound = patch.currentRound;
  if (patch.lifecycleVersion !== undefined) next.lifecycleVersion = patch.lifecycleVersion;
  if (patch.clock) next.clock = { ...next.clock, ...patch.clock };
  return next;
}

/** Host actions validated before routes mutate the database. */
export function validateHostAction(state: LifecycleState, action: HostLifecycleAction): void {
  if (state.phase === 'ended') {
    throw new LifecycleError('Match already ended');
  }

  switch (action.type) {
    case 'start_interval':
      if (state.phase !== 'lobby' && state.phase !== 'interval') {
        throw new LifecycleError('Build interval can only start from lobby or interval');
      }
      return;
    case 'start_round_early':
      if (state.phase !== 'interval') {
        throw new LifecycleError('Round can only start early from a build interval');
      }
      return;
    case 'extend_interval':
      if (state.phase !== 'interval') {
        throw new LifecycleError('Can only extend the active build interval');
      }
      if (action.addSec <= 0) throw new LifecycleError('Extension must be positive');
      return;
    case 'extend_round':
      if (state.phase !== 'round') {
        throw new LifecycleError('Can only extend the active round');
      }
      if (action.addSec <= 0) throw new LifecycleError('Extension must be positive');
      return;
    case 'pause':
      if (state.phase !== 'round' && state.phase !== 'interval') {
        throw new LifecycleError('Can only pause during interval or round');
      }
      if (state.clock.pausedAtMs != null) throw new LifecycleError('Already paused');
      return;
    case 'resume':
      if (state.clock.pausedAtMs == null) throw new LifecycleError('Not paused');
      return;
    case 'end_round':
      if (state.phase !== 'round') throw new LifecycleError('No live round to end');
      return;
    case 'end_match':
      return;
    default:
      action satisfies never;
  }
}

/** Apply a validated host override and bump lifecycle_version. */
export function applyHostAction(
  state: LifecycleState,
  action: HostLifecycleAction,
  roundIntervalSec: number,
  roundDurationSec: number,
): LifecycleState {
  validateHostAction(state, action);
  const now = state.clock.nowMs;
  const version = state.lifecycleVersion + 1;

  switch (action.type) {
    case 'start_interval': {
      const endsAt = now + msFromSec(roundIntervalSec);
      return applyPatch(state, {
        phase: 'interval',
        currentRound: state.phase === 'lobby' ? 1 : state.currentRound,
        lifecycleVersion: version,
        clock: {
          intervalStartedAtMs: now,
          intervalEndsAtMs: endsAt,
          roundStartedAtMs: null,
          roundEndsAtMs: null,
          pausedAtMs: null,
        },
      });
    }
    case 'start_round_early': {
      const endsAt = now + msFromSec(roundDurationSec);
      return applyPatch(state, {
        phase: 'round',
        lifecycleVersion: version,
        clock: {
          roundStartedAtMs: now,
          roundEndsAtMs: endsAt,
          pausedAtMs: null,
        },
      });
    }
    case 'extend_interval': {
      const base = state.clock.intervalEndsAtMs ?? now;
      return applyPatch(state, {
        lifecycleVersion: version,
        clock: { intervalEndsAtMs: base + msFromSec(action.addSec) },
      });
    }
    case 'extend_round': {
      const base = state.clock.roundEndsAtMs ?? now;
      return applyPatch(state, {
        lifecycleVersion: version,
        clock: { roundEndsAtMs: base + msFromSec(action.addSec) },
      });
    }
    case 'pause':
      return applyPatch(state, {
        lifecycleVersion: version,
        clock: { pausedAtMs: now },
      });
    case 'resume': {
      const pausedAt = state.clock.pausedAtMs!;
      const delta = now - pausedAt;
      const patch: Partial<LifecycleClock> = {
        pausedAtMs: null,
        totalPausedMs: state.clock.totalPausedMs + delta,
      };
      if (state.clock.intervalEndsAtMs != null) {
        patch.intervalEndsAtMs = state.clock.intervalEndsAtMs + delta;
      }
      if (state.clock.roundEndsAtMs != null) {
        patch.roundEndsAtMs = state.clock.roundEndsAtMs + delta;
      }
      return applyPatch(state, { lifecycleVersion: version, clock: patch });
    }
    case 'end_round': {
      const nextRound = state.currentRound + 1;
      if (nextRound > state.totalRounds) {
        return applyPatch(state, {
          phase: 'ended',
          lifecycleVersion: version,
          clock: { roundStartedAtMs: null, roundEndsAtMs: null, pausedAtMs: null },
        });
      }
      const endsAt = now + msFromSec(roundIntervalSec);
      return applyPatch(state, {
        phase: 'interval',
        currentRound: nextRound,
        lifecycleVersion: version,
        clock: {
          intervalStartedAtMs: now,
          intervalEndsAtMs: endsAt,
          roundStartedAtMs: null,
          roundEndsAtMs: null,
          pausedAtMs: null,
        },
      });
    }
    case 'end_match':
      return applyPatch(state, {
        phase: 'ended',
        lifecycleVersion: version,
        clock: {
          intervalStartedAtMs: null,
          intervalEndsAtMs: null,
          roundStartedAtMs: null,
          roundEndsAtMs: null,
          pausedAtMs: null,
        },
      });
    default:
      action satisfies never;
      return state;
  }
}

/**
 * Idempotently advance overdue automatic transitions. Returns the updated state
 * and whether anything changed (for lifecycle_version bumps in routes).
 */
export function catchUpAutoTransitions(
  state: LifecycleState,
  roundIntervalSec: number,
  roundDurationSec: number,
): { state: LifecycleState; changed: boolean } {
  if (!state.autoTransitions || state.phase === 'ended') {
    return { state, changed: false };
  }

  let current = cloneState(state);
  let changed = false;
  const maxSteps = state.totalRounds * 4 + 4;

  for (let step = 0; step < maxSteps; step++) {
    const now = effectiveNowMs(current.clock);
    current.clock.nowMs = state.clock.nowMs;

    if (current.phase === 'lobby') {
      // Automatic lobby→interval is host-driven in v1; catch-up stays idle.
      break;
    }

    if (
      current.phase === 'interval' &&
      current.clock.intervalEndsAtMs != null &&
      now >= current.clock.intervalEndsAtMs
    ) {
      const endsAt = now + msFromSec(roundDurationSec);
      current = applyPatch(current, {
        phase: 'round',
        lifecycleVersion: current.lifecycleVersion + 1,
        clock: {
          roundStartedAtMs: now,
          roundEndsAtMs: endsAt,
        },
      });
      changed = true;
      continue;
    }

    if (
      current.phase === 'round' &&
      current.clock.roundEndsAtMs != null &&
      now >= current.clock.roundEndsAtMs
    ) {
      const nextRound = current.currentRound + 1;
      if (nextRound > current.totalRounds) {
        current = applyPatch(current, {
          phase: 'ended',
          lifecycleVersion: current.lifecycleVersion + 1,
          clock: {
            intervalStartedAtMs: null,
            intervalEndsAtMs: null,
            roundStartedAtMs: null,
            roundEndsAtMs: null,
            pausedAtMs: null,
          },
        });
      } else {
        const endsAt = now + msFromSec(roundIntervalSec);
        current = applyPatch(current, {
          phase: 'interval',
          currentRound: nextRound,
          lifecycleVersion: current.lifecycleVersion + 1,
          clock: {
            intervalStartedAtMs: now,
            intervalEndsAtMs: endsAt,
            roundStartedAtMs: null,
            roundEndsAtMs: null,
          },
        });
      }
      changed = true;
      continue;
    }

    break;
  }

  return { state: current, changed };
}

/** Lobby cannot jump straight into round one — always require a build interval. */
export function lobbyMustStartIntervalFirst(action: HostLifecycleAction): boolean {
  return action.type !== 'start_round_early';
}
