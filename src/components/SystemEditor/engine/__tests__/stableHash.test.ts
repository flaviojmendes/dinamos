import { describe, it, expect } from 'vitest';
import { stableHash } from '../stableHash';

describe('stableHash', () => {
  it('produces stable digests for equivalent object key order', () => {
    expect(stableHash({ a: 1, b: 2 })).toBe(stableHash({ b: 2, a: 1 }));
    expect(stableHash(null)).toBe(stableHash(undefined));
  });

  it('returns a 64-char SHA-256 hex digest', () => {
    const hash = stableHash({ nodes: [], edges: [] });
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when architecture content changes', () => {
    expect(stableHash({ nodes: [1], edges: [] })).not.toBe(
      stableHash({ nodes: [2], edges: [] }),
    );
  });
});
