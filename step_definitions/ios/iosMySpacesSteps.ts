import { Then, When } from "@cucumber/cucumber";
import MySpacesPage from "../../support/page_objects/ios/mySpacesPage";

Then(
  "I see {string} in my spaces list",
  async function (spaceNameElement: string) {
    await this.mySpacesPage.checkSpacesExist(spaceNameElement);
  }
);

Then(
  "I see {string} and {string} in my spaces list",
  async function (firstSpace: string, secondSpace: string) {
    await this.mySpacesPage.checkSpacesExist(firstSpace, secondSpace);
  }
);

When("I create a new space named {string}", async function (name: string) {
  this.mySpacesPage = new MySpacesPage(this.driver);
  await this.mySpacesPage.createNewItem();
  await this.mySpacesPage.typeItemTitle(name);
  await this.mySpacesPage.createItem();
  //if I see collaborate on spaces, then I complete item creation
  if (await this.mySpacesPage.isCollaborateOnSpacesBannerVisible()) {
    await this.mySpacesPage.completeItemCreation();
  }
});
