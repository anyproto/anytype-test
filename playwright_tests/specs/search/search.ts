import { test as baseTest, expect } from "@playwright/test";
import { delay, setupTestContext } from '../../setup/helpers';
import { page, storage, translations, electronApp } from '../../setup/globals';

import { widget } from "../../utils/widgets";
import { 
	deleteObjectByName, 
	UI_TEST_SPACE_NAME, 
	openSpace, 
	createPage,
	createTitleWithSelectionTarget, 
	createTitleWithEditorTitle 
} from "../../utils/spaceUtils";

// Экспортируем функцию с тестом, чтобы её можно было импортировать в другие файлы
export const searchObjectByTitleAndText = async () => {
	try {
		const title = "Lorem ipsum dolor sit amet";
		await delay(5000);
		// Create page
		console.log("Creating a new page...");
		const pageCreated = await createPage(page);
		//expect(pageCreated).toBeTruthy();
		await delay(5000);
		// Find and create a title
		console.log("Creating title...");
		await createTitleWithSelectionTarget(page, title);
		
		// Checking for the presence of a block to activate the input
		console.log("Setting up content editor...");
		const editorWrapper = page.locator("div#blockLast");
		expect(await editorWrapper.count()).toBeGreaterThan(0);
		await expect(editorWrapper).toBeVisible({ timeout: 5000 });
		await editorWrapper.click();
		await editorWrapper.click();
		
		// Checking the presence of a text input field
		const wrapContent = page.locator("div.editableWrap").nth(1);
		expect(await wrapContent.count()).toBeGreaterThan(0);
		await expect(wrapContent).toBeVisible({ timeout: 5000 });
		
		const value = wrapContent.locator("div#value").nth(0);
		expect(await value.count()).toBeGreaterThan(0);
		await expect(value).toBeVisible({ timeout: 5000 });
		
		// Click in the input field and enter text using the keyboard
		await value.click();
		await page.keyboard.type("Тест тест тест");
		await page.keyboard.press("Enter");
		
		// Checking the entered text
		const editorText = await value.innerText();
		expect(editorText).toBe('Тест тест тест');
		
		// Checking for the search button
		console.log("Starting search...");
		const searchButton = page.locator('div.icon.search.withBackground');
		expect(await searchButton.count()).toBeGreaterThan(0);
		await expect(searchButton).toBeVisible({ timeout: 5000 });
		await searchButton.click();
		
		// Checking for the search field
		const searchInput = page.locator('input.input.input-text');
		expect(await searchInput.count()).toBeGreaterThan(0);
		await expect(searchInput).toBeVisible({ timeout: 5000 });
		await searchInput.fill(title);
		
		// Waiting for search results to appear
		await page.waitForTimeout(1000); // give time for search results to update
		
		// Checking for the presence of a search results container
		console.log("Verifying search results...");
		const resultsContainer = page.locator('div.ReactVirtualized__Grid__innerScrollContainer');
		expect(await resultsContainer.count()).toBeGreaterThan(0);
		await expect(resultsContainer).toBeVisible({ timeout: 5000 });
		
		// Check the first element (found document)
		const foundDocument = resultsContainer.locator('div.item').first();
		expect(await foundDocument.count()).toBeGreaterThan(0);
		await expect(foundDocument).toBeVisible({ timeout: 5000 });
		
		const documentName = foundDocument.locator('div.name');
		const documentText = await documentName.innerText();
		expect(documentText).toBe(title);
		
		// Check the second element (Create Object)
		const createObject = resultsContainer.locator('div.item').nth(1);
		expect(await createObject.count()).toBeGreaterThan(0);
		await expect(createObject).toBeVisible({ timeout: 5000 });

		const createObjectName = createObject.locator('div.name');
		const createObjectText = await createObjectName.innerText();
		expect(createObjectText).toContain("Create Object");
		expect(createObjectText).toContain(title);
		
		// Close the search by pressing the Escape key
		await page.keyboard.press('Escape');
		await page.waitForTimeout(1000);  // We give time to close the search
		
		// Delete the created document
		console.log("Cleaning up: Deleting the test document...");
		await deleteObjectByName(page, title, true, "Pages");
		console.log("✅ Search test completed successfully");
	} catch (e) {
		console.error(`❌ ERROR in Search object by title and text test: ${e}`);
		throw e; // Re-throw the error so the test runner can record it
	}
};

