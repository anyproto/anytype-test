import { BasePage } from "./basePage";

class ChatPage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }

  async sendMessage(message: string) {
    await this.enterTextInField(message, "class name:XCUIElementTypeTextView");
    await this.tap("accessibility id:Chat/SendMessage/active");
  }

  async checkMessageInChat(message: string) {
    const messageElement = this.userDriver.$(`accessibility id:${message}`);
    await messageElement.waitForExist();
    const isVisible = await messageElement.isDisplayed();
    if (!isVisible) {
      throw new Error(`Message "${message}" exists but is not visible`);
    }
  }

  async tapChat() {
    await this.tap("accessibility id:x32/Chat");
  }
}

export default ChatPage;
