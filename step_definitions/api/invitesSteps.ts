import {
  callSpaceInviteGenerate,
  callSpaceInviteRevoke,
  callSpaceInviteView,
  callSpaceJoin,
  callSpaceMakeShareable,
  checkSpaceInviteNotValid,
  callSpaceRequestApprove,
  callSpaceParticipantPermissionsChange,
  callSpaceJoinCancel,
  callSpaceDelete,
  callSpaceLeaveApprove,
  callSpaceParticipantRemove,
  callSpaceRequestDecline,
} from "../../support/api/clients/spaceApi";
import { Given, Then, When } from "@cucumber/cucumber";
import { store } from "../../support/api/helpers/store";
import { Logger } from "@origranot/ts-logger";
import { expect } from "expect";
import { setClientAsCurrentClient } from "./commonSteps";
import { callObjectSearch } from "../../support/api/clients/objectApi";
import {
  Block_Content_Dataview_Filter,
  Block_Content_Dataview_Filter_Condition,
  ObjectType_Layout,
} from "../../pb/pkg/lib/pb/model/protos/models";
import { setUserAsCurrentUser } from "../../support/api/services/utils";
import { ParticipantPermissions } from "../../pb/pkg/lib/pb/model/protos/models";

const logger = new Logger({ name: "custom" });

When("the user makes his first space shareable", async () => {
  logger.info("STEP: the user makes his first space shareable");
  const user = store.currentUser;
  if (!user.accountSpaceId) {
    throw new Error("User's accountSpaceId is undefined");
  }
  await callSpaceMakeShareable(user.accountSpaceId);
});

Then("the user can generate an invite link", async () => {
  logger.info("STEP: the user can generate an invite link");
  const user = store.currentUser;
  if (!user.accountSpaceId) {
    throw new Error("User's accountSpaceId is undefined");
  }
  await callSpaceInviteGenerate(user.accountSpaceId);
});

Given(
  "the user has shared his space and generated an invite link",
  async function () {
    logger.info(
      "STEP: the user has shared his space and generated an invite link"
    );
    const user = store.currentUser;
    if (!user.accountSpaceId) {
      throw new Error("User's accountSpaceId is undefined");
    }
    await callSpaceMakeShareable(user.accountSpaceId);
    const result = await callSpaceInviteGenerate(user.accountSpaceId);
    if (!result.inviteContentId || !result.inviteFileKey) {
      throw new Error("Failed to generate invite - missing required fields");
    }
    this.inviteContentId = result.inviteContentId;
    this.inviteFileKey = result.inviteFileKey;
    this.sharedSpaceId = user.accountSpaceId;
  }
);

When("the user revokes the invite link", async () => {
  logger.info("STEP: the user revokes the invite link");
  const user = store.currentUser;
  if (!user.accountSpaceId) {
    throw new Error("User's accountSpaceId is undefined");
  }
  await callSpaceInviteRevoke(user.accountSpaceId);
});

When("the user sends requests to join the space", async function () {
  logger.info("STEP: the user sends requests to join the space");
  if (!this.sharedSpaceId) {
    throw new Error(
      "sharedSpaceId is not set. Did you run the 'Given the user has shared his space...' step first?"
    );
  }
  const user = store.currentUser;
  if (!user.accountSpaceId) {
    throw new Error("User's accountSpaceId is undefined");
  }
  if (!this.inviteContentId || !this.inviteFileKey) {
    throw new Error("Invite details are not available");
  }
  await callSpaceInviteView(this.inviteContentId, this.inviteFileKey);
  await callSpaceJoin(
    this.sharedSpaceId,
    this.inviteContentId,
    this.inviteFileKey,
    user.networkId
  );
});

Then("the invite link should be invalid", async function () {
  logger.info("STEP: the invite link should be invalid");
  const user = store.currentUser;
  if (!user.accountSpaceId) {
    throw new Error("User's accountSpaceId is undefined");
  }
  const result = await checkSpaceInviteNotValid(user.accountSpaceId);
  expect(result).toBe(true);
});

