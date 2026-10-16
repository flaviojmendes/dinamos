#!/usr/bin/env node
/**
 * Summarize production bundle sizes from `dist/` after `npm run build`.
 * Writes JSON to benchmarks/bundle-baseline.json and prints a short report.
 */
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const OUT_DIR = join(process.cwd(), 'benchmarks');
const OUT_FILE = join(OUT_DIR, 'bundle-baseline.json');

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function compressSizes(buf) {
  return {
    raw: buf.length,
    gzip: gzipSync(buf, { level: 9 }).length,
    brotli: brotliCompressSync(buf, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  };
}

function walkAssets(dir, prefix = '') {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (statSync(full).isDirectory()) {
      files.push(...walkAssets(full, rel));
    } else {
      files.push({ rel, full });
    }
  }
  return files;
}

function parseIndexHtml() {
  const htmlPath = join(DIST, 'index.html');
  if (!existsSync(htmlPath)) return { entryJs: [], entryCss: [] };
  const html = readFileSync(htmlPath, 'utf8');
  const entryJs = [...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
  const entryCss = [...html.matchAll(/href="(\/assets\/[^"]+\.css)"/g)].map((m) => m[1]);
  return { entryJs, entryCss };
}

function startupFiles(entryJs, entryCss) {
  const files = new Set([...entryJs, ...entryCss].map((file) => file.replace(/^\//, '')));
  const manifestPath = [join(DIST, '.vite', 'manifest.json'), join(DIST, 'manifest.json')]
    .find((file) => existsSync(file));
  if (!manifestPath) return files;

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const visited = new Set();
  const active = new Set();
  const path = [];

  function checkStaticImports(key) {
    if (active.has(key)) {
      const cycle = [...path.slice(path.indexOf(key)), key]
        .map((id) => manifest[id].file).join(' -> ');
      throw new Error(`[baseline:bundle] Static chunk dependency cycle: ${cycle}`);
    }
    if (visited.has(key)) return;
    const chunk = manifest[key];
    if (!chunk) throw new Error(`[baseline:bundle] Missing manifest import: ${key}`);
    active.add(key);
    path.push(key);
    for (const dependency of chunk.imports ?? []) checkStaticImports(dependency);
    path.pop();
    active.delete(key);
    visited.add(key);
  }

  // Check lazy route chunks too, but never follow dynamic imports as static edges.
  for (const key of Object.keys(manifest)) checkStaticImports(key);

  const keyByFile = new Map(Object.entries(manifest).map(([key, chunk]) => [chunk.file, key]));
  const included = new Set();
  function include(key) {
    if (included.has(key)) return;
    included.add(key);
    const chunk = manifest[key];
    files.add(chunk.file);
    for (const css of chunk.css ?? []) files.add(css);
    for (const dependency of chunk.imports ?? []) include(dependency);
  }
  for (const file of entryJs) {
    const key = keyByFile.get(file.replace(/^\//, ''));
    if (key === undefined) throw new Error(`[baseline:bundle] Entry missing from manifest: ${file}`);
    include(key);
  }
  return files;
}

function routeChunk(name) {
  const patterns = [
    { route: 'entry (index.html)', re: /^index-[A-Za-z0-9_-]+\.js$/ },
    { route: 'landing (/)', re: /^LandingPage|^index-yyK/i },
    { route: 'lesson (content)', re: /ContentPage|MdxPage|index-BsSGdS4d/i },
    { route: 'forum topic', re: /^TopicView-/i },
    { route: 'game editor', re: /^SystemEditorV2-/i },
    { route: 'game arena', re: /^GameArenaPage-/i },
    { route: 'game host', re: /^HostConsole-/i },
    { route: 'design-lab home', re: /^Home-/i },
    { route: 'challenge', re: /^Challenge-/i },
  ];
  for (const { route, re } of patterns) {
    if (re.test(name)) return route;
  }
  return null;
}

function main() {
  if (!existsSync(DIST)) {
    console.error('[baseline:bundle] dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const assetsDir = join(DIST, 'assets');
  const assetFiles = existsSync(assetsDir) ? walkAssets(assetsDir) : [];
  const chunks = assetFiles
    .filter(({ rel }) => rel.endsWith('.js') || rel.endsWith('.css'))
    .map(({ rel, full }) => {
      const buf = readFileSync(full);
      const sizes = compressSizes(buf);
      return {
        file: `assets/${rel}`,
        name: basename(rel),
        ...sizes,
        routeHint: routeChunk(basename(rel)),
      };
    })
    .sort((a, b) => b.gzip - a.gzip);

  const jsTotal = chunks.filter((c) => c.file.endsWith('.js')).reduce((s, c) => s + c.raw, 0);
  const cssTotal = chunks.filter((c) => c.file.endsWith('.css')).reduce((s, c) => s + c.raw, 0);

  const { entryJs, entryCss } = parseIndexHtml();
  const entryScripts = new Set(entryJs.map((file) => file.replace(/^\//, '')));
  const initialFiles = startupFiles(entryJs, entryCss);
  const entryChunks = chunks.filter((c) => initialFiles.has(c.file))
    // Keep the actual entry first for the existing per-entry JS budget.
    .sort((a, b) => Number(entryScripts.has(b.file)) - Number(entryScripts.has(a.file)));

  const routeChunks = chunks.filter((c) => c.routeHint && !entryJs.some((p) => c.file.endsWith(p.replace(/^\//, ''))));

  const report = {
    capturedAt: new Date().toISOString(),
    distPath: DIST,
    totals: {
      jsFiles: chunks.filter((c) => c.file.endsWith('.js')).length,
      cssFiles: chunks.filter((c) => c.file.endsWith('.css')).length,
      jsRaw: jsTotal,
      cssRaw: cssTotal,
    },
    entry: {
      scripts: entryJs,
      styles: entryCss,
      chunks: entryChunks.map(({ file, raw, gzip, brotli }) => ({ file, raw, gzip, brotli })),
      gzipTotal: entryChunks.reduce((s, c) => s + c.gzip, 0),
      brotliTotal: entryChunks.reduce((s, c) => s + c.brotli, 0),
    },
    topChunksByGzip: chunks.slice(0, 25).map(({ file, raw, gzip, brotli, routeHint }) => ({
      file,
      raw,
      gzip,
      brotli,
      routeHint,
    })),
    routeChunks: routeChunks.slice(0, 20).map(({ file, raw, gzip, brotli, routeHint }) => ({
      file,
      raw,
      gzip,
      brotli,
      routeHint,
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  const mainEntry = entryChunks.find((c) => c.file.endsWith('.js'));
  console.log('=== Bundle baseline ===');
  console.log(`Initial JS + CSS gzip total: ${formatBytes(report.entry.gzipTotal)} (${entryJs.join(', ') || 'n/a'})`);
  if (mainEntry) {
    console.log(`Main entry chunk: ${mainEntry.file} — raw ${formatBytes(mainEntry.raw)}, gzip ${formatBytes(mainEntry.gzip)}, brotli ${formatBytes(mainEntry.brotli)}`);
  }
  console.log(`All JS assets: ${report.totals.jsFiles} files, ${formatBytes(report.totals.jsRaw)} raw`);
  console.log('\nTop route-related chunks (gzip):');
  for (const c of routeChunks.slice(0, 8)) {
    console.log(`  ${c.routeHint}: ${c.file} — ${formatBytes(c.gzip)}`);
  }
  console.log(`\nWrote ${OUT_FILE}`);
}

main();
