import { Logger } from "@origranot/ts-logger";
import { driver } from "@wdio/globals";

const logger = new Logger({
  name: "custom",
});
export class BasePage {
  protected userDriver: WebdriverIO.Browser;

  constructor(userDriver: WebdriverIO.Browser) {
    this.userDriver = userDriver;
  }

  async tap(selector: string) {
    const element = this.userDriver.$(selector);
    await element.click();
  }

  async proceedToNextStep() {
    await this.tap("accessibility id:Next");
  }

  async performSwipe(
    startXPercentage: number = 50, // Default to middle of screen
    startYPercentage: number = 20, // Default to near top
    endXPercentage: number = 50, // Default to middle of screen
    endYPercentage: number = 80, // Default to near bottom
    duration: number = 1000 // Swipe duration in ms
  ) {
    // Get screen dimensions
    const { width, height } = await this.userDriver.getWindowRect();

    // Convert percentages to actual coordinates
    const startX = Math.floor(width * (startXPercentage / 100));
    const startY = Math.floor(height * (startYPercentage / 100));
    const endX = Math.floor(width * (endXPercentage / 100));
    const endY = Math.floor(height * (endYPercentage / 100));

    try {
      await this.userDriver
        .action("pointer")
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration, x: endX, y: endY })
        .up({ button: 0 })
        .perform();

      // Small pause after swipe to let animations complete
      await this.userDriver.pause(500);
    } catch (error) {
      throw new Error(`Failed to perform swipe: ${error.message}`);
    }
  }

  async verifyElementDisplayed(
    selector: string,
    elementDescription: string,
    timeout: number = 5000
  ) {
    logger.info(`Checking for ${elementDescription}`);
    try {
      const element = this.userDriver.$(selector);
      await element.waitForDisplayed({ timeout });
      const isDisplayed = await element.isDisplayed();

      if (!isDisplayed) {
        logger.error(`${elementDescription} not displayed`);
        throw new Error(`${elementDescription} is not displayed`);
      }
      logger.info(`${elementDescription} displayed successfully`);
    } catch (error: unknown) {
      logger.error(
        `Failed to find ${elementDescription}: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async verifyElementNotDisplayed(
    selector: string,
    elementDescription: string,
    timeout: number = 5000
  ) {
    logger.info(`Checking that ${elementDescription} is not displayed`);
    try {
      const element = this.userDriver.$(selector);

      // Wait for element to not be displayed or to not exist
      await element.waitForDisplayed({
        timeout,
        reverse: true, // This makes it wait for element to NOT be displayed
      });

      logger.info(`Verified ${elementDescription} is not displayed`);
    } catch (error: unknown) {
      logger.error(
        `Expected element to not be displayed, but failed: ${
          (error as Error).message
        }`
      );
      throw error;
    }
  }

  async enterTextInField(text: string, selector: string) {
    const textField = this.userDriver.$(selector);
    await textField.waitForExist({ timeout: 5000 });
    await textField.clearValue();
    await textField.setValue(text);
  }

  async logPageSource() {
    const pageSource = await this.userDriver.getPageSource();
    logger.info(pageSource);
  }
}
