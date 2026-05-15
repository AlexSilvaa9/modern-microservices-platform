import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { CatalogPage } from '../../pages/CatalogPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPaymentPage } from '../../pages/CheckoutPaymentPage';
import { OrderHistoryPage } from '../../pages/OrderHistoryPage';

test.describe('B2C Journey: Customer Purchase', () => {

  test('User registers, logs in, adds item to cart, pays, and checks order', async ({ page }) => {
    // A random user email to avoid duplicate errors in DB if it persists between runs
    const randomId = Date.now() + Math.floor(Math.random() * 100000);
    const username = `testuser${randomId}`;
    const email = `testuser${randomId}@example.com`;
    const password = 'Password123!';

    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const cartPage = new CartPage(page);
    const paymentPage = new CheckoutPaymentPage(page);
    const orderHistoryPage = new OrderHistoryPage(page);

    // 1. Register
    await registerPage.navigate();
    await registerPage.register(username, email, password);
    // Depending on routing, might go to login automatically, let's go explicitly
    
    // 2. Login
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForURL('**/home');
    
    // 3. Catalog
    await catalogPage.navigate();
    const productCount = await catalogPage.catalogItems.count();
    if (productCount > 0) {
      await catalogPage.addToCartByIndex(0);
      
      // 4. Cart & Checkout
      await cartPage.navigate();
      await expect(cartPage.cartItems.first()).toBeVisible();
      await cartPage.proceedToCheckout();
      
      // Wait to reach payment page
      await expect(page).toHaveURL(/.*\/orders\/checkout|.*payment.*/);
      
      // 5. Payment
      await expect(paymentPage.payNowButton).toBeVisible();
      await paymentPage.confirmPayment();
      
      // Wait for success and go to history
      await expect(paymentPage.viewOrderButton).toBeVisible({ timeout: 10000 });
      await paymentPage.proceedToOrderHistory();
      
      // 6. Order History
      await expect(page).toHaveURL(/.*\/orders\/history/);
      // Verify we have at least one order
      await expect(orderHistoryPage.orderRows.first()).toBeVisible();
    }
  });
});
