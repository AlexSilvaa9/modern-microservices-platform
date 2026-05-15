import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';

test.describe('Register', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test('should display register form correctly', async () => {
    await expect(registerPage.usernameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test('should show validation errors on empty submission', async () => {
    await registerPage.submitButton.click();
    
    await expect(registerPage.page.locator('.error-msg').first()).toBeVisible();
  });

  test('should allow user to type and submit', async () => {
    await registerPage.register('newuser', 'newuser@example.com', 'password123');
    // Depending on your app's actual behavior, assert a redirect or success message
  });

  test('should navigate to login page', async () => {
    await registerPage.goToLogin();
    await expect(registerPage.page).toHaveURL(/.*\/auth\/login/);
  });
});
