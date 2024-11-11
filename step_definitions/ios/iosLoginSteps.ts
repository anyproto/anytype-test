import { Given, Then, When } from "@cucumber/cucumber";

import apiHelpers from "../../support/helpers/apiHelpers";
import { LoginScreen } from "../../support/page_objects/ios/login_screen";
import { VaultSetupPage } from "../../support/page_objects/ios/vaultSetupPage";
import SpacePage from "../../support/page_objects/ios/spacePage";
import MySpacesPage from "../../support/page_objects/ios/mySpacesPage";

// Helper function to validate VaultSetupPage
function validateVaultSetupPage(
  vaultSetupPage: VaultSetupPage | undefined
): asserts vaultSetupPage is VaultSetupPage {
  if (!vaultSetupPage) {
    throw new Error(
      "VaultSetupPage not initialized. Make sure 'I create a new vault' step runs first"
    );
  }
}

Given("I have a test account with data", async function () {
  const account = await apiHelpers.createTestAccount();
  await apiHelpers.populateAccountData(account);
  this.testAccount = account;
});

When("I log in to the iOS app", async function () {
  await LoginScreen.login(this.testAccount.email, this.testAccount.password);
});

When("I create a new vault", async function () {
  this.vaultSetupPage = new VaultSetupPage(this.driver);
  await this.vaultSetupPage.createNewVault();
  await this.vaultSetupPage.getMyKey();
});

When("I enter my name", async function () {
  validateVaultSetupPage(this.vaultSetupPage);
  await this.vaultSetupPage.enterName("Friedolin");
});

When("I should see my recovery key and copy it", async function () {
  validateVaultSetupPage(this.vaultSetupPage);
  await this.vaultSetupPage.copyKeyToClipboardAndValidate();
  await this.vaultSetupPage.proceedToNextStep();
});

Then("I can enter my vault", async function () {
  validateVaultSetupPage(this.vaultSetupPage);
  await this.vaultSetupPage.enterVaultWithRetry();
  await this.vaultSetupPage.performSwipe(196, 87, 195, 655);
});
