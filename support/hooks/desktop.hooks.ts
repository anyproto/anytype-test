import { Before, After, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { _electron as electron, ElectronApplication } from "playwright";
import { parseElectronApp } from "electron-playwright-helpers";
import { ICustomWorld } from "../world";

let electronApp: ElectronApplication;

BeforeAll(async function () {
  const electronAppPath = process.env.ELECTRON_APP_PATH || "/path/to/your/app";
  const appInfo = parseElectronApp(electronAppPath);
  process.env.CI = "e2e";

  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
});

Before(async function (this: ICustomWorld) {
  this.electronApp = electronApp;
  this.page = await electronApp.firstWindow();
});

After(async function () {
  // Clean up UI-specific resources if needed
});

AfterAll(async function () {
  await electronApp.close();
});
