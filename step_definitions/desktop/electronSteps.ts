import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ICustomWorld } from "../../support/world";
import { clickMenuItemById } from "electron-playwright-helpers";

Given("the application is running", async function (this: ICustomWorld) {
  // This step is handled in the hooks.ts file
});

When("I choose to sign up", async function (this: ICustomWorld) {
  this.assertUITest();
  await this.page.getByText("AuthSelectSignup").click();
});

When(
  "I select the option to create a new vault",
  async function (this: ICustomWorld) {
    this.assertUITest();
    await this.page.getByText("AuthOnboardVaultButton").click();
    await this.page.getByText("AuthOnboardPhraseSubmit").click();
  }
);

When("I complete the onboarding process", async function (this: ICustomWorld) {
  this.assertUITest();
  await this.page.click(".icon.copy");
  this.vaultKey = await this.page.evaluate(() =>
    navigator.clipboard.readText()
  );
  await this.page.getByText("commonNext").click();
  await this.page.getByPlaceholder("defaultNamePage").fill("Friedolin");
  await this.page.getByText("authOnboardSoulButton").click();
});

Then("I should be inside my vault", async function (this: ICustomWorld) {
  this.assertUITest();
  await expect(this.page.getByText("popipConfirmWelcomeButton")).toBeVisible();
});

Given("I am logged into my vault", async function (this: ICustomWorld) {
  // Implement login steps here
});

When("I navigate to settings", async function (this: ICustomWorld) {
  this.assertUITest();
  await this.electronApp?.evaluate(clickMenuItemById, "vault");
  await this.page.click("#item-settings");
});

When("I click the logout button", async function (this: ICustomWorld) {
  this.assertUITest();
  await this.page.click('div.label[data-content="popupSettingsLogout"]');
  await this.page
    .locator("#sideRight")
    .getByText("popupSettingsLogout")
    .click();
});

Then("I should be logged out", async function (this: ICustomWorld) {
  // Implement check for logged out state
});
