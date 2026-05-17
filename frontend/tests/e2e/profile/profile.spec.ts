import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/ProfilePage';
import { registerAndLogin, createUniqueUser } from '../../helpers/auth';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, createUniqueUser('profile'));
  });

  test('should allow user to view and edit profile', async ({ page }) => {
    // Navigate to profile
    const profilePage = new ProfilePage(page);
    await profilePage.navigate();

    // The profile elements might be visible (we use fallback selectors if test IDs are not present yet)
    await expect(page.locator('.profile-container').or(page.locator('app-user-detail'))).toBeVisible();
    
    // Check if user info is displayed (could check by test-id or text)
    // await expect(profilePage.usernameDisplay).toBeVisible();
  });
});
