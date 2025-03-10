import { browser, driver } from "@wdio/globals";
import type { Browser } from "webdriverio";
import { join } from "path";
import fs from "fs";
import { spawn } from "child_process";
import { promisify } from "util";
import { exec as exec } from "child_process";
import { TimelineService } from "wdio-timeline-reporter";
import { remote } from "webdriverio";

// Add this at the top of the file to store FFmpeg processes
const ffmpegProcesses: { [key: string]: any } = {};

export const config: WebdriverIO.Config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO supports running e2e tests as well as unit and component tests.
  runner: "local",
  tsConfigPath: "./tsconfig.json",
  port: 4723,
  path: "/",
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // of the configuration file being run.
  //
  // The specs are defined as an array of spec files (optionally using wildcards
  // that will be expanded). The test for each spec file will be run in a separate
  // worker process. In order to have a group of spec files run in the same worker
  // process simply enclose them in an array within the specs array.
  //
  // The path of the spec files will be resolved relative from the directory of
  // of the config file unless it's absolute.
  //
  specs: ["../features/ios/*.feature"],
  // Patterns to exclude.
  exclude: [
    "../features/api/*.feature"
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://saucelabs.com/platform/platform-configurator
  //
  /*  capabilities: [
    {
      // capabilities for local Appium web tests on iOS
      platformName: "iOS",
      "appium:automationName": "XCUITest",
      "appium:deviceName": process.env.IOS_DEVICE_NAME || "iPhone 16",
      "appium:platformVersion": process.env.IOS_PLATFORM_VERSION || "18.0",
      "appium:app":
        process.env.IOS_APP_PATH ||
        "/Users/shamray/Library/Developer/Xcode/DerivedData/Anytype-evciqepohadcddcqdidnlrlktwqf/Build/Products/Debug-iphonesimulator/Anytype.app",
      "appium:autoAcceptAlerts": true,
      "appium:language": process.env.IOS_LANGUAGE || "en",
    },
  ], */
  capabilities: {
    UserA: {
      capabilities: {
        platformName: "iOS",
        "appium:automationName": "XCUITest",
        "appium:deviceName": "iPhone 15",
        "appium:platformVersion": "17.4",
        "appium:app": './Anytype Dev.app',
        "appium:autoAcceptAlerts": true,
        "appium:language": process.env.IOS_LANGUAGE || "en",
        "appium:udid": process.env.IPHONE_A_UDID || "E448B4C9-48F4-467B-AE1D-5D440A6760C5",
        "appium:wdaLocalPort": 8100,
        "appium:realDeviceScreenshotter": true,
        "appium:simpleIsVisibleCheck": true,
        "appium:showXcodeLog": true,
        'appium:newCommandTimeout': 300,
        'appium:connectionTimeout': 180000
      },
    },
    UserB: {
      capabilities: {
        platformName: "iOS",
        "appium:automationName": "XCUITest",
        "appium:deviceName": "iPhone 15 Pro",
        "appium:platformVersion": "17.4",
        "appium:app": './Anytype Dev.app',
        "appium:autoAcceptAlerts": true,
        "appium:language": process.env.IOS_LANGUAGE || "en",
        "appium:udid": process.env.IPHONE_B_UDID || "CF76C796-DB3A-4A51-B52F-340201F8D980",
        "appium:wdaLocalPort": 8101,
        "appium:realDeviceScreenshotter": true,
        "appium:simpleIsVisibleCheck": true,
        "appium:showXcodeLog": true,
        'appium:newCommandTimeout': 300,
        'appium:connectionTimeout': 180000
      },
    },
  },

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevels: {
    webdriver: "debug",
    webdriverio: "debug",
    "@wdio/local-runner": "debug",
    "@wdio/cli": "debug",
    appium: "debug",
    custom: "info",
    "@wdio/cucumber-framework": "debug",
    "@wdio/appium-service": "debug",
  },
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/appium-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  // baseUrl: 'http://localhost:8080',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 200000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
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

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "cucumber",

  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  // reporters: ['dot'],
  reporters: [["timeline", { outputDir: "./test-results/timeline" }]],

  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    // <string[]> (file/dir) require files before executing features
    require: ["./step_definitions/ios/*.ts"],
    // <boolean> show full backtrace for errors
    backtrace: true,
    // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    requireModule: [],
    // <boolean> invoke formatters without executing steps
    dryRun: false,
    // <boolean> abort the run on first failure
    failFast: false,
    // <string[]> Only execute the scenarios with name matching the expression (repeatable).
    name: [],
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <boolean> fail if there are any undefined or pending steps
    strict: true,
    // <string> (expression) only execute the features or scenarios with tags matching the expression
    tagExpression: "",
    // <number> timeout for step definitions
    timeout: 60000,
    // <boolean> Enable this config to treat undefined definitions as warnings.
    ignoreUndefinedDefinitions: true,
    retry: 0,
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed before a worker process is spawned and can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  // beforeSession: function (config, capabilities, specs, cid) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  // before: async function (capabilities) {
  // },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Cucumber Hooks
   *
   * Runs before a Cucumber Feature.
   * @param {string}                   uri      path to feature file
   * @param {GherkinDocument.IFeature} feature  Cucumber feature object
   */
  // beforeFeature: function (uri, feature) {
  // },
  /**
   *
   * Runs before a Cucumber Scenario.
   * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
   * @param {object}                 context  Cucumber World object
   */
  beforeScenario: async function (world, context) {
    await driver.reloadSession();
    // Log the scenario name and any tags
    console.log('\n' + '='.repeat(80));
    console.log(`RUNNING SCENARIO: ${world.pickle.name}`);
    if (world.pickle.tags && world.pickle.tags.length > 0) {
      console.log(`TAGS: ${world.pickle.tags.map(tag => tag.name).join(', ')}`);
    }
    console.log('='.repeat(80) + '\n');
  },
  // beforeScenario: async function (scenario) {
  //   await driver.reloadSession();

  //   try {
  //     const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
  //     const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, "_");

  //     // Get the current driver's UDID and user identifier
  //     const udid = driver.capabilities["appium:udid"];
  //     const userIdentifier = driver.capabilities["appium:deviceName"].includes(
  //       "User A"
  //     )
  //       ? "UserA"
  //       : "UserB";

  //     // Create video directory if it doesn't exist
  //     const videoDir = join(process.cwd(), "test-results", "videos");
  //     if (!fs.existsSync(videoDir)) {
  //       fs.mkdirSync(videoDir, { recursive: true });
  //     }

  //     const videoPath = join(
  //       videoDir,
  //       `${userIdentifier}_${scenarioName}_${timestamp}.mp4`
  //     );

  //     // Get simulator window ID using osascript
  //     const getSimWindowCmd = `osascript -e 'tell application "Simulator" to id of window 1 where name contains "${udid}"'`;
  //     const simWindowId = (await exec(getSimWindowCmd)).stdout.trim();

  //     // Start FFmpeg recording for this simulator
  //     const ffmpegCmd = spawn("ffmpeg", [
  //       "-f",
  //       "avfoundation",
  //       "-i",
  //       `${simWindowId}:none`,
  //       "-r",
  //       "30",
  //       "-vcodec",
  //       "h264",
  //       "-preset",
  //       "ultrafast",
  //       "-pix_fmt",
  //       "yuv420p",
  //       videoPath,
  //     ]);

  //     // Store the FFmpeg process reference with the UDID as key
  //     ffmpegProcesses[udid] = {
  //       process: ffmpegCmd,
  //       videoPath: videoPath,
  //     };

  //     // Log any FFmpeg errors
  //     ffmpegCmd.stderr.on("data", (data) => {
  //       console.log(`FFmpeg stderr for ${userIdentifier}: ${data}`);
  //     });
  //   } catch (error) {
  //     console.log(`Failed to start FFmpeg recording for simulator: ${error}`);
  //   }
  // },
  /**
   *
   * Runs before a Cucumber Step.
   * @param {Pickle.IPickleStep} step             step data
   * @param {IPickle}            scenario         scenario pickle
   * @param {object}             context          Cucumber World object
   */
  // beforeStep: function (step, scenario, context) {
  // },
  /**
   * Runs after a Cucumber Step.
   * @param {Pickle.IPickleStep} step             step data
   * @param {IPickle}            scenario         scenario pickle
   * @param {object}             result           results object containing scenario results
   * @param {boolean}            result.passed    true if scenario has passed
   * @param {string}             result.error     error stack if scenario failed
   * @param {number}             result.duration  duration of scenario in milliseconds
   * @param {object}             context          Cucumber World object
   */
  // afterStep: async function (step, scenario, result) {
  //   if (!result.passed) {
  //     // Take a screenshot if the step fails
  //     const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
  //     const screenshotPath = `./screenshots/failed-${step}-${timestamp}.png`;
  //     await browser.saveScreenshot(screenshotPath);
  //   }
  // },
  /**
   *
   * Runs after a Cucumber Scenario.
   * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
   * @param {object}                 result           results object containing scenario results
   * @param {boolean}                result.passed    true if scenario has passed
   * @param {string}                 result.error     error stack if scenario failed
   * @param {number}                 result.duration  duration of scenario in milliseconds
   * @param {object}                 context          Cucumber World object
   */
  // afterScenario: async function (world, result) {
  //   try {
  //     // Store capabilities before the session ends
  //     const capabilities = driver.capabilities;

  //     // Check if capabilities exist before proceeding
  //     if (capabilities) {
  //       const udid = capabilities["appium:udid"];

  //       // Only proceed with FFmpeg cleanup if we have a valid UDID
  //       if (udid && ffmpegProcesses[udid]) {
  //         // Stop FFmpeg recording for this simulator
  //         ffmpegProcesses[udid].process.kill("SIGTERM");

  //         await new Promise((resolve) => {
  //           ffmpegProcesses[udid].process.on("close", () => {
  //             resolve(true);
  //           });
  //         });

  //         // Handle failed test video renaming
  //         if (!result.passed) {
  //           const videoPath = ffmpegProcesses[udid].videoPath;
  //           const failedVideoPath = videoPath.replace(".mp4", "_FAILED.mp4");
  //           if (fs.existsSync(videoPath)) {
  //             fs.renameSync(videoPath, failedVideoPath);
  //           }
  //         }

  //         delete ffmpegProcesses[udid];
  //       }

  //       // Take screenshot on failure if session is still active
  //       if (!result.passed && (await driver.sessionId)) {
  //         const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
  //         const userIdentifier = capabilities["appium:deviceName"].includes(
  //           "User A"
  //         )
  //           ? "UserA"
  //           : "UserB";
  //         const screenshotPath = `./screenshots/${userIdentifier}_failed_${timestamp}.png`;
  //         try {
  //           await browser.saveScreenshot(screenshotPath);
  //         } catch (screenshotError) {
  //           console.log("Failed to save screenshot:", screenshotError);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error handling test artifacts:", error);
  //   }
  // },
  /**
   *
   * Runs after a Cucumber Feature.
   * @param {string}                   uri      path to feature file
   * @param {GherkinDocument.IFeature} feature  Cucumber feature object
   */
  // afterFeature: function (uri, feature) {
  // },

  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  // onComplete: function(exitCode, config, capabilities, results) {
  // },
  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
  // onReload: function(oldSessionId, newSessionId) {
  // }
  /**
   * Hook that gets executed before a WebdriverIO assertion happens.
   * @param {object} params information about the assertion to be executed
   */
  // beforeAssertion: function(params) {
  // }
  /**
   * Hook that gets executed after a WebdriverIO assertion happened.
   * @param {object} params information about the assertion that was executed, including its results
   */
  // afterAssertion: function(params) {
  // },
  onPrepare: function () {
    const fs = require("fs");
    if (!fs.existsSync("./screenshots")) {
      fs.mkdirSync("./screenshots");
    }
  },
};
