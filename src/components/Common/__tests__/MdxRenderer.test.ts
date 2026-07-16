import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mdxCacheKey } from '../MdxRenderer';

describe('MdxRenderer cache key', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('changes when source body changes', () => {
    const a = mdxCacheKey('intro', 'en', '# Hello');
    const b = mdxCacheKey('intro', 'en', '# Hello world');
    expect(a).not.toBe(b);
  });

  it('is stable for identical slug, lang, and source', () => {
    const source = 'Same **content**';
    expect(mdxCacheKey('cap-theorem', 'pt', source)).toBe(mdxCacheKey('cap-theorem', 'pt', source));
  });

  it('partitions by slug and language', () => {
    const source = 'body';
    expect(mdxCacheKey('a', 'en', source)).not.toBe(mdxCacheKey('b', 'en', source));
    expect(mdxCacheKey('a', 'en', source)).not.toBe(mdxCacheKey('a', 'pt', source));
  });
});
