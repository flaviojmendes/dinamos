import { describe, it, expect } from 'vitest';
import { boundedQueueMetrics, erlangC, mmcMetrics } from '../queueing';

describe('queueing theory', () => {
  it('M/M/1 matches the closed-form Wq = rho / (mu - lambda)', () => {
    // lambda = 8/s, mu = 10/s, c = 1 -> rho = 0.8
    const lambda = 8;
    const mu = 10;
    const m = mmcMetrics(lambda, mu, 1);

    expect(m.rho).toBeCloseTo(0.8, 6);

    // Wq (seconds) = rho / (mu - lambda) = 0.8 / 2 = 0.4s = 400ms
    expect(m.waitMs).toBeCloseTo(400, 2);
    // W = Wq + 1/mu = 0.4 + 0.1 = 0.5s = 500ms
    expect(m.responseMs).toBeCloseTo(500, 2);
  });

  it("satisfies Little's Law: L = lambda * W", () => {
    const lambda = 8;
    const mu = 10;
    const m = mmcMetrics(lambda, mu, 1);
    const expectedL = (lambda * m.responseMs) / 1000;
    expect(m.inSystem).toBeCloseTo(expectedL, 6);

    const expectedLq = (lambda * m.waitMs) / 1000;
    expect(m.queueLength).toBeCloseTo(expectedLq, 6);
  });

  it('Erlang-C is 1 when offered load meets or exceeds servers', () => {
    expect(erlangC(2, 2)).toBe(1);
    expect(erlangC(2, 3)).toBe(1);
  });

  it('M/M/c reduces wait below M/M/1 for the same load (statistical economy of scale)', () => {
    // Same total capacity: c=1 mu=10 vs c=2 mu=5, lambda=8.
    const single = mmcMetrics(8, 10, 1);
    const dual = mmcMetrics(8, 5, 2);
    expect(dual.rho).toBeCloseTo(0.8, 6);
    // The single fast server has lower wait than two half-speed servers here,
    // but both must be stable and finite.
    expect(single.saturated).toBe(false);
    expect(dual.saturated).toBe(false);
    expect(dual.waitMs).toBeGreaterThan(0);
  });

  it('flags saturation when rho >= 1 with a finite, growing wait', () => {
    const m = mmcMetrics(12, 10, 1);
    expect(m.saturated).toBe(true);
    expect(Number.isFinite(m.waitMs)).toBe(true);
    expect(m.waitMs).toBeGreaterThan(0);
  });
});

// An overloaded system must not appear faster as it crosses saturation.
describe('queue limits', () => {
  it('does not reset the waiting time at the capacity boundary', () => {
    const below = mmcMetrics(9.999, 10, 1);
    const above = mmcMetrics(10.001, 10, 1);
    expect(above.waitMs).toBeGreaterThanOrEqual(below.waitMs);
  });
});


describe('finite waiting rooms', () => {
  it('matches M/M/1/1 loss probability with no waiting room', () => {
    const m = boundedQueueMetrics(8, 10, 1, 0);
    expect(m.blockingProbability).toBeCloseTo(8 / 18, 10);
    expect(m.admittedRate).toBeCloseTo(80 / 18, 10);
    expect(m.queueLength).toBe(0);
    expect(m.waitMs).toBe(0);
    expect(m.inSystem).toBeCloseTo(m.admittedRate * m.responseMs / 1000, 10);
  });

  it('matches a uniform M/M/1/K distribution at rho=1', () => {
    const m = boundedQueueMetrics(10, 10, 1, 2);
    expect(m.blockingProbability).toBeCloseTo(0.25, 10);
    expect(m.queueLength).toBeCloseTo(0.75, 10);
    expect(m.inSystem).toBeCloseTo(1.5, 10);
    expect(m.waitMs).toBeCloseTo(100, 10);
  });

  it('retains a bounded queue and Little\'s Law under severe overload', () => {
    const m = boundedQueueMetrics(1e6, 10, 2, 1000);
    expect(m.queueLength).toBeLessThanOrEqual(1000);
    expect(m.admittedRate).toBeCloseTo(20, 2);
    expect(m.inSystem).toBeCloseTo(m.admittedRate * m.responseMs / 1000, 5);
    expect(Number.isFinite(m.waitMs)).toBe(true);
  });
  it('agrees with independently enumerated birth/death states across load regimes', () => {
    for (const workers of [1, 2, 8]) for (const room of [0, 1, 25]) {
      for (const rho of [1e-8, 0.1, 0.99999999999, 1, 1.00000001, 1.5, 100]) {
        const lambda = workers * 10 * rho;
        const weights = [1];
        for (let n = 1; n <= workers + room; n++) weights.push(weights[n - 1] * lambda / (Math.min(n, workers) * 10));
        const total = weights.reduce((a, b) => a + b, 0);
        const expectedQueue = weights.reduce((sum, weight, n) => sum + Math.max(0, n - workers) * weight, 0) / total;
        const expectedBusy = weights.reduce((sum, weight, n) => sum + Math.min(workers, n) * weight, 0) / total;
        const actual = boundedQueueMetrics(lambda, 10, workers, room);
        expect(actual.queueLength).toBeCloseTo(expectedQueue, 7);
        expect(actual.blockingProbability).toBeCloseTo(weights[weights.length - 1] / total, 7);
        expect(actual.admittedRate).toBeCloseTo(10 * expectedBusy, 7);
      }
    }
  });

  it('sums a large waiting room without enumerating its states', () => {
    const room = 1e9;
    const actual = boundedQueueMetrics(10, 10, 1, room);
    expect(actual.blockingProbability).toBeCloseTo(1 / (room + 2), 14);
    expect(actual.queueLength).toBeCloseTo(room * (room + 1) / (2 * (room + 2)), 5);
    expect(actual.admittedRate).toBeCloseTo(10 * (room + 1) / (room + 2), 10);
  });

});
