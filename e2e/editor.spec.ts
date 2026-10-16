import { test as base, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await use(errors);
    expect(errors).toEqual([]);
  }, { auto: true }],
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('i18nextLng', 'en');
    localStorage.setItem('language-choice-made', 'true');
    localStorage.setItem('cookie-consent', JSON.stringify({ necessary: true, analytics: false, functional: false, marketing: false, timestamp: Date.now() }));
  });
});

async function exportedDesign(page: Page) {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export (.din)', exact: true }).click();
  const download = await downloadPromise;
  const file = await download.path();
  return JSON.parse(await readFile(file!, 'utf8'));
}

const savedDesign = {
  version: '2.0', seed: 0, profileType: 'constant', provider: 'gcp', chaos: [],
  nodes: [
    { id: 'c', position: { x: 350, y: 0 }, config: { id: 'c', kind: 'client', label: 'Fixture client', baseRate: 60, queueCapacity: null } },
    { id: 'lb', position: { x: 350, y: 180 }, config: { id: 'lb', kind: 'loadBalancer', label: 'Fixture LB', strategy: 'weighted', weights: { a: 3, b: 1 } } },
    { id: 'a', position: { x: 200, y: 360 }, config: { id: 'a', kind: 'server', label: 'API A' } },
    { id: 'b', position: { x: 500, y: 360 }, config: { id: 'b', kind: 'server', label: 'API B' } },
  ],
  edges: [ { id: 'clb', source: 'c', target: 'lb' }, { id: 'lba', source: 'lb', target: 'a' }, { id: 'lbb', source: 'lb', target: 'b' } ],
};

test('editor runs, pauses, resets and lets a client stop traffic', async ({ page }) => {
  await page.goto('/editor');
  await expect(page.getByText('t=0s', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.getByText('t=1s', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.getByText('t=2s', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await page.getByTitle('Simulated time').innerText();
  await page.waitForTimeout(650);
  await expect(page.getByTitle('Simulated time')).toHaveText(paused);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.locator('.react-flow__node[data-id="c1"]').click();
  await page.getByRole('slider', { name: 'Base rate', exact: true }).press('Home');
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.getByRole('group', { name: /Traffic: 0 req\/s/ })).toBeVisible();
  await page.getByRole('button', { name: /^Undo/ }).click();
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.getByRole('group', { name: /Traffic: 120 req\/s/ })).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Seed', exact: true }).fill('0');
  await expect(page.getByText('t=0s', { exact: true })).toBeVisible();
});

test('file imports restore queues, weighted routing and provider; malformed imports leave the graph intact', async ({ page }) => {
  await page.goto('/editor');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({ name: 'fixture.din', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(savedDesign)) });
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await expect(page.getByRole('combobox', { name: 'Cloud', exact: true })).toHaveValue('gcp');
  await page.locator('.react-flow__node[data-id="lb"]').click();
  await page.getByRole('slider', { name: 'Weight: API A', exact: true }).press('Home');
  await page.locator('.react-flow__node[data-id="a"]').click();
  await page.getByRole('switch', { name: 'Limit waiting queue', exact: true }).click();
  await page.getByRole('slider', { name: 'Waiting queue slots', exact: true }).press('Home');
  const exported = await exportedDesign(page);
  expect(exported.provider).toBe('gcp');
  expect(exported.seed).toBe(0);
  expect(exported.nodes.find((n: { id: string }) => n.id === 'c').config.queueCapacity).toBeNull();
  expect(exported.nodes.find((n: { id: string }) => n.id === 'a').config.queueCapacity).toBe(0);
  expect(exported.nodes.find((n: { id: string }) => n.id === 'lb').config.weights).toEqual({ a: 0, b: 1 });
  await fileInput.setInputFiles({ name: 'invalid.din', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...savedDesign, edges: [{ id: 'bad', source: 'c', target: 'missing' }] })) });
  await expect(page.getByText('Error importing file. Invalid or corrupted format.', { exact: true })).toBeVisible();
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.getByRole('group', { name: /Traffic: 60 req\/s/ })).toBeVisible();
});

test('shared embeds can simulate while graph and scenario controls stay read-only', async ({ page }) => {
  await page.route('**/api/architectures/editor-fixture', route => route.fulfill({ json: { design: savedDesign } }));
  await page.goto('/embed/editor/editor-fixture');
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Load', exact: true })).toBeDisabled();
  await expect(page.getByRole('combobox', { name: 'Cloud', exact: true })).toBeDisabled();
  await expect(page.getByRole('spinbutton', { name: 'Seed', exact: true })).toBeDisabled();
  await page.locator('.react-flow__node[data-id="c"]').click();
  await expect(page.getByRole('slider', { name: 'Base rate', exact: true })).toBeDisabled();
  await page.keyboard.press('Delete');
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.getByText('t=1s', { exact: true })).toBeVisible();
  const exported = await exportedDesign(page);
  expect(exported.nodes).toHaveLength(4);
  expect(exported.nodes[0].config.baseRate).toBe(60);
});

test('mobile shared scenarios remain read-only', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/architectures/editor-mobile', route => route.fulfill({ json: { design: savedDesign } }));
  await page.goto('/embed/editor/editor-mobile');
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await page.getByRole('button', { name: 'Scenario', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Cloud', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Load', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Inject', exact: true })).toBeDisabled();
  expect(await page.locator('.react-flow__controls-interactive').count()).toBe(0);
});

test('components can be connected and duplicate logical links are rejected', async ({ page }) => {
  await page.goto('/editor');
  const design = { ...savedDesign, nodes: [savedDesign.nodes[0], { ...savedDesign.nodes[2], position: { x: 350, y: 180 } }], edges: [] };
  await page.locator('input[type="file"]').setInputFiles({ name: 'wiring.din', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(design)) });
  await expect(page.locator('.react-flow__node')).toHaveCount(2);
  async function connect(sourceSide: string, targetSide: string) {
    const source = page.locator(`.react-flow__node[data-id="c"] [data-handleid="${sourceSide}"]`);
    const target = page.locator(`.react-flow__node[data-id="a"] [data-handleid="${targetSide}"]`);
    await expect(source).toBeVisible();
    await expect(target).toBeVisible();
    await source.hover();
    const end = await target.boundingBox();
    await page.mouse.down();
    await page.mouse.move(end!.x + end!.width / 2, end!.y + end!.height / 2, { steps: 12 });
    await page.mouse.up();
  }
  await connect('bottom', 'top');
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  await connect('right', 'right');
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.getByRole('group', { name: /Traffic: 60 req\/s/ })).toBeVisible();
  const paletteServer = page.locator('.react-flow__panel [draggable="true"]').filter({ hasText: /^Server$/ });
  await paletteServer.dragTo(page.locator('.react-flow__pane'), { targetPosition: { x: 700, y: 340 } });
  await expect(page.locator('.react-flow__node')).toHaveCount(3);
});
