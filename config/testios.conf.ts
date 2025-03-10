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
        'appium:deviceName': process.env.DEVICE_NAME || 'iPhone 15',
        'appium:platformVersion': process.env.PLATFORM_VERSION || '17.4',
  
        // UDID of the simulator you created and booted
        'appium:udid': process.env.IPHONE_A_UDID,
  
        // Path to the .app you unzipped (for example `./Anytype Dev.app`)
        'appium:app': process.env.APP_PATH || './Anytype Dev.app',
  
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
    logLevel: 'info',
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
  