#!/usr/bin/env node
/**
 * Capture local reproducible baselines for the Vercel efficiency roadmap (phase 0).
 * Does not require Vercel dashboard access.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'benchmarks');
const SUMMARY_FILE = join(OUT_DIR, 'baseline-summary.json');

function run(label, cmd, args, env = {}) {
  console.log(`\n>> ${label}`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } });
  if (r.status !== 0) {
    console.error(`[baseline] ${label} failed with exit ${r.status}`);
    process.exit(r.status ?? 1);
  }
}

function main() {
  const skipBuild = process.argv.includes('--skip-build');
  const lighthouseUrl = process.env.BASELINE_URL || '';

  mkdirSync(OUT_DIR, { recursive: true });

  if (!skipBuild) {
    run('Production build', 'npm', ['run', 'build']);
  } else if (!existsSync(join(ROOT, 'dist'))) {
    console.error('[baseline] dist/ missing; run without --skip-build');
    process.exit(1);
  }

  run('Bundle report', 'node', ['scripts/report-bundle-baseline.mjs']);
  run('Game request-rate estimate', 'node', ['scripts/estimate-game-request-rate.mjs']);

  // Asset sizes from existing dist; optionally re-time builds when not skipped.
  const buildArgs = skipBuild
    ? ['scripts/measure-build-baseline.mjs', '--skip-build']
    : ['scripts/measure-build-baseline.mjs'];
  run('Build timing + static assets', 'node', buildArgs);

  if (lighthouseUrl) {
    run('Lighthouse (mobile)', 'node', ['scripts/run-lighthouse-baseline.mjs', '--url', lighthouseUrl]);
  } else {
    run('Lighthouse skip marker', 'node', ['scripts/run-lighthouse-baseline.mjs']);
  }

  const summary = {
    capturedAt: new Date().toISOString(),
    vercelTelemetry: {
      status: 'unavailable',
      reason:
        'Production Vercel account metrics (function invocations, active CPU, duration, transfer by path, deploy build duration) require dashboard/API access not configured in this repository.',
      action: 'Export a representative week from Vercel Usage → Functions / Observability and attach to benchmarks/vercel-telemetry.json when available.',
    },
    artifacts: {
      bundle: 'benchmarks/bundle-baseline.json',
      gameRequests: 'benchmarks/game-request-baseline.json',
      build: 'benchmarks/build-baseline.json',
      lighthouse: 'benchmarks/lighthouse-baseline.json',
    },
  };

  if (existsSync(join(OUT_DIR, 'bundle-baseline.json'))) {
    summary.bundle = JSON.parse(readFileSync(join(OUT_DIR, 'bundle-baseline.json'), 'utf8'));
  }
  if (existsSync(join(OUT_DIR, 'game-request-baseline.json'))) {
    summary.gameRequests = JSON.parse(readFileSync(join(OUT_DIR, 'game-request-baseline.json'), 'utf8'));
  }
  if (existsSync(join(OUT_DIR, 'build-baseline.json'))) {
    summary.build = JSON.parse(readFileSync(join(OUT_DIR, 'build-baseline.json'), 'utf8'));
  }
  if (existsSync(join(OUT_DIR, 'lighthouse-baseline.json'))) {
    summary.lighthouse = JSON.parse(readFileSync(join(OUT_DIR, 'lighthouse-baseline.json'), 'utf8'));
  }

  writeFileSync(SUMMARY_FILE, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`\n[baseline] Summary written to ${SUMMARY_FILE}`);
}

main();
