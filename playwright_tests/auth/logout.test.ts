import { test, expect } from '@playwright/test';
import { page, storage, translations } from '../setup/globals';
import { delay } from '../setup/helpers';


export const loginTest = () => {
    test("Log out", async () => {
        await delay(2000);
        await page.locator('div#item-settings.item.isButton.settings').click();
        await page.click(`div.logout`);
        await page.getByText(translations.popupLogoutLogoutButton).click();
    });
};