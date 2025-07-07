import dotenv from 'dotenv';
import path, { format } from 'path';

// Load environment variables in order
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.export'), override: true });

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    
    // Where your spec files are located
    specs: ["../features/ios/*.feature"],
    exclude: [],
    // reporters: ['spec'],
    // reporters: [],
    // ==================
    // Capabilities
    // ==================
    maxInstances: 1, // Just one device

    capabilities: {
      UserA: {
        capabilities: {
          platformName: "iOS",
          "appium:automationName": "XCUITest",
          "appium:deviceName": process.env.IPHONE_MODEL_A,
          "appium:platformVersion": process.env.IOS_VERSION,
          "appium:app": process.env.IOS_APP_PATH,
          "appium:autoAcceptAlerts": true,
          'appium:connectHardwareKeyboard': false,
          "appium:language": process.env.IOS_LANGUAGE,
          "appium:udid": process.env.USER_A_IOS_UUID,
          "appium:wdaLocalPort": 8100,
          "appium:simpleIsVisibleCheck": true,
          'appium:useNewWDA': true,
          'appium:usePrebuiltWDA': false,
          "appium:showXcodeLog": true,
          'appium:newCommandTimeout': 300,
          'appium:wdaStartupRetries': 2,
          'appium:wdaLaunchTimeout': 60000,
          'appium:wdaConnectionTimeout': 60000
        }
      },
      UserB: {
        capabilities: {
          platformName: "iOS",
          "appium:automationName": "XCUITest",
          "appium:deviceName": process.env.IPHONE_MODEL_B,
          "appium:platformVersion": process.env.IOS_VERSION,
          "appium:app": process.env.IOS_APP_PATH,
          "appium:autoAcceptAlerts": true,
          'appium:connectHardwareKeyboard': false,
          "appium:language": process.env.IOS_LANGUAGE,
          "appium:udid": process.env.USER_B_IOS_UUID,
          "appium:wdaLocalPort": 8101,
          "appium:simpleIsVisibleCheck": true,
          'appium:useNewWDA': true,
          'appium:usePrebuiltWDA': false,
          "appium:showXcodeLog": true,
          'appium:newCommandTimeout': 300,
          'appium:wdaStartupRetries': 2,
          'appium:wdaLaunchTimeout': 60000,
          'appium:wdaConnectionTimeout': 60000
        }
      }
    },
  
    //
    // ===========
    // WebdriverIO
    // ===========
    logLevel: 'error',
    // logLevel: 'debug',
    // logLevels: {
    //   webdriver: "trace",
    //   webdriverio: "trace",
    //   "@wdio/local-runner": "trace",
    //   "@wdio/cli": "debug",
    //   appium: "trace",
    //   custom: "info",
    //   "@wdio/cucumber-framework": "debug",
    //   "@wdio/appium-service": "trace",
    // },
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
  
    // If XCUITest/WDA is slow, you might raise this:
    connectionRetryTimeout: 180000, // 3 min
  
    // ==============
    // Appium Service
    // ==============
    // This starts the Appium server so you don't have to do `appium &`
    services: [
      [
        'appium',
        {
          address: 'localhost',
          port: 4723,
          relaxedSecurity: true
         },
      ],
    ],
    // ============
    // Test Framework
    // ============
    framework: 'cucumber',
    cucumberOpts: {
      require: [
        './step_definitions/ios/*.ts',
        './support/hooks/ios.hooks.ts'
      ],
      timeout: 60000,
      ignoreUndefinedDefinitions: true,
      strict: false,
      format: ['pretty'],
      // configFile: "./cucumber.cjs",
    },
  
    //
    // =====
    // Hooks
    // =====
    // (Omit hooks if you just want a minimal config)
  };
  