import { Page } from '@playwright/test';

export function widget(page: Page, widgetName: string) {
    const widgetLocator = page.locator(
      `.widget:has(.name span:has-text("${widgetName}"))`
    );
    
    return {
      async create() {
        await widgetLocator.locator('.iconWrap.create').click();
      },
      async more() {
        await widgetLocator.locator('.iconWrap.more').click();
      },
  
      // Raw locators:
      createButton: widgetLocator.locator('.iconWrap.create'),
      moreButton:   widgetLocator.locator('.iconWrap.more'),
    };
  }
