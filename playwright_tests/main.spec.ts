import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import {
	clickMenuItemById,
	parseElectronApp,
	stubDialog,
} from "electron-playwright-helpers";
import { ElectronApplication, Page, _electron as electron } from "playwright";
import * as fs from 'fs';
import * as path from 'path';


let electronApp: ElectronApplication;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let translations;
try {
	const translationPath = path.join(process.cwd(), 'test-temp-translations.json');
	if (process.env.LANG_FILES_PATH) {
		// Always copy the translation file from LANG_FILES_PATH
		fs.copyFileSync(process.env.LANG_FILES_PATH, translationPath);
	} else {
		throw new Error('LANG_FILES_PATH environment variable is not defined. This is required for running e2e tests.');
	}
	
	if (fs.existsSync(translationPath)) {
		translations = JSON.parse(fs.readFileSync(translationPath, 'utf-8'));
	} else {
		console.warn('Translation file not found at:', translationPath);
		translations = {};  // Empty object instead of default translations
	}
} catch (error) {
	console.error('Error loading translations:', error);
	throw error;
}

const storage = {};

test.beforeAll(async () => {
	const langFilePath = process.env.LANG_FILES_PATH;
	
	if (langFilePath) {
		console.log('Checking if language file exists:', fs.existsSync(langFilePath));
		if (fs.existsSync(langFilePath)) {
			console.log('Language file content:', fs.readFileSync(langFilePath, 'utf-8').substring(0, 100) + '...');
		}
	} else {
		console.log('Language file path is not defined');
	}
	
	console.log('\n=== Test Setup Debug ===');
	console.log('Global object keys:', Object.keys(global));
	console.log('Translations available:', !!global['translations']);
	console.log('Translations type:', typeof global['translations']);
	if (global['translations']) {
		console.log('Number of translation keys:', Object.keys(global['translations']).length);
	}
	
	// parse the directory and find paths and other info
	const electronAppPath =
		process.env.ELECTRON_APP_PATH ||
		"/Users/shamray/workspace/anytype/anytype-ts/dist/mac-arm64/Anytype.app";
	const appInfo = parseElectronApp(electronAppPath);
	// set the CI environment variable to true
	process.env.CI = "e2e";
	electronApp = await electron.launch({
		args: [appInfo.main],
		executablePath: appInfo.executable,
	});

	electronApp.on("window", async (page) => {
		const filename = page.url()?.split("/").pop();
		console.log(`Window opened: ${filename}`);

		// capture errors
		page.on("pageerror", (error) => {
			console.error(error);
		});
		// capture console messages
		page.on("console", (msg) => {
			console.log('\x1b[34m%s\x1b[0m', msg.text());
		});
	});
});

test.afterAll(() => {});

let page: Page;

test("Renders the first page", async () => {
	page = await electronApp.firstWindow();
	//wait for 30 seconds
	const title = await page.title();
});

test("Enter my Vault", async () => {
	//Step create new vault
	await page.getByText(translations.authSelectSignup).click();
	//Step Reveal the key
	await page.getByText(translations.authOnboardPhraseSubmit).click();
	await delay(3000);
	//Step save the key
	await page.click(".icon.copy");
	// Retrieve clipboard content
	const copiedText = await page.evaluate(async () => {
		return await navigator.clipboard.readText();
	});
	// Save the copied text to storage
	storage["vaultKey"] = copiedText;
	console.log("Copied text:", storage["vaultKey"]);
	await delay(3000);
	await page.getByText(translations.commonNext).click();
	//Step choose the name and enter the vault
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