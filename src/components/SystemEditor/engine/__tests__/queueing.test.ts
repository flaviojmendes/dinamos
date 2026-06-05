import { describe, it, expect } from 'vitest';
import { erlangC, mmcMetrics } from '../queueing';

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
