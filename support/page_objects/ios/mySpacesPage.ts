import { driver } from "@wdio/globals";
import { BasePage } from "./basePage";

class MySpacesPage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }

  async typeItemTitle(title: string) {
    await this.enterTextInField(title, "accessibility id:Untitled");
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
      const element = this.userDriver.$(selector);
      await element.waitForDisplayed({ timeout: 5000 });
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async checkSpacesExist(...spaceNames: string[]) {
    for (const spaceName of spaceNames) {
      const selector = `//XCUIElementTypeButton[contains(@name, '${spaceName}')]`;
      try {
        await this.userDriver.$(selector).waitForExist({ timeout: 5000 });
      } catch (error) {
        throw new Error(`Space "${spaceName}" does not exist`);
      }
    }
  }

  async openSpace(spaceName: string) {
    const selector = `//XCUIElementTypeButton[contains(@name, '${spaceName}')]`;
    await this.userDriver.$(selector).click();
  }
}

export default MySpacesPage;
