import { BasePage } from "./basePage";
import { Browser } from "webdriverio";

class MySpacesPage extends BasePage {
  constructor(driver: Browser) {
    super(driver);
  }

  async typeItemTitle(title: string) {
    await this.tap("accessibility id:Untitled");
    for (let char of title) {
      await this.tap(`accessibility id:${char}`);
    }
  }

  async createItem() {
    await this.tap("accessibility id:Create");
  }

  async completeItemCreation() {
    await this.proceedToNextStep();
    await this.proceedToNextStep();
    await this.tap("accessibility id:Done");
  }

  async proceedToNextStep() {
    await this.tap("accessibility id:Next");
  }

  async createNewItem() {
    await this.tap("accessibility id:x32/Plus");
  }

  async navigateToSettings() {
    await this.tap("accessibility id:NavigationBase/Settings");
  }
  async isCollaborateOnSpacesBannerVisible() {
    const selector =
      '//XCUIElementTypeStaticText[@name="Collaborate on spaces"]';
    try {
      return await this.driver.$(selector).isDisplayed();
    } catch (error) {
      return false;
    }
  }
  async checkSpacesExist(...spaceNames: string[]) {
    for (const spaceName of spaceNames) {
      const selector = `//XCUIElementTypeButton[contains(@name, '${spaceName}')]`;
      try {
        await this.driver.$(selector).waitForExist({ timeout: 5000 });
      } catch (error) {
        throw new Error(`Space "${spaceName}" does not exist`);
      }
    }
  }
}

export default MySpacesPage;
