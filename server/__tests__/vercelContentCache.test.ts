import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

interface VercelHeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

interface VercelConfig {
  rewrites: { source: string; destination: string }[];
  headers: VercelHeaderRule[];
}

function loadVercelConfig(): VercelConfig {
  const raw = readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8');
  return JSON.parse(raw) as VercelConfig;
}

function findHeaderRule(config: VercelConfig, source: string): VercelHeaderRule | undefined {
  return config.headers.find((rule) => rule.source === source);
}

function cacheControl(rule: VercelHeaderRule | undefined): string | undefined {
  return rule?.headers.find((h) => h.key === 'Cache-Control')?.value;
}

describe('vercel.json static content caching', () => {
  const config = loadVercelConfig();

  it('keeps API rewrites ahead of the SPA catch-all', () => {
    expect(config.rewrites[0]).toEqual({ source: '/api/(.*)', destination: '/api' });
    expect(config.rewrites[1]).toEqual({ source: '/((?!api/).*)', destination: '/' });
  });

  it('sets short SWR caching on /content/manifest.json', () => {
    const rule = findHeaderRule(config, '/content/manifest.json');
    expect(cacheControl(rule)).toBe(
      'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
    );
  });

  it('sets one-year immutable caching on hash-versioned body JSON', () => {
    const rule = findHeaderRule(config, '/content/([a-f0-9]{16})/pages/(.*)\\.json');
    expect(cacheControl(rule)).toBe('public, max-age=31536000, immutable');
  });

  it('applies content cache rules after the SPA catch-all for header precedence', () => {
    const sources = config.headers.map((rule) => rule.source);
    const catchAllIdx = sources.indexOf('/((?!assets/).*)');
    const manifestIdx = sources.indexOf('/content/manifest.json');
    const bodyIdx = sources.indexOf('/content/([a-f0-9]{16})/pages/(.*)\\.json');
    expect(catchAllIdx).toBeGreaterThanOrEqual(0);
    expect(manifestIdx).toBeGreaterThan(catchAllIdx);
    expect(bodyIdx).toBeGreaterThan(catchAllIdx);
  });

  it('matches versioned body URLs emitted by the static exporter', () => {
    const pattern = /^\/content\/([a-f0-9]{16})\/pages\/(.*)\.json$/;
    expect(
      pattern.test('/content/a1b2c3d4e5f67890/pages/deadbeefcafebabe-en.json')
    ).toBe(true);
    expect(pattern.test('/content/manifest.json')).toBe(false);
  });
});
