import { Given, Then, When } from "@cucumber/cucumber";
import { saveUser } from "./accountSteps";
import { faker } from "@faker-js/faker";
import { callWalletCreateSession, callWalletRecover } from "../api/walletApi";
import { UserType } from "../dataTypes";
import { store } from "../helpers/store";
import { Logger } from "@origranot/ts-logger";
import { callAccountRecover, callAccountSelect } from "../api/accountApi";
import { expect } from "@playwright/test";
import { updateClientToken } from "../helpers/tokenManager";

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
  logger.info("Account select time: " + accountSelectTime);
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
    await expect(accountSelectTime).toBeLessThan(expectedTime);
  }
);
