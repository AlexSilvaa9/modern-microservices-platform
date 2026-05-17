import { test, expect } from '@playwright/test';
import { registerAndLogin, createUniqueUser } from '../../helpers/auth';

test.describe('Auth: Logout', () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, createUniqueUser('logout'));
  });

  test('should allow user to log out', async ({ page }) => {
    // Click profile dropdown and logout
    await page.locator('.profile-btn').click();
    await page.locator('.profile-menu a', { hasText: /(Logout|Cerrar sesión|Salir)/i }).or(page.locator('a:has(.bi-box-arrow-right)')).first().click();

    // Verify redirected to login or public page
    await expect(page).toHaveURL(/.*\/auth\/login|.*\/$/);
  });
});
