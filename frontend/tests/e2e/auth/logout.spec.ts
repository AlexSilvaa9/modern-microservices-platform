import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Auth: Logout', () => {

  test('should allow user to log out', async ({ page }) => {
    // A random user email
    const randomId = Date.now() + Math.floor(Math.random() * 100000);
    const email = `testuser${randomId}@example.com`;
    const password = 'Password123!';
    // For this test, we can register first or assume the test registers implicitly.
    // If the DB resets, it's better to register. But we'll just use the register api or page.
    // To be safe, we'll use the register page.
    await page.goto('/auth/register');
    await page.getByTestId('register-username-input').fill(`logoutuser${randomId}`);
    await page.getByTestId('register-email-input').fill(email);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-submit-button').click();
    await page.waitForURL('**/auth/login');

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForURL('**/home');

    // Click profile dropdown and logout
    await page.locator('.profile-btn').click();
    await page.locator('.profile-menu a', { hasText: /(Logout|Cerrar sesión|Salir)/i }).or(page.locator('a:has(.bi-box-arrow-right)')).first().click();

    // Verify redirected to login or public page
    await expect(page).toHaveURL(/.*\/auth\/login|.*\/$/);
  });
});
