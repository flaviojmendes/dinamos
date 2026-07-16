#!/usr/bin/env node
/**
 * Split monolithic translation.json into per-namespace JSON files (one top-level key each).
 * Run after editing src/locales/{en,pt}/translation.json or when adding keys.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const LOCALES_DIR = join(ROOT, 'src/locales');

for (const lng of readdirSync(LOCALES_DIR)) {
  const mono = join(LOCALES_DIR, lng, 'translation.json');
  let payload;
  try {
    payload = JSON.parse(readFileSync(mono, 'utf8'));
  } catch {
    continue;
  }

  const outDir = join(LOCALES_DIR, lng, 'namespaces');
  mkdirSync(outDir, { recursive: true });

  const keys = Object.keys(payload).sort();
  for (const key of keys) {
    const out = join(outDir, `${key}.json`);
    writeFileSync(out, `${JSON.stringify(payload[key], null, 2)}\n`);
  }

  const manifest = join(outDir, '_manifest.json');
  writeFileSync(manifest, `${JSON.stringify(keys, null, 2)}\n`);
  console.log(`${lng}: split ${keys.length} namespaces → ${outDir}`);
}
