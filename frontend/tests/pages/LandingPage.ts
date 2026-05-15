import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly languageLinks: Locator;
  readonly heroSection: Locator;
  readonly blogLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // These selectors are assumptions. You should add data-testids if they are missing.
    this.heroSection = page.locator('app-landing-page');
    this.blogLink = page.locator('a[href*="/blog"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async navigateToBlog() {
    await this.blogLink.first().click();
  }
}
