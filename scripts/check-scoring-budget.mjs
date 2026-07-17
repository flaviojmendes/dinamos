#!/usr/bin/env node
/**
 * Fail CI when Arena scoring recomputation exceeds latency budgets.
 * Run after `npm run baseline:scoring` (reads benchmarks/scoring-baseline.json).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'benchmarks/scoring-baseline.json');

/** Per-scenario median limits (ms). Tune after observing production canaries. */
const BUDGETS = {
  'checkpoint-15s': 250,
  'checkpoint-30s': 450,
  'round-60s': 900,
  'round-120s': 1800,
};

/** Upper bound for recomputing 32 players sequentially at round end. */
const MAX_SEQUENTIAL_32P_ROUND_120_MS = 60_000;

function main() {
  if (!existsSync(BASELINE)) {
    console.error(
      '[scoring-budget] Missing scoring baseline. Run `npm run baseline:scoring` first.',
    );
    process.exit(1);
  }

  const report = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const failures = [];

  for (const c of report.cases ?? []) {
    const budget = BUDGETS[c.id];
    if (budget == null) continue;
    if (c.medianMs > budget) {
      failures.push(`${c.id} median ${c.medianMs}ms > ${budget}ms`);
    }
  }

  const round120 = report.cases?.find((c) => c.id === 'round-120s');
  if (round120) {
    const projected32 = round120.medianMs * 32;
    if (projected32 > MAX_SEQUENTIAL_32P_ROUND_120_MS) {
      failures.push(
        `projected 32-player round-120 sequential ${projected32}ms > ${MAX_SEQUENTIAL_32P_ROUND_120_MS}ms`,
      );
    }
  }

  console.log('=== Scoring budget check ===');
  for (const c of report.cases ?? []) {
    const budget = BUDGETS[c.id];
    if (budget == null) continue;
    console.log(`${c.id}: ${c.medianMs}ms (budget ${budget}ms)`);
  }

  if (failures.length) {
    console.error('\n[scoring-budget] FAIL');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }

  console.log('\n[scoring-budget] PASS');
}

main();
