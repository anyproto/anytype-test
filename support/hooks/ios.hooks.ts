import { browser } from "@wdio/globals";
import { AfterStep, After, BeforeStep, Before, ITestStepHookParameter, ITestCaseHookParameter } from "@cucumber/cucumber";
import { Logger } from "@origranot/ts-logger";
import fs from 'fs';
import { driver } from "@wdio/globals";

const logger = new Logger({ name: "custom" });

function getUniqueDirectoryName(baseDir: string): string {
  let counter = 1;
  let dirName = baseDir;
  
  while (fs.existsSync(dirName)) {
    dirName = `${baseDir}-${counter}`;
    counter++;
  }
  
  return dirName;
}
BeforeStep(async function (step: ITestStepHookParameter) {
  if (step.pickle.steps[0].id == step.pickleStep.id) {
    logger.info('='.repeat(30));
    logger.info(`SCENARIO: ${step.pickle.name}, tags: ${step.pickle.tags.map(tag => tag.name).join(", ")}`);
  }
  // logger.info(`Executing step: ${step.pickleStep.text}`);
  logger.info(`STEP: ${(step.pickleStep as any).keyword} ${step.pickleStep.text}`);
});

AfterStep(async function (step: ITestStepHookParameter) {
  if (step.result?.status === "FAILED") {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-').replace(/\..+/, '');
    const baseDir = `./results/failed/${timestamp}-${step.pickleStep.text}`.replace(/['"]/g, '');;
    const screenshotsDir = getUniqueDirectoryName(baseDir);
    
    fs.mkdirSync(screenshotsDir, { recursive: true });

    // Save screenshots and pageSource for all simulators
    const instances = driver.instances || ['default'];
    for (const simulatorName of instances) {
      try {
        const simulator = driver[simulatorName];
        const capabilities = await simulator.capabilities;
        const simulatorInfo = `${simulatorName}-${capabilities.deviceName}-${capabilities.platformVersion}`;

        await simulator.saveScreenshot(`${screenshotsDir}/image-${simulatorInfo}.png`);
        const pageSource = await simulator.getPageSource();
        fs.writeFileSync(`${screenshotsDir}/pageSource-${simulatorInfo}.xml`, pageSource, 'utf-8');
        logger.info(`Data saved for ${simulatorInfo}`);
      } catch (error) {
        logger.error(`Failed to save data for simulator ${simulatorName}:`, error);
      }
    }
    logger.info(`All data saved in: ${screenshotsDir}`);
  }
});
