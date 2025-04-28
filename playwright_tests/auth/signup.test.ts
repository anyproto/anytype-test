import { test, expect } from '@playwright/test';
import { page, storage, translations } from '../setup/globals';
import { delay } from '../setup/helpers';

export const signupTest = () => {
  test("Enter my Vault (Sign up new user)", async () => {
    console.log('Starting signup process...');
    
    await page.getByText(translations.authSelectSignup).click();
    await page.getByText(translations.authOnboardPhraseSubmit).click();
    
    await delay(2000);
    
    console.log('Copying vault key...');
    await page.click(".icon.copy");
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    storage["vaultKey"] = copiedText;
    console.log("Copied vault key:", copiedText);
    
    await delay(2000);
    
    console.log('Continuing onboarding...');
    await page.getByText(translations.commonNext).click();
    await page.getByPlaceholder(translations.defaultNamePage).fill("Friedolin");
    
    await delay(2000);
    
    await page.getByText(translations.commonDone).click();
    
    console.log('Signup completed successfully!');
  });
};
