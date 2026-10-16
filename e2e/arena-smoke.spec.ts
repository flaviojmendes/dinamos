import { test as base, expect } from '@playwright/test';

const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await use(errors);
    expect(errors, 'The production app must start without JavaScript errors').toEqual([]);
  }, { auto: true }],
});

/**
 * Public Arena route smoke tests against the Vite preview server.
 * Run: npm run test:e2e:install && npm run test:e2e
 */
for (const locale of [
  { language: 'en', heading: 'Welcome to System Design', google: 'Continue with Google', github: 'Continue with GitHub' },
  { language: 'pt', heading: 'Bem-vindo ao System Design', google: 'Continuar com Google', github: 'Continuar com GitHub' },
]) {
  test.describe(`Arena route smoke (${locale.language})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(language => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('language-choice-made', 'true');
      }, locale.language);
    });

    test('login page renders for unauthenticated visitors', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: locale.heading, exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: locale.google, exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: locale.github, exact: true })).toBeVisible();
    });

    for (const path of ['/arena', '/arena/host']) {
      test(`${path} requires sign-in`, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole('heading', { name: locale.heading, exact: true })).toBeVisible();
      });
    }
  });
}
