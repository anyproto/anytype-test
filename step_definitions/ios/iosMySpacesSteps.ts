import { Then, When } from "@cucumber/cucumber";
import MySpacesPage from "../../support/page_objects/ios/mySpacesPage";
import SpaceTypePage from "../../support/page_objects/ios/spaceTypePage";
import { Logger } from "@origranot/ts-logger";
import SpacePage from "../../support/page_objects/ios/spacePage";
import { getUserDriver } from "../../support/ios/iosUtils";

const logger = new Logger({ name: "custom" });

Then(
  "{string} sees {string} in his spaces list",
  async function (user: string, spaceNameElement: string) {
    const userDriver = getUserDriver(user);
    this.mySpacesPage = new MySpacesPage(userDriver);
    await this.mySpacesPage.checkSpacesExist(spaceNameElement);
  }
);

Then(
  "{string} sees {string} and {string} in his spaces list",
  async function (user: string, firstSpace: string, secondSpace: string) {
    const userDriver = getUserDriver(user);
    this.mySpacesPage = new MySpacesPage(userDriver);
    await this.mySpacesPage.checkSpacesExist(firstSpace, secondSpace);
  }
);

When(
  "{string} creates a new space named {string}",
  async function (user: string, name: string) {
    const userDriver = getUserDriver(user);
    this.mySpacesPage = new MySpacesPage(userDriver);
    const spaceTypePage = await this.mySpacesPage.createNewItem();
    const spaceCreatePage = await spaceTypePage.createDataType();
    
    await spaceCreatePage.typeItemTitle(name);
    await spaceCreatePage.createItem();
    //if I see collaborate on spaces, then I complete item creation
    if (await this.mySpacesPage.isCollaborateOnSpacesBannerVisible()) {
      await this.mySpacesPage.completeItemCreation();
    }
  }
);

Then(
  "{string} is in {string} space",
  async function (user: string, spaceName: string) {
    const userDriver = getUserDriver(user);
    this.spacePage = new SpacePage(userDriver);
    const widgetsElement = userDriver.$("accessibility id:x32/Widgets");
    if (await widgetsElement.isExisting()) {
      await widgetsElement.click();
    }
    // Check for the first letter of space name as static text
    const firstLetter = spaceName.charAt(0);
    const letterElement = userDriver.$(
      `-ios class chain:**/XCUIElementTypeStaticText[\`label == "${firstLetter}"\`][2]`
    );
    await userDriver.waitUntil(async () => await letterElement.isDisplayed(), {
      timeout: 5000,
      interval: 500,
      timeoutMsg: `Second occurrence of letter "${firstLetter}" of space "${spaceName}" not found`,
    });
  }
);

Then("{string} can tap navigate back button", async function (user: string) {
  const userDriver = getUserDriver(user);
  this.spacePage = new SpacePage(userDriver);
  await this.spacePage.navigateBack();
});

When(
  "{string} can access {string} space in the Anytype app",
  async function (user: string, spaceName: string) {
    const userDriver = getUserDriver(user);
    this.mySpacesPage = new MySpacesPage(userDriver);
    //wait for 12 seconds to make sure the space is loaded
    await userDriver.pause(12000);
    await this.mySpacesPage.checkSpacesExist(spaceName);
    await this.mySpacesPage.openSpace(spaceName);
  }
);
