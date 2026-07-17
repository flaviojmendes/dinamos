#!/usr/bin/env node
/**
 * Install Playwright Chromium into .playwright-browsers with correct platform
 * detection (arm64 Macs in sandboxes may otherwise fetch mac-x64 and crash).
 */
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browsersPath = resolve(rootDir, '.playwright-browsers');

const env = {
  ...process.env,
  PLAYWRIGHT_BROWSERS_PATH: browsersPath,
};

if (os.platform() === 'darwin' && os.arch() === 'arm64') {
  env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE ?? 'mac15-arm64';
}

const result = spawnSync('npx', ['playwright', 'install', 'chromium'], {
  stdio: 'inherit',
  env,
  cwd: rootDir,
});

process.exit(result.status ?? 1);
