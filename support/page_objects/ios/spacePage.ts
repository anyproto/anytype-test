import { browser, driver } from "@wdio/globals";
import { BasePage } from "./basePage";
import { Logger } from "@origranot/ts-logger";

const logger = new Logger({ name: "custom" });

class SpacePage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }

  async navigateBack() {
    logger.info("Navigating back using back button");
    const backButton = this.userDriver.$("accessibility id:x32/Island/back");
    await backButton.click();
  }

  async tapSpaceName(spaceName: string) {
    // logger.info(`Tapping space name: ${name}`);
    // await this.tap(`accessibility id:${name}`);
    logger.info(`Tapping space initials: ${spaceName}`);
    const firstLetter = spaceName.charAt(0);
    const letterElement = this.userDriver.$(
      `-ios class chain:**/XCUIElementTypeStaticText[\`label == "${firstLetter}"\`][2]`
    );
    await letterElement.click();
  }

  async selectShare() {
    logger.info("Selecting Share option");
    await this.tap("accessibility id:Share");
  }

  async selectManage() {
    logger.info("Selecting Manage option");
    await this.tap("accessibility id:Manage");
  }

  async generateInviteLink() {
    logger.info("Generating invite link");
    const generateInviteLinkButton = this.userDriver.$(
      "accessibility id:Generate invite link"
    );
    await generateInviteLinkButton.click();
  }

  async checkInviteLinkGenerated() {
    logger.info("Checking if invite link is generated");
    try {
      const inviteLinkElement = this.userDriver.$(
        '-ios class chain:**/XCUIElementTypeButton[`name BEGINSWITH "https://invite.any.coop/"`]'
      );
      await this.userDriver.waitUntil(
        async () => await inviteLinkElement.isDisplayed(),
        {
          timeout: 30000,
          interval: 500,
          timeoutMsg: "Invite link was not generated within 30 seconds",
        }
      );
      logger.info("Invite link successfully generated");
    } catch (error) {
      logger.error(
        `Failed to generate invite link: ${(error as Error).message}`
      );
      await this.userDriver.saveScreenshot(
        `./results/screenshots/invite-link-not-generated-${new Date().getTime()}.png`
      );
      throw error;
    }
  }

  async copyInviteLink(): Promise<string> {
    logger.info("Copying invite link to clipboard");
    const inviteLinkButton = this.userDriver.$(
      '-ios class chain:**/XCUIElementTypeButton[`name BEGINSWITH "https://invite.any.coop/"`]'
    );
    await inviteLinkButton.click();

    const clipboardContentBase64 = await this.userDriver.getClipboard();
    const clipboardContent = Buffer.from(
      clipboardContentBase64,
      "base64"
    ).toString("utf-8");

    if (!clipboardContent.startsWith("https://invite.any.coop/")) {
      logger.error("Invalid invite link format in clipboard");
      throw new Error("Invite link was not properly copied to clipboard");
    }

    logger.info(`Successfully copied invite link: ${clipboardContent}`);
    return clipboardContent;
  }

  async sendRequestToJoin() {
    logger.info("Sending request to join");
    console.log("Sending request to join with console.log");
    await this.tap("accessibility id:Request to join");
  }

  async selectDone() {
    logger.info("Selecting Done");
    await this.tap("accessibility id:Done");
  }

  async checkRequestToJoinConfirmationPopup() {
    await this.verifyElementDisplayed(
      "accessibility id:Request sent",
      "Request sent confirmation"
    );
  }

  async assertUserIsInSpaceSharingMenu(user: string) {
    await this.verifyElementDisplayed(
      `accessibility id:Sharing`,
      `Space sharing menu`
    );
  }

  async checkUserInSpaceSharingMenu(user: string) {
    await this.verifyElementDisplayed(
      `accessibility id:${user}`,
      `${user} in space sharing menu`
    );
  }

  async checkUserNameNotOnTheScreen(user: string) {
    await this.verifyElementNotDisplayed(
      `accessibility id:${user}`,
      `${user} not on the screen`
    );
  }

  async approveJoinRequest(requester: string, rights: string) {
    const rightsLower = rights.toLowerCase();
    logger.info(
      `Approving join request of ${requester} with ${rightsLower} rights`
    );

    // Add retry logic for View request button
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      await this.tap("accessibility id:View request");

      try {
        // Wait a short moment to let UI update
        await this.userDriver.pause(1000);

        // Check if button is still visible
        const viewRequestButton = await this.userDriver.$(
          "accessibility id:View request"
        );
        const isStillVisible = await viewRequestButton.isDisplayed();

        if (!isStillVisible) {
          break; // Button is gone, we can proceed
        }

        logger.warn(
          `View request button still visible after tap attempt ${i + 1}`
        );
        if (i === maxRetries - 1) {
          throw new Error(
            "Failed to dismiss View request button after multiple attempts"
          );
        }
      } catch (error) {
        if ((error as Error).message.includes("no such element")) {
          break; // Button is gone, we can proceed
        }
        throw error; // Re-throw other errors
      }
    }

    await this.tap(`accessibility id:Add as ${rightsLower}`);
  }

  async declineJoinRequest(requester: string) {
    logger.info(`Declining join request of ${requester}`);
    await this.tap(`accessibility id:Reject`);
  }

  async checkSpaceName(expectedName: string) {
    await this.verifyElementDisplayed(
      `-ios predicate string:label == "${expectedName}"`,
      `Space name "${expectedName}"`
    );
  }
}

export default SpacePage;
