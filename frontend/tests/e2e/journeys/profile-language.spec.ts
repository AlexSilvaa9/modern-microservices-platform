import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/ProfilePage';
import { createUniqueUser, registerAndLogin } from '../../helpers/auth';

test.describe('B2C Journey: Profile Language', () => {
  test('user changes the profile language and sees the translated UI update', async ({ page }) => {
    await registerAndLogin(page, createUniqueUser('language'));

    const profilePage = new ProfilePage(page);
    await profilePage.navigate();

    await expect(page.getByText('Datos generales')).toBeVisible();

    const languageDropdown = page.locator('app-user-detail app-dropdown');
    await languageDropdown.locator('.dropdown-trigger').click();
    await languageDropdown.locator('.dropdown-item', { hasText: 'English' }).click();

    await expect(page.getByText('General data')).toBeVisible();
    await expect(languageDropdown.locator('.dropdown-trigger')).toContainText('English');
  });
});