import { ElectronApplication, _electron as electron } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { parseElectronApp } from 'electron-playwright-helpers';
import { page, setElectronApp, setPage, setTranslations, translations } from './globals';
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
		
		// Ensure we're logged out before starting tests
		console.log('Checking login state... and logging out if needed');
		//await logOutIfNeeded();
		console.log('Test context setup completed successfully');
		return { app, win };
	} catch (error) {
		console.error('Error during test context setup:', error);
		throw error;
	}
}

export async function logOutIfNeeded() {
	console.log('Log out if needed function called');
	const loginScreenStatus = await isOnLoginScreen();
    if (!loginScreenStatus) {
        console.log('We are not on the login screen, logging out...');
        await delay(1000);
        await logOut();
     }
}

export async function createAccount(name: string = "Friedolin") {
    await page.getByText(translations.authSelectSignup).click();
    await page.getByText(translations.authOnboardPhraseSubmit).click();
    await delay(1000);
    // Skip copying and checking the vault key
    await page.getByText(translations.commonNext).click();
    await page.getByPlaceholder(translations.commonYourName).fill(name);
    await delay(1000);
    await page.getByText(translations.commonDone).click();
}

export async function logOut() {
    // Check if we're on the auth setup screen
    const stuckOnLogginIn = await page.getByText(translations.pageAuthSetupEntering).count() > 0;

    if (stuckOnLogginIn) {
		console.log('Stuck on logging in, clicking back button');
        await page.locator('div.button.black.c28').getByText(translations.commonBack).click();
    } else {
		console.log('Not stuck on logging in, logging out...');
        await page.locator('div#item-settings.item.isButton.settings').click();
        await page.click(`div.logout`);
        await page.getByText(translations.popupLogoutLogoutButton).click();
    }
}

export async function isOnLoginScreen(): Promise<boolean> {
    try {
        console.log('\n=== Login Screen Check ===');
        
        // Use simpler, more robust selectors
        const disclaimerSelector = 'div.label.disclaimer';
        const loginSelector = `div.txt:has-text("${translations.authSelectLogin}")`;
        const signupSelector = `div.txt:has-text("${translations.authSelectSignup}")`;
        
        console.log('Checking selectors:');
        console.log('Disclaimer:', disclaimerSelector);
        console.log('Login:', loginSelector);
        console.log('Signup:', signupSelector);

        await delay(1000);

        const [disclaimerCount, loginCount, signupCount] = await Promise.all([
            page.locator(disclaimerSelector).count(),
            page.locator(loginSelector).count(),
            page.locator(signupSelector).count()
        ]);

        console.log(`Results:
        Disclaimer count: ${disclaimerCount}
        Login count: ${loginCount}
        Signup count: ${signupCount}`);

        const isLoginScreen = disclaimerCount > 0 && loginCount > 0 && signupCount > 0;
        console.log(`Is on login screen: ${isLoginScreen}`);
        return isLoginScreen;
    } catch (error) {
        console.error('Error checking login screen:', error);
        return false;
    }
}