import { BasePage } from "./basePage";

class VaultSettingsPage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }
  async navigateToVaultSettings() {
    await this.tap("accessibility id:NavigationBase/Settings");
  }

  async navigateToVaultAndAccess() {
    await this.tap(
      '-ios class chain:**/XCUIElementTypeButton[`name == "Vault and access"`]'
    );
  }

  async deleteVault() {
    await this.tap("accessibility id:Delete vault");
    await this.tap("accessibility id:Delete");
  }

  async logoutAndClearData() {
    await this.tap("accessibility id:Logout and clear data");
  }

  async performFullLogout() {
    await this.navigateToVaultAndAccess();
    await this.deleteVault();
    await this.logoutAndClearData();
  }
}

export default VaultSettingsPage;
