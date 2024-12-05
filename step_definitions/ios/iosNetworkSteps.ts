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
      logger.info("Network is set to staging");
      //   const configPath = path.resolve(process.cwd(), "config.yml");
      //   const deviceUdid = getDeviceUdidForUser(user);
      //   const appGroupId = "group.io.anytype.app";
      //   const appBundleId = "io.anytype.app.dev";

      //   try {
      //     const sharedContainerPath = execSync(
      //       `xcrun simctl get_app_container ${deviceUdid} ${appBundleId} ${appGroupId}`
      //     )
      //       .toString()
      //       .trim();
      //     console.log(`Config Path: ${configPath}`);
      //     const fileContent = fs.readFileSync(configPath, { encoding: "base64" });
      //     // Desired location on the simulator
      //     const remotePath = `${sharedContainerPath}/Documents/config.yml`;
      //     await userDriver.pushFile(remotePath, fileContent);
      try {
        await this.loginPage.chooseSelfHostedNetwork();
        await this.loginPage.uploadConfigFile();
      } catch (error) {
        logger.error(`Failed to set network: ${error}`);
      }
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
