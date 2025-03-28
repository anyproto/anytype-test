import { ElectronApplication, _electron as electron } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { parseElectronApp } from 'electron-playwright-helpers';
import { page, setElectronApp, setPage, setTranslations, translations } from '../globals';
import crypto from 'crypto';

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export function loadTranslations() {
	const translationPath = path.join(process.cwd(), 'test-temp-translations.json');
	
	if (!process.env.LANG_FILES_PATH) {
		throw new Error('LANG_FILES_PATH environment variable is not defined. This is required for running e2e tests.');
	}

	// Always copy the translation file from LANG_FILES_PATH
	fs.copyFileSync(process.env.LANG_FILES_PATH, translationPath);

	if (!fs.existsSync(translationPath)) {
		console.warn('Translation file not found at:', translationPath);
		return {};  // Empty object instead of default translations
	}

	return JSON.parse(fs.readFileSync(translationPath, 'utf-8'));
}

export async function launchElectronApp(): Promise<ElectronApplication> {
	const electronAppPath = process.env.ELECTRON_APP_PATH;
	if (!electronAppPath) {
		throw new Error('ELECTRON_APP_PATH environment variable is not defined. This is required for running e2e tests.');
	}
	const appInfo = parseElectronApp(electronAppPath);
    console.log(appInfo);
	process.env.CI = "e2e";

	// Debug logging for language files
	if (process.env.LANG_FILES_PATH) {
		console.log('Checking if language file exists:', fs.existsSync(process.env.LANG_FILES_PATH));
		if (fs.existsSync(process.env.LANG_FILES_PATH)) {
			console.log('Language file content:', fs.readFileSync(process.env.LANG_FILES_PATH, 'utf-8').substring(0, 100) + '...');
		}
	}

	const app = await electron.launch({
		args: [appInfo.main],
		executablePath: appInfo.executable,
	});
	
	app.on("window", async (page) => {
		const filename = page.url()?.split("/").pop();
		console.log(`Window opened: ${filename}`);
		
		page.on("pageerror", (error) => {
			console.error(error);
		});
		page.on("console", (msg) => {
			try {
				const text = msg.text();
				// Try to parse any potential JSON in the message
				const parsed = text.replace(/%c/g, '').split(' ').map(part => {
					try {
						return JSON.parse(part);
					} catch {
						return part;
					}
				}).join(' ');
				console.log('\x1b[34m%s\x1b[0m', parsed);
			} catch (error) {
				// Fallback to original message if parsing fails
				console.log('\x1b[34m%s\x1b[0m', msg.text());
			}
		});
	});

	return app;
}

export function createTestDataDir(): string {
	const TMP_DIR = path.join(process.cwd(), 'tmp');
	if (!fs.existsSync(TMP_DIR)) {
		console.log('Creating TMP_DIR...');
		fs.mkdirSync(TMP_DIR);
	}

	const randomDirName = crypto.randomBytes(8).toString('hex');
	console.log('Generated random directory name:', randomDirName);
	const testDataPath = path.join(TMP_DIR, randomDirName);
	console.log('Attempting to create directory at:', testDataPath);
	fs.mkdirSync(testDataPath);
	console.log('Successfully created test data directory');

	process.env.DATA_PATH = testDataPath;
	return testDataPath;
}

export async function setupTestContext() {
	console.log('Starting test context setup...');
	try {
		// Create a new test data directory for this test run
		createTestDataDir();

		// Launch the Electron application and get the app instance
		console.log('Launching Electron app...');
		const app = await launchElectronApp();
		console.log('Electron app launched successfully');

		// Store the app instance in a global variable for access across tests
		console.log('Setting up global app instance...');
		setElectronApp(app);

		// Load and set translations from the specified language file
		console.log('Loading translations...');
		const translations = loadTranslations();
		console.log('Translations loaded:', Object.keys(translations).length, 'keys found');
		setTranslations(translations);

		// Get the first/main window of the application
		console.log('Waiting for first window...');
		const win = await app.firstWindow();
		console.log('First window acquired');

		// Store the main window's page object in a global variable for access across tests
		console.log('Setting up global page instance...');
		setPage(win);

		console.log('Test context setup completed successfully');
		return { app, win };
	} catch (error) {
		console.error('Error during test context setup:', error);
		throw error;
	}
}

export async function createAccount(name: string = "Friedolin") {
    if (!isOnLoginScreen()) {
        await delay(2000);
        await logOut();
     }
    await page.getByText(translations.authSelectSignup).click();
    await page.getByText(translations.authOnboardPhraseSubmit).click();
    await delay(2000);
    // Skip copying and checking the vault key
    await page.getByText(translations.commonNext).click();
    await page.getByPlaceholder(translations.defaultNamePage).fill(name);
    await delay(2000);
    await page.getByText(translations.commonDone).click();
}

export async function logOut() {
    await page.locator('div#item-settings.item.isButton.settings').click();
	await page.click(`div.logout`);
	await page.getByText(translations.popupLogoutLogoutButton).click();
}

export async function isOnLoginScreen(): Promise<boolean> {
    try {
        // Check for the presence of login-specific elements
        const loginElements = await Promise.all([
            page.locator('div.label.disclaimer[data-content="' + translations.authDisclaimer + '"]').count(),
            page.locator(`div.txt:has-text("${translations.authSelectLogin}")`).count(),
            page.locator(`div.txt:has-text("${translations.authSelectSignup}")`).count()
        ]);
        // All elements should be present (count > 0 for each)
        return loginElements.every(count => count > 0);
    } catch (error) {
        console.error('Error checking login screen:', error);
        return false;
    }
}


