import { Browser } from "webdriverio";

export class BasePage {
  constructor(protected driver: Browser) {}

  async tap(selector: string) {
    const element = this.driver.$(selector);
    await element.click();
  }

  async proceedToNextStep() {
    await this.tap("accessibility id:Next");
  }

  async typeOnKeyboardAndSend(text: string) {
    for (const char of text) {
      await this.tap(`accessibility id:${char}`);
    }
    await this.tap("accessibility id:Return");
  }

  async performSwipe(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    await this.driver
      .action("pointer")
      .move({ duration: 0, x: startX, y: startY })
      .down({ button: 0 })
      .move({ duration: 1000, x: endX, y: endY })
      .up({ button: 0 })
      .perform();
  }
}
