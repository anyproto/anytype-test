import { test, expect } from '@playwright/test';
import { page } from '../setup/globals';
import { delay } from '../setup/helpers';
import { widget } from '../utils/widgets';
import { deleteObjectByName } from '../utils/spaceUtils';

export const searchObjectTest = () => {
  test("Create a page and search it by exact title match", async () => {
    const testTitle = 'One good name';
    console.log('Starting search object test...');

    // Create a new page object
    console.log('Creating a new page object...');
    await widget(page, 'Pages').createObject();
    console.log('New page object created.');

    // Wait for the input field for page title is appears
    const pageNameInput = page.locator('#value.ctitle');
    await pageNameInput.waitFor();
    await expect(pageNameInput).toBeFocused();
    console.log('Page title input is focused.');

    // Enter page title
    console.log(`Typing page title: ${testTitle}...`);
    await pageNameInput.click();
    await page.keyboard.type(testTitle);
    await page.keyboard.press('Enter');
    console.log(`Page title "${testTitle}" entered.`);

    // Check that the page title was installed correctly
    await expect(pageNameInput).toHaveText(testTitle);
    console.log('Page title verification passed.');

    // Click Searcn button
    console.log('Clicking search icon...');
    const searchIcon = page.locator('.icon.search.withBackground');
    await searchIcon.click();
    console.log('Search icon clicked.');

    // Wait for Search field appears
    const searchInput = page.locator('#input');
    await searchInput.waitFor();
    console.log('Search input field appeared.');

    // Enter search query
    console.log(`Searching for: ${testTitle}...`);
    await searchInput.click();
    await page.keyboard.type(testTitle);
    await delay(1000); // Wait for search to complete

    // Check if search results are appeared
    console.log('Verifying search results...');
    const searchResult = page.locator('div.name > markuphighlight').filter({ hasText: testTitle });
    await expect(searchResult).toBeVisible({ timeout: 5000 });
    console.log('Search result found and verified.');

    // Clear search input
    console.log('Clearing search input...');
    await searchInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    console.log('Search input cleared.');

    // Close search window
    console.log('Closing search window...');
    await page.keyboard.press('Escape');
    await delay(2000);
    console.log('Search window closed.');

    // Delete the test object
    console.log(`Cleaning up: Deleting the test object "${testTitle}"...`);
    await deleteObjectByName(page, testTitle, true, "Pages");
    console.log('✅ Test object deleted successfully.');
  });
};
