import { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './desktop.base.config';

/**
 * Production configuration with sequential test execution
 * Uses projects with dependencies to ensure proper test order
 */
const config: PlaywrightTestConfig = {
  ...baseConfig,
  
  // Projects with dependencies for sequential execution
  projects: [
    // Stage 1: Authentication (runs first)
    {
      name: 'authentication',
      testMatch: /.*preparation.*\.test\.ts/,
      dependencies: [],
    },
    
    // Stage 2: Object creation (depends on authentication)
    {
      name: 'object-creation',
      testMatch: /.*create.*\.test\.ts/,
      dependencies: ['authentication'],
    },
    
    // Stage 3: Object search (depends on creation)
    {
      name: 'object-search',
      testMatch: /.*search.*\.test\.ts/,
      dependencies: ['object-creation'],
    },
    
    // Stage 4: Object deletion (depends on creation)
    {
      name: 'object-deletion',
      testMatch: /.*delete.*\.test\.ts/,
      dependencies: ['object-creation'],
    },
  ],
};

export default config;
