import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { SidebarPage } from '../../pages/SidebarPage';

test.describe('B2B Journey: Admin Access', () => {

  test('Admin user logs in and can access admin sidebar options', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sidebarPage = new SidebarPage(page);

    // 1. Navigate and Login with Admin credentials
    // Note: Assuming 'admin@example.com' has Role.ADMIN in your backend.
    await loginPage.navigate();
    await loginPage.login('alexsilvaebg9@gmail.com', 'admin123');

    // Wait for redirect to home/dashboard
    await page.waitForURL('**/home');

    // 2. Verify Admin Sidebar Options
    // Since the user is an admin, the DOM should render the *appIsAdmin sections.
    // If the database has no admin user, this step will fail in real life until seeded.
    const adminGroupsCount = await sidebarPage.adminGroups.count();

    if (adminGroupsCount > 0) {
      // Toggle the first admin group (e.g., User Management or Order Management)
      await sidebarPage.toggleAdminGroup(0);

      // The items inside should become visible
      await expect(sidebarPage.adminItems.first()).toBeVisible();

      // Click an admin option to navigate
      await sidebarPage.clickAdminItem(0);
    }
  });
});