When(
  "the user {int} approves the join request of user {int} with {string} rights",
  { timeout: 60000 },
  async function (
    approverNumber: number,
    joinerNumber: number,
    rights: string
  ) {
    logger.info(
      `STEP: the user ${approverNumber} approves the join request of user ${joinerNumber} with ${rights} rights`
    );
    setClientAsCurrentClient(approverNumber);
    let permissions: "reader" | "editor";
    if (rights === "Viewer") {
      permissions = "reader";
    } else if (rights === "Editor") {
      permissions = "editor";
    } else {
      throw new Error("Invalid rights, only Viewer or Editor are supported");
    }
    const joiner = store.users.get(joinerNumber);
    if (!joiner || !joiner.accountId) {
      throw new Error(
        `User ${joinerNumber} not found in the store or accountId is undefined`
      );
    }
    await callSpaceRequestApprove(
      this.sharedSpaceId,
      joiner.accountId,
      permissions
    );
    //wait for ACL to be updated, 15 seconds is enough
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
);

Then(
  "the user {int} changes the rights of user {int} from {string} to {string}",
  { timeout: 60000 },
  async function (
    approverNumber: number,
    joinerNumber: number,
    roleBefore: string,
    roleAfter: string
  ) {
    logger.info(
      `STEP: the user ${approverNumber} changes the rights of user ${joinerNumber} from ${roleBefore} to ${roleAfter}`
    );
    setClientAsCurrentClient(approverNumber);
    const joiner = store.users.get(joinerNumber);
    if (!joiner || !joiner.accountId) {
      throw new Error(
        `User ${joinerNumber} not found in the store or accountId is undefined`
      );
    }
    let permissions: "reader" | "editor";
    if (roleAfter === "Viewer") {
      permissions = "reader";
    } else if (roleAfter === "Editor") {
      permissions = "editor";
    } else {
      throw new Error("Invalid rights, only Viewer or Editor are supported");
    }

    if (!this.sharedSpaceId) {
      throw new Error(
        "sharedSpaceId is not set. Did you run the 'Given the user has shared his space...' step first?"
      );
    }

    await callSpaceParticipantPermissionsChange(
      this.sharedSpaceId,
      joiner.accountId,
      permissions
    );

    //wait for ACL to be updated, 15 seconds is enough
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
);

Given(
  "the user cancels their join request",
  { timeout: 60000 },
  async function () {
    logger.info("STEP: the user cancels their join request");
    if (!this.sharedSpaceId) {
      throw new Error(
        "sharedSpaceId is not set. Did you run the 'Given the user has shared his space...' step first?"
      );
    }
    await callSpaceJoinCancel(this.sharedSpaceId);
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
);

Then("there is no request pending for joining the space", async function () {
  logger.info("STEP: there is no request pending for joining the space");
  const user = store.currentUser;
  if (!user.accountSpaceId) {
    throw new Error("User's accountSpaceId is undefined");
  }

  const filters: Block_Content_Dataview_Filter[] = [
    {
      relationKey: "layout",
      condition: Block_Content_Dataview_Filter_Condition.Equal,
      value: {
        kind: {
          oneofKind: "numberValue",
          numberValue: ObjectType_Layout.participant,
        },
      },
      id: "",
      operator: 0,
      relationProperty: "",
      quickOption: 0,
      format: 0,
      includeTime: false,
      nestedFilters: [],
    },
  ];
  const result = await callObjectSearch(filters, user.accountSpaceId);
  if (result.length === 0) {
    throw new Error("No participant records found");
  }
  // Check each record's participantStatus
  result.forEach((record, index) => {
    const participantStatus = record.fields?.participantStatus?.kind;

    if (!participantStatus || participantStatus.oneofKind !== "numberValue") {
      throw new Error(
        `Participant record at index ${index} has invalid participantStatus`
      );
    }

    if (participantStatus.numberValue === 0) {
      // 0 represents "Joining" status
      throw new Error(
        `Participant record at index ${index} still has Joining status`
      );
    }
  });
  logger.info("No participants have Joining status");
});

When("the user {int} leaves the shared space", async function (int: number) {
  logger.info(`STEP: the user ${int} leaves the shared space`);
  setClientAsCurrentClient(int);
  setUserAsCurrentUser(int);
  if (!this.sharedSpaceId) {
    throw new Error(
      "sharedSpaceId is not set. Did you run the 'Given the user has shared his space...' step first?"
    );
  }
  await callSpaceDelete(this.sharedSpaceId);
});

Then(
  "the request is automatically approved as {string} again",
  { timeout: 60000 },
  async function (role: string) {
    logger.info(`STEP: the request is automatically approved as ${role} again`);
    //wait for 15 seconds
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const user = store.currentUser;
    const filters: Block_Content_Dataview_Filter[] = [
      {
        relationKey: "layout",
        condition: Block_Content_Dataview_Filter_Condition.Equal,
        value: {
          kind: {
            oneofKind: "numberValue",
            numberValue: ObjectType_Layout.participant,
          },
        },
        id: "",
        operator: 0,
        relationProperty: "",
        quickOption: 0,
        format: 0,
        includeTime: false,
        nestedFilters: [],
      },
    ];
    const result = await callObjectSearch(filters, this.sharedSpaceId);
    logger.info(`Found ${result.length} participant records`);

    // Find the record for the current user
    const userRecord = result.find(
      (record) =>
        record.fields?.identity?.kind?.oneofKind === "stringValue" &&
        record.fields.identity.kind.stringValue === user.accountId
    );
    logger.info(`Found user record: ${!!userRecord}`);

    if (!userRecord) {
      throw new Error("Current user's participant record not found");
    }

    // Check participant status
    const participantStatus = userRecord.fields?.participantStatus?.kind;
    logger.info(`Participant status: ${JSON.stringify(participantStatus)}`);

    if (!participantStatus || participantStatus.oneofKind !== "numberValue") {
      throw new Error("Invalid participant status format");
    }

    // Check if participantStatus is 1 (approved)
    if (participantStatus.numberValue !== 1) {
      throw new Error(
        `Expected participant status to be 1 (approved), but got ${participantStatus.numberValue}`
      );
    }

    // Check participant permissions
    const participantPermissions =
      userRecord.fields?.participantPermissions?.kind;
    logger.info(
      `Current participant permissions: ${JSON.stringify(
        participantPermissions
      )}`
    );

    if (
      !participantPermissions ||
      participantPermissions.oneofKind !== "numberValue"
    ) {
      throw new Error("Invalid participant permissions format");
    }

    // Validate permissions based on role
    let expectedPermission: ParticipantPermissions;
    if (role === "Viewer") {
      expectedPermission = ParticipantPermissions.Reader;
    } else if (role === "Editor") {
      expectedPermission = ParticipantPermissions.Writer;
    } else {
      throw new Error(`Invalid role: ${role}. Expected "Viewer" or "Editor"`);
    }

    if (participantPermissions.numberValue !== expectedPermission) {
      logger.info(
        `Permission mismatch - Expected: ${expectedPermission}, Got: ${participantPermissions.numberValue}`
      );
      throw new Error(
        `Expected participant permissions to be ${expectedPermission} (${role}), but got ${participantPermissions.numberValue}`
      );
    }
    logger.info(
      `Successfully verified participant permissions for role: ${role}`
    );
  }
);

When(
  "the user {int} approves the leave request of user {int}",
  async function (approverNumber: number, leaverNumber: number) {
    logger.info(
      `STEP: the user ${approverNumber} approves the leave request of user ${leaverNumber}`
    );
    setClientAsCurrentClient(approverNumber);
    setUserAsCurrentUser(approverNumber);
    const leavingUser = store.users.get(leaverNumber);
    if (!leavingUser || !leavingUser.accountId) {
      throw new Error("User not found in the store or accountId is undefined");
    }
    await callSpaceLeaveApprove(this.sharedSpaceId, leavingUser.accountId);
  }
);

When(
  "the user {int} deletes the shared space",
  async function (userNumber: number) {
    logger.info(`STEP: the user ${userNumber} deletes the shared space`);
    setClientAsCurrentClient(userNumber);
    setUserAsCurrentUser(userNumber);
    if (!this.sharedSpaceId) {
      throw new Error(
        "sharedSpaceId is not set. Did you run the 'Given the user has shared his space...' step first?"
      );
    }
    await callSpaceDelete(this.sharedSpaceId);
  }
);

When(
  "the user {int} removes the user {int} from the space",
  async function (removerNumber: number, leaverNumber: number) {
    logger.info(
      `STEP: the user ${removerNumber} removes the user ${leaverNumber} from the space`
    );
    setClientAsCurrentClient(removerNumber);
    setUserAsCurrentUser(removerNumber);
    const leaver = store.users.get(leaverNumber);
    if (!leaver || !leaver.accountId) {
      throw new Error("User not found in the store or accountId is undefined");
    }
    await callSpaceParticipantRemove(this.sharedSpaceId, leaver.accountId);
  }
);

When(
  "the user {int} declines the join request of user {int}",
  async function (declinerNumber: number, leavingUserNumber: number) {
    logger.info(
      `STEP: the user ${declinerNumber} declines the join request of user ${leavingUserNumber}`
    );
    setClientAsCurrentClient(declinerNumber);
    setUserAsCurrentUser(declinerNumber);
    const leaver = store.users.get(leavingUserNumber);
    if (!leaver || !leaver.accountId) {
      throw new Error("User not found in the store or accountId is undefined");
    }
    await callSpaceRequestDecline(this.sharedSpaceId, leaver.accountId);
  }
);
