import { test, expect } from '@playwright/test';
import { CatalogPage } from '../../pages/CatalogPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPaymentPage } from '../../pages/CheckoutPaymentPage';
import { OrderHistoryPage } from '../../pages/OrderHistoryPage';
import { registerAndLogin, createUniqueUser } from '../../helpers/auth';

test.describe('B2C Journey: Customer Purchase', () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, createUniqueUser('purchase'));
  });

  test('User registers, logs in, adds item to cart, pays, and checks order', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const cartPage = new CartPage(page);
    const paymentPage = new CheckoutPaymentPage(page);
    const orderHistoryPage = new OrderHistoryPage(page);

    // 1. Catalog
    await catalogPage.navigate();

      await catalogPage.addToCartByIndex(0);

      // 2. Cart & Checkout
      await cartPage.navigate();
      await expect(cartPage.cartItems.first()).toBeVisible();
      await cartPage.proceedToCheckout();

      // Wait to reach payment page
      await expect(page).toHaveURL(/.*\/orders\/checkout|.*payment.*/);

      // 3. Payment
      await expect(paymentPage.payNowButton).toBeVisible();
      await paymentPage.confirmPayment();

      // Wait for success and go to history
      await expect(paymentPage.viewOrderButton).toBeVisible({ timeout: 10000 });
      await paymentPage.proceedToOrderHistory();

      // 4. Order History
      await expect(page).toHaveURL(/.*\/orders\/history/);
      // Verify we have at least one order
      await expect(orderHistoryPage.orderRows.first()).toBeVisible();
    
  });
});
