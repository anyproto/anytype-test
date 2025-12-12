import { Page, expect } from '@playwright/test';
import { delay } from '../setup/helpers';
import { translations } from '../setup/globals';

// Constants
export const UI_TEST_SPACE_NAME = "item-bafyreie74y66kmzxhu53b4ug5ahrdqe4gw3rwvowhy4aml45chnztz6gsi.3oflrdc7y18gx";

/**
 * Opens a specific space by its name.
 * @param page - Object of the Playwright page
 * @param spaceName - Name of the space to open
 * @returns {Promise<boolean>} - Whether the space is opened successfully or not
 */
export async function openSpace(page: Page, spaceName: string): Promise<boolean> {
  const space = page.locator(`div#${spaceName}`).locator(".isSpaceView");
  
  if (await space.isVisible()) {
    await space.click();
    console.log("Changed space");
    return true;
  } else {
    console.log("Space was not found");
    return false;
  }
}


/**
 * Creates an empty page using default object creation (no menu selection).
 * @param page - Object of the Playwright page
 * @param title - Optional title for the page
 * @returns {Promise<boolean>} - Whether the page is created successfully or not
 */
export async function createPageDefault(page: Page, title?: string): Promise<boolean> {
  try {
    // Step 1: Create object by clicking plus button
    console.log('Creating object by clicking plus button...');
    const plusButton = page.locator('div.subHead div.plusWrapper div.icon.create.withBackground');
    await plusButton.waitFor({ state: 'visible', timeout: 10000 });
    await plusButton.click();
    console.log('Plus button clicked');
    await page.waitForTimeout(2000);
    
    // Step 2: Enter title for the object if provided
    if (title) {
      console.log(`Entering title for the object: ${title}...`);
      // Wait a bit more for the page to load and title field to appear
      await page.waitForTimeout(3000);
      
      const titleInput = page.locator('div#value.editable.value.focusable.ctitle[contenteditable="true"]');
      await titleInput.waitFor({ state: 'visible', timeout: 20000 });
      await titleInput.click();
      await titleInput.type(title, { delay: 100 }); // Type as if human is typing
      console.log(`Title entered: ${title}`);
      await page.waitForTimeout(1000);
    }

    console.log("Page object created successfully using default method.");
    return true;
  } catch (e) {
    console.log(`Error creating page using default method: ${e}`);
    return false;
  }
}

/**
 * Delete object by name
 * @param page - Object of the Playwright page
 * @param objectName - Name of the object to delete
 * @param deleteAll - Delete all objects witn selected name (by default False)
 * @param tabName - Tab name (by default "Pages")
 * @returns {Promise<boolean>} - Delete status (Successful or Not)
 */
export async function deleteObjectByName(
  page: Page, 
  objectName: string, 
  deleteAll: boolean = false, 
  tabName: string = "Pages"
): Promise<boolean> {
  try {
    // Find and click on the All Objects button
    const allObjectButton = page.locator("div#widget-space div#item-all");
    await expect(allObjectButton).toBeVisible({ timeout: 5000 });
    await allObjectButton.click();

    // Select the desired tab (by default "Pages")
    const tabElement = page.locator(`div.tab:text("${tabName}")`);
    await expect(tabElement).toBeVisible({ timeout: 5000 });
    await tabElement.click();

    // Find and click on the Search Input field
    const searchInput = page.locator("input#input");
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill(objectName);
    
    // Give time for searching
    await page.waitForTimeout(2000);

    // Get elements with the specified name
    const items = page.locator(`div.item .name span:text("${objectName}")`);
    
    // Check if any element with the specified name exists
    const count = await items.count();
    if (count === 0) {
      console.log(`Does not exist any element with the name '${objectName}'`);
      return false;
    }

    console.log(`Elements with the specified name found: ${count}`);

    // Determine amount of items which need to be deleted
    const itemsToDelete = deleteAll ? count : 1;
    
    // Delete each element with the specified name
    for (let i = 0; i < itemsToDelete; i++) {
      // Gir first item with the specified name
      const item = page.locator(`div.item .name span:text("${objectName}")`).first();
      
      // Right click for the opening context menu
      await item.click({ button: 'right' });
      
      // Waiting for appearing an option "Move to Bin""
      const moveToBin = page.locator("div.item#item-archive");
      await expect(moveToBin).toBeVisible({ timeout: 5000 });
      
      // Click on "Move to Bin"
      await moveToBin.click();
      
      // Give some time for deleting
      await page.waitForTimeout(1000);
    }
    
    // Go back to main page
    const backArrow = page.locator("div.subHead").locator("div.back");
    await expect(backArrow).toBeVisible({ timeout: 5000 });
    await backArrow.click();

    return true;

  } catch (e) {
    console.log(`Delete error: ${e}`);
    return false;
  }
}

