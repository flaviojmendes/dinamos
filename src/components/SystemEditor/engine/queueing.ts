// Queueing-theory primitives: M/M/c utilization, Erlang-C waiting time and
// Little's Law. All times are returned in milliseconds to match the rest of
// the engine; service rate `mu` is in req/s.

export interface QueueMetrics {
  /** Utilization rho = lambda / (c * mu). May exceed 1 when overloaded. */
  rho: number;
  /** Mean queue wait in ms (Wq). */
  waitMs: number;
  /** Mean response time in ms (W = Wq + 1/mu). */
  responseMs: number;
  /** Mean number waiting (Lq). */
  queueLength: number;
  /** Mean number in system (L = lambda * W). */
  inSystem: number;
  /** True when the system is unstable (rho >= 1). */
  saturated: boolean;
}

/**
 * Erlang-B blocking probability, computed with the numerically-stable
 * recurrence B(0) = 1, B(k) = a*B(k-1) / (k + a*B(k-1)).
 * `a` is the offered load in Erlangs (lambda / mu).
 */
export function erlangB(c: number, a: number): number {
  let b = 1;
  for (let k = 1; k <= c; k++) {
    b = (a * b) / (k + a * b);
  }
  return b;
}

/**
 * Erlang-C probability that an arriving request must wait, derived from
 * Erlang-B: C = c*B / (c - a*(1 - B)).
 */
export function erlangC(c: number, a: number): number {
  const rho = a / c;
  if (rho >= 1) return 1;
  const b = erlangB(c, a);
  const denom = c - a * (1 - b);
  if (denom <= 0) return 1;
  return (c * b) / denom;
}

/**
 * Full M/M/c metrics for arrival rate `lambda` (req/s), per-server service
 * rate `mu` (req/s) and `c` servers. Saturated systems return capped,
 * monotonically-increasing waits so the UI degrades gracefully instead of
 * producing Infinity/NaN.
 */
export function mmcMetrics(lambda: number, mu: number, c: number): QueueMetrics {
  const servers = Math.max(1, Math.floor(c));
  const serviceMs = mu > 0 && isFinite(mu) ? 1000 / mu : 0;

  if (lambda <= 0) {
    return { rho: 0, waitMs: 0, responseMs: serviceMs, queueLength: 0, inSystem: 0, saturated: false };
  }
  if (!isFinite(mu) || mu <= 0) {
    // Infinite service rate (e.g. a pass-through client): no queueing.
    return { rho: 0, waitMs: 0, responseMs: 0, queueLength: 0, inSystem: 0, saturated: false };
  }

  const a = lambda / mu; // offered load in Erlangs
  const rho = a / servers;

  if (rho >= 1) {
    // Unstable: model a heavily backed-up queue. Wait grows with how far over
    // capacity we are, capped to keep the simulation numerically sane.
    const overload = rho - 1;
    const waitMs = Math.min(60000, serviceMs * (10 + overload * 200));
    const responseMs = waitMs + serviceMs;
    const inSystem = (lambda * responseMs) / 1000;
    return {
      rho,
      waitMs,
      responseMs,
      queueLength: (lambda * waitMs) / 1000,
      inSystem,
      saturated: true,
    };
  }

  const pWait = erlangC(servers, a);
  // Wq = C / (c*mu - lambda) seconds.
  const waitSeconds = pWait / (servers * mu - lambda);
  const waitMs = waitSeconds * 1000;
  const responseMs = waitMs + serviceMs;
  const queueLength = lambda * waitSeconds; // Lq = lambda * Wq
  const inSystem = (lambda * responseMs) / 1000; // L = lambda * W

  return { rho, waitMs, responseMs, queueLength, inSystem, saturated: false };
}
