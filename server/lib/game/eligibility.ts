import { effectiveNowMs, type LifecycleClock } from './lifecycle/fsm';

export interface EligibilityWindow {
  /** Simulated seconds elapsed since round start (excluding pause). */
  simElapsedSec: number;
  /** Offset from round start before this player accrues score. */
  eligibleFromSec: number;
  /** Inclusive lower tick bound for scoring (1-based ticks). */
  eligibleFromTick: number;
  /** Exclusive upper tick bound for scoring. */
  eligibleToTick: number;
}

function toMs(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  return new Date(value).getTime();
}

/** Pause-aware effective now for a DB session row. */
export function sessionEffectiveNowMs(
  nowMs: number,
  pausedAt: Date | string | null | undefined,
): number {
  const pausedAtMs = toMs(pausedAt);
  if (pausedAtMs == null) return nowMs;
  return pausedAtMs;
}

/** Seconds of eligible simulation time for a player within the active round. */
export function computeEligibilityWindow(params: {
  roundStartedAt: Date | string | null | undefined;
  joinedAt: Date | string | null | undefined;
  nowMs: number;
  pausedAt: Date | string | null | undefined;
  totalPausedMs: number;
  roundDurationSec: number;
}): EligibilityWindow {
  const roundStartMs = toMs(params.roundStartedAt);
  const joinedMs = toMs(params.joinedAt) ?? roundStartMs ?? params.nowMs;
  const effectiveNow = sessionEffectiveNowMs(params.nowMs, params.pausedAt);

  if (roundStartMs == null) {
    return {
      simElapsedSec: 0,
      eligibleFromSec: 0,
      eligibleFromTick: 1,
      eligibleToTick: 1,
    };
  }

  const eligibleStartMs = Math.max(roundStartMs, joinedMs);
  const eligibleFromSec = Math.max(0, (eligibleStartMs - roundStartMs) / 1000);

  const simElapsedSec = Math.max(
    0,
    (effectiveNow - eligibleStartMs - params.totalPausedMs) / 1000,
  );
  const cappedElapsed = Math.min(simElapsedSec, params.roundDurationSec);

  const eligibleFromTick = Math.floor(eligibleFromSec) + 1;
  const eligibleToTick = Math.min(
    params.roundDurationSec,
    Math.max(eligibleFromTick, Math.ceil(cappedElapsed)),
  );

  return {
    simElapsedSec: cappedElapsed,
    eligibleFromSec,
    eligibleFromTick,
    eligibleToTick,
  };
}

export function clockFromSession(params: {
  nowMs: number;
  intervalStartedAt?: Date | string | null;
  intervalEndsAt?: Date | string | null;
  roundStartedAt?: Date | string | null;
  roundEndsAt?: Date | string | null;
  pausedAt?: Date | string | null;
  totalPausedMs?: number | null;
}): LifecycleClock {
  return {
    nowMs: params.nowMs,
    intervalStartedAtMs: toMs(params.intervalStartedAt),
    intervalEndsAtMs: toMs(params.intervalEndsAt),
    roundStartedAtMs: toMs(params.roundStartedAt),
    roundEndsAtMs: toMs(params.roundEndsAt),
    pausedAtMs: toMs(params.pausedAt),
    totalPausedMs: params.totalPausedMs ?? 0,
  };
}

export function effectiveNowFromClock(clock: LifecycleClock): number {
  return effectiveNowMs(clock);
}

/** Seconds remaining until interval or round deadline (truthful server countdown). */
export function secondsUntilDeadline(
  phase: string,
  clock: LifecycleClock,
): number | null {
  const now = effectiveNowMs(clock);
  if (phase === 'interval' && clock.intervalEndsAtMs != null) {
    return Math.max(0, Math.ceil((clock.intervalEndsAtMs - now) / 1000));
  }
  if (phase === 'round' && clock.roundEndsAtMs != null) {
    return Math.max(0, Math.ceil((clock.roundEndsAtMs - now) / 1000));
  }
  return null;
}

export function isPaused(clock: LifecycleClock): boolean {
  return clock.pausedAtMs != null;
}
