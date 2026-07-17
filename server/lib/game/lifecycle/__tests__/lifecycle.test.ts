import { describe, it, expect } from 'vitest';
import {
  applyHostAction,
  catchUpAutoTransitions,
  effectiveNowMs,
  lobbyMustStartIntervalFirst,
  validateHostAction,
  type LifecycleState,
  LifecycleError,
} from '../fsm';
import { shouldFinalizeRound } from '../../scoring/recompute';

function baseState(overrides: Partial<LifecycleState> = {}): LifecycleState {
  const nowMs = 1_700_000_000_000;
  return {
    phase: 'lobby',
    currentRound: 0,
    totalRounds: 2,
    autoTransitions: true,
    lifecycleVersion: 0,
    clock: {
      nowMs,
      intervalStartedAtMs: null,
      intervalEndsAtMs: null,
      roundStartedAtMs: null,
      roundEndsAtMs: null,
      pausedAtMs: null,
      totalPausedMs: 0,
    },
    ...overrides,
  };
}

describe('lifecycle FSM', () => {
  it('requires lobby to enter a build interval before a round', () => {
    const state = baseState();
    expect(() => validateHostAction(state, { type: 'start_round_early' })).toThrow(LifecycleError);
    expect(lobbyMustStartIntervalFirst({ type: 'start_round_early' })).toBe(false);
    expect(lobbyMustStartIntervalFirst({ type: 'start_interval' })).toBe(true);
  });

  it('starts the first build interval from lobby', () => {
    const next = applyHostAction(baseState(), { type: 'start_interval' }, 60, 120);
    expect(next.phase).toBe('interval');
    expect(next.currentRound).toBe(1);
    expect(next.clock.intervalStartedAtMs).toBeTruthy();
    expect(next.clock.intervalEndsAtMs).toBe(next.clock.intervalStartedAtMs! + 60_000);
    expect(next.lifecycleVersion).toBe(1);
  });

  it('auto-transitions interval to round when the build window expires', () => {
    const started = applyHostAction(baseState(), { type: 'start_interval' }, 60, 90);
    const atEnd = {
      ...started,
      clock: { ...started.clock, nowMs: started.clock.intervalEndsAtMs! + 1 },
    };
    const { state, changed } = catchUpAutoTransitions(atEnd, 60, 90);
    expect(changed).toBe(true);
    expect(state.phase).toBe('round');
    expect(state.clock.roundStartedAtMs).toBe(atEnd.clock.nowMs);
    expect(state.clock.roundEndsAtMs).toBe(atEnd.clock.nowMs + 90_000);
  });

  it('freezes effective now while paused', () => {
    const interval = applyHostAction(baseState(), { type: 'start_interval' }, 60, 120);
    const round = applyHostAction(interval, { type: 'start_round_early' }, 60, 120);
    const paused = applyHostAction(round, { type: 'pause' }, 60, 120);
    const later = {
      ...paused,
      clock: { ...paused.clock, nowMs: paused.clock.nowMs + 30_000 },
    };
    expect(effectiveNowMs(later.clock)).toBe(paused.clock.pausedAtMs);
  });

  it('extends deadlines and accumulates paused duration on resume', () => {
    const interval = applyHostAction(baseState(), { type: 'start_interval' }, 60, 120);
    const round = applyHostAction(interval, { type: 'start_round_early' }, 60, 120);
    const paused = applyHostAction(round, { type: 'pause' }, 60, 120);
    const roundEndsBefore = paused.clock.roundEndsAtMs!;
    const resumed = applyHostAction(
      { ...paused, clock: { ...paused.clock, nowMs: paused.clock.nowMs + 12_000 } },
      { type: 'resume' },
      60,
      120,
    );
    expect(resumed.clock.totalPausedMs).toBe(12_000);
    expect(resumed.clock.roundEndsAtMs).toBe(roundEndsBefore + 12_000);
    expect(resumed.clock.pausedAtMs).toBeNull();
  });

  it('auto-advances round to the next interval and eventually ends', () => {
    let state = applyHostAction(baseState(), { type: 'start_interval' }, 30, 40);
    state = applyHostAction(state, { type: 'start_round_early' }, 30, 40);
    state = {
      ...state,
      clock: { ...state.clock, nowMs: state.clock.roundEndsAtMs! + 1 },
    };
    let caught = catchUpAutoTransitions(state, 30, 40);
    expect(caught.state.phase).toBe('interval');
    expect(caught.state.currentRound).toBe(2);

    const roundTwo = applyHostAction(caught.state, { type: 'start_round_early' }, 30, 40);
    const afterRoundTwo = {
      ...roundTwo,
      clock: { ...roundTwo.clock, nowMs: roundTwo.clock.roundEndsAtMs! + 1 },
    };
    caught = catchUpAutoTransitions(afterRoundTwo, 30, 40);
    expect(caught.state.phase).toBe('ended');
  });

  it('catchUp auto-transition is idempotent once deadlines are satisfied', () => {
    let state = applyHostAction(baseState(), { type: 'start_interval' }, 10, 20);
    state = {
      ...state,
      clock: { ...state.clock, nowMs: state.clock.intervalEndsAtMs! + 1 },
    };
    const first = catchUpAutoTransitions(state, 10, 20);
    const second = catchUpAutoTransitions(first.state, 10, 20);
    expect(first.changed).toBe(true);
    expect(second.changed).toBe(false);
    expect(second.state.phase).toBe('round');
  });

  it('finalizes verified scores before transitioning to the next interval', () => {
    expect(shouldFinalizeRound('interval', 0, {}, 3)).toBe(true);
    expect(shouldFinalizeRound('round', 0, {}, 3)).toBe(false);
  });
});
