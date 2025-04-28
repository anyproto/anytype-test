import { test, expect } from "@playwright/test";
import { delay } from '../setup/helpers';
import { page } from '../setup/globals';
import { 
	deleteObjectByName, 
	createPage,
	createTitleWithSelectionTarget, 
	createTitleWithEditorTitle 
} from "../utils/spaceUtils";
import { setupTest } from '../setup/testSetup';

// Setup test environment once
setupTest();


test("Create and delete various object types", async () => {
	
	// Click on the button with the drop-down list
	//await delay(5000);
	console.log("Clicking on space arrow button...");
	const arrowButton = page.locator("div#widget-space-arrow");
	await expect(arrowButton).toBeVisible({ timeout: 5000 });
	await arrowButton.click();
	console.log("Space arrow button clicked");
	
	// Create Bookmark
	console.log("Creating Bookmark object...");
	const menuTypeSuggest = page.locator("div#menuTypeSuggest");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	let menuItem = menuTypeSuggest.locator("div.name:has-text('Bookmark')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	await createTitleWithSelectionTarget(page, "Bookmark UItest");
	console.log("Bookmark object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	let backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);
	
	// Create Collection
	console.log("Creating Collection object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Collection')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	// Enter name for Collection
	await createTitleWithEditorTitle(page, "Collection UItest");
	console.log("Collection object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);
	
	// Create Human
	/*console.log("Creating Human object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Human')");
	await delay(5000);
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	// Enter name for Human
	await createTitleWithSelectionTarget(page, "Human UItest");
	console.log("Human object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);*/
	
	// Create Note
	console.log("Creating Note object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Note')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	// 3 way to create a title
	// Enter the name in the first editable field
	console.log("Setting Note title and content...");
	const editorWrapper = page.locator("div#blockLast");
	await expect(editorWrapper).toBeVisible({ timeout: 5000 });
	await editorWrapper.click();
	await editorWrapper.click();
	const titleInputDiv = page.locator("div.editable").first();
	await expect(titleInputDiv).toBeVisible({ timeout: 5000 });
	await titleInputDiv.click();
	await titleInputDiv.evaluate((el, name) => { el.innerText = name; }, "Note UItest");
	const titleText = await titleInputDiv.innerText();
	expect(titleText).toBe("Note UItest");
	
	// Enter text into the body of the note
	await expect(editorWrapper).toBeVisible({ timeout: 5000 });
	await editorWrapper.click();
	await editorWrapper.click();
	const wrapContent = page.locator("div.editableWrap").nth(1);
	await expect(wrapContent).toBeVisible({ timeout: 5000 });
	const value = wrapContent.locator("div#value").nth(0);
	await expect(value).toBeVisible({ timeout: 5000 });
	await value.click();
	await value.evaluate((el, text) => { el.innerText = text; }, "Note UItest");
	
	const editorText = await value.innerText();
	expect(editorText).toBe("Note UItest");
	console.log("Note object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);
	
	// Create Page
	console.log("Creating Page object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Page')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	await createTitleWithSelectionTarget(page, "Page UItest");
	console.log("Page object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);
	
	// Create Project
	console.log("Creating Project object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Project')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	await createTitleWithSelectionTarget(page, "Project UItest");
	console.log("Project object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);
	
	// Create Query
	console.log("Creating Quety object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Query')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	// Click on Object Type
	console.log("Configuring Query object type...");
	const objectType = page.locator("form#item-type");
	await expect(objectType).toBeVisible({ timeout: 5000 });
	await objectType.click();
	
	// Click on Page in the drop-down menu
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	const pageOption = menuTypeSuggest.locator("div.name:has-text('Page')");
	await expect(pageOption).toBeVisible({ timeout: 5000 });
	await pageOption.click();
	
	// Find the title field and enter the name
	await createTitleWithEditorTitle(page, "Query UItest");
	console.log("Query object created successfully");
	
	// Go back
	console.log("Going back to menu...");
	backArrow = page.locator("div#widget-space-arrow");
	await expect(backArrow).toBeVisible({ timeout: 5000 });
	await backArrow.click();
	await delay(2000);
	
	// Create Task
	console.log("Creating Task object...");
	await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });
	menuItem = menuTypeSuggest.locator("div.name:has-text('Task')");
	await expect(menuItem).toBeVisible({ timeout: 5000 });
	await delay(1000);
	await menuItem.click({ force: true });
	await delay(2000);
	
	// Find the title field and enter the name
	await createTitleWithSelectionTarget(page, "Task UItest");
	console.log("Task object created successfully");
	
	console.log("✅ All object types created successfully");
	
	// Delete all objects
	console.log("Cleaning up: Deleting all created objects...");
	//await deleteObjectByName(page, "Human UItest", true, "Pages");
	await deleteObjectByName(page, "Bookmark UItest", true, "Bookmarks");
	await deleteObjectByName(page, "Collection UItest", true, "Lists");
	
	await deleteObjectByName(page, "Note UItest", true, "Pages");
	await deleteObjectByName(page, "Page UItest", true, "Pages");
	await deleteObjectByName(page, "Project UItest", true, "Pages");
	await deleteObjectByName(page, "Query UItest", true, "Lists");
	await deleteObjectByName(page, "Task UItest", true, "Pages");
	console.log("✅ All object types deleted successfully");
});

test("Create object and publish it", async () => {
	try {	
		await delay(2000);
		console.log("Creating a new page...");
		const pagCereated = await createPage(page);
		//expect(pageCreated).toBeTruthy();
		await delay(5000);
		// Find and create a title
		console.log("Creating title...");
		await createTitleWithSelectionTarget(page, "Документ 1");
		
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
		await value.evaluate((el) => { el.innerText = 'Тест тест тест'; });
		
		const editorText = await value.innerText();
		expect(editorText).toBe('Тест тест тест');
		
		// Click share button
		console.log("Clicking share button...");
		const share = page.locator("div#button-header-share");
		await expect(share).toBeVisible({ timeout: 5000 });
		await share.click();
		
		// Wait for the "Publish" button to appear and click it
		console.log("Clicking publish button...");
		const publishButton = page.locator("#menuPublish").locator("div.buttons").locator("div.txt");
		await expect(publishButton).toBeVisible({ timeout: 5000 });
		await publishButton.click();
		
		console.log("✅ Test completed successfully.");
		await page.keyboard.press('Escape');
		// Cleanup: Delete the created document
		console.log("Cleaning up: Deleting the test document...");
		await deleteObjectByName(page, "Документ 1", true, "Pages");
		console.log("Test cleanup completed");
	} catch (e) {
		console.error(`❌ ERROR in Create object and publish it test: ${e}`);
		throw e; // Re-throw the error so the test runner can record it
	}
});