// testSetup.ts
import { test } from '@playwright/test';
import { setupTestContext, waitForPageLoadAfterLogin } from './helpers';
import { electronApp, page } from './globals';
import { DirectoryUtils } from '../utils/directoryUtils';

/**
 * Common setup function to be used in all test files
 * This avoids duplicating the setup code in multiple test files
 */
export const setupTest = () => {
  test.beforeAll(async () => {
    console.log('🧪 Setting up test context...');
    
    // Setup all test result directories
    DirectoryUtils.setupTestResultDirectories();
    
    await setupTestContext();
  });

  test.beforeEach(async () => {
    // Enable screenshots and videos for Electron app
    if (page) {
      // Set up screenshot and video recording for this test
      await page.context().tracing.start({ 
        screenshots: true, 
        snapshots: true,
        sources: true 
      });
    }
  });

  test.afterEach(async ({ }, testInfo) => {
    // Take screenshot on failure for Electron app
    if (testInfo.status !== testInfo.expectedStatus && page) {
      try {
        // Ensure screenshots directory exists
        DirectoryUtils.ensureDirectoryExists(DirectoryUtils.getScreenshotsDir());
        
        const screenshotPath = DirectoryUtils.getScreenshotsDir() + '/' + `${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`;
        await page.screenshot({ 
          path: screenshotPath, 
          fullPage: true 
        });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        
        // Attach screenshot to test report
        await testInfo.attach('screenshot', {
          path: screenshotPath,
          contentType: 'image/png'
        });
      } catch (error) {
        console.error('Failed to take screenshot:', error);
      }
    }
    
    // Stop tracing
    if (page) {
      await page.context().tracing.stop();
    }
  });

  test.afterAll(async() => {
    if (electronApp) {
      console.log('Closing Electron app...');
      await electronApp.close();
    } else {
      console.warn('No Electron app instance found to close');
    }
  });
};