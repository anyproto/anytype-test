import { browser } from "@wdio/globals";
import { AfterStep } from "@cucumber/cucumber";

AfterStep(async function (stepResult: { result: { status: string } }) {
  // Check if the step has failed
  if (stepResult.result.status === "failed") {
    // Generate a timestamp for the screenshot filename
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const screenshotPath = `./screenshots/failed-${timestamp}.png`;

    // Capture the screenshot
    await browser.saveScreenshot(screenshotPath);

    console.log(`Screenshot saved: ${screenshotPath}`);
  }
});