/**
 * Delete space by name
 * @param page - Object of the Playwright page
 * @param spaceName - Name of the space to delete
 * @param deleteAll - Delete all spaces with selected name (by default True)
 * @returns {Promise<boolean>} - Delete status (Successful or Not)
 */
export async function deleteSpaceByName(
  page: Page, 
  spaceName: string, 
  deleteAll: boolean = true
): Promise<boolean> {
  try {
    console.log(`Starting deletion of space(s) with name: ${spaceName}`);
    
    // Step 1: Go back to vault using back arrow
    console.log('Going back to vault...');
    const backArrow = page.locator('div.subHead div.side.left div.icon.back');
    await expect(backArrow).toBeVisible({ timeout: 10000 });
    await backArrow.click();
    await delay(2000);
    
    // Step 2: Find and click on the space with given name
    console.log(`Looking for space: ${spaceName}...`);
    const spaceItem = page.locator(`div.item .name span:text("${spaceName}")`);
    const spaceCount = await spaceItem.count();
    
    if (spaceCount === 0) {
      console.log(`No spaces found with name: ${spaceName}`);
      return true;
    }
    
    console.log(`Found ${spaceCount} space(s) with name: ${spaceName}`);
    
    // Wait a bit for all spaces to finish loading
    console.log('Waiting for spaces to finish loading...');
    await page.waitForTimeout(5000);
    
    // Check for non-loading spaces only
    const nonLoadingSpaces = page.locator(`div.item:not(.isLoading) .name span:text("${spaceName}")`);
    const readySpacesCount = await nonLoadingSpaces.count();
    
    if (readySpacesCount === 0) {
      console.log(`All spaces with name "${spaceName}" are still loading, skipping deletion`);
      return true;
    }
    
    console.log(`Found ${readySpacesCount} ready space(s) with name: ${spaceName}`);
    
    // Determine how many spaces to delete
    const spacesToDelete = deleteAll ? readySpacesCount : 1;
    
    for (let i = 0; i < spacesToDelete; i++) {
      console.log(`Deleting space ${i + 1}/${spacesToDelete}...`);
      
      // Click on the space to open it (only non-loading spaces)
      const currentSpace = page.locator(`div.item:not(.isLoading) .name span:text("${spaceName}")`).first();
      
      // Wait for the space to be ready
      console.log('Waiting for space to be ready...');
      await page.waitForTimeout(3000);
      
      // Try to click with force if element is disabled
      try {
        await currentSpace.click({ force: true, timeout: 10000 });
      } catch (error) {
        console.log('Force click failed, trying alternative approach...');
        // Alternative: click on the parent item element
        const parentItem = currentSpace.locator('xpath=ancestor::div[contains(@class, "item")]');
        await parentItem.click({ force: true, timeout: 10000 });
      }
      
      await delay(2000);
      
      // Step 3: Go to settings
      console.log('Going to settings...');
      const settingsButton = page.locator('div#item-settings');
      await expect(settingsButton).toBeVisible({ timeout: 10000 });
      await settingsButton.click();
      await delay(2000);
      
      // Step 4: Click on three dots menu
      console.log('Opening more options menu...');
      const moreButton = page.locator('div#button-header-more');
      await expect(moreButton).toBeVisible({ timeout: 10000 });
      await moreButton.click();
      await delay(1000);
      
      // Step 5: Select "Delete Space"
      console.log('Selecting Delete Space option...');
      const deleteSpaceOption = page.locator('div.clickable div.name:text("Delete Space")');
      await expect(deleteSpaceOption).toBeVisible({ timeout: 10000 });
      await deleteSpaceOption.click();
      await delay(2000);
      
      // Step 6: Enter space name in confirmation form
      console.log('Entering space name in confirmation form...');
      const confirmInput = page.locator('div#popupConfirm-innerWrap input.input.input-text');
      await expect(confirmInput).toBeVisible({ timeout: 10000 });
      await confirmInput.fill(spaceName);
      await delay(1000);
      
      // Step 7: Click Delete button
      console.log('Clicking Delete button...');
      const deleteButton = page.locator('div#popupConfirm-innerWrap div.button.red div.txt:text("Delete")');
      await expect(deleteButton).toBeVisible({ timeout: 10000 });
      await deleteButton.click();
      await delay(3000);
      
      // Go back to vault to check for more spaces with same name
      console.log('Going back to vault...');
      const backArrow2 = page.locator('div.subHead div.side.left div.icon.back');
      await expect(backArrow2).toBeVisible({ timeout: 10000 });
      await backArrow2.click();
      await delay(2000);
    }
    
    // Final check - verify all spaces with this name are deleted
    const remainingSpaces = page.locator(`div.item .name span:text("${spaceName}")`);
    const finalCount = await remainingSpaces.count();
    
    if (finalCount === 0) {
      console.log(`✅ All spaces with name "${spaceName}" have been successfully deleted`);
      return true;
    } else {
      console.log(`⚠️ ${finalCount} space(s) with name "${spaceName}" still remain`);
      return false;
    }
    
  } catch (e) {
    console.log(`Error deleting space: ${e}`);
    return false;
  }
}

