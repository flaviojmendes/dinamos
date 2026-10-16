import { describe, it, expect } from 'vitest';
import {
  CircuitBreaker,
  afterRetryFailProb,
  combineFailureProbs,
  expectedAttempts,
  responseTimeoutFailureProb,
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

  it('requires an actual observation before opening or recovering', () => {
    const cb = new CircuitBreaker(0.5, 1000);
    cb.update(1, 0, 0);
    expect(cb.state).toBe('closed');
    cb.update(1, 100, 10);
    cb.advance(1100);
    expect(cb.state).toBe('halfOpen');
    cb.update(0, 1200, 0);
    expect(cb.state).toBe('halfOpen');
    cb.update(0, 1300, 1);
    expect(cb.state).toBe('closed');
  });

  it('does not trip a zero-threshold breaker on healthy requests', () => {
    const cb = new CircuitBreaker(0, 1000);
    cb.update(0, 100, 1);
    expect(cb.state).toBe('closed');
    cb.update(0.01, 200, 100);
    expect(cb.state).toBe('open');
  });

  it('uses the selected service distribution when calculating deadlines', () => {
    expect(responseTimeoutFailureProb(10, 0, 20, 'deterministic', 0.5)).toBe(0);
    expect(responseTimeoutFailureProb(30, 0, 20, 'deterministic', 0.5)).toBe(1);
    expect(responseTimeoutFailureProb(20, 0, 20, 'deterministic', 0.5)).toBe(0);
    expect(responseTimeoutFailureProb(10, 5, 20, 'deterministic', 0.5)).toBeCloseTo(Math.exp(-2), 8);
    expect(responseTimeoutFailureProb(10, 10, 20, 'exponential', 1)).toBeCloseTo(3 * Math.exp(-2), 8);
    expect(responseTimeoutFailureProb(10, 5, 20, 'exponential', 1)).toBeCloseTo(2 * Math.exp(-2) - Math.exp(-4), 8);
    expect(responseTimeoutFailureProb(10, 5, 0, 'exponential', 1)).toBe(0);
  });

  it('uses the exact lognormal median without queueing and approaches deterministic service at zero CV', () => {
    const cv = 0.5;
    const median = 100 / Math.sqrt(1 + cv * cv);
    expect(responseTimeoutFailureProb(100, 0, median, 'lognormal', cv)).toBeCloseTo(0.5, 6);
    expect(responseTimeoutFailureProb(100, 0, 200, 'lognormal', 0)).toBe(0);
    expect(responseTimeoutFailureProb(100, 0, 50, 'lognormal', 0)).toBe(1);
  });
});
