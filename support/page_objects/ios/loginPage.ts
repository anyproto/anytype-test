import { BasePage } from "./basePage";

class LoginPage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }

  async assertFirstPageIsVisible() {
    await this.verifyElementDisplayed(
      "accessibility id:NavigationBase/Settings",
      "Settings button"
    );
    await this.verifyElementDisplayed(
      "accessibility id:I am new here",
      "I am new here button"
    );
  }

  async changeNetworkSettings() {
    await this.tap("accessibility id:NavigationBase/Settings");
  }

  async chooseSelfHostedNetwork() {
    await this.tap("accessibility id:Add Self-hosted Network");
  }

  async uploadConfigFile() {
    await this.tap(
      '-ios class chain:**/XCUIElementTypeCell[`name == "config, yml"`]/XCUIElementTypeOther[2]/XCUIElementTypeOther[1]/XCUIElementTypeImage'
    );
  }
}

export default LoginPage;
