// Failure modelling: retry amplification, timeout probability and a stateful
// circuit breaker. These are pure helpers plus one small state machine that the
// simulator owns across ticks.

import { CircuitState, LatencyDistribution, RetryPolicy } from './types.js';

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

/**
 * Tail probability for the service distribution selected in the editor plus
 * exponential queue waiting. Deterministic/exponential services use exact
 * convolution tails; lognormal response uses the same first two moments when
 * waiting is nonzero (the sum has no elementary closed-form distribution).
 */
export function responseTimeoutFailureProb(
  serviceMeanMs: number,
  waitMeanMs: number,
  timeoutMs: number,
  distribution: LatencyDistribution,
  cv: number,
): number {
  if (timeoutMs <= 0 || !Number.isFinite(timeoutMs)) return 0;
  const service = Math.max(0, serviceMeanMs);
  const wait = Math.max(0, waitMeanMs);
  if (service <= 0) return wait > 0 ? Math.exp(-timeoutMs / wait) : 0;
  if (distribution === 'deterministic' || (distribution === 'lognormal' && cv <= 0)) {
    if (timeoutMs < service) return 1;
    return wait > 0 ? Math.exp(-(timeoutMs - service) / wait) : 0;
  }
  if (distribution === 'exponential') {
    if (wait <= 0) return Math.exp(-timeoutMs / service);
    if (Math.abs(service - wait) <= Math.max(service, wait) * 1e-8) {
      const ratio = timeoutMs / service;
      return Math.min(1, Math.exp(-ratio) * (1 + ratio));
    }
    return clamp01((service * Math.exp(-timeoutMs / service) - wait * Math.exp(-timeoutMs / wait)) / (service - wait));
  }
  const mean = service + wait;
  const variance = service * service * cv * cv + wait * wait;
  const sigma2 = Math.log1p(variance / (mean * mean));
  if (sigma2 <= 0) return timeoutMs < mean ? 1 : 0;
  const mu = Math.log(mean) - sigma2 / 2;
  const z = (Math.log(timeoutMs) - mu) / Math.sqrt(sigma2);
  return standardNormalSurvival(z);
}

/** Abramowitz-Stegun normal tail approximation, absolute error below 8e-8. */
function standardNormalSurvival(z: number): number {
  const x = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * x);
  const polynomial = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const tail = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * polynomial;
  return z >= 0 ? tail : 1 - tail;
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

  /** Advance the recovery timer before admitting this interval's traffic. */
  advance(nowMs: number): CircuitState {
    if (this.state === 'open' && nowMs - this.openedAtMs >= this.resetTimeoutMs) {
      this.state = 'halfOpen';
    }
    return this.state;
  }

  /**
   * Update the breaker with the observed downstream error rate at simulated
   * time `nowMs`. Returns 1 when open, 0 when closed and 0.5 as the half-open
   * indicator. The simulator separately caps admitted half-open probes to one
   * request per interval, rather than treating the indicator as a load fraction.
   */
  update(errorRate: number, nowMs: number, observedRequests = 1): number {
    switch (this.state) {
      case 'closed':
        if (observedRequests > 0 && errorRate > 0 && errorRate >= this.threshold) {
          this.state = 'open';
          this.openedAtMs = nowMs;
          return 1;
        }
        return 0;
      case 'open':
        return this.advance(nowMs) === 'halfOpen' ? 0.5 : 1;
      case 'halfOpen':
        // No admitted requests is absence of evidence, not a healthy probe.
        if (observedRequests <= 0) return 0.5;
        if (errorRate > 0 && errorRate >= this.threshold) {
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