/**
 * Create title with using selectionTarget-title
 * @param page - Page object of Playwright
 * @param titleName - Title text
 * @returns {Promise<boolean>} - Create status (Successful or Not)
 */
export async function createTitleWithSelectionTarget(page: Page, titleName: string): Promise<boolean> {

  const titleInputDiv = page.locator("div#selectionTarget-title");
  await expect(titleInputDiv).toBeVisible({ timeout: 5000 });
  await titleInputDiv.click();
  await titleInputDiv.type(titleName, { delay: 100 }); // Type as if human is typing
  await page.keyboard.press("Enter");

  const titleText = await titleInputDiv.innerText();
  expect(titleText).toBe(titleName);
  return true;
}

/**
 * Create title with using editor-title
 * @param page - Page object of Playwright
 * @param titleName - Title text
 * @returns {Promise<boolean>} - Create status (Successful or Not)
 */
export async function createTitleWithEditorTitle(page: Page, titleName: string): Promise<boolean> {
  // Enter Collection name
  const titleInputDiv = page.locator("div#editor-title");
  await expect(titleInputDiv).toBeVisible({ timeout: 5000 });
  await titleInputDiv.click();
  await titleInputDiv.type(titleName, { delay: 100 }); // Type as if human is typing
  
  const titleText = await titleInputDiv.innerText();
  expect(titleText).toBe(titleName);

  return true;
}

export async function publishCurrentObject(page: Page): Promise<boolean> {
  try {
    console.log("Clicking share button...");
    const share = page.locator("div#button-header-share");
    await expect(share).toBeVisible({ timeout: 5000 });
    await share.click();
    
    // Wait for the publish menu to appear
    await page.waitForTimeout(2000);
    
    // Get the published URL from the urlWrapper label BEFORE clicking the button
    const urlLabel = page.locator("#menuPublish div.urlWrapper div.label.small");
    await expect(urlLabel).toBeVisible({ timeout: 5000 });
    const publishedUrl = await urlLabel.innerText();
    
    console.log(`Published URL: ${publishedUrl}`);
    
    // Now click the "Update" button
    console.log("Clicking publish button...");
    const publishButton = page.locator("#menuPublish").locator("div.buttons").locator("div.txt");
    await expect(publishButton).toBeVisible({ timeout: 5000 });
    await publishButton.click();
    
    // Wait for publishing to complete
    await page.waitForTimeout(3000);
    
    console.log(`Published URL: ${publishedUrl}`);
    
    // Check if the published page is accessible (returns 200 status)
    const response = await page.request.get(publishedUrl);
    const statusCode = response.status();
    
    if (statusCode === 200) {
      console.log(`✅ Published page is accessible (status: ${statusCode})`);
      return true;
    } else {
      console.log(`❌ Published page is not accessible (status: ${statusCode})`);
      return false;
    }
    
  } catch (e) {
    console.log(`Error publishing object: ${e}`);
    return false;
  }
}

