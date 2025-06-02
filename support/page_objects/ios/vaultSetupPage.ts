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
    await this.tap("accessibility id:I am new here");
  }

  async showMyKey() {
    await this.tap("accessibility id:Tap to Reveal");
  }

  async skipMyKey() {
    await this.tap("accessibility id:Not now");
  }

  async done() {
    await this.tap("accessibility id:Done");
  }

  async validateBufferWithSeedPhrase() {
    // Get the mnemonic displayed in the UI
    const mnemonicElement = this.userDriver.$("XCUIElementTypeTextView");
    const displayedMnemonic = await mnemonicElement.getAttribute("value");

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
