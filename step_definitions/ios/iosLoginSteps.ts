import { Given, Then, When } from "@cucumber/cucumber";
import { VaultSetupPage } from "../../support/page_objects/ios/vaultSetupPage";
import MySpacesPage from "../../support/page_objects/ios/mySpacesPage";
import { Logger } from "@origranot/ts-logger";
import LoginPage from "../../support/page_objects/ios/loginPage";
import { getUserDriver } from "../../support/ios/iosUtils";

const logger = new Logger({ name: "custom" });

Given("{string} chooses to create a new vault", async function (user: string) {
  logger.info(`STEP: ${user} chooses to create a new vault`);

  const userDriver = getUserDriver(user);

  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.createNewVault();
  await this.vaultSetupPage.getMyKey();
});

When("{string} enters his name", async function (user: string) {
  logger.info(`STEP: ${user} enters his name`);
  const userDriver = getUserDriver(user);
  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.enterName(user);
});

When(
  "{string} should see his recovery key and copy it",
  async function (user: string) {
    logger.info(`STEP: ${user} should see his recovery key and copy it`);
    const userDriver = getUserDriver(user);
    this.vaultSetupPage = new VaultSetupPage(userDriver);

    try {
      await this.vaultSetupPage.showMyKey();
    } catch (error: unknown) {
      logger.error(`Failed to show recovery key: ${(error as Error).message}`);
      throw new Error(
        `Failed to show recovery key: ${(error as Error).message}`
      );
    }

    try {
      await userDriver.pause(1000);
      await this.vaultSetupPage.copyKeyToClipboardAndValidate();
      await this.vaultSetupPage.proceedToNextStep();
    } catch (error: unknown) {
      logger.error(
        `Failed to handle recovery key: ${(error as Error).message}`
      );
      throw error;
    }
  }
);

Then("{string} can enter his vault", async function (user: string) {
  logger.info(`STEP: ${user} can enter his vault`);
  const userDriver = getUserDriver(user);
  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.enterVaultWithRetry();
  await this.vaultSetupPage.performSwipe(196, 87, 195, 655);
});

Given(
  "{string} is on the first screen of ios app",
  async function (user: string) {
    logger.info(`STEP: ${user} is on the first screen of ios app`);
    const userDriver = getUserDriver(user);
    this.loginPage = new LoginPage(userDriver);
    await this.loginPage.assertFirstPageIsVisible();
  }
);

Given("{string} creates a new vault", async function (user: string) {
  logger.info(`STEP: ${user} creates a new vault`);
  const userDriver = getUserDriver(user);
  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.createNewVault();
  await this.vaultSetupPage.getMyKey();
  await this.vaultSetupPage.skipMyKey();
  await this.vaultSetupPage.enterName(user);
  await this.vaultSetupPage.enterVaultWithRetry();
  await this.vaultSetupPage.performSwipe(196, 87, 195, 655);
});

Given("{string} goes to home screen", async function (user: string) {
  logger.info(`STEP: ${user} goes to home screen`);
  const userDriver = getUserDriver(user);
  await userDriver.execute("mobile: pressButton", { name: "home" });
});
