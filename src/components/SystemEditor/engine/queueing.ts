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

export interface BoundedQueueMetrics extends QueueMetrics {
  blockingProbability: number;
  admittedRate: number;
}

const MAX_WAIT_MS = 60000;

/** M/M/c/K, where K = workers + waiting-room capacity. */
export function boundedQueueMetrics(lambda: number, mu: number, c: number, waitingRoom: number): BoundedQueueMetrics {
  const servers = Math.max(1, Math.floor(c));
  const room = Math.max(0, Math.floor(waitingRoom));
  if (lambda <= 0 || !Number.isFinite(mu)) {
    return { ...mmcMetrics(lambda, mu, servers), blockingProbability: 0, admittedRate: Math.max(0, lambda) };
  }
  if (mu <= 0) {
    return { rho: Infinity, waitMs: MAX_WAIT_MS, responseMs: MAX_WAIT_MS, queueLength: room, inSystem: servers + room, saturated: true, blockingProbability: 1, admittedRate: 0 };
  }

  // Below c the birth/death weights have Poisson form; from c onward
  // their ratio is constant (rho). Sum that tail analytically so a large
  // waiting room does not add work to every solver relaxation.
  const offered = lambda / mu;
  const rho = offered / servers;
  const logOffered = Math.log(offered);
  const prefixLogs = new Float64Array(servers);
  let logWeight = 0;
  let peakLog = 0;
  for (let n = 1; n <= servers; n++) {
    logWeight += logOffered - Math.log(n);
    peakLog = Math.max(peakLog, logWeight);
    if (n < servers) prefixLogs[n] = logWeight;
  }
  const logRho = Math.log(rho);
  const anchorLog = logWeight + (rho > 1 ? room * logRho : 0);
  peakLog = Math.max(peakLog, anchorLog);
  let prefixTotal = 0;
  let prefixOccupied = 0;
  for (let n = 0; n < servers; n++) {
    const weight = Math.exp(prefixLogs[n] - peakLog);
    prefixTotal += weight;
    prefixOccupied += n * weight;
  }
  const geometric = geometricTail(Math.min(rho, 1 / rho), room + 1);
  const tailWeight = Math.exp(anchorLog - peakLog) * geometric.sum;
  const meanWaitingInTail = rho > 1 ? room - geometric.mean : geometric.mean;
  const total = prefixTotal + tailWeight;
  const blockingProbability = Math.exp(logWeight + room * logRho - peakLog) / total;
  // Service completions avoid cancellation in lambda*(1-blocking) when the
  // blocking probability rounds to 1 under extreme overload.
  const admittedRate = Math.min(lambda, mu * (prefixOccupied + servers * tailWeight) / total);
  const queueLength = tailWeight * meanWaitingInTail / total;
  const inSystem = (prefixOccupied + tailWeight * (servers + meanWaitingInTail)) / total;
  const waitMs = admittedRate > 0 ? 1000 * queueLength / admittedRate : 0;
  return {
    rho: lambda / (servers * mu),
    waitMs,
    responseMs: waitMs + 1000 / mu,
    queueLength,
    inSystem,
    saturated: lambda >= servers * mu,
    blockingProbability,
    admittedRate,
  };
}

/** Sum and mean index of weights 1,r,...,r^(count-1), with 0 <= r <= 1. */
function geometricTail(ratio: number, count: number): { sum: number; mean: number } {
  if (ratio === 1) return { sum: count, mean: (count - 1) / 2 };
  const logRatio = Math.log(ratio);
  const sum = Math.expm1(count * logRatio) / Math.expm1(logRatio);
  // Near r=1 the ordinary closed form subtracts two very large numbers.
  const mean = Math.abs(count * logRatio) < 1e-3
    ? (count - 1) / 2 + (count * count - 1) * logRatio / 12
      - (count ** 4 - 1) * logRatio ** 3 / 720
    : 1 / Math.expm1(-logRatio) - count / Math.expm1(-count * logRatio);
  return { sum, mean: Math.max(0, Math.min(count - 1, mean)) };
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
    // An unbounded overloaded queue has no finite stationary wait. Display
    // the same 60s cap approached from below, rather than resetting latency
    // downward at saturation.
    const waitMs = MAX_WAIT_MS;
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
  const waitMs = Math.min(MAX_WAIT_MS, waitSeconds * 1000);
  const responseMs = waitMs + serviceMs;
  const queueLength = lambda * waitMs / 1000; // Lq = lambda * Wq
  const inSystem = (lambda * responseMs) / 1000; // L = lambda * W

  return { rho, waitMs, responseMs, queueLength, inSystem, saturated: false };
}
