// Deterministic, seedable RNG so simulation runs are reproducible.
// mulberry32 is small, fast and good enough for Monte-Carlo latency sampling.

export class Rng {
  private state: number;

  constructor(seed: number) {
    // Avoid a zero state which would stick the generator.
    this.state = (seed | 0) || 0x9e3779b9;
  }

  /** Uniform float in [0, 1). */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Uniform float in [min, max). */
  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  /** Standard normal via Box-Muller. */
  normal(): number {
    let u = 0;
    let v = 0;
    // next() is in [0,1); guard log(0).
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /** Exponential sample with the given mean (mean = 1/rate). */
  exponential(mean: number): number {
    if (mean <= 0) return 0;
    let u = this.next();
    while (u === 0) u = this.next();
    return -mean * Math.log(u);
  }

  /**
   * Lognormal sample whose underlying distribution has the supplied arithmetic
   * mean and coefficient of variation (cv = stddev / mean).
   */
  lognormal(mean: number, cv: number): number {
    if (mean <= 0) return 0;
    if (cv <= 0) return mean;
    const sigma2 = Math.log(1 + cv * cv);
    const mu = Math.log(mean) - sigma2 / 2;
    return Math.exp(mu + Math.sqrt(sigma2) * this.normal());
  }
}
