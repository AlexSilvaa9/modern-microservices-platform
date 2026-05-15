import { Page, Locator } from '@playwright/test';

export class CheckoutPaymentPage {
  readonly page: Page;
  readonly payNowButton: Locator;
  readonly viewOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.payNowButton = page.getByTestId('pay-now-btn');
    this.viewOrderButton = page.getByTestId('view-order-btn');
  }

  async confirmPayment() {
    await this.payNowButton.click();
  }

  async proceedToOrderHistory() {
    await this.viewOrderButton.click();
  }
}