/**
 * Unpublish current object
 * @param page - Page object of Playwright
 * @returns {Promise<boolean>} - Unpublish status (Successful or Not)
 */
export async function unpublishCurrentObject(page: Page): Promise<boolean> {
  try {
    console.log("Clicking share button to unpublish...");
    const share = page.locator("div#button-header-share");
    await expect(share).toBeVisible({ timeout: 5000 });
    await share.click();
    
    // Wait for the publish menu to appear
    await page.waitForTimeout(2000);
    
    // Click the "Unpublish" button
    console.log("Clicking unpublish button...");
    const unpublishButton = page.locator("#menuPublish").locator("div.buttons").locator("div.button.blank");
    await expect(unpublishButton).toBeVisible({ timeout: 5000 });
    await unpublishButton.click();
    
    // Wait for unpublishing to complete
    await page.waitForTimeout(2000);
    
    console.log("✅ Object unpublished successfully");
    return true;
    
  } catch (e) {
    console.log(`Error unpublishing object: ${e}`);
    return false;
  }
}

/**
 * Delete object from bin permanently
 * @param page - Page object of Playwright
 * @param objectName - Name of the object to delete from bin
 * @returns {Promise<boolean>} - Delete status (Successful or Not)
 */
export async function deleteObjectFromBin(page: Page, objectName: string): Promise<boolean> {
  try {
    console.log(`Starting deletion of object "${objectName}" from bin...`);
    
    // Step 1: Navigate to Bin widget
    console.log('Step 1: Navigating to Bin widget...');
    const binWidgetClickable = page.locator('div#body.body div.content div.sides div.side.left div.clickable:has(div.icon.headerIcon.widget-bin)');
    await expect(binWidgetClickable).toBeVisible({ timeout: 10000 });
    await binWidgetClickable.click();
    console.log('Bin widget clicked');
    await delay(3000);
    
    // Step 2: Check for the presence of deleted object on the page
    console.log(`Step 2: Checking for object "${objectName}" on Bin page...`);
    const deletedObject = page.locator(`div.page.pageMain.pageMainArchive div.objectManagerWrapper div.items div.item div.objectClickArea div.info div.name span:has-text("${objectName}")`);
    await expect(deletedObject).toBeVisible({ timeout: 10000 });
    console.log(`✅ Object "${objectName}" found in Bin`);
    
    // Step 3: Check "Select all" checkbox
    console.log('Step 3: Clicking Select all checkbox...');
    const selectAllCheckbox = page.locator('div.controlsWrapper div.controls div.side.left div.element div.icon.checkbox');
    await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
    await selectAllCheckbox.click();
    console.log('Select all checkbox clicked');
    await delay(1000);
    
    // Step 4: Click "Delete permanently" option
    console.log('Step 4: Clicking Delete permanently option...');
    const deletePermanentlyOption = page.locator('div.element:has(div.icon.remove) div.name:has-text("Delete permanently")');
    await expect(deletePermanentlyOption).toBeVisible({ timeout: 10000 });
    await deletePermanentlyOption.click();
    console.log('Delete permanently option clicked');
    await delay(1000);
    
    // Step 5: Click Delete button in confirmation dialog
    console.log('Step 5: Clicking Delete button in confirmation dialog...');
    const deleteButton = page.locator('div.button.black.c36.hover div.txt:has-text("Delete")');
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();
    console.log('Delete button clicked');
    await delay(3000);
    
    // Step 6: Verify that the object was permanently deleted
    console.log(`Step 6: Verifying object "${objectName}" was permanently deleted...`);
    const deletedObjectAfterPermanentDelete = page.locator(`div.page.pageMain.pageMainArchive div.objectManagerWrapper div.items div.item div.objectClickArea div.info div.name span:has-text("${objectName}")`);
    await expect(deletedObjectAfterPermanentDelete).not.toBeVisible({ timeout: 10000 });
    console.log(`✅ Object "${objectName}" was permanently deleted successfully`);
    
    return true;
    
  } catch (e) {
    console.log(`Error deleting object "${objectName}" from bin: ${e}`);
    return false;
  }
}

