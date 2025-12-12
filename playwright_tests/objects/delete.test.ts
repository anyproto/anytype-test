import { test, expect } from '@playwright/test';
import { page, translations, storage } from '../setup/globals';
import { setupTest } from '../setup/testSetup';
import { createPageDefault, deleteObjectFromBin, deleteSpaceByName,  } from '../utils/spaceUtils';
import { waitForPageLoadAfterLogin } from '../setup/helpers';

// Setup test environment once
setupTest();
test("01_Delete object from bin", async () => {

    console.log('Starting delete object from bin test...');
    
    // Wait for page to be fully loaded and synced after login
    await waitForPageLoadAfterLogin(60000);
    
    // Step 1: Create object with title using widget utility
    console.log('Step 1: Creating object with title using widget utility...');
    const pageCreated = await createPageDefault(page, 'Test bin object');
    console.log('Object created with title: Test bin object');
    await page.waitForTimeout(2000);
    
    // Step 2: Click on 3 dots and select "Move to Bin"
    console.log('Step 2: Clicking on 3 dots and selecting Move to Bin...');
    const threeDotsButton = page.locator('div#button-header-more.icon.more.withBackground');
    await expect(threeDotsButton).toBeVisible({ timeout: 10000 });
    await threeDotsButton.click();
    console.log('Three dots button clicked');
    await page.waitForTimeout(1000);
    
    // Select "Move to Bin" option using translations
    const moveToBinOption = page.locator(`div.clickable:has(div.icon.remove.iconMain) div.name:has-text("${translations.commonMoveToBin}")`);
    await expect(moveToBinOption).toBeVisible({ timeout: 10000 });
    await moveToBinOption.click();
    console.log(`${translations.commonMoveToBin} option selected`);
    await page.waitForTimeout(2000);
    
    // Step 3: Check for notification using translations
    console.log('Step 3: Checking for notification...');
    const objectCount = '1 Object'; 
    const notification = page.locator(`text="${translations.toastMovedToBin.replace('%s', objectCount)}"`);
    await expect(notification).toBeVisible({ timeout: 10000 });
    console.log(`✅ Notification "${translations.toastMovedToBin.replace('%s', objectCount)}" appeared`);
    
    // Step 4: Check if Bin widget was created in the widget panel
    console.log('Step 4: Checking if Bin widget was created...');
    const binWidget = page.locator('div#body.body div.content div.sides div.side.left div.clickable div.icon.headerIcon.widget-bin');
    await expect(binWidget).toBeVisible({ timeout: 10000 });
    console.log('✅ Bin widget created successfully');
    
    // Additional check for Bin widget name using translations
    const binWidgetName = page.locator(`div#body.body div.content div.sides div.side.left div.clickable div.name span:has-text("${translations.commonBin}")`);
    await expect(binWidgetName).toBeVisible({ timeout: 10000 });
    console.log(`✅ ${translations.commonBin} widget name verified`);
    
    // Step 5: Delete object from bin using utility function
    console.log('Step 5: Deleting object from bin using utility function...');
    const deleteResult = await deleteObjectFromBin(page, 'Test bin object');
    if (deleteResult) {
      console.log('✅ Object deleted from bin successfully');
    } else {
      console.log('❌ Failed to delete object from bin');
      throw new Error('Failed to delete object from bin');
    }
    
    // Final timeout
    await page.waitForTimeout(5000);
    console.log('✅ Test completed successfully');
});

test("02_Delete space with custom name", async () => {
    console.log('Starting delete space test...');
    // Wait for page to be fully loaded and synced after login
    await waitForPageLoadAfterLogin(60000);
    
    // Use test data from storage
    const spaceName = storage["testSpaceName"];
    
    // Delete the space using the utility function
    console.log('Deleting space...');
    const deleteResult = await deleteSpaceByName(page, spaceName, true);
    
    if (deleteResult) {
        console.log('✅ Space deleted successfully');
    } else {
        console.log('⚠️ Space deletion failed');
        throw new Error(`Failed to delete space "${spaceName}"`);
    }
});
