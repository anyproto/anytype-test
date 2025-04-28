import { test, expect } from '@playwright/test';
import { page } from '../setup/globals';
import { delay } from '../setup/helpers';
import { createPage, createTitleWithSelectionTarget, deleteObjectByName } from '../utils/spaceUtils';

export const publishObjectTest = () => {
  test("Create a page object and publish it", async () => {
    try {
      console.log("Starting page creation and publishing process...");

      await delay(2000);

      // Create new page
      console.log("Creating a new page...");
      await createPage(page);
      await delay(5000);

      // Enter Title
      const documentTitle = "Документ 1";
      console.log(`Creating title: ${documentTitle}...`);
      await createTitleWithSelectionTarget(page, documentTitle);

      // Edit page content
      console.log("Editing page content...");
      const editorWrapper = page.locator("div#blockLast");
      await expect(editorWrapper).toBeVisible({ timeout: 5000 });
      await editorWrapper.click();
      await editorWrapper.click();

      const wrapContent = page.locator("div.editableWrap").nth(1);
      await expect(wrapContent).toBeVisible({ timeout: 5000 });

      const value = wrapContent.locator("div#value").nth(0);
      await expect(value).toBeVisible({ timeout: 5000 });

      await value.click();
      await value.evaluate((el) => { el.innerText = 'Тест тест тест'; });

      const editorText = await value.innerText();
      expect(editorText).toBe('Тест тест тест');

      // Click button "Share"
      console.log("Clicking share button...");
      const shareButton = page.locator("div#button-header-share");
      await expect(shareButton).toBeVisible({ timeout: 5000 });
      await shareButton.click();

      // Click button "Publish"
      console.log("Clicking publish button...");
      const publishButton = page.locator("#menuPublish").locator("div.buttons").locator("div.txt");
      await expect(publishButton).toBeVisible({ timeout: 5000 });
      await publishButton.click();

      console.log("✅ Object published successfully.");

      // Close publisn menu
      await page.keyboard.press('Escape');
      await delay(1000);

      // Clean up: delete created document
      console.log("Cleaning up: Deleting the published document...");
      await deleteObjectByName(page, documentTitle, true, "Pages");

      console.log("✅ Test completed successfully.");

    } catch (error) {
      console.error(`❌ ERROR in publishObjectTest: ${error}`);
      throw error; // for test failure in case of an error 
    }
  });
};
