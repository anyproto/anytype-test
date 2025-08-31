import { test, expect } from "@playwright/test";
import { delay, waitForPageLoadAfterLogin } from '../setup/helpers';
import { page, translations, storage } from '../setup/globals';
import { widget } from "../utils/widgets";
import { 
    deleteObjectByName, 
    createPage,
    createTitleWithSelectionTarget,
    clearInputField
} from "../utils/spaceUtils";
import { setupTest } from '../setup/testSetup';

// Setup test environment once
setupTest();

test("Search page by exact match in title", async () => {
    const text = 'Good name';
    console.log('Starting search test...');
    
    // Wait for page to be fully loaded and synced after login
    await waitForPageLoadAfterLogin(60000);
    
    // Click on the button with the drop-down list
    console.log("Clicking on space arrow button...");
    const arrowButton = page.locator("div.icon.arrow.withBackground");
    await expect(arrowButton).toBeVisible({ timeout: 100000 });
    await arrowButton.click();
    console.log("Space arrow button clicked");
    
    // Create Page
    console.log("Creating Page object...");
    const menuTypeSuggest = page.locator("div#menuTypeSuggest");
    await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
    let menuItem = menuTypeSuggest.locator(`div.name:has-text('${translations.sidebarSectionLayoutFormatPage}')`);
    await expect(menuItem).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await menuItem.click({ force: true });
    await page.waitForTimeout(2000);
    
    // Create title for the page
    await createTitleWithSelectionTarget(page, text);
    console.log(`Page object created with title: ${text}`);
    
    console.log('Clicking on search button...');
    await page.locator('#item-search').click();
    console.log('Clicked on search button');
    
    console.log('Waiting for search input...');
    const searchInput = page.locator('#input');
    await searchInput.waitFor();
    console.log('Search input is ready');
    
    console.log(`Searching for: ${text}...`);
    
    // Clear the search input field if there's any existing text
    await clearInputField(page, searchInput);
    
    await page.keyboard.type(text); // Enter text character-by-character like a user would do
    // Don't press Enter here because we want to see if it's working without pressing Enter
    console.log(`Entered search query: ${text}`);
    
    // Wait for search results to appear
    console.log('Waiting for search results...');
    await page.waitForTimeout(2000); // Give time for search results to update
    
    // Check if search results container is visible
    console.log('Checking search results container...');
    await expect(page.locator('div.ReactVirtualized__Grid__innerScrollContainer')).toBeVisible({ timeout: 10000 });
    
    console.log('Verifying search results...');
    await expect(page.locator('div.name > markuphighlight').filter({ hasText: text})).toBeVisible({ timeout: 10000 });
    console.log('Search result found and verified');
    
    // Clearing search input
    console.log('Clearing search input...');
    const searchInputField = page.locator('#input');
    await clearInputField(page, searchInputField);
    console.log('Search input cleared');
    
    // Close search window
    console.log('Closing search window...');
    await page.keyboard.press('Escape'); // Press Escape to close the search window
    await page.waitForTimeout(5000); // Pause for 5 seconds before closing the search window
    console.log('Search window closed');
    
    // Cleaning up: deleting the created page
    console.log(`Cleaning up: Deleting the test object "${text}"...`);
    await deleteObjectByName(page, text);
    console.log('Test cleanup completed');
});


test("Search object by title and text", async () => {
	try {

		// Wait for page to be fully loaded and synced after login
		await waitForPageLoadAfterLogin(60000);
    
		const title = "Search Test Object";
		// Create page
		console.log("Creating a new page...");
		const pageCreated = await createPage(page);
		//expect(pageCreated).toBeTruthy();
		await page.waitForTimeout(5000);
		// Find and create a title
		console.log("Creating title...");
		await createTitleWithSelectionTarget(page, title);
		
		// Checking for the presence of a block to activate the input
		console.log("Setting up content editor...");
		const editorWrapper = page.locator("div#blockLast");
		expect(await editorWrapper.count()).toBeGreaterThan(0);
		await expect(editorWrapper).toBeVisible({ timeout: 5000 });
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
		// Copy text to clipboard and paste it for faster input
		await page.evaluate((text) => {
			navigator.clipboard.writeText(text);
		}, storage.default_text);
		await page.keyboard.press("Control+v"); // Paste text
		await page.keyboard.press("Enter");
		
		// Checking the entered text
		const editorText = await value.textContent();
		expect(editorText).toBe(storage.default_text);
		
		// Checking for the search button
		console.log("Starting search...");
		const searchButton = page.locator('div#item-search');
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
		const documentText = await documentName.textContent();
		expect(documentText).toBe(title);
		
		// Check the second element (Create Object)
		const createObject = resultsContainer.locator('div.item').nth(1);
		expect(await createObject.count()).toBeGreaterThan(0);
		await expect(createObject).toBeVisible({ timeout: 5000 });

		const createObjectName = createObject.locator('div.name');
		const createObjectText = await createObjectName.textContent();
		expect(createObjectText).toContain("Create Object");
		expect(createObjectText).toContain(title);
		
		// Close the search by pressing the Escape key
		await page.keyboard.press('Escape');
		await page.waitForTimeout(1000);  // We give time to close the search
		
		// Second search: Search by first 20 characters from default text
		console.log("Starting second search by first 20 characters from default text...");
		await searchButton.click();
		
		// Clear the search field
		await clearInputField(page, searchInput);
		
		// Search for first 20 characters from default text
		const searchText = storage.default_text.substring(0, 20);
		await searchInput.fill(searchText);
		
		// Waiting for search results to appear
		await page.waitForTimeout(1000); // give time for search results to update
		
		// Checking for the presence of a search results container
		console.log("Verifying search results for partial text search...");
		await expect(resultsContainer).toBeVisible({ timeout: 5000 });
		
		// Check the first element (found document)
		await expect(foundDocument).toBeVisible({ timeout: 5000 });
		
		const documentTextForLorem = await documentName.textContent();
		expect(documentTextForLorem).toBe(title);
		
		// Close the search by pressing the Escape key
		await page.keyboard.press('Escape');
		await page.waitForTimeout(1000);  // We give time to close the search
		
		// Delete the created document
		console.log("Cleaning up: Deleting the test document...");
		await deleteObjectByName(page, title, true, translations.sidebarObjectTypeObject);
		console.log("✅ Search test completed successfully");
	} catch (e) {
		console.error(`❌ ERROR in Search object by title and text test: ${e}`);
		throw e; // Re-throw the error so the test runner can record it
	}
});