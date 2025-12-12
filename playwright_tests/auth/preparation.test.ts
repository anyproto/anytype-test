import { test, expect } from '@playwright/test';
import { delay, logOutFromSpace, waitForPageLoadAfterLogin } from '../setup/helpers';
import { page, storage, translations } from '../setup/globals';
import { setupTest } from '../setup/testSetup';

// Setup test environment once
setupTest();

  test("01_Create new account", async () => {
    console.log('Starting Create new account test...');
    
    // Click "I am new here" button
    console.log('Step 1: Clicking '+translations.authSelectSignup+' button...');
    const newHereButton = page.getByText(translations.authSelectSignup);
    await expect(newHereButton).toBeVisible({ timeout: 10000 });
    await newHereButton.click();
    console.log('"'+translations.authSelectSignup+'" button clicked');
    
    // Enter email
    console.log('Entering email...');
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
    await delay(1000);

    // Wait for personal selection screen
    await page.waitForSelector('.stagePersona', { timeout: 10000 });
    console.log('Persona selection screen loaded');
    await delay(1000);

    // Select Founder/Entrepreneur role
    console.log('Selecting Founder/Entrepreneur role...');
    const founderOption = page.locator('.option').filter({ hasText: 'Founder / Entrepreneur' });
    await expect(founderOption).toBeVisible({ timeout: 10000 });
    await founderOption.click();
    console.log('Founder/Entrepreneur role selected');
    await delay(1000);

    // Click Continue button on personal screen
    const personaContinueButton = page.locator('.button.accent.c48').filter({ hasText: 'Continue' });
    await expect(personaContinueButton).toBeVisible({ timeout: 10000 });
    await personaContinueButton.click();
    console.log('Continue button clicked on persona screen');
    await delay(1000);

    // Wait for use case selection screen
    await page.waitForSelector('.stageUseCase', { timeout: 10000 });
    console.log('Use case selection screen loaded');
    await delay(1000);

    // Select Life planning use case
    console.log('Selecting Life planning use case...');
    const lifePlanningOption = page.locator('.option').filter({ hasText: 'Life planning' });
    await expect(lifePlanningOption).toBeVisible({ timeout: 10000 });
    await lifePlanningOption.click();
    console.log('Life planning use case selected');
    await delay(1000);

    // Click Done button on use case screen
    const doneButton = page.locator('.button.accent.c48').filter({ hasText: 'Done' });
    await expect(doneButton).toBeVisible({ timeout: 10000 });
    await doneButton.click();
    console.log('Done button clicked on use case screen');
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
    page.locator("#path").getByText(translations.commonHomepage);
    await waitForPageLoadAfterLogin(60000);
});

