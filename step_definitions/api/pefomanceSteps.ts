import { Given, Then, When } from "@cucumber/cucumber";
import { saveUser } from "./accountSteps";
import { faker } from "@faker-js/faker";
import {
  callWalletCreateSession,
  callWalletRecover,
} from "../../support/api/clients/walletApi";
import { UserType } from "../../support/types/dataTypes";
import { store } from "../../support/helpers/store";
import { Logger } from "@origranot/ts-logger";
import {
  callAccountRecover,
  callAccountSelect,
  callAccountStop,
} from "../../support/api/clients/accountApi";
import { expect } from "@playwright/test";
import { updateClientToken } from "../../support/api/clients/tokenManager";

const logger = new Logger();

Given("the user has a large account", async function () {
  logger.info("STEP: the user creates a new account");
  const userNumber = store.currentUserNumber as number;
  const mnemonic =
    "option pause tattoo baby fossil dwarf undo observe actor now pool cream";

  const userToSave: UserType = {
    mnemonic: mnemonic,
    name: faker.person.fullName(),
  };
  saveUser(userNumber, userToSave);
});

When("the user calls accountSelect on {string}", async (network: string) => {
  logger.info("STEP: the user calls accountSelect on " + network);
  const user = store.currentUser;
  const token = await callWalletCreateSession(user.mnemonic);
  updateClientToken(token);

  if (!user.accountId) {
    const accountId = await callAccountRecover();
    user.accountId = accountId;
    saveUser(store.currentUserNumber!, user);
  }

  const start = performance.now();
  await callAccountSelect(user.accountId, network);
  const end = performance.now();
  const accountSelectTime = end - start;
  store.accountSelectTime = accountSelectTime;
  logger.info("Account select time on " + network + ": " + accountSelectTime);
});

When("the user calls walletRecover", async () => {
  const start = performance.now();
  const user = store.currentUser;
  await callWalletRecover(user.mnemonic);
  const end = performance.now();
  const walletRecoverTime = end - start;
  logger.info("Wallet create time: " + walletRecoverTime);
});

Then(
  "the account select time should be less than {int} milliseconds",
  async (expectedTime: number) => {
    const accountSelectTime = store.accountSelectTime;
    logger.info("Account select time to compare: " + accountSelectTime);
    expect(accountSelectTime).toBeLessThan(expectedTime);
  }
);

When("the user calls accountStop", async () => {
  await callAccountStop();
});
