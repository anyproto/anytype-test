import { driver } from "@wdio/globals";
import { BasePage } from "./basePage";
import SpaceCreatePage from "./spaceCreatePage";

class SpaceTypePage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }
  
  async createDataType() {
    await this.tap("accessibility id:Space");
    return new SpaceCreatePage(this.userDriver);
  }
}

export default SpaceTypePage;
