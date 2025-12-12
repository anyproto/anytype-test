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

	const launchOptions: any = {
		args: [appInfo.main],
		executablePath: appInfo.executable,
	};

	// Add headless mode if HEADLESS environment variable is set
	if (process.env.HEADLESS === 'true') {
		console.log('🚀 Starting Electron app in HEADLESS mode');
		launchOptions.args.push('--headless=new');
		launchOptions.args.push('--no-sandbox');
		launchOptions.args.push('--disable-dev-shm-usage');
	} else {
		console.log('🖥️ Starting Electron app in GUI mode');
	}

	const app = await electron.launch(launchOptions);
	
	app.on("window", async (page) => {
		if (process.env.SHOW_ANYTYPE_LOGS === 'true') {
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
		}
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
		const testDataPath = createTestDataDir();
		console.log('Test data directory created:', testDataPath);

		// Screenshots directory will be created in testSetup.ts

		// Launch the Electron app
		console.log('Launching Electron app...');
		const app = await launchElectronApp();
		setElectronApp(app);

		// Wait for the first window to be ready
		console.log('Setting up global app instance...');
		const firstWindow = await app.firstWindow();
		setPage(firstWindow);

		// Load translations
		console.log('Loading translations...');
		const translations = loadTranslations();
		setTranslations(translations);
		console.log('Translations loaded:', Object.keys(translations).length, 'keys found');

		// Wait for the first window to be fully loaded
		console.log('Waiting for first window...');
		await firstWindow.waitForLoadState('domcontentloaded');
		console.log('First window acquired');

		// Set up global page instance
		console.log('Setting up global page instance...');
		//await firstWindow.waitForLoadState('networkidle');

		// Check login state and log out if needed
		console.log('Checking login state... and logging out if needed');
		if (process.env.RUN_LOGOUT === 'true') {
			await logOutFromSpace();
		} else {
			console.log('RUN_LOGOUT is false or not set, skipping logOutIfNeeded...');
		}

		console.log('Test context setup completed successfully');
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
		logoutFromEnteringPage();
    } else {
		console.log('Not stuck on logging in, logging out...');
		logOutFromSpace();
    }
}

export async function logoutFromEnteringPage() {
	console.log('Logging out from entering page...');
	console.log('Stuck on logging in, clicking back button');
	const backButton = page.locator('div.animation', { hasText: translations.commonBack });
	const isVisible = await backButton.isVisible();
	const isEnabled = await backButton.isEnabled();

	if (isVisible && isEnabled) {
		await backButton.click();
	} else {
		console.error('Back button is not visible or not enabled');
	}
}


export async function logOutFromSpace() {
	console.log('Logging out from space...');
	// Wait for page to be fully loaded and synced after login
	await waitForPageLoadAfterLogin(60000);
	// Step 1: Click back arrow to return to vault
	console.log('Step 1: Clicking back arrow to return to vault...');
	const backArrow = page.locator('div.subHead div.side.left div.icon.back');
	await backArrow.waitFor({ state: 'visible', timeout: 10000 });
	await backArrow.click();
	console.log('Back arrow clicked');
	await delay(2000);
	
	// Step 2: Click on account icon in bottom left
	console.log('Step 2: Clicking on account icon...');
	const accountIcon = page.locator('div.bottom div.side.left div.appSettings');
	await accountIcon.waitFor({ state: 'visible', timeout: 10000 });
	await accountIcon.click();
	console.log('Account icon clicked');
	await delay(1000);
	
	// Step 3: Click logout button in settings
	console.log('Step 3: Clicking logout button...');
	const logoutButton = page.locator('div.logout');
	await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
	await logoutButton.click();
	console.log('Logout button clicked');
	await delay(1000);
	
	// Step 4: Click logout button in confirmation dialog
	console.log('Step 4: Clicking logout button in confirmation dialog...');
	const confirmLogoutButton = page.locator('div#popupLogout-innerWrap div.buttons div.button.red.c36 div.txt:has-text("Logout")');
	await confirmLogoutButton.waitFor({ state: 'visible', timeout: 10000 });
	await confirmLogoutButton.click();
	console.log('Logout confirmed');
	await delay(1000);

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

/**
 * Wait for application synchronization to complete
 * Checks for sync status using the headerSync element
 */
export async function waitForSyncComplete(timeoutMs: number = 30000): Promise<void> {
    console.log('🔄 Waiting for application sync to complete...');
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
        try {
            // Wait for headerSync element to appear first

			const defaultObjectButton = page.locator('div.subHead div.plusWrapper div.icon.create.withBackground');
			// await plusButton.waitFor({ state: 'visible', timeout: 10000 });
            // const headerSync = page.locator('#headerSync');
            const isHeaderSyncVisible = await defaultObjectButton.isVisible();
            
            if (!isHeaderSyncVisible) {
                console.log('⏳ Waiting for defaultObjectButton element to appear...');
                await delay(2000);
                continue;
            }
            
            // Once headerSync is visible, wait 4 seconds and proceed
            console.log('✅ defaultObjectButton element found, waiting 4 seconds before proceeding...');
            await delay(4000);
            console.log('✅ Sync wait completed');
            return;
            

            /*
            // Check if sync is complete by looking for synced class inside headerSync
            const syncedIcon = page.locator('#headerSync .icon.synced');
            const isSynced = await syncedIcon.isVisible();
            
            if (isSynced) {
                console.log('✅ Sync completed successfully');
                return;
            } else {
                console.log('⏳ Sync in progress... waiting');
                await delay(2000);
            }
            */
            
        } catch (error) {
            console.log('⚠️ Error checking sync status:', error.message);
            await delay(2000);
        }
    }
    
    console.log('⚠️ Sync timeout reached, proceeding anyway');
}

/**
 * Wait for page to be fully loaded after login
 * Includes waiting for sync to complete
 */
export async function waitForPageLoadAfterLogin(timeoutMs: number = 30000): Promise<void> {
    console.log('📄 Waiting for page to load after login...');
    
    
    // Wait for sync to complete
    await waitForSyncComplete(timeoutMs);
    
    console.log('✅ Page fully loaded and synced');
}
