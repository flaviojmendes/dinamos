import { describe, expect, it } from 'vitest';
import { Rng } from '../rng';

describe('seeded latency RNG', () => {
  it('treats zero as its own valid seed and repeats it exactly', () => {
    const samples = (seed: number) => {
      const rng = new Rng(seed);
      return Array.from({ length: 10 }, () => rng.next());
    };
    expect(samples(0)).toEqual(samples(0));
    expect(samples(0)).not.toEqual(samples(0x9e3779b9));
    expect(samples(0).every((sample) => sample >= 0 && sample < 1)).toBe(true);
  });
});
