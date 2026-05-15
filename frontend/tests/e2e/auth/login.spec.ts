import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login form correctly', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should show validation errors on empty submission', async () => {
    await loginPage.submitButton.click();
    
    // Expect form validation errors to appear
    await expect(loginPage.page.locator('.error-msg').first()).toBeVisible();
  });

  test('should allow user to type and submit', async () => {
    await loginPage.login('test@example.com', 'password123');
    // NOTE: Depending on your app's actual behavior, you might assert a redirect here.
    // e.g., await expect(page).toHaveURL('/');
  });

  test('should navigate to register page', async () => {
    await loginPage.goToRegister();
    await expect(loginPage.page).toHaveURL(/.*\/auth\/register/);
  });
});
