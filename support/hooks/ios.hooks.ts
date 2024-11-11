import { Before, After, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { remote, Browser } from "webdriverio";
import iosConfig from "../../config/ios.config";
import { ICustomWorld } from "../world";

let driver: Browser;

BeforeAll(async function () {
  driver = await remote({
    ...iosConfig.server,
    capabilities: iosConfig.capabilities,
  });
});

Before(async function (this: ICustomWorld) {
  this.driver = driver;
});

After(async function (this: ICustomWorld) {
  if (this.result?.status === "failed") {
    await driver.saveScreenshot(
      `${iosConfig.test.screenshotsPath}/failure-${Date.now()}.png`
    );
  }
});

AfterAll(async function () {
  if (driver) {
    await driver.deleteSession();
  }
});
