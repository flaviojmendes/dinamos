#!/usr/bin/env node
/**
 * Time `npm run build` and `vercel-build` (without DATABASE_URL) and record
 * landing static asset sizes. Writes benchmarks/build-baseline.json.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, statSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'benchmarks');
const OUT_FILE = join(OUT_DIR, 'build-baseline.json');

function runTimed(label, cmd, args, env = {}) {
  const started = Date.now();
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    shell: false,
  });
  const durationMs = Date.now() - started;
  return {
    label,
    command: [cmd, ...args].join(' '),
    durationMs,
    durationSec: Math.round((durationMs / 1000) * 100) / 100,
    exitCode: result.status ?? 1,
    stdoutTail: (result.stdout || '').split('\n').slice(-15).join('\n'),
    stderrTail: (result.stderr || '').split('\n').slice(-15).join('\n'),
  };
}

function publicAssetSizes() {
  const publicDir = join(ROOT, 'public');
  const landingMedia = [
    'cache.gif',
    'cache.webp',
    'cache-poster.webp',
    'circuit.gif',
    'circuit.webp',
    'circuit-poster.webp',
    'loadbalancer.gif',
    'loadbalancer.webp',
    'loadbalancer-poster.webp',
    'logo.png',
    'favicon.png',
  ];
  const assets = {};
  let landingSimulatorRaw = 0;
  let landingPreferredRaw = 0;
  let landingInitialRaw = 0;
  for (const name of landingMedia) {
    const p = join(publicDir, name);
    if (existsSync(p)) {
      const size = statSync(p).size;
      assets[name] = size;
      if (name.endsWith('.gif')) landingSimulatorRaw += size;
      if (name.endsWith('.webp') && !name.includes('-poster')) landingPreferredRaw += size;
      if (name.includes('-poster') || name === 'logo.png') landingInitialRaw += size;
    } else {
      assets[name] = null;
    }
  }
  return {
    assets,
    landingSimulatorGifsRaw: landingSimulatorRaw,
    landingPreferredWebpRaw: landingPreferredRaw,
    landingInitialMediaRaw: landingInitialRaw,
  };
}

function distSummary() {
  const dist = join(ROOT, 'dist');
  if (!existsSync(dist)) return null;
  let total = 0;
  let files = 0;
  const stack = [dist];
  while (stack.length) {
    const dir = stack.pop();
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name);
      if (name.isDirectory()) stack.push(p);
      else {
        total += statSync(p).size;
        files += 1;
      }
    }
  }
  return { files, totalBytes: total };
}

function main() {
  const skipBuild = process.argv.includes('--skip-build');
  const runs = [];

  if (!skipBuild) {
    runs.push(runTimed('npm run build', 'npm', ['run', 'build']));
    runs.push(
      runTimed('npm run vercel-build (no DATABASE_URL)', 'npm', ['run', 'vercel-build'], {
        DATABASE_URL: '',
      }),
    );
  }

  const report = {
    capturedAt: new Date().toISOString(),
    nodeVersion: process.version,
    platform: `${process.platform} ${process.arch}`,
    ciBuildCommand: 'npm run vercel-build',
    vercelBuildCommand: 'tsc && vite build',
    notes: [
      'CI and Vercel both use `npm run vercel-build` without DATABASE_URL — no DB mutation during build.',
      'Apply CMS content separately via `npm run release:content` (see docs/vercel-efficiency/RELEASE.md).',
    ],
    runs,
    publicAssets: publicAssetSizes(),
    dist: distSummary(),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  console.log('=== Build baseline ===');
  for (const r of runs) {
    console.log(`${r.label}: ${r.durationSec}s (exit ${r.exitCode})`);
  }
  const gifs = report.publicAssets.landingSimulatorGifsRaw;
  const webp = report.publicAssets.landingPreferredWebpRaw ?? 0;
  const initial = report.publicAssets.landingInitialMediaRaw ?? 0;
  console.log(`Landing simulator GIFs (raw): ${(gifs / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Landing preferred WebP (raw): ${(webp / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Landing initial media (posters + logo, raw): ${(initial / 1024).toFixed(1)} KB`);
  if (report.dist) {
    console.log(`dist/: ${report.dist.files} files, ${(report.dist.totalBytes / 1024 / 1024).toFixed(2)} MB raw`);
  }
  console.log(`\nWrote ${OUT_FILE}`);
}

main();
