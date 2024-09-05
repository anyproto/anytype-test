import { Given, When, Then } from "@cucumber/cucumber";
import { ElectronApplication, Page, _electron as electron } from "playwright";
import { expect } from "@playwright/test";
import {
  clickMenuItemById,
  parseElectronApp,
} from "electron-playwright-helpers";

let electronApp: ElectronApplication;
let page: Page;
const storage: { [key: string]: string } = {};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Given("the application is running", async function () {
  if (electronApp && page) {
    console.log("The application is already running.");
    return;
  }

  const electronAppPath =
    process.env.ELECTRON_APP_PATH ||
    "/Users/shamray/workspace/anytype/anytype-ts/dist/mac-arm64/Anytype.app";
  const appInfo = parseElectronApp(electronAppPath);
  process.env.CI = "e2e";
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });

  electronApp.on("window", async (page) => {
    const filename = page.url()?.split("/").pop();
    console.log(`Window opened: ${filename}`);

    page.on("pageerror", (error) => {
      console.error(error);
    });
    page.on("console", (msg) => {
      console.log(msg.text());
    });
  });

  page = await electronApp.firstWindow();
});

When("I choose to sign up", async function () {
  await page.getByText("AuthSelectSignup").click();
});

When("I select the option to create a new vault", async function () {
  await page.getByText("AuthOnboardVaultButton").click();
  await page.getByText("AuthOnboardPhraseSubmit").click();
});

When("I complete the onboarding process", async function () {
  await page.click(".icon.copy");
  const copiedText = await page.evaluate(() => {
    return navigator.clipboard.readText();
  });
  storage["vaultKey"] = copiedText;
  console.log("Copied text:", storage["vaultKey"]);
  page.getByText("toast copy");
  await delay(1000);
  await page.getByText("commonNext").click();
  await page.getByPlaceholder("defaultNamePage").fill("Friedolin");
  await delay(1000);
  await page.keyboard.press("Enter");
});

Then("I should be inside my vault", async function () {
  await page.getByText("popupConfirmWelcomeButton").click();
});

Given("I am logged into my vault", async function () {
  // Assuming we're already logged in from the previous scenario
});

When("I navigate to settings", async function () {
  await delay(2000);
  await clickMenuItemById(electronApp, "vault");
  await page.click("#item-settings");
});

When("I click the logout button", async function () {
  await page.click('div.label[data-content="popupSettingsLogout"]');
  await page.locator("#sideRight").getByText("popupSettingsLogout").click();
});

Then("I should be logged out", async function () {
  // Add an assertion to verify the user is logged out
});

Given("I am on the login page", async function () {
  await delay(2000);
  await page.getByText("authSelectLogin").click();
});

When("I enter my vault key", async function () {
  await page.locator(".phraseInnerWrapper").click();
  await page.locator("#entry").type(storage["vaultKey"]);
  await page.keyboard.press("Space");
});

When("I submit the login form", async function () {
  await page.getByText("authLoginSubmit").click();
});

Then("I should be logged into my vault", async function () {
  await page.locator("#path").getByText("Homepage");
});

When("I create a new Personal Project space", async function () {
  await delay(2000);
  await clickMenuItemById(electronApp, "newSpace");
  await page.locator("#select-select-usecase").click();
  await page.getByText("usecase2Title", { exact: true }).click();
  await page.getByText("commonCreate", { exact: true }).click();
});

Then("I should see the new space created", async function () {
  await expect(page).toHaveTitle(/.*usecase2Title*/);
});

When("I enter an invalid vault key", async function () {
  await page.locator(".phraseInnerWrapper").click();
  await page
    .locator("#entry")
    .type(storage["vaultKey"].split("").reverse().join(""));
  await page.keyboard.press("Space");
});

Then("I should see an error message", async function () {
  const errorElement = page.locator("div.error.animation");
  await expect(errorElement).toHaveText("pageAuthLoginInvalidPhrase");
});
