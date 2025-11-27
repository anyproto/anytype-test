import { test, expect } from '@playwright/test';
import { delay, logOutFromSpace, waitForPageLoadAfterLogin } from '../setup/helpers';
import { page, storage, translations } from '../setup/globals';
import { setupTest } from '../setup/testSetup';

// Setup test environment once
setupTest();

  test("01_Create new account", async () => {
    console.log('Starting Create new account test...');
    
    // Step 1: Click "I am new here" button
    console.log('Step 1: Clicking '+translations.authSelectSignup+' button...');
    const newHereButton = page.getByText(translations.authSelectSignup);
    await expect(newHereButton).toBeVisible({ timeout: 10000 });
    await newHereButton.click();
    console.log('"'+translations.authSelectSignup+'" button clicked');
    
    // Wait for the next step to be ready
    await page.waitForSelector('text=' + translations.authOnboardPhraseSubmit, { timeout: 10000 });
    
    // Step 2: Click "Show my key" button
    console.log('Step 2: Clicking '+translations.authOnboardPhraseSubmit+' button...');
    const showKeyButton = page.getByText(translations.authOnboardPhraseSubmit);
    await expect(showKeyButton).toBeVisible({ timeout: 10000 });
    await showKeyButton.click();
    console.log('"'+translations.authOnboardPhraseSubmit+'" button clicked');
    
    // Wait for phrase wrapper to be visible
    await page.waitForSelector('div.phraseWrapper.animation.isReadonly', { timeout: 10000 });
    
    // Step 3: Get the vault key from the phrase wrapper
    console.log('Step 3: Getting vault key from phrase wrapper...');
    const phraseWords = page.locator('div.phraseWrapper.animation.isReadonly div.phraseInnerWrapper span.word');
    await expect(phraseWords.first()).toBeVisible({ timeout: 10000 });
    
    // Get all phrase words and combine them
    const wordElements = await phraseWords.all();
    const vaultKeyWords: string[] = [];
    for (const wordElement of wordElements) {
        const wordText = await wordElement.textContent();
        if (wordText && wordText.trim() !== '') {
            vaultKeyWords.push(wordText.trim());
        }
    }
    
    const vaultKey = vaultKeyWords.join(' ');
    storage["vaultKey"] = vaultKey;
    console.log('Vault key saved:', vaultKey);
    await delay(2000);
    // Wait for Next button to be ready
    await page.waitForSelector('text=' + translations.commonNext, { timeout: 10000 });
    
    // Step 4: Click "Next" button
    console.log('Step 4: Clicking '+translations.commonNext+' button...');
    const nextButton = page.getByText(translations.commonNext);
    await expect(nextButton).toBeVisible({ timeout: 10000 });
    await nextButton.click();
    console.log('"'+translations.commonNext+'" button clicked');
    
    // Wait for name input to be ready
    await page.waitForSelector('input[type="text"]', { timeout: 15000 });
    
    // Step 5: Enter account name
    console.log('Step 5: Entering account name...');
    
    // Try different selectors for the name input
    let nameInput: any = null;
    const nameSelectors = [
        'input[type="text"][class="input input-text"]',
        'input[type="text"]'
    ];
    
    for (const selector of nameSelectors) {
        try {
            console.log(`Trying name input selector: ${selector}`);
            nameInput = page.locator(selector);
            await nameInput.waitFor({ state: 'visible', timeout: 5000 });
            console.log(`Found name input with selector: ${selector}`);
            break;
        } catch (e) {
            console.log(`Selector ${selector} failed: ${e.message}`);
            continue;
        }
    }
    
    if (!nameInput) {
        throw new Error('Could not find name input field with any selector');
    }
    
    await nameInput.click();
    await nameInput.type(storage["testAccountName"], { delay: 100 }); // Type as if human is typing
    console.log('Account name entered:', storage["testAccountName"]);
    
    // Wait for Continue button to be ready
    await page.waitForSelector('text=' + translations.commonContinue, { timeout: 10000 });
    
    // Click "Continue" button
    const continueButton = page.getByText(translations.commonContinue);
    await expect(continueButton).toBeVisible({ timeout: 10000 });
    await continueButton.click();
    console.log('"'+translations.commonContinue+'" button clicked');
    
    // Wait for email input to be ready
    await page.waitForSelector(`[placeholder="${translations.authOnboardEmailPlaceholder}"]`, { timeout: 10000 });
    
    // Step 6: Enter email
    console.log('Step 6: Entering email...');
    const emailInput = page.getByPlaceholder(translations.authOnboardEmailPlaceholder);
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.click();
    await emailInput.type(storage["testEmail"], { delay: 100 }); // Type as if human is typing
    console.log('Email entered:', storage["testEmail"]);
    
    // Wait for final Continue button to be ready
    await page.waitForSelector('text=' + translations.commonContinue, { timeout: 10000 });
    
    // Click "Continue" button again
    const finalContinueButton = page.getByText(translations.commonContinue);
    await expect(finalContinueButton).toBeVisible({ timeout: 10000 });
    await finalContinueButton.click();
    console.log('"'+translations.commonContinue+'" button clicked');
    
    // Wait for the process to complete and verify account name is displayed
    await page.waitForSelector('.subHead .name span', { timeout: 15000 });
    
    // Verify the account name is displayed correctly
    const accountNameElement = page.locator('.subHead .name span');
    await expect(accountNameElement).toBeVisible({ timeout: 10000 });
    
    const displayedName: string | null = await accountNameElement.textContent();
    console.log('Displayed account name:', displayedName);
    
    // Verify the displayed name matches what we entered
    if (displayedName && displayedName !== storage["defaultSpaceName"]) {
        throw new Error(`Account name mismatch! Expected: "${storage["defaultSpaceName"]}", but got: "${displayedName}"`);
    }
    await delay(20000);
    console.log('✅ Create new account test completed successfully');
});

test("02_Log out", async () => {
    // Wait for page to be fully loaded and synced after login
    await waitForPageLoadAfterLogin(60000);
    
    await logOutFromSpace();
});

  test("03_Log in as existing user", async () => {
    await delay(2000);
    await page.getByText(translations.authSelectLogin).click();
    await page.locator(".phraseInnerWrapper").click();
    await page.locator("#entry").type(storage["vaultKey"]);
    await page.keyboard.press("Space");
    await page.getByText(translations.authLoginSubmit).click();
    await delay(2000);
    page.locator("#path").getByText(translations.commonHomepage);
});

