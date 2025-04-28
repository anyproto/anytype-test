import { test, expect } from '@playwright/test';
import { page, translations } from '../setup/globals';
import { delay } from '../setup/helpers';

export const createSpaceTest = () => {
  test("Create a new space", async () => {
    console.log("Starting create space test...");

    await delay(2000);

    // Click button "Add Space"
    console.log("Clicking 'Add Space' button...");
    const addButton = page.locator('div#item-add');
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();

    // Enter the space name
    const spaceName = "Cool Space";
    console.log(`Entering space name: ${spaceName}...`);
    const spaceNameInput = page.locator('input[placeholder="Untitled"]');
    await expect(spaceNameInput).toBeVisible({ timeout: 5000 });
    await spaceNameInput.fill(spaceName);

    // Catch events in debug console
    page.on('console', msg => {
      console.log('Console message:', msg.text());
    });

    const consolePromise = page.waitForEvent('console', {
      predicate: msg => {
        const text = msg.text();
        console.log('Checking console message:', text);
        return text.includes('Response.WorkspaceCreate');
      },
      timeout: 20000, // More time for server response
    });

    // Click button "Create"
    console.log("Clicking 'Create' button...");
    const createButton = page.getByText(translations.popupSpaceCreateCreate);
    await expect(createButton).toBeVisible({ timeout: 5000 });
    await createButton.click();

    try {
      const consoleMessage = await consolePromise;
      console.log('Successfully received console message:', consoleMessage.text());
    } catch (error) {
      console.error('Failed to receive expected console message:', error);
    }

    // Check if the space was created successfully
    console.log('Verifying created space visibility...');
    const createdSpace = page.locator('span').filter({ hasText: spaceName });
    await expect(createdSpace).toBeVisible({ timeout: 10000 });

    console.log("✅ New space created and verified successfully.");
  });
};
