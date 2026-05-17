import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export type TestUserCredentials = {
  username: string;
  email: string;
  password: string;
};

export function createUniqueUser(prefix = 'testuser'): TestUserCredentials {
  const randomId = Date.now() + Math.floor(Math.random() * 100000);

  return {
    username: `${prefix}${randomId}`,
    email: `${prefix}${randomId}@example.com`,
    password: 'Password123!',
  };
}

export async function registerAndLogin(
  page: Page,
  credentials: TestUserCredentials = createUniqueUser(),
): Promise<TestUserCredentials> {
  const registerPage = new RegisterPage(page);
  await registerPage.navigate();
  await registerPage.register(credentials.username, credentials.email, credentials.password);

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(credentials.email, credentials.password);
  await page.waitForURL('**/home');

  return credentials;
}

export const ADMIN_CREDENTIALS: TestUserCredentials = {
  username: 'admin',
  email: 'alexsilvaebg9@gmail.com',
  password: 'admin123',
};

export async function loginAsAdmin(page: Page): Promise<TestUserCredentials> {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
  await page.waitForURL('**/home');

  return ADMIN_CREDENTIALS;
}


export async function logoutCurrentUser(page: Page): Promise<void> {
  await page.locator('.profile-btn').click();
  await page
    .locator('.profile-menu a', { hasText: /(Logout|Cerrar sesión|Salir)/i })
    .or(page.locator('a:has(.bi-box-arrow-right)'))
    .first()
    .click();

  await page.waitForURL(/.*\/auth\/login|.*\/$/);
}