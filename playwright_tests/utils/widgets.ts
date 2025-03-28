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
      async createObject() {
        await widgetLocator.hover();
        await widgetLocator.locator('.iconWrap.create').click();
      },
      async more() {
        await widgetLocator.hover();
        await widgetLocator.locator('.iconWrap.more').click();
      },
  
      // Raw locators:
      createButton: widgetLocator.locator('.iconWrap.create'),
      moreButton:   widgetLocator.locator('.iconWrap.more'),
    };
  }
