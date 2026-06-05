// Failure modelling: retry amplification, timeout probability and a stateful
// circuit breaker. These are pure helpers plus one small state machine that the
// simulator owns across ticks.

import { CircuitState, RetryPolicy } from './types';

/**
 * Expected number of attempts per logical request given a per-attempt failure
 * probability and a retry policy. With failure prob `f` and `m` retries this is
 * the truncated geometric series sum_{i=0..m} f^i = (1 - f^(m+1)) / (1 - f).
 */
export function expectedAttempts(failProb: number, policy?: RetryPolicy): number {
  if (!policy || policy.maxRetries <= 0) return 1;
  const f = clamp01(failProb);
  const m = policy.maxRetries;
  if (f <= 0) return 1;
  if (f >= 1) return m + 1;
  return (1 - Math.pow(f, m + 1)) / (1 - f);
}

/** Residual failure probability after exhausting retries: f^(m+1). */
export function afterRetryFailProb(failProb: number, policy?: RetryPolicy): number {
  const f = clamp01(failProb);
  if (!policy || policy.maxRetries <= 0) return f;
  return Math.pow(f, policy.maxRetries + 1);
}

/**
 * Probability a response exceeds the timeout, assuming the response time is
 * exponentially distributed around `meanResponseMs`. P(T > t) = exp(-t/mean).
 * This is the tail that retries/timeouts convert into failures.
 */
export function timeoutFailureProb(meanResponseMs: number, timeoutMs: number): number {
  if (timeoutMs <= 0 || !isFinite(timeoutMs)) return 0;
  if (meanResponseMs <= 0) return 0;
  return Math.exp(-timeoutMs / meanResponseMs);
}

/** Combine independent failure sources into a single probability. */
export function combineFailureProbs(...probs: number[]): number {
  let survive = 1;
  for (const p of probs) survive *= 1 - clamp01(p);
  return 1 - survive;
}

/**
 * Circuit breaker following the classic closed -> open -> half-open cycle. The
 * simulator advances it once per tick with the freshly-observed error rate.
 */
export class CircuitBreaker {
  state: CircuitState = 'closed';
  private openedAtMs = 0;
  private readonly threshold: number;
  private readonly resetTimeoutMs: number;

  constructor(threshold = 0.5, resetTimeoutMs = 5000) {
    this.threshold = threshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  /**
   * Update the breaker with the observed downstream error rate at simulated
   * time `nowMs`. Returns the fraction of traffic that should be *shed* (1 when
   * fully open, 0 when closed, partial while half-open probing).
   */
  update(errorRate: number, nowMs: number): number {
    switch (this.state) {
      case 'closed':
        if (errorRate >= this.threshold) {
          this.state = 'open';
          this.openedAtMs = nowMs;
          return 1;
        }
        return 0;
      case 'open':
        if (nowMs - this.openedAtMs >= this.resetTimeoutMs) {
          this.state = 'halfOpen';
          return 0.5; // probe with half traffic
        }
        return 1;
      case 'halfOpen':
        if (errorRate >= this.threshold) {
          this.state = 'open';
          this.openedAtMs = nowMs;
          return 1;
        }
        this.state = 'closed';
        return 0;
      default:
        return 0;
    }
  }
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
