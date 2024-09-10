import { Logger } from "@origranot/ts-logger";
import {
  callWalletCreate,
  callWalletCreateSession,
  callWalletRecover,
} from "../api/walletApi";
import { callAccountCreate, callAccountSelect } from "../api/accountApi";
import { store } from "../helpers/store";
import { Given, Then } from "@cucumber/cucumber";
import { callListenSessionEvents } from "../api/streamRequest";
import { isVersion034OrLess } from "../helpers/utils";

// Initialize the logger
const logger = new Logger();

export const setUserAsCurrentUser = (userNumber: number) => {
  store.currentUserNumber = userNumber;
  logger.info(`Current user is user number ${userNumber}`);

  // returning this here to make this function chainable and reuse somewhere else
  logger.info("Stored users", JSON.stringify(Array.from(store.users)));
  return;
};

Given("the user creates a new account on {string}", async (network: string) => {
  logger.info("STEP: the user creates a new account");
  const userNumber = store.currentUserNumber;
  if (!userNumber) {
    logger.error("Error: Current user number is not defined");
    throw new Error("Current user number is not defined");
  }
  await callWalletCreate(userNumber);
  const user = store.users.get(userNumber);
  if (!user) {
    logger.error("Error: User is not defined");
    throw new Error("User is not defined");
  }
  const mnemonic = user.mnemonic;
  const token = await callWalletCreateSession(mnemonic);

  // Update the client token using the stored grpcClientManager
  if (store.grpcClientManager) {
    logger.info("Updating client token");
    if (store.currentClientNumber) {
      store.grpcClientManager.updateClientToken(
        store.currentClientNumber,
        token
      );
    } else {
      logger.error("Error: Current client number is not defined");
      throw new Error("Current client number is not defined");
    }
  }
  callListenSessionEvents();

  //Switch to choose the network
  switch (network) {
    case "prod":
      await callAccountCreate(userNumber, true);
      break;
    case "staging":
      await callAccountCreate(userNumber);
      break;
    default:
      logger.error("Error: Invalid network");
      throw new Error("Invalid network");
  }
});

Given(
  "the user logs in to their account on {string}",
  async (network: string) => {
    logger.info("STEP: the user logs in to their account");
    const userNumber = store.currentUserNumber;
    if (!userNumber) {
      logger.error("Error: Current user number is not defined");
      throw new Error("Current user number is not defined");
    }
    await callWalletRecover(userNumber);
    const user = store.users.get(userNumber);
    if (!user) {
      logger.error("Error: User is not defined");
      throw new Error("User is not defined");
    }
    logger.info("Getting mnemonic", user.mnemonic);
    const mnemonic = user.mnemonic;
    const token = await callWalletCreateSession(mnemonic);

    // Update the client token using the stored grpcClientManager
    if (store.grpcClientManager) {
      logger.info("Updating client token");
      if (store.currentClientNumber) {
        store.grpcClientManager.updateClientToken(
          store.currentClientNumber,
          token
        );
        callListenSessionEvents();
      } else {
        logger.error("Error: Current client number is not defined");
        throw new Error("Current client number is not defined");
      }
    }
    //Switch to choose the network
    switch (network) {
      case "prod":
        await callAccountSelect(userNumber, true);
        break;
      case "staging":
        await callAccountSelect(userNumber);
        break;
      default:
        logger.error("Error: Invalid network");
        throw new Error("Invalid network");
    }
  }
);

/**
 * Utility function to wait for a condition to be true with a timeout.
 * @param conditionFn A function that returns a boolean indicating if the condition is met.
 * @param timeoutMs The maximum time to wait in milliseconds.
 * @param intervalMs The interval to check the condition in milliseconds.
 * @returns A promise that resolves if the condition becomes true within the timeout, otherwise rejects.
 */
async function waitForCondition(
  conditionFn: () => boolean,
  timeoutMs: number = 10000, // Default timeout of 10 seconds
  intervalMs: number = 100 // Check every 100 milliseconds
): Promise<void> {
  const start = Date.now();

  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (conditionFn()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start >= timeoutMs) {
        clearInterval(interval);
        reject(
          new Error("Timeout: Condition not met within the specified time.")
        );
      }
    }, intervalMs);
  });
}

Then("the account is synced", async () => {
  logger.info("STEP: the account is synced");
  try {
    // Wait for the variable to become true with a timeout of 60 seconds
    await waitForCondition(() => store.spaceSyncStatusReceived, 60000);

    if (
      store.currentServerVersion &&
      isVersion034OrLess(store.currentServerVersion)
    ) {
      logger.info("Heart version is 0.34 or less, wait for 30 seconds");
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
    logger.info("The account is successfully synced.");
    //Wait for another 15 seconds to ensure the account is fully synced
  } catch (error) {
    // Log an error and throw it to fail the test
    logger.error(
      "The account is not synced. SpaceSyncStatusUpdate event not received in time."
    );
    throw new Error(
      "Test failed: The account did not sync within the expected time."
    );
  }
});