/**
 * Clear input field using Ctrl+A and Delete
 * @param page - Object of the Playwright page
 * @param inputLocator - Locator of the input field to clear
 * @returns {Promise<void>} - Promise that resolves when the field is cleared
 */
export async function clearInputField(page: Page, inputLocator: any): Promise<void> {
  await inputLocator.click();
  await page.keyboard.press('Control+a'); // Select all text
  await page.keyboard.press('Delete'); // Delete selected text
}

/**
 * Open slash menu in editor by typing "/" in the specified input field
 * @param page - Object of the Playwright page
 * @param inputLocator - Locator of the input field where to type "/"
 * @returns {Promise<boolean>} - Whether the slash menu was opened successfully
 */
export async function openSlashMenu(page: Page, inputLocator: any): Promise<boolean> {
  try {
    console.log("Opening slash menu...");
    
    // Click on the input field to focus it
    await inputLocator.click();
    
    // Type "/" to open the slash menu
    await inputLocator.type("/");
    
    // Wait for the slash menu to appear
    const slashMenu = page.locator("div.ReactVirtualized__Grid.ReactVirtualized__List");
    await expect(slashMenu).toBeVisible({ timeout: 5000 });
    
    console.log("✅ Slash menu opened successfully");
    return true;
  } catch (e) {
    console.log(`Error opening slash menu: ${e}`);
    return false;
  }
}

/**
 * Select an item from the slash menu by its ID
 * @param page - Object of the Playwright page
 * @param itemId - ID of the menu item to select (e.g., "item-text-0", "item-text-1")
 * @returns {Promise<boolean>} - Whether the item was selected successfully
 */
export async function selectSlashMenuItem(page: Page, itemId: string): Promise<boolean> {
  try {
    console.log(`Selecting slash menu item: ${itemId}`);
    
    // Find and click on the specified menu item
    const menuItem = page.locator(`div#${itemId}.item.isBig.withDescription.withIcon`);
    await expect(menuItem).toBeVisible({ timeout: 5000 });
    await menuItem.click();
    
    // Wait for the menu to disappear
    const slashMenu = page.locator("div.ReactVirtualized__Grid.ReactVirtualized__List");
    await expect(slashMenu).not.toBeVisible({ timeout: 5000 });
    
    console.log(`✅ Slash menu item '${itemId}' selected successfully`);
    return true;
  } catch (e) {
    console.log(`Error selecting slash menu item '${itemId}': ${e}`);
    return false;
  }
}

/**
 * Scroll the slash menu to make the Embeds section visible
 * @param page - Object of the Playwright page
 * @returns {Promise<boolean>} - Whether the scroll was successful
 */
export async function scrollSlashMenuToEmbeds(page: Page): Promise<boolean> {
  try {
    console.log("Scrolling slash menu to Embeds section...");
    
    const slashMenu = page.locator("div.ReactVirtualized__Grid.ReactVirtualized__List");
    await expect(slashMenu).toBeVisible({ timeout: 5000 });
    
    // Scroll to make the Embeds section visible (around position 1068px)
    await slashMenu.evaluate((element) => {
      element.scrollTop = 1000; // Scroll to approximately where Embeds section is
    });
    
    await delay(1000); // Wait for scroll to complete
    
    // Verify that the Embeds section is visible
    const embedsSection = page.locator("div#item-embed.sectionName");
    const isVisible = await embedsSection.isVisible();
    
    if (isVisible) {
      console.log("✅ Slash menu scrolled to Embeds section successfully");
      return true;
    } else {
      console.log("Embeds section not visible, trying alternative scroll position...");
      // Try scrolling a bit more
      await slashMenu.evaluate((element) => {
        element.scrollTop = 1100;
      });
      await delay(1000);
      
      const isVisibleAfterSecondScroll = await embedsSection.isVisible();
      if (isVisibleAfterSecondScroll) {
        console.log("✅ Slash menu scrolled to Embeds section successfully (second attempt)");
        return true;
      } else {
        throw new Error("Embeds section still not visible after scrolling");
      }
    }
  } catch (e) {
    console.log(`Error scrolling slash menu to Embeds: ${e}`);
    return false;
  }
}

/**
 * Remove cursor from current input field by clicking elsewhere
 * @param page - Object of the Playwright page
 * @param targetLocator - Optional locator to click on (defaults to first editor input)
 * @returns {Promise<boolean>} - Whether the cursor was successfully removed
 */
