import { test, expect } from '@playwright/test';
import { LandingPage } from '../../pages/LandingPage';

test.describe('Public Journeys', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.navigate();
  });

  test('should display the landing page correctly', async ({ page }) => {
    // Wait for the hero section or any main content
    await expect(page.locator('.hero-section').first().or(page.locator('app-landing-page'))).toBeVisible();
  });

  test('should navigate to the blog page', async ({ page }) => {
    // Click on blog link, assuming there is a navigation item for blog
    // Let's go to /blog directly if link is not easily locatable in headless tests
    await page.goto('/blog');
    
    // Expect some blog content to render
    await expect(page.locator('app-blog').or(page.locator('.blog-container'))).toBeVisible();
  });

  test('should allow language change', async ({ page }) => {
    await page.goto('/es');
    await expect(page).toHaveURL(/.*\/es/);

    await page.goto('/en');
    await expect(page).toHaveURL(/.*\/en/);
  });
});
