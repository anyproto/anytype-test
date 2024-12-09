import * as bip39 from "bip39";
import { BasePage } from "./basePage";
import { browser, driver } from "@wdio/globals";
import { ConsoleTransport, Logger } from "@origranot/ts-logger";

const logger = new Logger({
  name: "custom",
});

export class VaultSetupPage extends BasePage {
  constructor(userDriver: WebdriverIO.Browser) {
    super(userDriver);
  }

  async createNewVault() {
    await this.tap("accessibility id:New Vault");
  }

  async getMyKey() {
    await this.tap("accessibility id:Get my Key");
  }

  async showMyKey() {
    logger.info("Testing logger inside async function");
    await this.tap("accessibility id:Show my Key");
  }

  async skipMyKey() {
    await this.tap("accessibility id:Skip");
  }

  async copyKeyToClipboardAndValidate() {
    // Get the mnemonic displayed in the UI
    const mnemonicElement = this.userDriver.$("XCUIElementTypeTextView");
    const displayedMnemonic = await mnemonicElement.getAttribute("value");

    // Tap the "Copy to clipboard" button
    await this.tap("accessibility id:Copy to clipboard");

    // Get clipboard content and decode from base64
    const clipboardContentBase64 = await this.userDriver.getClipboard();
    const clipboardContent = Buffer.from(
      clipboardContentBase64,
      "base64"
    ).toString("utf-8");

    logger.info("Clipboard content: " + clipboardContent);
    logger.info("Displayed mnemonic: " + displayedMnemonic);

    // Normalize spaces in both clipboard content and displayed mnemonic
    const normalizedClipboardContent = clipboardContent
      .trim()
      .replace(/\s+/g, " ");
    const normalizedDisplayedMnemonic = displayedMnemonic
      .trim()
      .replace(/\s+/g, " ");

    // Check if the normalized clipboard content matches the normalized displayed mnemonic
    if (normalizedClipboardContent !== normalizedDisplayedMnemonic) {
      throw new Error(
        "Clipboard content does not match the displayed mnemonic"
      );
    }

    // Check if the clipboard content is a 12-word mnemonic
    const words = normalizedClipboardContent.split(" ");
    if (words.length !== 12) {
      throw new Error(
        `Expected 12 words in mnemonic, but found ${words.length}`
      );
    }

    // Check if all words are valid BIP39 words
    const invalidWords = words.filter(
      (word) => !bip39.wordlists.english.includes(word)
    );
    if (invalidWords.length > 0) {
      throw new Error(`Invalid BIP39 words found: ${invalidWords.join(", ")}`);
    }

    // Verify the entire mnemonic
    if (!bip39.validateMnemonic(clipboardContent)) {
      throw new Error("Invalid mnemonic: failed BIP39 validation");
    }
  }

  async enterVault() {
    await this.tap("accessibility id:Enter my Vault");
  }

  async enterName(name: string) {
    await this.enterTextInField(name, "XCUIElementTypeTextField");
  }

  async enterVaultWithRetry(maxRetries = 3, retryDelay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.enterVault();

        // Check if we're still on the vault setup page
        const isStillOnSetupPage = await this.isSetYourNamePageVisible();

        if (!isStillOnSetupPage) {
          logger.info("Successfully entered the vault");
          return; // Exit the method if we've successfully entered the vault
        }

        logger.info(`Attempt ${attempt}: Still on setup page, retrying...`);

        // If we're still on the setup page, we need to try entering the vault again
        if (attempt < maxRetries) {
          await this.userDriver.pause(retryDelay); // Wait before retrying
        }
      } catch (error) {
        logger.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw error; // Rethrow the error if we've exhausted all retries
        }
        await this.userDriver.pause(retryDelay); // Wait before retrying
      }
    }
    throw new Error("Failed to enter vault after maximum retries");
  }

  async isSetYourNamePageVisible() {
    try {
      await this.userDriver
        .$("~Enter my Vault")
        .waitForExist({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
