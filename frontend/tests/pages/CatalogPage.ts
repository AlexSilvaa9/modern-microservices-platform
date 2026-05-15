import { Page, Locator } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly catalogList: Locator;
  readonly catalogItems: Locator;
  readonly addToCartButtons: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageNumberButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.catalogList = page.getByTestId('catalog-list');
    this.catalogItems = page.getByTestId('catalog-item');
    this.addToCartButtons = page.getByTestId('add-to-cart-button');
    this.prevPageButton = page.getByTestId('catalog-prev-page');
    this.nextPageButton = page.getByTestId('catalog-next-page');
    this.pageNumberButtons = page.getByTestId('catalog-page-number');
  }

  async navigate() {
    await this.page.goto('/catalog');
  }

  async addToCartByIndex(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  async goToPrevPage() {
    await this.prevPageButton.click();
  }
}
