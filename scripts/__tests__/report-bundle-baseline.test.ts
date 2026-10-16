import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { afterEach, describe, expect, it } from 'vitest';

const reporter = fileURLToPath(new URL('../report-bundle-baseline.mjs', import.meta.url));
const fixtureDirectories = new Set<string>();

type Manifest = Record<string, {
  file: string;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
}>;

interface BundleReport {
  entry: {
    scripts: string[];
    chunks: { file: string; gzip: number }[];
    gzipTotal: number;
  };
}

function writeManifest(directory: string, manifest: Manifest) {
  const manifestDirectory = join(directory, 'dist', '.vite');
  mkdirSync(manifestDirectory, { recursive: true });
  writeFileSync(join(manifestDirectory, 'manifest.json'), JSON.stringify(manifest));
}

function createFixture(includeManifest = true) {
  const directory = mkdtempSync(join(tmpdir(), 'dinamos-bundle-baseline-test-'));
  fixtureDirectories.add(directory);
  const assets = join(directory, 'dist', 'assets');
  mkdirSync(assets, { recursive: true });
  writeFileSync(join(directory, 'dist', 'index.html'),
    '<script src="/assets/index-fixture.js"></script><link href="/assets/index-fixture.css" rel="stylesheet">');
  for (const [name, content] of Object.entries({
    'index-fixture.js': 'console.log("entry")',
    'vendor-react.js': 'console.log("a longer vendor payload with unique words to exceed the entry gzip size")',
    'shared.js': 'console.log("shared")',
    'route.js': 'console.log("dynamic route")',
    'index-fixture.css': 'body{}',
    'shared.css': '.shared{}',
    'route.css': '.route{}',
  })) {
    writeFileSync(join(assets, name), content);
  }

  const manifest: Manifest = {
    'index.html': {
      file: 'assets/index-fixture.js',
      imports: ['_vendor'],
      dynamicImports: ['route'],
      css: ['assets/index-fixture.css'],
    },
    _vendor: {
      file: 'assets/vendor-react.js',
      imports: ['_shared'],
      css: ['assets/shared.css', 'assets/index-fixture.css'],
    },
    _shared: { file: 'assets/shared.js' },
    route: {
      file: 'assets/route.js',
      imports: ['index.html'],
      css: ['assets/route.css'],
    },
  };
  if (includeManifest) writeManifest(directory, manifest);
  return { directory, manifest };
}

function runReporter(directory: string) {
  return spawnSync(process.execPath, [reporter], {
    cwd: directory,
    encoding: 'utf8',
    timeout: 10_000,
  });
}

function readReport(directory: string): BundleReport {
  return JSON.parse(readFileSync(join(directory, 'benchmarks', 'bundle-baseline.json'), 'utf8'));
}

afterEach(() => {
  for (const directory of fixtureDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
  fixtureDirectories.clear();
});

describe('bundle baseline reporter CLI', () => {
  it('counts static dependencies and CSS once, excludes dynamic imports, and keeps the entry first', () => {
    const { directory } = createFixture();
    const result = runReporter(directory);
    expect(result.status, result.stderr || result.error?.message).toBe(0);

    const report = readReport(directory);
    const expectedFiles = [
      'assets/index-fixture.js',
      'assets/vendor-react.js',
      'assets/shared.js',
      'assets/index-fixture.css',
      'assets/shared.css',
    ];
    expect(report.entry.chunks.map((chunk) => chunk.file).sort()).toEqual([...expectedFiles].sort());
    expect(report.entry.chunks[0].file).toBe('assets/index-fixture.js');
    expect(report.entry.scripts).toEqual(['/assets/index-fixture.js']);
    expect(report.entry.gzipTotal).toBe(expectedFiles.reduce((total, file) =>
      total + gzipSync(readFileSync(join(directory, 'dist', file)), { level: 9 }).length, 0));
  });

  it('rejects a static chunk cycle with the affected dependency chain', () => {
    const { directory, manifest } = createFixture();
    manifest._shared.imports = ['_vendor'];
    writeManifest(directory, manifest);

    const result = runReporter(directory);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(
      'Static chunk dependency cycle: assets/vendor-react.js -> assets/shared.js -> assets/vendor-react.js',
    );
  });

  it('rejects a static cycle confined to a lazy route', () => {
    const { directory, manifest } = createFixture();
    manifest.route.imports = ['route'];
    writeManifest(directory, manifest);

    const result = runReporter(directory);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Static chunk dependency cycle: assets/route.js -> assets/route.js');
  });

  it('uses the HTML entry files for older builds without a manifest', () => {
    const { directory } = createFixture(false);
    const result = runReporter(directory);
    expect(result.status, result.stderr || result.error?.message).toBe(0);

    const report = readReport(directory);
    expect(report.entry.chunks.map((chunk) => chunk.file).sort()).toEqual([
      'assets/index-fixture.css',
      'assets/index-fixture.js',
    ]);
    expect(report.entry.scripts).toEqual(['/assets/index-fixture.js']);
  });
});
