import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly usernameDisplay: Locator;
  readonly emailDisplay: Locator;
  readonly roleDisplay: Locator;
  readonly editButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameDisplay = page.getByTestId('profile-username');
    this.emailDisplay = page.getByTestId('profile-email');
    this.roleDisplay = page.getByTestId('profile-role');
    this.editButton = page.getByTestId('profile-edit-btn');
  }

  async navigate() {
    await this.page.goto('/userdetail');
  }
}
