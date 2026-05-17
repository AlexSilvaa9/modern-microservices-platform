import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { createUniqueUser } from '../../helpers/auth';

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

  test('should allow user to type and submit', async ({ page }) => {
    const user = createUniqueUser();
    await registerPage.register(user.username, user.email, user.password);


    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
    await page.waitForURL('**/home');
    await expect(page).toHaveURL(/.*\/home|.*\/$/);
    // Depending on your app's actual behavior, assert a redirect or success message
  });

  test('should navigate to login page', async () => {
    await registerPage.goToLogin();
    await expect(registerPage.page).toHaveURL(/.*\/auth\/login/);
  });
});
