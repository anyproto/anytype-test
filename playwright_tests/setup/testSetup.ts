// testSetup.ts
import { test } from '@playwright/test';
import { setupTestContext } from './helpers';
import { electronApp } from './globals';

/**
 * Common setup function to be used in all test files
 * This avoids duplicating the setup code in multiple test files
 */
export const setupTest = () => {
  test.beforeAll(async () => {
    console.log('🧪 Setting up test context...');
    await setupTestContext();
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