import { Given, Then, When } from "@cucumber/cucumber";
import { VaultSetupPage } from "../../support/page_objects/ios/vaultSetupPage";
import MySpacesPage from "../../support/page_objects/ios/mySpacesPage";
import { Logger } from "@origranot/ts-logger";
import LoginPage from "../../support/page_objects/ios/loginPage";
import { getUserDriver } from "../../support/ios/iosUtils";
import fs from 'fs';
import path from 'path';

const logger = new Logger({ name: "custom" });

Given("{string} chooses to create a new vault", async function (user: string) {
  const userDriver = getUserDriver(user);

  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.createNewVault();
});

When("{string} enters his name", async function (user: string) {
  const userDriver = getUserDriver(user);
  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.enterName(user);
});

When(
  "{string} should see his recovery key and copy it",
  async function (user: string) {
    const userDriver = getUserDriver(user);
    this.vaultSetupPage = new VaultSetupPage(userDriver);

    await this.vaultSetupPage.showMyKey();

    await userDriver.pause(1000);
    await this.vaultSetupPage.validateBufferWithSeedPhrase();
    await this.vaultSetupPage.proceedToNextStep();
  }
);

Then("{string} can enter his vault", async function (user: string) {
  const userDriver = getUserDriver(user);
  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.done();
});

Given(
  "{string} is on the first screen of ios app",
  async function (user: string) {
    const userDriver = getUserDriver(user);
    this.loginPage = new LoginPage(userDriver);
    await this.loginPage.assertFirstPageIsVisible();
  }
);

Given("{string} creates a new vault", async function (user: string) {
  const userDriver = getUserDriver(user);
  this.vaultSetupPage = new VaultSetupPage(userDriver);
  await this.vaultSetupPage.createNewVault();
  await this.vaultSetupPage.skipMyKey();
  await this.vaultSetupPage.enterName(user);
  await this.vaultSetupPage.done();
});

Given("{string} goes to home screen", async function (user: string) {
  const userDriver = getUserDriver(user);
  await userDriver.execute("mobile: pressButton", { name: "home" });
});
