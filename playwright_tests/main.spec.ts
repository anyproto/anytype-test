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


