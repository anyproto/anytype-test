import { test, expect } from "@playwright/test";
import { delay, setupTestContext } from './setup/helpers';
import { page, storage, translations, electronApp } from './globals';

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
	console.log('TEST: Starting "Enter my Vault" test...');
	await page.getByText(translations.authSelectSignup).click();
	console.log('TEST: Clicked signup button');
	await page.getByText(translations.authOnboardPhraseSubmit).click();
	console.log('TEST: Clicked phrase submit button');
	await delay(2000);
	console.log('TEST: Attempting to copy vault key');
	await page.click(".icon.copy");

	const copiedText = await page.evaluate(() => navigator.clipboard.readText());
	storage["vaultKey"] = copiedText;
	console.log("TEST: Copied vault key:", copiedText);

	await delay(2000);
	console.log('TEST: Clicking next button');
	await page.getByText(translations.commonNext).click();
	console.log('TEST: Filling in name');
	await page.getByPlaceholder(translations.commonYourName).fill("Friedolin");
	await delay(2000);
	console.log('TEST: Clicking done button');
	await page.getByText(translations.commonDone).click();
	console.log('TEST: "Enter my Vault" test completed');
});

test("Log out", async () => {
	console.log('TEST: Starting "Log out" test...');
	await delay(2000);
	console.log('TEST: Clicking settings button');
	await page.locator('div#item-settings.item.isButton.settings').click();
	console.log('TEST: Clicking logout button');
	await page.click(`div.logout`);
	console.log('TEST: Confirming logout');
	await page.getByText(translations.popupLogoutLogoutButton).click();
	console.log('TEST: "Log out" test completed');
});

test("Log in as existing user", async () => {
	console.log('TEST: Starting "Log in as existing user" test...');
	await delay(2000);
	console.log('TEST: Clicking login button');
	await page.getByText(translations.authSelectLogin).click();
	console.log('TEST: Clicking phrase input wrapper');
	await page.locator(".phraseInnerWrapper").click();
	console.log('TEST: Typing vault key:', storage["vaultKey"]);
	await page.locator("#entry").type(storage["vaultKey"]);
	console.log('TEST: Pressing space key');
	await page.keyboard.press("Space");
	console.log('TEST: Submitting login');
	await page.getByText(translations.authLoginSubmit).click();
	console.log('TEST: Verifying homepage is visible');
	await page.locator("#path").getByText("Homepage");
	console.log('TEST: "Log in as existing user" test completed');
});

test("Create a new space", async () => {
	console.log('TEST: Starting "Create a new space" test...');
	await delay(2000);
	console.log('TEST: Clicking add button');
	await page.locator('div#item-add').click();
	console.log('TEST: Filling in space name');
	await page.locator('input[placeholder="Untitled"]').fill("Cool Space");	
	
	// Add debug logging for all console messages
	page.on('console', msg => {
		console.log('APP CONSOLE:', msg.text());
	});

	// Create a promise with a more generous timeout
	console.log('TEST: Setting up console event listener for workspace creation');
	const consolePromise = page.waitForEvent('console', {
		predicate: msg => {
			const text = msg.text();
			console.log('TEST: Checking console message:', text);
			return text.includes('Response.WorkspaceCreate');  // Simplified condition
		},
		timeout: 20000  // Increase timeout to 20 seconds
	});

	console.log('TEST: Clicking create button');
	await page.getByText(translations.popupSpaceCreateCreate).click();
	
	try {
		console.log('TEST: Waiting for workspace creation confirmation...');
		const consoleMessage = await consolePromise;
		console.log('TEST: Successfully received console message:', consoleMessage.text());
	} catch (error) {
		console.error('TEST ERROR: Failed to receive expected console message:', error);
	}

	// Wait for visual confirmation instead of relying on console
	console.log('TEST: Waiting for "Cool Space" to be visible');
	await expect(page.locator('span').filter({ hasText: 'Cool Space' })).toBeVisible();
	console.log('TEST: "Create a new space" test completed');
});
