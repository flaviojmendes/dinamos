#!/usr/bin/env node
/**
 * Measure deterministic round recomputation latency for Arena scoring budgets.
 * Writes benchmarks/scoring-baseline.json (used by check-scoring-budget.mjs).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'benchmarks');
const OUT_FILE = join(OUT_DIR, 'scoring-baseline.json');

async function loadRunner() {
  const { register } = await import('tsx/esm/api');
  register();
  const { runRound } = await import('../src/components/SystemEditor/engine/roundRunner.ts');
  const { getPreset } = await import('../src/components/SystemEditor/engine/scenarios.ts');
  const { presetNodesToArchitecture } = await import('../src/components/SystemEditor/game/architecture.ts');
  return { runRound, getPreset, presetNodesToArchitecture };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function bench(fn, iterations = 5) {
  const samples = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }
  return {
    samplesMs: samples.map((n) => Math.round(n * 100) / 100),
    medianMs: Math.round(median(samples) * 100) / 100,
    maxMs: Math.round(Math.max(...samples) * 100) / 100,
  };
}

async function main() {
  const { runRound, getPreset, presetNodesToArchitecture } = await loadRunner();
  const preset = getPreset('three-tier');
  if (!preset) throw new Error('Missing three-tier preset');
  const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);

  const scenarios = [
    { id: 'checkpoint-15s', tickCount: 15, label: '15s checkpoint recompute' },
    { id: 'checkpoint-30s', tickCount: 30, label: '30s checkpoint recompute' },
    { id: 'round-60s', tickCount: 60, label: '60s round recompute' },
    { id: 'round-120s', tickCount: 120, label: '120s round recompute' },
  ];

  const cases = scenarios.map((scenario) => {
    const result = bench(
      () =>
        runRound({
          architecture,
          seed: preset.seed,
          loadProfile: { type: 'constant' },
          tickCount: scenario.tickCount,
        }),
      5,
    );
    return { ...scenario, ...result };
  });

  const fixturePath = join(
    ROOT,
    'src/components/SystemEditor/engine/__fixtures__/golden/three-tier-constant-30s.json',
  );
  const golden = JSON.parse(readFileSync(fixturePath, 'utf8'));

  const report = {
    capturedAt: new Date().toISOString(),
    nodeVersion: process.version,
    fixture: golden.id,
    cases,
    notes:
      'Median wall time for a single-player deterministic recompute. Budgets assume sequential recompute for up to 32 players must stay within serverless limits.',
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);
  console.log('=== Scoring baseline ===');
  for (const c of cases) {
    console.log(`${c.label}: median ${c.medianMs}ms (max ${c.maxMs}ms)`);
  }
  console.log(`Wrote ${OUT_FILE}`);
}

main().catch((err) => {
  console.error('[scoring-baseline] Failed:', err);
  process.exit(1);
});
