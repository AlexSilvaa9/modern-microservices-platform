import { test, expect } from '@playwright/test';
import { CatalogPage } from '../../pages/CatalogPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPaymentPage } from '../../pages/CheckoutPaymentPage';
import { createUniqueUser, loginAsAdmin, registerAndLogin } from '../../helpers/auth';
import { findRowAcrossPaginatedTable } from '../../helpers/pagination';

function getOrderIdFromPaymentUrl(urlString: string): string {
  const url = new URL(urlString);

  return (
    url.searchParams.get('orderId') ??
    url.searchParams.get('id') ??
    url.pathname.split('/').filter(Boolean).pop() ??
    ''
  ).replace(/^#/, '').trim();
}

test.describe('B2B Journey: Complete Order', () => {
  test('admin marks a paid order as completed', async ({ page }) => {
    const user = createUniqueUser('order');
    const catalogPage = new CatalogPage(page);
    const cartPage = new CartPage(page);
    const paymentPage = new CheckoutPaymentPage(page);

    await registerAndLogin(page, user);

    await catalogPage.navigate();


    await catalogPage.addToCartByIndex(0);
    await cartPage.navigate();
    await expect(cartPage.cartItems.first()).toBeVisible();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/.*\/orders\/checkout|.*payment.*/);
    await expect(paymentPage.payNowButton).toBeVisible();
    await paymentPage.confirmPayment();
    await expect(paymentPage.viewOrderButton).toBeVisible({ timeout: 10000 });
    const orderId = getOrderIdFromPaymentUrl(page.url());
    await paymentPage.proceedToOrderHistory();
    await expect(page).toHaveURL(/.*\/orders\/history/);

    await loginAsAdmin(page);
    await page.goto('/admin/orders');
    await expect(page.locator('app-order-management')).toBeVisible();

    const orderRow = await findRowAcrossPaginatedTable(page, '.order-table', orderId);
    await orderRow.locator('button.action-icon').click();

    await expect(page.getByRole('button', { name: 'Marcar como completado' })).toBeVisible();
    await page.getByRole('button', { name: 'Marcar como completado' }).click();
    await expect(page).toHaveURL(/.*\/orders\/history/);

    await page.goto('/admin/orders');
    await expect(page.locator('app-order-management')).toBeVisible();

    const statusFilter = page.locator('app-order-management app-dropdown');
    await statusFilter.locator('.dropdown-trigger').click();
    await statusFilter.locator('.dropdown-item', { hasText: 'COMPLETED' }).click();

    const completedOrderRow = await findRowAcrossPaginatedTable(page, '.order-table', orderId);
    await expect(completedOrderRow.locator('.status-pill')).toContainText('COMPLETED');
  });
});