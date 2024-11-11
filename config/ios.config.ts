interface IOSServerConfig {
  hostname: string;
  port: number;
  path: string;
}

interface IOSCapabilities {
  platformName: string;
  "appium:automationName": string;
  "appium:deviceName": string;
  "appium:platformVersion": string;
  "appium:app": string;
  "appium:autoAcceptAlerts": boolean;
  "appium:language": string;
}

interface TestConfig {
  timeout: number;
  retries: number;
  screenshotsPath: string;
}

interface IOSConfig {
  server: IOSServerConfig;
  capabilities: IOSCapabilities;
  test: TestConfig;
}

const iosConfig: IOSConfig = {
  server: {
    hostname: process.env.APPIUM_HOST || "localhost",
    port: parseInt(process.env.APPIUM_PORT ?? "4723", 10),
    path: "/",
  },

  capabilities: {
    platformName: "iOS",
    "appium:automationName": "XCUITest",
    "appium:deviceName": process.env.IOS_DEVICE_NAME || "iPhone 16",
    "appium:platformVersion": process.env.IOS_PLATFORM_VERSION || "18.1",
    "appium:app": process.env.IOS_APP_PATH || "./cmd/Anytype.app",
    "appium:autoAcceptAlerts": true,
    "appium:language": process.env.IOS_LANGUAGE || "en",
  },

  test: {
    timeout: 30000,
    retries: 2,
    screenshotsPath: "./test-results/ios-screenshots",
  },
};

export default iosConfig;
