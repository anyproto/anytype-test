import {
  callWalletCreate,
  callWalletCreateSession,
  callWalletRecover,
} from "../../support/api/clients/walletApi";
import {
  callAccountCreate,
  callAccountDelete,
  callAccountRecover,
  callAccountSelect,
} from "../../support/api/clients/accountApi";
import { store } from "../../support/api/helpers/store";
import { Given, Then } from "@cucumber/cucumber";
import { callListenSessionEvents } from "../../support/api/services/streamRequest";
import {
  getCurrentUserNumber,
  setUserAsCurrentUser,
  waitForCondition,
} from "../../support/api/services/utils";
import { faker } from "@faker-js/faker";
import { UserType } from "../../support/types/dataTypes";
import { updateClientToken } from "../../support/api/clients/tokenManager";
import {
  callImportUseCase,
  callObjectSubscribeIds,
  setDescription,
} from "../../support/api/clients/objectApi";
import {
  callWorkspaceOpen,
  callWorkspaceSetInfo,
} from "../../support/api/clients/workspaceApi";
import { callInitialSetParameters } from "../../support/api/clients/metricsApi";
import { exec } from "child_process";
import { logger } from "../../support/api/helpers/loggerConfig";
import { setClientAsCurrentClient } from "./commonSteps";
import { getObjectSyncStatus } from "./commonSteps";

export function saveUser(userNumber: number, user: UserType): void {
  store.users.set(userNumber, user);
  logger.info(
    `Saving user as user number ${userNumber}`,
    JSON.stringify(user),
    {
      user: userNumber,
    }
  );
}

Given("the user creates a new account on {string}", async (network: string) => {
  logger.info("STEP: the user creates a new account");
  const userNumber = getCurrentUserNumber();
  const mnemonic = await callWalletCreate();

  const userToSave: UserType = {
    mnemonic: mnemonic,
    name: faker.person.fullName(),
  };
  saveUser(userNumber, userToSave);
  const token = await callWalletCreateSession(mnemonic);
  updateClientToken(token);
  callListenSessionEvents(userNumber);
  const response = await callAccountCreate(userNumber, network);
  const { account } = response;

  if (!account || !account.info) {
    throw new Error("Account information not returned in the response");
  }

  const {
    accountSpaceId,
    analyticsId,
    profileObjectId,
    techSpaceId,
    networkId,
  } = account.info;
  const accountId = account.id;
  const missingFields: string[] = [];
  if (!accountSpaceId) missingFields.push("account space ID");
  if (!accountId) missingFields.push("account ID");
  if (!analyticsId) missingFields.push("analytics ID");
  if (!profileObjectId) missingFields.push("profile object ID");
  if (!techSpaceId) missingFields.push("tech space ID");
  // if (!networkId) missingFields.push("network ID");
  if (missingFields.length > 0) {
    throw new Error(
      `The following fields were not returned in the response: ${missingFields.join(
        ", "
      )}`
    );
  }

  userToSave.accountSpaceId = accountSpaceId;
  userToSave.accountId = accountId;
  userToSave.analyticsId = analyticsId;
  userToSave.profileObjectId = profileObjectId;
  userToSave.techSpaceId = techSpaceId;
  userToSave.networkId = networkId;
  saveUser(store.currentUserNumber!, userToSave);
  logger.info(
    `AccountSpaceId for user ${store.currentUserNumber} saved: accountSpaceId: ${accountSpaceId}, accountId: ${accountId}, analyticsId: ${analyticsId}, profileObjectId: ${profileObjectId}, networkId: ${networkId}`,
    { user: store.currentUserNumber }
  );
  await callImportUseCase(accountSpaceId, "GET_STARTED");
  await callWorkspaceSetInfo(accountSpaceId, "My Ultimate Space");
  await setDescription(
    profileObjectId,
    "This description is funny and not funny until you read it."
  );
  // Subscribe to profileObjectId and techSpaceId
  logger.info(
    "Subscribing to profile object with profileObjectId and techSpaceId",
    { user: store.currentUserNumber }
  );
  const responseRecords = await callObjectSubscribeIds(
    [profileObjectId, techSpaceId],
    techSpaceId
  );
  if (responseRecords.length !== 1) {
    throw new Error(
      `Expected responseRecord to contain exactly one element, but got ${
        responseRecords ? responseRecords.length : 0
      }`
    );
  }
  if (responseRecords[0]?.fields?.iconImage?.kind) {
    const kind = responseRecords[0].fields.iconImage.kind;
    if (kind.oneofKind === "stringValue" && kind.stringValue) {
      const iconImage = kind.stringValue;
      store.setUserProperty(store.currentUserNumber!, "iconImage", iconImage);
      logger.debug(
        `Icon image for user ${store.currentUserNumber} saved: ${iconImage}`,
        { user: store.currentUserNumber }
      );
    } else {
      logger.warn("Icon image is not a string value", {
        user: store.currentUserNumber,
      });
    }
  } else {
    logger.warn("Icon image not found in the response", {
      user: store.currentUserNumber,
    });
  }
  logger.debug("DEBUG:current user in store", store.currentUser, {
    user: store.currentUserNumber,
  });
});

