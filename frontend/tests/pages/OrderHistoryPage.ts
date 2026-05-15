import { Page, Locator } from '@playwright/test';

export class OrderHistoryPage {
  readonly page: Page;
  readonly orderRows: Locator;
  readonly viewDetailsButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderRows = page.getByTestId('order-history-row');
    this.viewDetailsButtons = page.getByTestId('view-order-details-btn');
  }

  async navigate() {
    await this.page.goto('/orders/history');
  }

  async viewDetailsForOrder(index: number) {
    await this.viewDetailsButtons.nth(index).click();
  }
}
