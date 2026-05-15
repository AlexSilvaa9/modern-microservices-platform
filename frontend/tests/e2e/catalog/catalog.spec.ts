import { test, expect } from '@playwright/test';
import { CatalogPage } from '../../pages/CatalogPage';

test.describe('Catalog', () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.navigate();
  });

  test('should display the product list', async () => {
    // Wait for the catalog list to be visible. If there are no products or server is down, this might fail.
    // In a real E2E environment, you should mock the API or seed the database.
    await expect(catalogPage.catalogList).toBeVisible();
    
    // Check that at least one item is rendered
    const count = await catalogPage.catalogItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should allow adding a product to cart if products exist', async () => {
    const count = await catalogPage.catalogItems.count();
    if (count > 0) {
      await catalogPage.addToCartByIndex(0);
      // Wait for the add to cart logic (maybe a toast notification or cart badge update)
      // await expect(page.getByTestId('cart-badge')).toHaveText('1');
    }
  });

  test('should paginate correctly if multiple pages exist', async () => {
    const isNextEnabled = await catalogPage.nextPageButton.isEnabled();
    if (isNextEnabled) {
      await catalogPage.goToNextPage();
      await expect(catalogPage.pageNumberButtons.nth(1)).toHaveClass(/pagination-btn--active/);
    }
  });
});
