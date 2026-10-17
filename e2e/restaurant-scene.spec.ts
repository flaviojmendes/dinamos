import { test as base, expect } from '@playwright/test';
import { buildSync } from 'esbuild';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import type { RestaurantProp } from '../src/components/restaurant/visualModel';

interface SceneOptions {
  slug?: string;
  step?: 0 | 1 | 2;
  level?: number;
  playing?: boolean;
  reducedMotion?: boolean;
  locale?: 'en' | 'pt';
}
interface SceneSnapshot {
  backend: 'webgl' | 'svg' | null;
  webglAvailable: boolean;
  callbacks: number[];
  unavailable: number;
  children: number;
  totalChildren: number;
  paths: number;
  svgMarkupLength: number;
  paintedSamples: number;
  propMeshes: number;
  propTriangles: number;
  propCenters: number[][];
  visibleProps: RestaurantProp[];
  labels: string[];
  prop: RestaurantProp;
}
interface SceneCase {
  slug: string;
  step: 0 | 1 | 2;
  prop: RestaurantProp;
  detail?: string;
  blocked: boolean;
  fault: boolean;
  nameEn: string;
  namePt: string;
}
interface SceneHarness {
  mount: (options?: SceneOptions) => SceneSnapshot;
  update: (options: SceneOptions) => SceneSnapshot;
  snapshot: () => SceneSnapshot;
  rotate: (direction: number) => void;
  zoom: () => void;
  dispose: () => void;
  catalog: () => SceneCase[];
  slowFrames: () => void;
}
declare global { interface Window { RestaurantTest: SceneHarness } }

