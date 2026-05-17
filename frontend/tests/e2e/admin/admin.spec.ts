import { test, expect } from '@playwright/test';
import { AdminPages } from '../../pages/AdminPages';
import { loginAsAdmin } from '../../helpers/auth';

test.describe('Admin Panel', () => {

  test('should allow admin to access all admin pages', async ({ page }) => {
    const adminPages = new AdminPages(page);

    await loginAsAdmin(page);

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
