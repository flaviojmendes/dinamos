#!/usr/bin/env node
/**
 * Fail CI when production bundles exceed gzip budgets.
 * Run after `npm run build` (reads dist/ + benchmarks/bundle-baseline.json).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'benchmarks/bundle-baseline.json');

/** Gzip limits (bytes). Tune as bundles shrink. */
const BUDGETS = {
  entryJsGzip: 200 * 1024,
  entryTotalGzip: 230 * 1024,
  forumTopicGzip: 320 * 1024,
  gameEditorGzip: 180 * 1024,
};

function formatBytes(n) {
  return `${(n / 1024).toFixed(1)} KB`;
}

function main() {
  if (!existsSync(BASELINE)) {
    console.error('[bundle-budget] Missing bundle baseline. Run `npm run build && npm run baseline:bundle` first.');
    process.exit(1);
  }

  const report = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const entryJs = report.entry.chunks.find((c) => c.file.endsWith('.js'));
  const entryTotal = report.entry.gzipTotal;
  const forum = report.routeChunks.find((c) => c.routeHint === 'forum topic');
  const gameEditor = report.routeChunks.find((c) => c.routeHint === 'game editor');

  const failures = [];
  if (entryJs && entryJs.gzip > BUDGETS.entryJsGzip) {
    failures.push(
      `entry JS gzip ${formatBytes(entryJs.gzip)} > ${formatBytes(BUDGETS.entryJsGzip)} (${entryJs.file})`,
    );
  }
  if (entryTotal > BUDGETS.entryTotalGzip) {
    failures.push(
      `entry total gzip ${formatBytes(entryTotal)} > ${formatBytes(BUDGETS.entryTotalGzip)}`,
    );
  }
  if (forum && forum.gzip > BUDGETS.forumTopicGzip) {
    failures.push(
      `forum topic gzip ${formatBytes(forum.gzip)} > ${formatBytes(BUDGETS.forumTopicGzip)} (${forum.file})`,
    );
  }
  if (gameEditor && gameEditor.gzip > BUDGETS.gameEditorGzip) {
    failures.push(
      `game editor gzip ${formatBytes(gameEditor.gzip)} > ${formatBytes(BUDGETS.gameEditorGzip)} (${gameEditor.file})`,
    );
  }

  console.log('=== Bundle budget check ===');
  if (entryJs) console.log(`Entry JS: ${formatBytes(entryJs.gzip)} (budget ${formatBytes(BUDGETS.entryJsGzip)})`);
  console.log(`Entry total: ${formatBytes(entryTotal)} (budget ${formatBytes(BUDGETS.entryTotalGzip)})`);
  if (forum) console.log(`Forum topic: ${formatBytes(forum.gzip)} (budget ${formatBytes(BUDGETS.forumTopicGzip)})`);
  if (gameEditor) {
    console.log(`Game editor: ${formatBytes(gameEditor.gzip)} (budget ${formatBytes(BUDGETS.gameEditorGzip)})`);
  }

  if (failures.length) {
    console.error('\nBundle budget exceeded:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log('\nAll bundle budgets passed.');
}

main();
