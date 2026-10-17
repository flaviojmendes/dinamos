import { test as base, expect } from '@playwright/test';
import { buildSync } from 'esbuild';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface SceneOptions {
  slug?: string;
  step?: 0 | 1 | 2;
  level?: number;
  playing?: boolean;
  reducedMotion?: boolean;
}
interface SceneSnapshot {
  backend: 'webgl' | 'svg' | null;
  webglAvailable: boolean;
  callbacks: number[];
  unavailable: number;
  children: number;
  paths: number;
}
interface SceneHarness {
  mount: (options?: SceneOptions) => SceneSnapshot;
  update: (options: SceneOptions) => SceneSnapshot;
  snapshot: () => SceneSnapshot;
  rotate: (direction: number) => void;
  zoom: () => void;
  dispose: () => void;
}
declare global { interface Window { RestaurantTest: SceneHarness } }

// This exercises the shipped renderer directly, without an authentication
// override, production-only route, mock Three.js implementation, or GPU requirement.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = buildSync({
  stdin: {
    resolveDir: root,
    sourcefile: 'restaurant-renderer-e2e.ts',
    loader: 'ts',
    contents: `
      import { createRestaurantWorld } from './src/components/restaurant/restaurantWorld';
      import { getConcept } from './src/components/restaurant/learningModel';
      import { getLessonVisual } from './src/components/restaurant/visualModel';
      let world;
      let options;
      let callbacks = [];
      let unavailable = 0;
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
      const webglAvailable = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      const host = () => document.getElementById('restaurant');
      function state() {
        const concept = getConcept(options.slug);
        if (!concept) throw new Error('Unknown renderer test lesson');
        return {
          mode: concept.mode, focus: concept.steps[options.step].focus,
          visual: getLessonVisual(options.slug, options.step),
          step: options.step, level: options.level,
          playing: options.playing, reducedMotion: options.reducedMotion,
          onStepComplete: () => callbacks.push(options.step),
        };
      }
      export function snapshot() {
        return { backend: world?.backend ?? null, webglAvailable,
          callbacks: [...callbacks], unavailable, children: host().childElementCount,
          paths: host().querySelectorAll('svg path').length };
      }
      export function mount(next = {}) {
        world?.dispose(); callbacks = []; unavailable = 0;
        options = { slug: 'intro', step: 0, level: 1, playing: false, reducedMotion: true, ...next };
        world = createRestaurantWorld(host(), { ...state(), onUnavailable: () => unavailable++ });
        return snapshot();
      }
      export function update(next) { options = { ...options, ...next }; world.update(state()); return snapshot(); }
      export function rotate(direction) { world.rotate(direction); }
      export function zoom() { world.zoom(); }
      export function dispose() { world?.dispose(); world = undefined; }
    `,
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  globalName: 'RestaurantTest',
  target: 'es2022',
  minify: true,
}).outputFiles[0].text;

const test = base.extend<{ rendererErrors: string[] }>({
  rendererErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.stack ?? error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setContent('<!doctype html><html lang="en"><head><style>body{margin:0}#restaurant{width:760px;height:400px;background:#17232b}</style></head><body><div id="restaurant" role="img" aria-label="Restaurant renderer test"></div></body></html>');
    await page.addScriptTag({ content: bundle });
    await use(errors);
    await page.evaluate(() => window.RestaurantTest.dispose());
    expect(errors, 'The real restaurant renderer must not produce JavaScript or console errors').toEqual([]);
  }, { auto: true }],
});

test('saved-progress levels visibly build six distinct restaurant stages, preferring WebGL when available', async ({ page }) => {
  const start = await page.evaluate(() => window.RestaurantTest.mount());
  expect(start.backend).toBe(start.webglAvailable ? 'webgl' : 'svg');
  expect(start.children).toBe(1);
  if (start.backend === 'svg') expect(start.paths).toBeGreaterThan(50);
  const renderings = new Set<string>();
  for (let level = 1; level <= 6; level++) {
    await page.evaluate(next => window.RestaurantTest.update({ level: next }), level);
    const image = await page.locator('#restaurant').screenshot();
    expect(image.byteLength, `Level ${level} must contain a rendered restaurant`).toBeGreaterThan(5_000);
    renderings.add(createHash('sha256').update(image).digest('hex'));
  }
  expect(renderings.size, 'Every permanent expansion must change the visible diorama').toBe(6);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().unavailable)).toBe(0);
});

test('each teaching step finishes once after four active seconds, excluding pause and reduced motion', async ({ page }) => {
  await page.evaluate(() => window.RestaurantTest.mount({ slug: 'components/cache', playing: true, reducedMotion: false }));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.RestaurantTest.update({ playing: false }));
  await page.waitForTimeout(1_800);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().callbacks)).toEqual([]);
  await page.evaluate(() => window.RestaurantTest.update({ playing: true, reducedMotion: true }));
  await page.waitForTimeout(1_800);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().callbacks)).toEqual([]);
  await page.evaluate(() => window.RestaurantTest.update({ reducedMotion: false }));
  await page.waitForTimeout(2_000);
  // Over six wall-clock seconds have elapsed, but less than four teaching seconds.
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().callbacks)).toEqual([]);
  await expect.poll(() => page.evaluate(() => window.RestaurantTest.snapshot().callbacks), { timeout: 5_000 }).toEqual([0]);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().callbacks)).toEqual([0]);
  await page.evaluate(() => window.RestaurantTest.update({ step: 1 }));
  await expect.poll(() => page.evaluate(() => window.RestaurantTest.snapshot().callbacks), { timeout: 7_000 }).toEqual([0, 1]);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().callbacks)).toEqual([0, 1]);
});

test('camera actions change the rendered view and dispose/recreate leaves one working scene', async ({ page }) => {
  await page.evaluate(() => window.RestaurantTest.mount({ level: 6 }));
  const frame = page.locator('#restaurant');
  const first = await frame.screenshot();
  await page.evaluate(() => window.RestaurantTest.rotate(1));
  const rotated = await frame.screenshot();
  expect(rotated.equals(first)).toBe(false);
  await page.evaluate(() => window.RestaurantTest.zoom());
  expect((await frame.screenshot()).equals(rotated)).toBe(false);
  await page.evaluate(() => window.RestaurantTest.dispose());
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().children)).toBe(0);
  // React StrictMode and lesson changes both use this mount/cleanup/mount sequence.
  await page.evaluate(() => {
    window.RestaurantTest.mount();
    window.RestaurantTest.dispose();
    window.RestaurantTest.mount({ slug: 'consistency-strategies/saga', level: 6, step: 1 });
  });
  const final = await page.evaluate(() => window.RestaurantTest.snapshot());
  expect(final.children).toBe(1);
  expect(final.unavailable).toBe(0);
  expect(final.callbacks).toEqual([]);
  expect((await frame.screenshot()).byteLength).toBeGreaterThan(5_000);
});
