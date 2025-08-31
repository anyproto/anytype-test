import { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './desktop.base.config';

/**
 * Debug configuration for running individual tests without dependencies
 * Use this config for debugging and development
 */
const config: PlaywrightTestConfig = {
  ...baseConfig,
  retries: 0, // No retries for debugging
  
  // No projects - run all tests without any grouping or dependencies
};

export default config;
