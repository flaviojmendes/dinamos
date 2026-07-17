import { test, expect } from '@playwright/test';

/**
 * Public Arena route smoke tests against the Vite preview server.
 * Run: npm run test:e2e:install && npm run test:e2e
 */
test.describe('Arena route smoke', () => {
  test('login page renders for unauthenticated visitors', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Welcome to System Design/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('arena landing requires sign-in', async ({ page }) => {
    await page.goto('/arena');
    await expect(page).toHaveURL(/\/login/);
  });

  test('arena host console requires sign-in', async ({ page }) => {
    await page.goto('/arena/host');
    await expect(page).toHaveURL(/\/login/);
  });
});
