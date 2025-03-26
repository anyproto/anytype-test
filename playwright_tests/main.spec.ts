import { test } from "@playwright/test";
import { delay, setupTestContext } from './setup/helpers';
import { page, storage, translations } from './globals';


test.beforeAll(async () => {
	console.log('🧪 Setting up test context...');
	await setupTestContext();
});

test.afterAll(() => {});


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