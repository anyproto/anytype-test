import { test, expect } from '@playwright/test';
import { page, storage, translations } from '../setup/globals';
import { delay } from '../setup/helpers';

export const loginTest = () => {
  test("Log in as existing user", async () => {
    await delay(2000);
    await page.getByText(translations.authSelectLogin).click();
    await page.locator(".phraseInnerWrapper").click();
    await page.locator("#entry").type(storage["vaultKey"]);
    await page.keyboard.press("Space");
    await page.getByText(translations.authLoginSubmit).click();
    page.locator("#path").getByText("Homepage");
  });
};