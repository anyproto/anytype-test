import { Logger } from "@origranot/ts-logger";
import {
  callWalletCreate,
  callWalletCreateSession,
  callWalletRecover,
} from "../api/walletApi";
import {
  callAccountCreate,
  callAccountDelete,
  callAccountRecover,
  callAccountSelect,
} from "../api/accountApi";
import { store } from "../helpers/store";
import { Given, Then } from "@cucumber/cucumber";
import { callListenSessionEvents } from "../api/streamRequest";
import { getCurrentUserNumber, isVersion034OrLess } from "../helpers/utils";
import { faker } from "@faker-js/faker";
import { UserType } from "../dataTypes";
import { updateClientToken } from "../helpers/tokenManager";

// Initialize the logger
const logger = new Logger();

export function saveUser(userNumber: number, user: UserType): void {
  store.users.set(userNumber, user);
  logger.info(`Saving user as user number ${userNumber}`, JSON.stringify(user));
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
  callListenSessionEvents();
  await callAccountCreate(userNumber, network);
});

Given(
  "the user logs in to their account on {string}",
  async (network: string) => {
    logger.info("STEP: the user logs in to their account");

    const user = store.currentUser;
    logger.info("Recovering wallet", user.mnemonic);
    await callWalletRecover(user.mnemonic);

    const token = await callWalletCreateSession(user.mnemonic);
    updateClientToken(token);

    if (!user.accountId) {
      const accountId = await callAccountRecover();
      user.accountId = accountId;
      saveUser(store.currentUserNumber!, user);
    }
    await callAccountSelect(user.accountId, network);
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
      logger.info("Heart version is 0.34 or less, wait for 20 seconds");
      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
    logger.info("The account is successfully synced.");
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

Then("the account is deleted", async () => {
  logger.info("STEP: the account is deleted");
  await callAccountDelete();
});
