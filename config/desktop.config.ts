import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

/**
 * TODO: remove `defaultAppPath` and rely fully on an environment variable in the future.
 */
const APP_DIRECTORY = process.env.ANYTYPE_APP_DIR;
const CONFIG_PATH = process.env.CONFIG_PATH || './myDocker.yml';

if (!APP_DIRECTORY) {
  throw new Error('ANYTYPE_APP_DIR environment variable is not defined. This is required for running e2e tests.');
}

function getSystemSpecificPath(): string {
  const system = process.env.SYSTEM_TYPE?.toUpperCase() || 'MAC-ARM';

  const paths: Record<string, string> = {
    'MAC-INTEL': 'dist/mac/Anytype.app',
    'MAC': 'dist/mac-arm64/Anytype.app',
    'MAC-ARM': 'dist/mac-arm64/Anytype.app',
    'LINUX': 'dist/linux-unpacked',
    'WINDOWS': 'dist/win-unpacked',
  };

  return paths[system] || paths['MAC-ARM'];
}

/**
 * Centralized path configurations used throughout the tests.
 */
export const PATHS = {
  ELECTRON_APP: path.join(APP_DIRECTORY, getSystemSpecificPath()),
  LANG_FILES: path.join(APP_DIRECTORY, 'dist/lib/json/lang/en-US.json'),
  STAGING_CONFIG: CONFIG_PATH,
} as const;

/**
 * Log debug information for sanity checks.
 */
function logDebugInfo(): void {
  console.log('=== Debug Info ===');
  console.log('App Directory:', APP_DIRECTORY);
  console.log('System Type:', process.env.SYSTEM_TYPE);
  console.log('Electron App Path:', PATHS.ELECTRON_APP);
  console.log('Language Files Path:', PATHS.LANG_FILES);
  console.log('Test Data Path:', process.env.DATA_PATH);
  console.log('================');
}

// Debug logs
logDebugInfo();

// Set environment variables for use in tests
process.env.ELECTRON_APP_PATH = PATHS.ELECTRON_APP;
process.env.LANG_FILES_PATH = PATHS.LANG_FILES;;
process.env.ANY_SYNC_NETWORK = PATHS.STAGING_CONFIG;

/**
 * Playwright test configuration
 */
const config: PlaywrightTestConfig = {
  testDir: '../playwright_tests',
  maxFailures: 2,
  timeout: 5 * 60 * 10000,
  workers: 1,
  reporter: [
    ['html', { outputFolder: '../test-results' }],
    ['list'],
  ],
  use: {
    trace: 'on-first-retry',
  },
};

export default config;
