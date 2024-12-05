import { Given, Then, When } from "@wdio/cucumber-framework";
import { browser } from "@wdio/globals";
import { getUserDriver } from "../../support/ios/iosUtils";
import SpacePage from "../../support/page_objects/ios/spacePage";
import { Logger } from "@origranot/ts-logger";
import LinkStorage from "../../support/ios/linkStorage";
import ChatPage from "../../support/page_objects/ios/chatPage";

const logger = new Logger({ name: "custom" });

Given(
  "{string} navigates to the {string} space settings screen",
  async function (user: string, spaceName: string) {
    logger.info(
      `STEP: ${user} navigates to the "${spaceName}" space settings screen`
    );
    const userDriver = getUserDriver(user);
    this.spacePage = new SpacePage(userDriver);
    await this.spacePage.tapSpaceName(spaceName);
  }
);

Given(
  "{string} selects {string} from space settings menu",
  async function (user: string, option: string) {
    logger.info(`STEP: ${user} selects "${option}" from space settings menu`);
    const userDriver = getUserDriver(user);
    this.spacePage = new SpacePage(userDriver);
    switch (option) {
      case "Share":
        await this.spacePage.selectShare();
        break;
      case "Manage":
        await this.spacePage.selectManage();
        break;
      default:
        throw new Error(`Unknown option: ${option}`);
    }
  }
);

Given("{string} selects Generate Invite Link", async function (user: string) {
  logger.info(`STEP: ${user} selects Generate Invite Link`);
  const userDriver = getUserDriver(user);
  this.spacePage = new SpacePage(userDriver);
  await this.spacePage.generateInviteLink();
  await this.spacePage.checkInviteLinkGenerated();
});

Given(
  "{string} sends an invitation to {string}",
  async function (user: string, userToInvite: string) {
    logger.info(`STEP: ${user} sends an invitation to ${userToInvite}`);
    const userDriver = getUserDriver(user);
    this.spacePage = new SpacePage(userDriver);
    const inviteLink = await this.spacePage.copyInviteLink();
    logger.info(`Invite link copied: ${inviteLink}`);
    LinkStorage.setInviteLink(inviteLink);
  }
);

When(
  "{string} receives and clicks the invitation link",
  async function (user: string) {
    logger.info(`STEP: ${user} receives the invitation link`);
    const userDriver = getUserDriver(user);
    const inviteLink = LinkStorage.getInviteLink();
    if (!inviteLink) {
      throw new Error(
        "No invite link available. Error in your scenario or code."
      );
    }
    await userDriver.navigateTo(inviteLink);
  }
);

When(
  "{string} sends a request to join the {string} space",
  async function (user: string, spaceName: string) {
    logger.info(
      `STEP: ${user} sends a request to join the "${spaceName}" space`
    );
    const userDriver = getUserDriver(user);
    await userDriver.pause(3000);
    this.spacePage = new SpacePage(userDriver);
    await this.spacePage.sendRequestToJoin();
  }
);

Then(
  "{string} sees the Request to join Confirmation popup",
  async function (user: string) {
    logger.info(`STEP: ${user} sees the Request to join Confirmation popup`);
    const userDriver = getUserDriver(user);
    this.spacePage = new SpacePage(userDriver);
    await this.spacePage.checkRequestToJoinConfirmationPopup();
    await this.spacePage.selectDone();
  }
);

When(
  "{string} approves the join request of {string} with {string} rights",
  async function (approver: string, requester: string, rights: string) {
    logger.info(
      `STEP: ${approver} approves the join request of ${requester} with ${rights} rights`
    );
    const userDriver = getUserDriver(approver);
    this.spacePage = new SpacePage(userDriver);
    await this.spacePage.approveJoinRequest(requester, rights);
    await this.spacePage.performSwipe(50, 20, 50, 80);
    await this.spacePage.performSwipe(50, 20, 50, 80);
    this.chatPage = new ChatPage(userDriver);
    await this.chatPage.tapChat();
  }
);

When(
  "{string} declines the join request of {string}",
  async function (decliner: string, requester: string) {
    logger.info(`STEP: ${decliner} declines the join request of ${requester}`);
    const userDriver = getUserDriver(decliner);
    this.spacePage = new SpacePage(userDriver);
    await this.spacePage.declineJoinRequest(requester);
  }
);

When(
  "{string} sees the message {string} in chat",
  async function (user: string, message: string) {
    logger.info(`STEP: ${user} sees the message "${message}" in chat`);
    const userDriver = getUserDriver(user);
    this.chatPage = new ChatPage(userDriver);
    await this.chatPage.logPageSource();
    await this.chatPage.checkMessageInChat(message);
  }
);

When(
  "{string} sends a message {string} in chat",
  async function (user: string, message: string) {
    logger.info(`STEP: ${user} sends a message "${message}" in chat`);
    const userDriver = getUserDriver(user);
    this.chatPage = new ChatPage(userDriver);
    await this.chatPage.sendMessage(message);
  }
);

When(
  "{string} doesn't see {string} in the space sharing menu",
  async function (activeUser: string, userToCheck: string) {
    logger.info(
      `STEP: ${activeUser} doesn't see ${userToCheck} in the space sharing menu`
    );
    const userDriver = getUserDriver(activeUser);
    this.spacePage = new SpacePage(userDriver);
    await this.spacePage.assertUserIsInSpaceSharingMenu();
    await this.spacePage.checkUserNameNotOnTheScreen(userToCheck);
  }
);
