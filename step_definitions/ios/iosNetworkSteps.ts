import { When } from "@cucumber/cucumber";
import { Logger } from "@origranot/ts-logger";
import {
  getDeviceUdidForUser,
  getUserDriver,
} from "../../support/ios/iosUtils";
import LoginPage from "../../support/page_objects/ios/loginPage";
import { execSync } from "child_process";
import path from "path";
import * as fs from "fs";

const logger = new Logger({ name: "custom" });

When(
  "{string} sets network to {string}",
  async function (user: string, networkName: string) {
    logger.info(`STEP: ${user} sets network to ${networkName}`);
    const userDriver = getUserDriver(user);
    this.loginPage = new LoginPage(userDriver);
    await this.loginPage.changeNetworkSettings();
    if (networkName === "staging") {
      logger.info("Reading newtwork config for staging");
      const configPath = path.resolve(process.cwd(), "config.yml");
      const baseConfig = ("anytype://networkConfig?config=") + fs.readFileSync(configPath, { encoding: "base64" });
      logger.info("Using deeplink");
      await userDriver.url(baseConfig);
    } else {
      logger.info(
        "Only staging network is availiable for this step. Other options are not implemented yet"
      );
    }
    await userDriver.pause(1000);
    await this.loginPage.performSwipe(50, 20, 50, 80);
    if (!(await this.loginPage.assertFirstPageIsVisible())) {
      await this.loginPage.performSwipe(50, 20, 50, 80);
    }
  }
);
