import { describe, it, expect } from 'vitest';
import {
  normalizeScoring,
  DEFAULT_SCORING,
  frameScore,
  emptyAccumulator,
  accumulate,
  ScoringConfig,
} from '../scoring';
import { SystemMetrics } from '../types';

function metrics(p: Partial<SystemMetrics>): SystemMetrics {
  return {
    offeredLoad: 0,
    totalThroughput: 0,
    successRate: 1,
    p50: 0,
    p95: 0,
    p99: 0,
    costPerHour: 0,
    warnings: [],
    ...p,
  } as SystemMetrics;
}

describe('normalizeScoring', () => {
  it('returns defaults when nothing is passed', () => {
    expect(normalizeScoring()).toEqual(DEFAULT_SCORING);
    expect(normalizeScoring(null)).toEqual(DEFAULT_SCORING);
  });

  it('overrides only the provided fields', () => {
    const cfg = normalizeScoring({ wThroughput: 5, budgetPerHour: 100 });
    expect(cfg.wThroughput).toBe(5);
    expect(cfg.budgetPerHour).toBe(100);
    expect(cfg.wSuccess).toBe(DEFAULT_SCORING.wSuccess);
  });
});

describe('frameScore', () => {
  const cfg: ScoringConfig = normalizeScoring({ budgetPerHour: 10 });

  it('rewards throughput and availability', () => {
    const s = frameScore(metrics({ totalThroughput: 100, successRate: 1 }), cfg);
    expect(s.throughput).toBe(100);
    expect(s.availability).toBe(cfg.wSuccess * 100);
    expect(s.latencyPenalty).toBe(0);
    expect(s.costPenalty).toBe(0);
    expect(s.net).toBe(s.throughput + s.availability);
  });

  it('clamps negative throughput to zero', () => {
    const s = frameScore(metrics({ totalThroughput: -50 }), cfg);
    expect(s.throughput).toBe(0);
  });

  it('penalizes latency over the target', () => {
    const s = frameScore(metrics({ p95: cfg.latencyTargetMs + cfg.latencyTargetMs }), cfg);
    expect(s.latencyPenalty).toBeGreaterThan(0);
  });

  it('applies a cost penalty only when over budget', () => {
    const under = frameScore(metrics({ costPerHour: 5 }), cfg);
    expect(under.costPenalty).toBe(0);
    const over = frameScore(metrics({ costPerHour: 20 }), cfg);
    expect(over.costPenalty).toBeGreaterThan(0);
  });

  it('ignores cost when budget is disabled (0)', () => {
    const s = frameScore(metrics({ costPerHour: 9999 }), normalizeScoring({ budgetPerHour: 0 }));
    expect(s.costPenalty).toBe(0);
  });
});

describe('accumulate', () => {
  it('starts from an empty accumulator', () => {
    const acc = emptyAccumulator();
    expect(acc.total).toBe(0);
    expect(acc.ticks).toBe(0);
  });

  it('sums frames and floors the running total at zero', () => {
    let acc = emptyAccumulator();
    acc = accumulate(acc, { throughput: 10, availability: 5, latencyPenalty: 0, costPenalty: 0, net: 15 });
    expect(acc.total).toBe(15);
    expect(acc.ticks).toBe(1);
    acc = accumulate(acc, { throughput: 0, availability: 0, latencyPenalty: 100, costPenalty: 0, net: -100 });
    expect(acc.total).toBe(0);
    expect(acc.ticks).toBe(2);
    expect(acc.latencyPenalty).toBe(100);
  });
});
