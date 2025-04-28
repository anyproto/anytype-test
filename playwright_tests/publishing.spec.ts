import { test, expect } from "@playwright/test";
import { delay, setupTestContext, createAccount, logOut, isOnLoginScreen } from './setup/helpers';
import { page, storage, translations } from './globals';
import { widget } from "./utils/widgets";
import { faker } from '@faker-js/faker';

test.beforeAll(async () => {
	console.log('🧪 Setting up test context...');
	await setupTestContext();
    await createAccount();
});

test("Publish a page", async () => {
    await widget(page, 'Pages').createObject();
    //I should be focused on the title input
    const pageName = page.locator('#value.ctitle');
    await pageName.waitFor();
    await expect(pageName).toBeFocused();
    await pageName.fill('One good name');
    await expect(pageName).toHaveText('One good name');
    await page.keyboard.press('Enter');
    const content = page.locator('.editable.value').nth(1);
    await content.waitFor();
    await expect(content).toBeFocused();
    await content.fill(faker.hacker.phrase());
    await page.locator('div#button-header-share').click();
    await page.locator('div.button.black').getByText(translations.menuPublishButtonPublish).click();
});

test.afterAll(() => {});