// This exercises the shipped renderer directly, without an authentication
// override, production-only route, mock Three.js implementation, or GPU requirement.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const courseSlugs = (JSON.parse(readFileSync(resolve(root, 'public/content/manifest.json'), 'utf8')).pages as { slug: string }[]).map(page => page.slug);
const bundle = buildSync({
  stdin: {
    resolveDir: root,
    sourcefile: 'restaurant-renderer-e2e.ts',
    loader: 'ts',
    contents: `
      import { createRestaurantWorld } from './src/components/restaurant/restaurantWorld';
      import { getConcept } from './src/components/restaurant/learningModel';
      import { restaurantConcepts } from './src/components/restaurant/learningModel';
      import { getLessonVisual } from './src/components/restaurant/visualModel';
      import { restaurantPropNames } from './src/components/restaurant/restaurantObjects';
      import * as T from 'three';
      let world;
      let options;
      let callbacks = [];
      let unavailable = 0;
      let lastScene;
      let lastCamera;
      let awaitingSceneCamera = false;
      let paintedSamples = 0;
      let pixelBuffer;
      // Observe the real scene and camera sent through both Three renderers.
      // Their matrix updates still run normally; no geometry or renderer is mocked.
      const updateScene = T.Scene.prototype.updateMatrixWorld;
      T.Scene.prototype.updateMatrixWorld = function(...args) { const result = updateScene.apply(this, args); lastScene = this; awaitingSceneCamera = true; return result; };
      const updateCamera = T.Camera.prototype.updateMatrixWorld;
      T.Camera.prototype.updateMatrixWorld = function(...args) { const result = updateCamera.apply(this, args); if (awaitingSceneCamera) { lastCamera = this; awaitingSceneCamera = false; } return result; };
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
      const webglAvailable = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      const host = () => document.getElementById('restaurant');
      export function slowFrames() {
        // Software WebGL is already slow on CI. Apply explicit low-frame-rate
        // coverage to the vector fallback without doubling the GPU runner's cost.
        if (webglAvailable) return;
        const nativeFrame = window.requestAnimationFrame.bind(window);
        // Exercise a low frame rate on both GPU and vector renderers. The lesson
        // clock must follow active elapsed time rather than clamped pose deltas.
        window.requestAnimationFrame = callback => nativeFrame(() => {
          window.setTimeout(() => callback(performance.now()), 400);
        });
      }
      function state() {
        const concept = getConcept(options.slug);
        if (!concept) throw new Error('Unknown renderer test lesson');
        return {
          mode: concept.mode, focus: concept.steps[options.step].focus,
          visual: getLessonVisual(options.slug, options.step),
          lesson: options.slug, title: concept.title[options.locale],
          step: options.step, level: options.level,
          locale: options.locale,
          playing: options.playing, reducedMotion: options.reducedMotion,
          onStepComplete: () => callbacks.push(options.step),
        };
      }
      function readPaint() {
        paintedSamples = 0;
        if (world?.backend !== 'webgl') return;
        const canvas = host().querySelector(':scope > canvas');
        const context = canvas.getContext('webgl2');
        const size = context.drawingBufferWidth * context.drawingBufferHeight * 4;
        if (!pixelBuffer || pixelBuffer.length !== size) pixelBuffer = new Uint8Array(size);
        // This runs immediately after the real render, before an unpreserved GPU
        // drawing buffer can be discarded by presentation.
        context.readPixels(0, 0, context.drawingBufferWidth, context.drawingBufferHeight, context.RGBA, context.UNSIGNED_BYTE, pixelBuffer);
        for (let i = 3; i < size; i += 64) if (pixelBuffer[i] > 0) paintedSamples++;
      }
      function renderedProp() {
        const result = { meshes: 0, triangles: 0, centers: [], visibleProps: [] };
        if (!lastScene || !lastCamera || !options) return result;
        const visual = getLessonVisual(options.slug, options.step);
        const projection = new T.Matrix4().multiplyMatrices(lastCamera.projectionMatrix, lastCamera.matrixWorldInverse);
        const frustum = new T.Frustum().setFromProjectionMatrix(projection);
        lastScene.traverseVisible(object => {
          const kind = object.userData.restaurantProp;
          if (!kind) return;
          let meshes = 0;
          let triangles = 0;
          object.traverseVisible(child => {
            if (!child.isMesh || !child.geometry?.attributes.position || !frustum.intersectsObject(child)) return;
            meshes++;
            triangles += (child.geometry.index?.count ?? child.geometry.attributes.position.count) / 3;
          });
          if (!meshes) return;
          if (!result.visibleProps.includes(kind)) result.visibleProps.push(kind);
          if (kind === visual.prop) {
            result.meshes += meshes; result.triangles += triangles;
            result.centers.push(object.getWorldPosition(new T.Vector3()).toArray().map(value => Math.round(value * 1000) / 1000));
          }
        });
        return result;
      }
      export function snapshot() {
        const physical = renderedProp();
        const paths = [...host().querySelectorAll(':scope > svg path')];
        const bounds = host().getBoundingClientRect();
        const labels = [...host().querySelectorAll(':scope > div span')].filter(element => {
          const at = element.getBoundingClientRect();
          return at.width > 0 && at.height > 0 && at.right > bounds.left && at.left < bounds.right && at.bottom > bounds.top && at.top < bounds.bottom;
        }).map(element => element.textContent);
        return { backend: world?.backend ?? null, webglAvailable,
          callbacks: [...callbacks], unavailable,
          children: host().querySelectorAll(':scope > canvas, :scope > svg').length,
          totalChildren: host().childElementCount,
          paths: paths.length, svgMarkupLength: paths.reduce((sum, path) => sum + (path.getAttribute('d')?.length ?? 0), 0),
          paintedSamples, propMeshes: physical.meshes, propTriangles: physical.triangles,
          propCenters: physical.centers, visibleProps: physical.visibleProps, labels,
          prop: options ? getLessonVisual(options.slug, options.step)?.prop : undefined };
      }
      export function mount(next = {}) {
        world?.dispose(); callbacks = []; unavailable = 0;
        options = { slug: 'intro', step: 0, level: 1, playing: false, reducedMotion: true, locale: 'en', ...next };
        world = createRestaurantWorld(host(), { ...state(), onUnavailable: () => unavailable++ });
        readPaint();
        return snapshot();
      }
      export function update(next) { options = { ...options, ...next }; world.update(state()); readPaint(); return snapshot(); }
      export function rotate(direction) { world.rotate(direction); }
      export function zoom() { world.zoom(); }
      export function dispose() { world?.dispose(); world = undefined; lastScene = undefined; lastCamera = undefined; }
      export function catalog() {
        return Object.values(restaurantConcepts).flatMap(concept => concept.steps.map((step, index) => {
          const visual = getLessonVisual(concept.slug, index);
          return { slug: concept.slug, step: index, prop: visual.prop, detail: visual.detail,
            blocked: !!visual.blocked, fault: !!visual.fault,
            nameEn: restaurantPropNames.en[visual.prop], namePt: restaurantPropNames.pt[visual.prop] };
        }));
      }
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
    expect(await page.evaluate(() => window.RestaurantTest.snapshot().totalChildren), 'Dispose must remove renderer and physical annotations').toBe(0);
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
  await page.evaluate(() => window.RestaurantTest.slowFrames());
  const start = await page.evaluate(() => window.RestaurantTest.mount({ slug: 'components/cache', playing: true, reducedMotion: false }));
  await page.waitForTimeout(1_100);
  const moving = await page.evaluate(() => window.RestaurantTest.snapshot());
  expect(moving.propCenters, 'A worker must actually carry the restaurant object through the scene').not.toEqual(start.propCenters);
  const paused = await page.evaluate(() => window.RestaurantTest.update({ playing: false }));
  await page.waitForTimeout(1_800);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().callbacks)).toEqual([]);
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().propCenters)).toEqual(paused.propCenters);
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
  expect(await page.evaluate(() => window.RestaurantTest.snapshot().totalChildren)).toBe(0);
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

function expectPhysicalScene(snapshot: SceneSnapshot, scene: SceneCase, locale: 'en' | 'pt' = 'en') {
  const description = `${scene.slug}, step ${scene.step + 1}, ${scene.prop}, ${locale}`;
  expect(snapshot.children, description).toBe(1);
  expect(snapshot.unavailable, description).toBe(0);
  expect(snapshot.propMeshes, `${description}: the physical object needs visible meshes, not only a label or dataset`).toBeGreaterThan(0);
  expect(snapshot.propTriangles, `${description}: the physical object needs nonempty geometry within the camera frustum`).toBeGreaterThanOrEqual(12);
  if (snapshot.backend === 'svg') {
    expect(snapshot.paths, `${description}: the real SVG renderer must emit visible paths`).toBeGreaterThan(50);
    expect(snapshot.svgMarkupLength, `${description}: the SVG geometry must contain painted shapes`).toBeGreaterThan(3_000);
  } else {
    expect(snapshot.paintedSamples, `${description}: the real GPU drawing buffer must contain painted pixels`).toBeGreaterThan(50);
  }
  const name = locale === 'en' ? scene.nameEn : scene.namePt;
  expect(snapshot.labels, `${description}: the label anchored to the physical object must use the selected language`).toContain(`${name}${scene.detail ? ` ${scene.detail}` : ''}`);
  if (scene.blocked || scene.fault) {
    expect(snapshot.visibleProps, `${description}: a real clock must accompany the physical waiting notice`).toContain('clock');
    const notice = locale === 'en'
      ? (scene.blocked ? 'Order on hold' : 'No new messages')
      : (scene.blocked ? 'Comanda em espera' : 'Sem novas notícias');
    expect(snapshot.labels, `${description}: the physical notice must also be translated`).toContain(notice);
  }
}

// Separate worlds bound object-pool and GPU memory while still rendering every
// published lesson's three authored scenes. Each batch is independently retryable.
for (let offset = 0; offset < courseSlugs.length; offset += 20) {
  const slugs = courseSlugs.slice(offset, offset + 20);
  test(`renders every physical scene for published lessons ${offset + 1}–${offset + slugs.length}`, async ({ page }) => {
    test.setTimeout(90_000);
    const catalog = await page.evaluate(() => window.RestaurantTest.catalog());
    expect(catalog).toHaveLength(courseSlugs.length * 3);
    expect([...new Set(catalog.map(scene => scene.slug))].sort()).toEqual([...courseSlugs].sort());
    const cases = catalog.filter(scene => slugs.includes(scene.slug));
    expect(cases).toHaveLength(slugs.length * 3);
    await page.evaluate(first => window.RestaurantTest.mount({ slug: first.slug, step: first.step, level: 6, reducedMotion: true, playing: false, locale: 'en' }), cases[0]);
    for (const scene of cases) {
      const snapshot = await page.evaluate(current => window.RestaurantTest.update({ slug: current.slug, step: current.step, locale: 'en' }), scene);
      expectPhysicalScene(snapshot, scene);
      expect(snapshot.callbacks, 'Reduced-motion scene review must not advance the teaching steps').toEqual([]);
    }
  });
}

test('all fourteen restaurant objects have painted geometry and physical labels in English and Portuguese', async ({ page }) => {
  test.setTimeout(90_000);
  const catalog = await page.evaluate(() => window.RestaurantTest.catalog());
  const examples = new Map<RestaurantProp, SceneCase>();
  for (const scene of catalog) if (!examples.has(scene.prop)) examples.set(scene.prop, scene);
  const representatives = [...examples.values()];
  expect(representatives.map(scene => scene.prop).sort()).toEqual([
    'badge', 'checklist', 'clock', 'customer', 'delivery-bag', 'ingredient', 'key',
    'ledger', 'menu', 'order', 'receipt', 'recipe', 'sealed-order', 'tray',
  ]);
  await page.evaluate(() => window.RestaurantTest.mount({ level: 6, locale: 'en' }));
  const paintedObjects = new Set<string>();
  for (const scene of representatives) {
    const english = await page.evaluate(current => window.RestaurantTest.update({ slug: current.slug, step: current.step, locale: 'en' }), scene);
    expectPhysicalScene(english, scene, 'en');
    const pixels = await page.locator('#restaurant').screenshot({
      // Comparing the painted miniature without HTML labels prevents translated
      // text alone from making otherwise empty/equal objects appear different.
      style: '#restaurant > div { visibility: hidden !important; }',
    });
    expect(pixels.byteLength).toBeGreaterThan(5_000);
    paintedObjects.add(createHash('sha256').update(pixels).digest('hex'));
    const portuguese = await page.evaluate(() => window.RestaurantTest.update({ locale: 'pt' }));
    expectPhysicalScene(portuguese, scene, 'pt');
    expect(portuguese.labels).not.toContain(`${scene.nameEn}${scene.detail ? ` ${scene.detail}` : ''}`);
  }
  expect(paintedObjects.size, 'The fourteen prop categories must produce distinct painted miniatures without text overlays').toBe(14);
  const interrupted = catalog.find(scene => scene.blocked && scene.fault)!;
  for (const locale of ['en', 'pt'] as const) {
    const snapshot = await page.evaluate(({ scene, language }) => window.RestaurantTest.update({ slug: scene.slug, step: scene.step, locale: language }), { scene: interrupted, language: locale });
    expectPhysicalScene(snapshot, interrupted, locale);
  }
});
