#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = mkdtempSync(join(tmpdir(), 'dinamos-api-runtime-'));

try {
  const configFile = ts.readConfigFile(join(root, 'api/tsconfig.json'), ts.sys.readFile);
  if (configFile.error) throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, join(root, 'api'));
  assert.equal(config.errors.length, 0, 'The API TypeScript configuration must be valid');

  // Keep modules separate and preserve their imports, as in the Node function.
  // Bundlers and TypeScript loaders can hide native ESM resolution failures.
  const program = ts.createProgram(config.fileNames, {
    ...config.options,
    noEmit: false,
    rootDir: root,
    outDir: output,
    incremental: false,
    declaration: false,
    declarationMap: false,
    sourceMap: false,
  });
  const emitted = program.emit();
  assert.equal(emitted.emitSkipped, false, 'The API must emit successfully');
  assert.equal(emitted.diagnostics.length, 0, 'The API must emit without errors');
  writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }));
  symlinkSync(join(root, 'node_modules'), join(output, 'node_modules'), 'junction');

  const entryUrl = pathToFileURL(join(output, 'api/index.js')).href;
  const appUrl = pathToFileURL(join(output, 'server/app.js')).href;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    const { default: handler } = await import(${JSON.stringify(entryUrl)});
    assert.equal(typeof handler, 'function', 'The Vercel API handler must load');
    const { default: app } = await import(${JSON.stringify(appUrl)});
    const health = await app.request('/api/health');
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });
    const protectedRoute = await app.request('/api/users/me');
    assert.equal(protectedRoute.status, 401);
    const missingRoute = await app.request('/api/does-not-exist');
    assert.equal(missingRoute.status, 404);
    console.log('Native Node API startup, health, authentication, and 404 checks passed.');
  `], {
    cwd: root,
    env: {
      ...process.env,
      NODE_OPTIONS: '',
      DATABASE_URL: '',
      FIREBASE_SERVICE_ACCOUNT_B64: '',
      FIREBASE_SERVICE_ACCOUNT_JSON: '',
    },
    stdio: 'inherit',
    timeout: 30_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  rmSync(output, { recursive: true, force: true });
}
