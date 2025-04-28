import { test, expect } from '@playwright/test';
import { page } from '../setup/globals';
import { delay } from '../setup/helpers';
import { deleteObjectByName } from '../utils/spaceUtils';

export const deleteObjectsTest = () => {
  test("Delete created objects if they exist", async () => {
    console.log("Starting safe deletion of created objects...");

    const objectsToDelete = [
      { name: "Bookmark UItest", type: "Bookmarks" },
      { name: "Collection UItest", type: "Lists" },
      { name: "Note UItest", type: "Pages" },
      { name: "Page UItest", type: "Pages" },
      { name: "Project UItest", type: "Pages" },
      { name: "Query UItest", type: "Lists" },
      { name: "Task UItest", type: "Pages" },
      // { name: "Human UItest", type: "Pages" }, // если понадобится
    ];

    for (const obj of objectsToDelete) {
      console.log(`Checking existence of object: ${obj.name}...`);

      // Open Search
      const searchIcon = page.locator('.icon.search.withBackground');
      await expect(searchIcon).toBeVisible({ timeout: 5000 });
      await searchIcon.click();

      const searchInput = page.locator('input.input.input-text');
      await expect(searchInput).toBeVisible({ timeout: 5000 });
      await searchInput.fill(obj.name);
      await delay(1000); // Pause for results appearance

      const searchResult = page.locator('div.ReactVirtualized__Grid__innerScrollContainer div.item').filter({
        hasText: obj.name,
      });

      const resultCount = await searchResult.count();

      if (resultCount > 0) {
        console.log(`Found object "${obj.name}". Proceeding to delete...`);
        await deleteObjectByName(page, obj.name, true, obj.type);
      } else {
        console.log(`Object "${obj.name}" not found. Skipping deletion.`);
      }

      // Close Search
      await page.keyboard.press('Escape');
      await delay(1000);
    }

    console.log("✅ Deletion process completed.");
  });
};
