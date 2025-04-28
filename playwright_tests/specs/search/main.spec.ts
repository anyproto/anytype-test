import { test, expect } from "@playwright/test";
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
// Импортируем функцию с тестом поиска
import { searchObjectByTitleAndText } from './search';

test.beforeAll(async () => {
	console.log('🧪 Setting up test context...');
	await setupTestContext();
});

test.afterAll(async() => {
	if (electronApp) {
		console.log('Closing Electron app...');
		await electronApp.close();
	} else {
		console.warn('No Electron app instance found to close');
	}
});


test("Enter my Vault", async () => {
	await page.getByText(translations.authSelectSignup).click();
	await page.getByText(translations.authOnboardPhraseSubmit).click();
	await delay(2000);
	await page.click(".icon.copy");

	const copiedText = await page.evaluate(() => navigator.clipboard.readText());
	storage["vaultKey"] = copiedText;
	console.log("Copied vault key:", copiedText);

	await delay(2000);
	await page.getByText(translations.commonNext).click();
	await page.getByPlaceholder(translations.defaultNamePage).fill("Friedolin");
	await delay(2000);
	await page.getByText(translations.commonDone).click();
});

test("Log out", async () => {
	await delay(2000);
	await page.locator('div#item-settings.item.isButton.settings').click();
	await page.click(`div.logout`);
	await page.getByText(translations.popupLogoutLogoutButton).click();
});

test("Log in as existing user", async () => {
	await delay(2000);
	await page.getByText(translations.authSelectLogin).click();
	await page.locator(".phraseInnerWrapper").click();
	await page.locator("#entry").type(storage["vaultKey"]);
	await page.keyboard.press("Space");
	await page.getByText(translations.authLoginSubmit).click();
	page.locator("#path").getByText("Homepage");
});

test("Create a new space", async () => {
	await delay(2000);
	await page.locator('div#item-add').click();
	await page.locator('input[placeholder="Untitled"]').fill("Cool Space");	
	
	// Add debug logging for all console messages
	page.on('console', msg => {
		console.log('Console message:', msg.text());
	});

	// Create a promise with a more generous timeout
	const consolePromise = page.waitForEvent('console', {
		predicate: msg => {
			const text = msg.text();
			console.log('Checking console message:', text);
			return text.includes('Response.WorkspaceCreate');  // Simplified condition
		},
		timeout: 20000  // Increase timeout to 20 seconds
	});

	await page.getByText(translations.popupSpaceCreateCreate).click();
	
	try {
		const consoleMessage = await consolePromise;
		console.log('Successfully received console message:', consoleMessage.text());
	} catch (error) {
		console.error('Failed to receive expected console message:', error);
	}

	// Wait for visual confirmation instead of relying on console
	await expect(page.locator('span').filter({ hasText: 'Cool Space' })).toBeVisible();
});


test("Search page by exact match in title", async () => {
	const text='One good name';
	console.log('Starting search test...');
	
	console.log('Creating a new page object...');
	await widget(page, 'Pages').createObject();
	console.log('Created a new page object');
	
	//I should be focused on the title input
	console.log('Waiting for title input...');
	const pageName = page.locator('#value.ctitle');
	await pageName.waitFor();
	await expect(pageName).toBeFocused();
	console.log('Title input is focused');
	
	console.log(`Filling title with text: ${text}...`);
	await pageName.click(); // First click to focus
	await page.keyboard.type(text); // Enter text character-by-character like a user would do
	await page.keyboard.press("Enter"); // Press enter after typing the text
	console.log(`Filled title with text: ${text}`);
	
	console.log('Verifying title text...');
	await expect(pageName).toHaveText(text);
	console.log('Title text verified');

	console.log('Clicking on search icon...');
	await page.locator('.icon.search.withBackground').click();
	console.log('Clicked on search icon');
	
	console.log('Waiting for search input...');
	const searchInput = page.locator('#input');
	await searchInput.waitFor();
	console.log('Search input is ready');
	
	console.log(`Searching for: ${text}...`);
	await searchInput.click(); // First click to focus
	await page.keyboard.type(text); // Enter text character-by-character like a user would do
	// Don't press Enter here because we want to see if it's working without pressing Enter
	console.log(`Entered search query: ${text}`);
	
	console.log('Verifying search results...');
	await expect(page.locator('div.name > markuphighlight').filter({ hasText: text})).toBeVisible();
	console.log('Search result found and verified');
	
	// Clearing search input
	console.log('Clearing search input...');
	const searchInputField = page.locator('#input');
	await searchInputField.click();
	await page.keyboard.press('Control+A'); // Highlight everything
	await page.keyboard.press('Backspace'); // Clear highlighted content
	console.log('Search input cleared');
	
	// Close search window
	console.log('Closing search window...');
	await page.keyboard.press('Escape'); // Press Escape to close the search window
	await delay(5000); // Pause for 5 seconds before closing the search window
	console.log('Search window closed');
	
	// Cleaning up: deleting the created page
	console.log(`Cleaning up: Deleting the test object "${text}"...`);
	await deleteObjectByName(page, text);
	console.log('Test cleanup completed');
});

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

// Add imported test for Search here
test("Search object by title and text", searchObjectByTitleAndText);