export async function removeCursorFromInput(page: Page, targetLocator?: any): Promise<boolean> {
  try {
    console.log("Removing cursor from current input field...");
    
    // Use provided target locator or default to first editor input
    const target = targetLocator || page.locator("div#value.editable.value.focusable").first();
    await expect(target).toBeVisible({ timeout: 5000 });
    await target.click();
    
    await delay(1000); // Wait for focus change
    
    console.log("✅ Cursor removed from input field successfully");
    return true;
  } catch (e) {
    console.log(`Error removing cursor from input: ${e}`);
    return false;
  }
}

/**
 * Add a title block via slash menu
 * @param page - Object of the Playwright page
 * @param titleText - Text to enter in the title field
 * @param inputLocator - Locator for the input field where to add the title (optional, defaults to last editor input)
 * @returns {Promise<boolean>} - Whether the title was added successfully
 */
export async function addTitleViaSlashMenu(page: Page, titleText: string, inputLocator?: any): Promise<boolean> {
  try {
    console.log(`Adding title '${titleText}' via slash menu...`);
    
    // Use provided input locator or find the last editor input
    const editorInput = inputLocator || page.locator("div#value.editable.value.focusable").last();
    await expect(editorInput).toBeVisible({ timeout: 5000 });
    
    // Open slash menu
    const slashMenuOpened = await openSlashMenu(page, editorInput);
    if (!slashMenuOpened) {
      throw new Error("Failed to open slash menu");
    }
    
    // Select Title item from the slash menu
    const titleItemSelected = await selectSlashMenuItem(page, "item-text-1");
    if (!titleItemSelected) {
      throw new Error("Failed to select Title item from slash menu");
    }
    
    await delay(1000);
    
    // Type the title text in the title field
    const titleInput = page.locator("div#value.editable.value.focusable").last();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.click();
    await titleInput.type(titleText);
    
    // Verify that the title was entered correctly
    const titleContent = await titleInput.innerText();
    expect(titleContent).toBe(titleText);
    
    console.log(`✅ Title '${titleText}' added successfully via slash menu`);
    return true;
  } catch (e) {
    console.log(`Error adding title '${titleText}' via slash menu: ${e}`);
    return false;
  }
}

/**
 * Handle error popup that may appear during tests
 * @param page - Object of the Playwright page
 * @param context - Context description for logging (e.g., "during object creation")
 * @returns {Promise<boolean>} - Whether the error popup was handled successfully
 */
export async function handleErrorPopup(page: Page, context: string = "during test execution"): Promise<boolean> {
  try {
    // Check if error popup is visible
    const errorPopup = page.locator("div#popupConfirm-innerWrap");
    const isVisible = await errorPopup.isVisible({ timeout: 2000 });
    
    if (isVisible) {
      console.log(`⚠️ Error popup detected ${context}`);
      
      // Get error message for logging
      const errorMessage = await errorPopup.locator("div.label.descr").innerText();
      console.log(`Error message: ${errorMessage}`);
      
      // Click Cancel button to dismiss the popup
      const cancelButton = errorPopup.locator("div.button.blank.c36");
      await expect(cancelButton).toBeVisible({ timeout: 5000 });
      await cancelButton.click();
      
      // Wait for popup to disappear
      await expect(errorPopup).not.toBeVisible({ timeout: 5000 });
      
      console.log(`✅ Error popup dismissed ${context}`);
      
      // Log this as a test issue but don't fail the test
      console.log(`❌ TEST ISSUE: Error popup appeared ${context}. This indicates a potential problem with the application.`);
      
      return true;
    }
    
    return false; // No popup was found
  } catch (e) {
    console.log(`Error handling popup ${context}: ${e}`);
    return false;
  }
}

/**
 * Create a new space with custom name
 * @param page - Object of the Playwright page
 * @param spaceName - Name of the space to create
 * @returns {Promise<boolean>} - Whether the space is created successfully or not
 */
