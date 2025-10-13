import { test, expect } from "@playwright/test";
import { delay, waitForPageLoadAfterLogin } from '../setup/helpers';
import { page, storage, translations } from '../setup/globals';
import { 
	deleteObjectByName, 
	createPage,
	createTitleWithSelectionTarget, 
	createTitleWithEditorTitle,
	publishCurrentObject,
	unpublishCurrentObject,
	createSpaceWithCustomName,
	deleteSpaceByName,
	clearInputField
} from "../utils/spaceUtils";
import { setupTest } from '../setup/testSetup';

// Setup test environment once
setupTest();


test("Create new space with custom name", async () => {
    console.log('Starting create new space test...');
    // Wait for page to be fully loaded and synced after login
	await waitForPageLoadAfterLogin(60000);
    
    // Use test data from storage
    const spaceName = storage["testSpaceName"];
    
    // Create the space using the utility function
    console.log('Creating new space...');
    const createResult = await createSpaceWithCustomName(page, spaceName);
    
    if (!createResult) {
        throw new Error(`Failed to create space "${spaceName}"`);
    }
    
    console.log('✅ Space created successfully');
});

test("Create and delete various object types", async () => {
	// Wait for page to be fully loaded and synced after login
	await waitForPageLoadAfterLogin(60000);
    
	// Click on the button with the drop-down list
	await page.waitForTimeout(10000);
	console.log("Clicking on space arrow button...");
	const arrowButton = page.locator("div.icon.arrow.withBackground");
	await expect(arrowButton).toBeVisible({ timeout: 100000 });
	await arrowButton.click();
	console.log("Space arrow button clicked");
	
	// Create Bookmark
	console.log("Creating Bookmark object...");
	const menuTypeSuggest = page.locator("div#menuTypeSuggest");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	let menuItem = menuTypeSuggest.locator(`div.name:has-text('${translations.blockNameBookmark}')`);
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	// Enter bookmark URL
	console.log("Entering bookmark URL...");
	const linkInput = page.locator("input.input-text[placeholder='Paste link']");
	await expect(linkInput).toBeVisible({ timeout: 5000 });
	await linkInput.fill("https://anytype.io");
	// Press Enter
	await linkInput.press("Enter");
	await page.waitForTimeout(2000);
	
	// check the title
	console.log("Checking bookmark title...");
	const titleElement = page.locator("div#block-title div#value");
	await expect(titleElement).toBeVisible({ timeout: 5000 });
	const bookmarkTitle = await titleElement.innerText();
	expect(bookmarkTitle).toBe("anytype — the everything app");
	console.log("Bookmark object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	let backArrow = page.locator("div.icon.arrow.withBackground");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await page.waitForTimeout(2000);
	
	// Create Collection
	console.log("Creating Collection object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator(`div.name:has-text('${translations.commonCollection}')`);
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(1000);
	await menuItem.click({ force: true });
	await page.waitForTimeout(2000);
	
	// Enter name for Collection
	await createTitleWithEditorTitle(page, "Collection UItest");
	console.log("Collection object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div.icon.arrow.withBackground");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await page.waitForTimeout(2000);
	
	// Create Note
	console.log("Creating Note object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator(`div.name:has-text('${translations.layout9}')`);
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(1000);
	await menuItem.click({ force: true });
	await page.waitForTimeout(2000);
	
	// Enter the name in the first editable field
	console.log("Setting Note title and content...");
	const editorWrapper = page.locator("div#blockLast");
	await expect(editorWrapper).toBeVisible({ timeout: 5000 });
	await editorWrapper.click();
	await editorWrapper.click();
	const titleInputDiv = page.locator("div.editable").first();
	await expect(titleInputDiv).toBeVisible({ timeout: 5000 });
	await titleInputDiv.click();
	await titleInputDiv.type("Note UItest", { delay: 100 }); // Type as if human is typing
	const titleText = await titleInputDiv.innerText();
	expect(titleText).toBe("Note UItest");
	
	console.log("Note object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div.icon.arrow.withBackground");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await page.waitForTimeout(2000);
	
	// Create Page
	console.log("Creating Page object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator(`div.name:has-text('${translations.sidebarSectionLayoutFormatPage}')`);
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(1000);
	await menuItem.click({ force: true });
	await page.waitForTimeout(2000);
	
	await createTitleWithSelectionTarget(page, "Page UItest");
	console.log("Page object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div.icon.arrow.withBackground");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await page.waitForTimeout(2000);
	
	// Create Project
	console.log("Creating Project object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Project')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(1000);
	await menuItem.click({ force: true });
	await page.waitForTimeout(2000);
	
	await createTitleWithSelectionTarget(page, "Project UItest");
	console.log("Project object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div.icon.arrow.withBackground");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await page.waitForTimeout(2000);
	
	// Create Query
	console.log("Creating Query object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator(`div.name:has-text('${translations.commonSet}')`);
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(1000);
	await menuItem.click({ force: true });
	await page.waitForTimeout(2000);
	
	// Query object is created with default settings
	console.log("Query object created with default settings...");
	
	// Find the title field and enter the name
	await createTitleWithEditorTitle(page, "Query UItest");
	console.log("Query object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div.icon.arrow.withBackground");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await page.waitForTimeout(2000);
	
	// Create Task
	console.log("Creating Task object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Task')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(1000);
	await menuItem.click({ force: true });
	await page.waitForTimeout(2000);
	
	// Find the title field and enter the name
	// Clear the title field before entering Task name
	const taskTitleInputDiv = page.locator("div#selectionTarget-title div#value");
	await expect(taskTitleInputDiv).toBeVisible({ timeout: 5000 });
	await page.waitForTimeout(500);
	// Clear the field using keyboard shortcuts
	await clearInputField(page, taskTitleInputDiv);
	await page.waitForTimeout(500);
	await taskTitleInputDiv.type("Task UItest", { delay: 100 }); // Type as if human is typing
	await page.waitForTimeout(500);
	await page.keyboard.press("Enter");
	console.log("Task object created successfully");
	
	console.log("✅ All object types created successfully");
	
	// Delete all objects
	console.log("Cleaning up: Deleting all created objects...");

	const bookmarkDeleted = await deleteObjectByName(page, "anytype — the everything app", true, translations.blockNameBookmark);
	expect(bookmarkDeleted).toBe(true);
	
	const collectionDeleted = await deleteObjectByName(page, "Collection UItest", true, translations.sidebarObjectTypeList);
	expect(collectionDeleted).toBe(true);
	
	const noteDeleted = await deleteObjectByName(page, "Note UItest", true, translations.sidebarObjectTypeObject);
	expect(noteDeleted).toBe(true);
	
	const pageDeleted = await deleteObjectByName(page, "Page UItest", true, translations.sidebarObjectTypeObject);
	expect(pageDeleted).toBe(true);
	
	const projectDeleted = await deleteObjectByName(page, "Project UItest", true, translations.sidebarObjectTypeObject);
	expect(projectDeleted).toBe(true);
	
	const queryDeleted = await deleteObjectByName(page, "Query UItest", true, translations.sidebarObjectTypeList);
	expect(queryDeleted).toBe(true);
	
	const taskDeleted = await deleteObjectByName(page, "Task UItest", true, translations.sidebarObjectTypeObject);
	expect(taskDeleted).toBe(true);
	
	console.log("✅ All object types deleted successfully");
});

test("Create object and publish it", async () => {
	try {
		// Wait for page to be fully loaded and synced after login
		await waitForPageLoadAfterLogin(60000);
    
		const pageTitle = "Test Publish Document";
		console.log("Creating a new page...");
		const pageCreated = await createPage(page);
		expect(pageCreated).toBe(true);
		await page.waitForTimeout(5000);
		// Find and create a title
		console.log("Creating title...");
		await createTitleWithSelectionTarget(page, pageTitle);
		
		// Edit content
		console.log("Editing content...");
		const editorWrapper = page.locator("div#blockLast");
		await expect(editorWrapper).toBeVisible({ timeout: 5000 });
		await editorWrapper.click();
		await editorWrapper.click();
		
		const wrapContent = page.locator("div.editableWrap").nth(1);
		await expect(wrapContent).toBeVisible({ timeout: 5000 });
		
		const value = wrapContent.locator("div#value").nth(0);
		await expect(value).toBeVisible({ timeout: 5000 });
		await value.click();
		// Copy text to clipboard and paste it for faster input
		await page.evaluate((text) => {
			navigator.clipboard.writeText(text);
		}, storage.default_text);
		await page.keyboard.press("Control+v"); // Paste text
		
		await page.waitForTimeout(500);
		const editorText = await value.innerText();
		expect(editorText).toBe(storage.default_text);

		const published = await publishCurrentObject(page);
		expect(published).toBe(true);

		console.log("✅ Test completed successfully.");
		await page.keyboard.press('Escape');
		
		// Unpublish the document before deletion
		console.log("Unpublishing the document...");
		const unpublished = await unpublishCurrentObject(page);
		expect(unpublished).toBe(true);
		
		// Cleanup: Delete the created document
		console.log("Cleaning up: Deleting the test document...");
		const documentDeleted = await deleteObjectByName(page, pageTitle, true, translations.sidebarObjectTypeObject);
		expect(documentDeleted).toBe(true);
		console.log("Test cleanup completed");
	} catch (e) {
		console.error(`❌ ERROR in Create object and publish it test: ${e}`);
		throw e; // Re-throw the error so the test runner can record it
	}
});