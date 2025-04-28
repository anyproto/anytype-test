import { Page, expect } from '@playwright/test';

// Constants
export const UI_TEST_SPACE_NAME = "item-bafyreidnfmx5dbw337vvjct3fzf7e2zphjlmlvhisids2625kfpykp5xje";

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
 * Creates an empty page.
 * @param page - Object of the Playwright page
 * @returns {Promise<boolean>} - Whether the page is created successfully or not
 */
export async function createPage(page: Page): Promise<boolean> {
  const createButton = page.locator("div.plusWrapper").locator("div.plus");
  
  if (await createButton.isVisible()) {
    await createButton.click();
    console.log("Create object button clicked successfully.");
  } else {
    console.log("Create object button not found.");
    return false;  // Finish test if the button is not visible
  }

  // Wait page react to clicking
  await page.waitForTimeout(1000);
  return true;
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
    const allObjectButton = page.locator("div#item-all");
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
    const backArrow = page.locator("div.titleWrap").locator("div.back");
    await expect(backArrow).toBeVisible({ timeout: 5000 });
    await backArrow.click();

    return true;

  } catch (e) {
    console.log(`Delete error: ${e}`);
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
  // Enter title name for Bookmark object
  const titleInputDiv = page.locator("div#selectionTarget-title");
  await expect(titleInputDiv).toBeVisible({ timeout: 5000 });
  await titleInputDiv.click();
  await page.keyboard.type(titleName);
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
  await titleInputDiv.evaluate((el, name) => { el.innerText = name; }, titleName);
  
  const titleText = await titleInputDiv.innerText();
  expect(titleText).toBe(titleName);

  return true;
}