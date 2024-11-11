import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { ElectronApplication, Page } from "playwright";
import { store, storeType } from "./helpers/store";
import { Browser } from "webdriverio";
import { VaultSetupPage } from "../support/page_objects/ios/vaultSetupPage";
import MySpacesPage from "./page_objects/ios/mySpacesPage";

export interface ICustomWorld extends World {
  driver: Browser;
  result: any;
  store: storeType;
  page?: Page;
  electronApp?: ElectronApplication;
  clearStore: () => void;
  assertUITest: () => asserts this is ICustomWorld & { page: Page };
  vaultKey: string;
  vaultSetupPage?: VaultSetupPage;
  mySpacePage?: MySpacesPage;
}

export class CustomWorld extends World implements ICustomWorld {
  store: storeType;
  page?: Page;
  electronApp?: ElectronApplication;
  vaultKey = "";
  vaultSetupPage?: VaultSetupPage;
  constructor(options: IWorldOptions) {
    super(options);
    this.store = store;
  }
  driver: any;
  result: any;
  mySpacePage?: MySpacesPage;
  assertUITest(): asserts this is ICustomWorld & { page: Page } {
    if (!this.page) {
      throw new Error(
        "This step requires a UI test environment with a page object"
      );
    }
  }

  clearStore() {
    this.store.clear();
  }
  //add more methods here to interact with the store or manage state
}

setWorldConstructor(CustomWorld);
