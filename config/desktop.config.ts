import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

/**
 * TODO: remove `defaultAppPath` and rely fully on an environment variable in the future.
 */
const DEFAULT_APP_PATH = '/Users/shamray/workspace/anytype/anytype-ts';
const APP_DIRECTORY = process.env.ANYTYPE_APP_DIR || DEFAULT_APP_PATH;
const CONFIG_PATH = process.env.CONFIG_PATH || './config.yml';

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

// Create a temporary directory in the project root
const TMP_DIR = path.join(__dirname, '..', 'tmp');
console.log('Checking if TMP_DIR exists:', TMP_DIR);
if (!fs.existsSync(TMP_DIR)) {
  console.log('Creating TMP_DIR...');
  fs.mkdirSync(TMP_DIR);
}

const randomDirName = crypto.randomBytes(8).toString('hex');
console.log('Generated random directory name:', randomDirName);
const testDataPath = path.join(TMP_DIR, randomDirName);
console.log('Attempting to create directory at:', testDataPath);
fs.mkdirSync(testDataPath);
console.log('Successfully created test data directory');

// Store the new test data path in an environment variable
process.env.DATA_PATH = testDataPath;

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
