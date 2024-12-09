import { Then, When } from "@cucumber/cucumber";
import { Logger } from "@origranot/ts-logger";
import VaultSettingsPage from "../../support/page_objects/ios/vaultSettingsPage";
import { getUserDriver } from "../../support/ios/iosUtils";

const logger = new Logger({ name: "custom" });

Then(
  "{string} navigates to the vault settings screen",
  async function (user: string) {
    logger.info(`STEP: ${user} navigates to the vault settings screen`);
    const userDriver = getUserDriver(user);
    this.vaultSettingsPage = new VaultSettingsPage(userDriver);
    await this.vaultSettingsPage.navigateToVaultSettings();
  }
);

When(
  "{string} selects {string} from vault settings menu",
  async function (user: string, option: string) {
    logger.info(`STEP: ${user} selects ${option} from vault settings menu`);
    const userDriver = getUserDriver(user);
    switch (option) {
      case "Vault and Access":
        this.vaultSettingsPage = new VaultSettingsPage(userDriver);
        await this.vaultSettingsPage.navigateToVaultAndAccess();
        break;
    }
  }
);

When(
  "{string} chooses to logout and and clear data",
  async function (user: string) {
    logger.info(`STEP: ${user} chooses to logout and and clear data`);
    const userDriver = getUserDriver(user);
    this.vaultSettingsPage = new VaultSettingsPage(userDriver);
    await this.vaultSettingsPage.logoutAndClearData();
  }
);

When(
  "{string} chooses to delete her vault and confirm",
  async function (user: string) {
    logger.info(`STEP: ${user} chooses to delete her vault and confirm`);
    const userDriver = getUserDriver(user);
    this.vaultSettingsPage = new VaultSettingsPage(userDriver);
    await this.vaultSettingsPage.deleteVault();
  }
);