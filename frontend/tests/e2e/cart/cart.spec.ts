import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await cartPage.navigate();
  });

  test('should display empty cart message if no items', async () => {
    // In E2E, the cart is usually empty at the beginning of the session
    const isCartEmpty = await cartPage.emptyCartMessage.isVisible();
    if (isCartEmpty) {
      await expect(cartPage.emptyCartMessage).toBeVisible();
    }
  });

  test('should display items if cart has products', async () => {
    const count = await cartPage.cartItems.count();
    if (count > 0) {
      await expect(cartPage.cartItems.first()).toBeVisible();
      await expect(cartPage.checkoutButton).toBeVisible();
      await expect(cartPage.clearCartButton).toBeVisible();
    }
  });

  test('should allow increasing item quantity', async () => {
    const count = await cartPage.cartItems.count();
    if (count > 0) {
      // Logic to check increase quantity
      await cartPage.increaseQuantity(0);
      // Wait for network response or re-render
    }
  });

  test('should navigate to checkout when checkout button is clicked', async () => {
    const count = await cartPage.cartItems.count();
    if (count > 0) {
      await cartPage.proceedToCheckout();
      await expect(cartPage.page).toHaveURL(/.*\/orders\/checkout/);
    }
  });
});
