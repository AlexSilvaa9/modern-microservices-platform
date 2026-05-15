import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly increaseButtons: Locator;
  readonly decreaseButtons: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('cart-item');
    this.increaseButtons = page.getByTestId('increase-qty-btn');
    this.decreaseButtons = page.getByTestId('decrease-qty-btn');
    this.removeButtons = page.getByTestId('remove-item-btn');
    this.checkoutButton = page.getByTestId('checkout-btn');
    this.clearCartButton = page.getByTestId('clear-cart-btn');
    this.emptyCartMessage = page.getByTestId('empty-cart-message');
  }

  async navigate() {
    await this.page.goto('/cart');
  }

  async increaseQuantity(index: number) {
    await this.increaseButtons.nth(index).click();
  }

  async decreaseQuantity(index: number) {
    await this.decreaseButtons.nth(index).click();
  }

  async removeItem(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async clearCart() {
    await this.clearCartButton.click();
  }
}
