import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { createUniqueUser, loginAsAdmin, logoutCurrentUser, registerAndLogin } from '../../helpers/auth';
import { findRowAcrossPaginatedTable } from '../../helpers/pagination';

test.describe('B2B Journey: Promote User to Admin', () => {
  test('admin grants admin role to a new user and the user can access admin pages', async ({ page }) => {
    const user = createUniqueUser('promote');

    await registerAndLogin(page, user);
    await loginAsAdmin(page);

    await page.goto('/admin/users');
    await expect(page.locator('app-user-management')).toBeVisible();

    const userRow = await findRowAcrossPaginatedTable(page, '.user-table', user.email);
    await userRow.locator('button.action-icon').click();

    await expect(page).toHaveURL(/.*\/userdetail/);

    const adminRoleChip = page.locator('button.role-chip', { hasText: 'ADMIN' });
    await adminRoleChip.click();
    await expect(adminRoleChip).toHaveClass(/is-active/);

    await page.getByRole('button', { name: 'Actualizar roles' }).click();
    await expect(page.getByText('Roles actualizados')).toBeVisible();

    await logoutCurrentUser(page);

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
    await page.waitForURL('**/home');

    await page.goto('/admin/users');
    await expect(page.locator('app-user-management')).toBeVisible();

    const promotedUserRow = await findRowAcrossPaginatedTable(page, '.user-table', user.email);
    await expect(promotedUserRow.locator('td').nth(2)).toContainText('ADMIN');
  });
});