import dotenv from 'dotenv';
import path from 'path';

// Debug: Print paths
console.log('Current working directory:', process.cwd());
console.log('Env export path:', path.resolve(process.cwd(), '.env.export'));

// Load environment variables in order
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.export'), override: true });

// Debug: Print environment variable
console.log('IPHONE_MODEL_A:', process.env.IPHONE_MODEL_A);

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    
    // Where your spec files are located
    specs: ["../features/ios/*.feature"],
    exclude: [],
  
    // ==================
    // Capabilities
    // ==================
    maxInstances: 1, // Just one device
    capabilities: [
      {
        // iOS-only
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
  
        // Name + version should match what you created with `xcrun simctl create`
        'appium:deviceName': process.env.IPHONE_MODEL_A,
        'appium:platformVersion': process.env.IOS_VERSION,
  
        // UDID of the simulator you created and booted
        'appium:udid': process.env.USER_A_IOS_UUID,
  
        // Path to the .app you unzipped (for example `./Anytype Dev.app`)
        'appium:app': process.env.IOS_APP_PATH,
  
        // Misc. extras
        'appium:autoAcceptAlerts': true,
        'appium:showXcodeLog': true,
        'appium:newCommandTimeout': 300,
      },
    ],
  
    //
    // ===========
    // WebdriverIO
    // ===========
    logLevel: 'debug',
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
  
    // If XCUITest/WDA is slow, you might raise this:
    connectionRetryTimeout: 180000, // 3 min
  
    // ==============
    // Appium Service
    // ==============
    // This starts the Appium server so you don't have to do `appium &`
    // services: [
    //   [
    //     'appium',
    //     {
    //       command: 'appium',
    //       args: {
    //         address: 'localhost',
    //         port: 4723,
    //         relaxedSecurity: true,
    //         // For fresh sessions each run
    //         'session-override': true,
    //       },
    //     },
    //   ],
    // ],
    services: [
        [
          "appium",
          {
            args: {
              address: "localhost",
              port: 4723,
              relaxedSecurity: true,
              "base-path": "",
              "allow-insecure": ["adb_shell"],
              "session-override": true,
            },
            command: "appium",
            logPath: "./",
          },
        ],
        // [TimelineService],
      ],
    //
    // ============
    // Test Framework
    // ============
    framework: 'cucumber',
    cucumberOpts: {
      require: ['./features/step_definitions/**/*.js'],
      timeout: 60000,
      ignoreUndefinedDefinitions: true,
      strict: false,
    },
  
    //
    // =====
    // Hooks
    // =====
    // (Omit hooks if you just want a minimal config)
  };
  