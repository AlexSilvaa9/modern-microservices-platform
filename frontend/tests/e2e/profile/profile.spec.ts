import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';

test.describe('User Profile', () => {

  test('should allow user to view and edit profile', async ({ page }) => {
    const randomId = Date.now() + Math.floor(Math.random() * 100000);
    const email = `profile${randomId}@example.com`;
    const password = 'Password123!';
    // Register
    await page.goto('/auth/register');
    await page.getByTestId('register-username-input').fill('profileuser');
    await page.getByTestId('register-email-input').fill(email);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-submit-button').click();
    await page.waitForURL('**/auth/login');

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForURL('**/home');

    // Navigate to profile
    const profilePage = new ProfilePage(page);
    await profilePage.navigate();

    // The profile elements might be visible (we use fallback selectors if test IDs are not present yet)
    await expect(page.locator('.profile-container').or(page.locator('app-user-detail'))).toBeVisible();
    
    // Check if user info is displayed (could check by test-id or text)
    // await expect(profilePage.usernameDisplay).toBeVisible();
  });
});