Given(
  "the user logs in to their account on {string}",
  { timeout: 60000 },
  async (network: string) => {
    logger.info("STEP: the user logs in to their account");

    const user = store.currentUser;
    logger.info("Recovering wallet", user.mnemonic, {
      user: store.currentUserNumber,
    });
    await callWalletRecover(user.mnemonic);

    const token = await callWalletCreateSession(user.mnemonic);
    updateClientToken(token);

    if (!user.accountId) {
      const accountId = await callAccountRecover();
      user.accountId = accountId;
      saveUser(store.currentUserNumber!, user);
    }
    const responseAccount = await callAccountSelect(user.accountId, network);
    //check that analyticsId is the same as it was before
    if (responseAccount.info?.analyticsId !== user.analyticsId) {
      throw new Error(
        `AnalyticsId mismatch. Expected: ${user.analyticsId}, Got: ${responseAccount.info?.analyticsId}`
      );
    }
  }
);

Then(
  "the account is synced within {int} seconds",
  { timeout: 140 * 1000 },
  async (seconds: number) => {
    logger.info("STEP: the account is synced");
    try {
      await waitForCondition(
        () => store.spaceSyncStatusReceived,
        seconds * 1000
      );

      logger.info("The account is successfully synced.", {
        user: store.currentUserNumber,
      });
    } catch (error) {
      // Check object sync status
      logger.info("Checking object 1 sync status");
      const syncStatus = await getObjectSyncStatus(1);
      
      if (syncStatus === 0) {
        logger.error("Object 1 was synced, but not the whole account");
      } else {
        logger.error("Object 1 was not synced, too");
      }
      // Generate stack trace by sending SIGABRT to grpc-server
      logger.info("Generating stack trace by sending SIGABRT to grpc-server");

      // Wait for the SIGABRT operation to complete
      await new Promise<void>((resolve, reject) => {
        exec("pkill -SIGABRT grpc-server", (error, stdout, stderr) => {
          if (error) {
            logger.error("Failed to send SIGABRT to grpc-server:", error);
          }
          if (stderr) {
            logger.error("pkill stderr:", stderr);
          }

          setTimeout(() => {
            resolve();
          }, 2000);
        });
      });

      // Log the error with stack trace and sync status
      logger.error(
        "The account is not synced. SpaceSyncStatusUpdate event not received in time.",
        {
          error: error instanceof Error ? error.stack : undefined,
          syncStatus
        }
      );

      throw new Error(
        `Test failed: The account did not sync within the expected time. Sync status: ${syncStatus}. Stack trace: ${
          error instanceof Error ? error.stack : "No stack trace available"
        }`
      );
    }
  }
);

Then("the account is deleted", async () => {
  logger.info("STEP: the account is deleted");
  await callAccountDelete();
});
Then("both accounts are deleted", async () => {
  logger.info("STEP: both accounts are deleted");
  setClientAsCurrentClient(1);
  setUserAsCurrentUser(1);
  await callAccountDelete();
  setClientAsCurrentClient(2);
  setUserAsCurrentUser(2);
  await callAccountDelete();
});

Then(
  "the account should have an analyticsId, profile picture and name",
  async () => {
    logger.info(
      "STEP: the account should have an analyticsId, profile picture and name"
    );
    if (!store.currentUser.profileObjectId || !store.currentUser.techSpaceId) {
      throw new Error("ProfileObjectId or TechSpaceId is undefined");
    }
    logger.info(
      "Subscribing to profile object with profileObjectId and SpaceId",
      { user: store.currentUserNumber }
    );
    const responseRecords = await callObjectSubscribeIds(
      [store.currentUser.profileObjectId],
      store.currentUser.techSpaceId
    );

    // Check if responseRecords has exactly one element
    if (responseRecords.length !== 1) {
      throw new Error(
        `Expected responseRecord to contain exactly one element, but got ${responseRecords.length}`
      );
    }

    const user = store.currentUser;
    const expectedAnalyticsId = user.analyticsId;
    const expectedIconImage = user.iconImage;
    const expectedName = user.name;

    const record = responseRecords[0];

    // Check analyticsId
    if (record.fields?.analyticsId?.kind) {
      const kind = record.fields.analyticsId.kind;
      if (kind.oneofKind === "stringValue" && kind.stringValue) {
        const analyticsId = kind.stringValue;
        if (analyticsId !== expectedAnalyticsId) {
          throw new Error(
            `AnalyticsId mismatch. Expected: ${expectedAnalyticsId}, Got: ${analyticsId}`
          );
        }
      } else {
        logger.warn("AnalyticsId is not a string value");
      }
    } else {
      logger.warn("AnalyticsId not found in the response");
    }

    // Check iconImage
    if (record.fields?.iconImage?.kind) {
      const kind = record.fields.iconImage.kind;
      if (kind.oneofKind === "stringValue" && kind.stringValue) {
        const iconImage = kind.stringValue;
        if (iconImage !== expectedIconImage) {
          throw new Error(
            `IconImage mismatch. Expected: ${expectedIconImage}, Got: ${iconImage}`
          );
        }
      } else {
        logger.warn("IconImage is not a string value");
      }
    } else {
      logger.warn("IconImage not found in the response");
    }

    // Check name
    if (record.fields?.name?.kind) {
      const kind = record.fields.name.kind;
      if (kind.oneofKind === "stringValue" && kind.stringValue) {
        const name = kind.stringValue;
        if (name !== expectedName) {
          throw new Error(
            `Name mismatch. Expected: ${expectedName}, Got: ${name}`
          );
        }
      } else {
        logger.warn("Name is not a string value");
      }
    } else {
      logger.warn("Name not found in the response");
    }

    logger.info(
      "Account properties (analyticsId, profile picture, and name) verified successfully."
    );
  }
);
