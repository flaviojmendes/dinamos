import { describe, it, expect } from 'vitest';
import {
  CircuitBreaker,
  afterRetryFailProb,
  combineFailureProbs,
  expectedAttempts,
  timeoutFailureProb,
} from '../failureModel';

describe('failure model', () => {
  it('expectedAttempts follows the truncated geometric series', () => {
    // f = 0.5, m = 2 -> 1 + 0.5 + 0.25 = 1.75
    expect(expectedAttempts(0.5, { maxRetries: 2, backoffBaseMs: 10, jitter: false })).toBeCloseTo(1.75, 6);
    expect(expectedAttempts(0, { maxRetries: 3, backoffBaseMs: 10, jitter: false })).toBe(1);
    expect(expectedAttempts(0.2)).toBe(1); // no policy
  });

  it('afterRetryFailProb is f^(m+1)', () => {
    expect(afterRetryFailProb(0.5, { maxRetries: 2, backoffBaseMs: 10, jitter: false })).toBeCloseTo(0.125, 6);
  });

  it('combineFailureProbs treats sources as independent', () => {
    // 1 - (1-0.1)(1-0.2) = 1 - 0.72 = 0.28
    expect(combineFailureProbs(0.1, 0.2)).toBeCloseTo(0.28, 6);
  });

  it('timeoutFailureProb is the exponential tail exp(-t/mean)', () => {
    expect(timeoutFailureProb(100, 100)).toBeCloseTo(Math.exp(-1), 6);
    expect(timeoutFailureProb(0, 100)).toBe(0);
  });

  it('circuit breaker opens, then half-opens after the reset timeout', () => {
    const cb = new CircuitBreaker(0.5, 5000);
    expect(cb.update(0.1, 0)).toBe(0); // healthy -> closed
    expect(cb.state).toBe('closed');

    expect(cb.update(0.8, 1000)).toBe(1); // trips open
    expect(cb.state).toBe('open');

    expect(cb.update(0.0, 3000)).toBe(1); // still within reset window
    expect(cb.state).toBe('open');

    expect(cb.update(0.0, 6500)).toBe(0.5); // half-open probe
    expect(cb.state).toBe('halfOpen');

    expect(cb.update(0.0, 7000)).toBe(0); // recovered -> closed
    expect(cb.state).toBe('closed');
  });
});
