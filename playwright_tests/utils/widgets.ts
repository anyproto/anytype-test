import { Page } from '@playwright/test';

/**
 * Creates a widget controller for interacting with a specific widget on the page
 * @param page - Playwright Page object
 * @param widgetName - The exact name of the widget as displayed in the UI
 * @returns {Object} Widget controller with methods and locators
 * @example
 * const myWidget = widget(page, 'My Widget');
 * await myWidget.createObject(); // Creates a new object in the widget
 * await myWidget.more(); // Opens the more menu
 */
export function widget(page: Page, widgetName: string) {
    const widgetLocator = page.locator(
      `.widget:has(.name span:has-text("${widgetName}"))`
    );
    
    return {
      async createDefaultObject(title?: string) {
        // Step 1: Create object by clicking plus button
        console.log('Creating object by clicking plus button...');
        const plusButton = page.locator('div.icon.plus.withBackground');
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
      },
  
      // Raw locators:
      createButton: widgetLocator.locator('.iconWrap.create'),
      moreButton:   widgetLocator.locator('.iconWrap.more'),
    };
  }
