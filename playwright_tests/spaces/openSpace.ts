import { test, expect } from '@playwright/test';
import { page } from '../setup/globals';
import { delay } from '../setup/helpers';
import { openSpace } from '../utils/spaceUtils';

export const openSpaceTest = () => {
  test("Open an existing space", async () => {
    console.log("Starting open space test...");

    const spaceName = "Cool Space"; // Название пространства, которое мы будем искать

    await delay(2000);

    // Пытаемся открыть пространство через функцию openSpace
    console.log(`Attempting to open space: ${spaceName}...`);
    const isSpaceOpened = await openSpace(page, spaceName);

    if (isSpaceOpened) {
      console.log(`✅ Space "${spaceName}" opened successfully.`);
    } else {
      throw new Error(`❌ Failed to open space "${spaceName}".`);
    }

    // Проверяем, что заголовок текущего открытого пространства совпадает с нужным именем
    const spaceTitleLocator = page.locator('div#path').locator('span').filter({ hasText: spaceName });
    await expect(spaceTitleLocator).toBeVisible({ timeout: 5000 });

    console.log("✅ Space title verified successfully.");
  });
};
