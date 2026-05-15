import { Page, Locator } from '@playwright/test';

export class AdminPages {
  readonly page: Page;
  
  // Example selectors for User Management
  readonly userTable: Locator;
  readonly userRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userTable = page.getByTestId('admin-user-table');
    this.userRows = page.locator('tbody tr');
  }

  async navigateToUsers() {
    await this.page.goto('/admin/users');
  }

  async navigateToOrders() {
    await this.page.goto('/admin/orders');
  }

  async navigateToSEO() {
    await this.page.goto('/admin/seo');
  }

  async navigateToAnalytics() {
    await this.page.goto('/admin/analytics');
  }
}
