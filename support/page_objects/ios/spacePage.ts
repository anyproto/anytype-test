import { BasePage } from "./basePage";
import { Browser } from "webdriverio";

class SpacePage extends BasePage {
  constructor(driver: Browser) {
    super(driver);
  }

  async navigateBack() {
    const backButton = this.driver.$("accessibility id:x32/Island/back");
    await backButton.click();
  }

  async checkSpaceName(expectedName: string) {
    try {
      const spaceNameElement = await this.driver.$(
        `-ios predicate string:label == "${expectedName}"`
      );
      const isDisplayed = await spaceNameElement.isDisplayed();

      if (!isDisplayed) {
        throw new Error(`Space name "${expectedName}" is not displayed`);
      }
    } catch (error: unknown) {
      throw new Error(
        `Failed to find space name "${expectedName}": ${
          (error as Error).message
        }`
      );
    }
  }
}

export default SpacePage;
