import { expect, Page, Locator } from '@playwright/test';

export async function findRowAcrossPaginatedTable(
  page: Page,
  tableSelector: string,
  rowText: string,
  options: { maxPages?: number } = {},
): Promise<Locator> {
  const maxPages = options.maxPages ?? 20;
  const table = page.locator(tableSelector);

  await expect(table).toBeVisible();
  await expect(table.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const matchingRow = table.locator('tbody tr', { hasText: rowText }).first();

    if (await matchingRow.count()) {
      await expect(matchingRow).toBeVisible();
      return matchingRow;
    }

    const nextButton = table
      .locator('.p-paginator-next, button[aria-label*="Next"], button[aria-label*="Siguiente"], button[aria-label*="Suivant"], button[aria-label*="Weiter"]')
      .first();

    if (!(await nextButton.count()) || !(await nextButton.isEnabled())) {
      break;
    }

    await nextButton.click();
  }

  throw new Error(`Row not found across paginated table: ${rowText}`);
}