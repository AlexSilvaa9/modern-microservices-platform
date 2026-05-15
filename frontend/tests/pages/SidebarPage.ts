import { Page, Locator } from '@playwright/test';

export class SidebarPage {
  readonly page: Page;
  readonly sidebarGroups: Locator;
  readonly sidebarItems: Locator;
  readonly adminGroups: Locator;
  readonly adminItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarGroups = page.getByTestId('sidebar-group');
    this.sidebarItems = page.getByTestId('sidebar-item');
    this.adminGroups = page.getByTestId('sidebar-admin-group');
    this.adminItems = page.getByTestId('sidebar-admin-item');
  }

  async clickItem(index: number) {
    await this.sidebarItems.nth(index).click();
  }

  async clickAdminItem(index: number) {
    await this.adminItems.nth(index).click();
  }

  async toggleAdminGroup(index: number) {
    await this.adminGroups.nth(index).click();
  }
}