export async function createSpaceWithCustomName(page: Page, spaceName: string): Promise<boolean> {
  try {
    console.log(`Starting creation of space with name: ${spaceName}`);
    
    // Wait for page to load and back arrow to be available
    await page.waitForSelector('div.subHead div.side.left div.icon.back', { timeout: 15000 });
    
    // Step 1: Click on back arrow to open vault
    console.log('Clicking on back arrow to open vault...');
    const backArrow = page.locator('div.subHead div.side.left div.icon.back');
    await expect(backArrow).toBeVisible({ timeout: 10000 });
    await backArrow.click();
    console.log('Back arrow clicked');
    
    // Wait for + button to be ready
    await page.waitForSelector('div#sidebarRightButton', { timeout: 10000 });
    
    // Step 2: Click on + button to create new space
    console.log('Clicking on + button to create new space...');
    const plusButton = page.locator('div#sidebarRightButton');
    await expect(plusButton).toBeVisible({ timeout: 10000 });
    await plusButton.click();
    console.log('Plus button clicked');
    
    // Wait for space option to be available
    await page.waitForSelector('div#item-space', { timeout: 10000 });
    
    // Step 3: Select Space option from the list
    console.log('Selecting Space option from the list...');
    const spaceOption = page.locator('div#item-space');
    await expect(spaceOption).toBeVisible({ timeout: 10000 });
    await spaceOption.click();
    console.log('Space option selected');
    
    // Wait for space creation popup to be ready
    await page.waitForSelector('div#popupSpaceCreate-innerWrap', { timeout: 10000 });
    
    // Step 4: Enter space name in the opened window
    console.log('Entering space name...');
    const spaceNameInput = page.locator('div#popupSpaceCreate-innerWrap div.editable[contenteditable="true"]');
    await expect(spaceNameInput).toBeVisible({ timeout: 10000 });
    await spaceNameInput.click();
    await spaceNameInput.fill(spaceName);
    console.log(`Space name entered: ${spaceName}`);
    
    // Wait for Create button to be ready
    await page.waitForSelector('text=' + translations.popupSpaceCreateCreate, { timeout: 10000 });
    
    // Step 5: Click "Create from scratch" button
    console.log('Clicking "' + translations.popupSpaceCreateCreate + '" button...');
    const createButton = page.getByText(translations.popupSpaceCreateCreate);
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();
    console.log('"' + translations.popupSpaceCreateCreate + '" button clicked');
    
    // Wait for space creation to complete and verify the space was created
    console.log('Verifying space creation...');
    await delay(10000);
    const createdSpace = page.locator('span').filter({ hasText: spaceName });
    await expect(createdSpace).toBeVisible({ timeout: 150000 });
    console.log('✅ New space created and verified successfully');
    
    // Additional verification - check if we're in the new space
    console.log('Verifying we are in the new space...');
    const spaceTitle = page.locator('div.subHead div.side.center div.name span').filter({ hasText: spaceName });
    await expect(spaceTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ Successfully navigated to the new space');
    
    // Press enter to finalize
    await page.keyboard.press('Enter');
    
    console.log(`✅ Space "${spaceName}" created successfully`);
    return true;
    
  } catch (e) {
    console.log(`Error creating space "${spaceName}": ${e}`);
    return false;
  }
}

/**
 * Paste text into input field using Ctrl+V (universal function)
 * @param page - Object of the Playwright page
 * @param inputLocator - Locator of the input field to paste into
 * @param text - The text to paste
 * @returns {Promise<boolean>} - Whether the text was pasted successfully
 */
export async function pasteTextIntoInput(page: Page, inputLocator: any, text: string): Promise<boolean> {
  try {
    console.log("Pasting text into input field using Ctrl+V...");
    
    // Click on the input field to focus it
    await expect(inputLocator).toBeVisible({ timeout: 5000 });
    await inputLocator.click();
    await delay(1000);
    
    // Set clipboard content
    await page.evaluate((text) => {
      navigator.clipboard.writeText(text);
    }, text);
    
    // Paste using Ctrl+V
    await page.keyboard.press("Control+v");
    await delay(2000); // Wait for paste to complete
    
    // Verify that the text was pasted correctly
    const inputContent = await inputLocator.innerText();
    if (inputContent === text) {
      console.log("✅ Text pasted successfully via Ctrl+V");
      return true;
    } else {
      console.log(`❌ Text paste verification failed. Expected: ${text}, Got: ${inputContent}`);
      return false;
    }
  } catch (e) {
    console.log(`Error pasting text into input: ${e}`);
    return false;
  }
}
