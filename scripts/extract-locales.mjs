#!/usr/bin/env node
/**
 * Extract embedded locale objects from src/config/i18n.ts into JSON files.
 */
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { transformSync } from 'esbuild';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src/config/i18n.ts');
const text = readFileSync(SRC, 'utf8');

const wrapped = text.replace(/\ni18n[\s\S]*export default i18n;?\s*$/, '\nexport { resources };');
const { code } = transformSync(wrapped, { loader: 'ts', format: 'esm' });
const tmp = join(tmpdir(), `i18n-extract-${process.pid}.mjs`);
writeFileSync(tmp, code);

try {
  const mod = await import(pathToFileURL(tmp).href);
  const { resources } = mod;
  for (const lng of ['en', 'pt']) {
    const dir = join(ROOT, 'src/locales', lng);
    mkdirSync(dir, { recursive: true });
    const payload = resources[lng].translation;
    const out = join(dir, 'translation.json');
    writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(`Wrote ${out} (${(Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1)} KB)`);
  }
} finally {
  unlinkSync(tmp);
}
