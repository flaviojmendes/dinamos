import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';

const rootDir = dirname(fileURLToPath(import.meta.url));

// Pin browsers to a repo-local cache (gitignored) so installs are reproducible.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve(rootDir, '.playwright-browsers');

// Some CI/dev sandboxes mis-detect Apple Silicon and fetch mac-x64 builds (SIGSEGV on arm64).
if (os.platform() === 'darwin' && os.arch() === 'arm64') {
  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE ??= 'mac15-arm64';
}

/** Prefer full Chrome for Testing over headless shell (more reliable in some sandboxes). */
const chromeForTesting = resolve(
  rootDir,
  '.playwright-browsers/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
);
const useBundledChrome =
  !process.env.CI && os.platform() === 'darwin' && existsSync(chromeForTesting);
const useSystemChrome =
  !process.env.CI && os.platform() === 'darwin' && !useBundledChrome;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useSystemChrome ? { channel: 'chrome' as const } : {}),
        ...(useBundledChrome
          ? { launchOptions: { executablePath: chromeForTesting } }
          : {}),
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173',
        port: 4173,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
