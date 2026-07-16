#!/usr/bin/env node
/**
 * Run mobile Lighthouse against key routes. Requires a reachable base URL
 * (local preview or production). Writes benchmarks/lighthouse-baseline.json.
 *
 * Usage:
 *   npm run preview &  # optional, for local
 *   node scripts/run-lighthouse-baseline.mjs --url http://localhost:4173
 *   node scripts/run-lighthouse-baseline.mjs --url https://dinamos.net
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const OUT_DIR = join(process.cwd(), 'benchmarks');
const OUT_FILE = join(OUT_DIR, 'lighthouse-baseline.json');

function parseArgs() {
  const urlIdx = process.argv.indexOf('--url');
  const baseUrl = urlIdx >= 0 ? process.argv[urlIdx + 1] : process.env.BASELINE_URL || '';
  return { baseUrl: baseUrl.replace(/\/$/, '') };
}

const ROUTES = [
  { id: 'landing', path: '/', auth: false },
  { id: 'lesson', path: '/intro', auth: true, note: 'Protected; scores may reflect login redirect unless authenticated' },
  { id: 'forum-topic', path: '/forum', auth: true, note: 'Forum list used when no public topic id is available' },
  { id: 'game-arena', path: '/arena', auth: true },
];

function runLighthouse(url) {
  const outPath = join(tmpdir(), `lh-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  const result = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse',
      url,
      '--quiet',
      '--chrome-flags=--headless --no-sandbox --disable-gpu',
      '--form-factor=mobile',
      '--screenEmulation.mobile=true',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${outPath}`,
    ],
    { encoding: 'utf8', timeout: 180_000 },
  );

  if (result.status !== 0 || !existsSync(outPath)) {
    return {
      url,
      error: result.stderr || result.stdout || 'Lighthouse failed',
      exitCode: result.status,
    };
  }

  try {
    const json = JSON.parse(readFileSync(outPath, 'utf8'));
    unlinkSync(outPath);
    const cats = json.categories || {};
    const audits = json.audits || {};
    return {
      url,
      fetchTime: json.fetchTime,
      scores: {
        performance: cats.performance?.score != null ? Math.round(cats.performance.score * 100) : null,
        accessibility: cats.accessibility?.score != null ? Math.round(cats.accessibility.score * 100) : null,
        bestPractices: cats['best-practices']?.score != null ? Math.round(cats['best-practices'].score * 100) : null,
        seo: cats.seo?.score != null ? Math.round(cats.seo.score * 100) : null,
      },
      metrics: {
        fcpMs: audits['first-contentful-paint']?.numericValue ?? null,
        lcpMs: audits['largest-contentful-paint']?.numericValue ?? null,
        tbtMs: audits['total-blocking-time']?.numericValue ?? null,
        cls: audits['cumulative-layout-shift']?.numericValue ?? null,
        speedIndexMs: audits['speed-index']?.numericValue ?? null,
      },
      transferBytes: audits['total-byte-weight']?.numericValue ?? null,
    };
  } catch (err) {
    return { url, error: String(err) };
  }
}

function main() {
  const { baseUrl } = parseArgs();
  if (!baseUrl) {
    console.error('Provide --url or BASELINE_URL. Skipping Lighthouse (no production telemetry substitute).');
    const report = {
      capturedAt: new Date().toISOString(),
      status: 'skipped',
      reason: 'No base URL provided. Set BASELINE_URL or pass --url to run mobile Lighthouse.',
      routes: ROUTES,
    };
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);
    process.exit(0);
  }

  const results = ROUTES.map((route) => ({
    ...route,
    url: `${baseUrl}${route.path}`,
    lighthouse: runLighthouse(`${baseUrl}${route.path}`),
  }));

  const report = {
    capturedAt: new Date().toISOString(),
    baseUrl,
    preset: 'mobile',
    results,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  console.log('=== Lighthouse baseline (mobile) ===');
  for (const r of results) {
    const lh = r.lighthouse;
    if (lh.error) {
      console.log(`${r.id}: ERROR — ${lh.error.slice(0, 120)}`);
    } else {
      console.log(`${r.id}: perf ${lh.scores.performance}, LCP ${Math.round(lh.metrics.lcpMs)}ms, transfer ${Math.round((lh.transferBytes || 0) / 1024)} KB`);
    }
  }
  console.log(`\nWrote ${OUT_FILE}`);
}

main();
