import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AdminPages } from '../../pages/AdminPages';

test.describe('Admin Panel', () => {

  test('should allow admin to access all admin pages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPages = new AdminPages(page);

    // Login with Admin credentials
    await loginPage.navigate();
    await loginPage.login('alexsilvaebg9@gmail.com', 'admin123'); // Assuming these are valid seeded admin creds
    await page.waitForURL('**/home');

    // Visit User Management
    await adminPages.navigateToUsers();
    await expect(page).toHaveURL(/.*\/admin\/users/);
    await expect(page.locator('app-user-management')).toBeVisible();

    // Visit Order Management
    await adminPages.navigateToOrders();
    await expect(page).toHaveURL(/.*\/admin\/orders/);
    await expect(page.locator('app-order-management')).toBeVisible();

    // Visit SEO
    await adminPages.navigateToSEO();
    await expect(page).toHaveURL(/.*\/admin\/seo/);
    await expect(page.locator('app-seo')).toBeVisible();

    // Visit Analytics
    await adminPages.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/admin\/analytics/);
    // Usually analytics maps to the same component or another. We just check URL.
  });
});
