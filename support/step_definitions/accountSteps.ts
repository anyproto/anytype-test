import {
  callWalletCreate,
  callWalletCreateSession,
  callWalletRecover,
} from "../api/walletApi";
import { callAccountCreate, callAccountSelect } from "../api/accountApi";
import { store } from "../helpers/store";
import { Given } from "@cucumber/cucumber";

export const setUserAsCurrentUser = (userNumber: number) => {
  store.currentUserNumber = userNumber;
  console.log(`Current user is user number ${userNumber}`);

  // returning this here to make this function chainable and reuse somewhere else
  return console.log("Stored users", JSON.stringify(Array.from(store.users)));
};

Given("the user creates a new account", async () => {
  const userNumber = store.currentUserNumber;
  if (!userNumber) {
    console.error("Error: Current user number is not defined");
    throw new Error("Current user number is not defined");
  }
  await callWalletCreate(userNumber);
  const user = store.users.get(userNumber);
  if (!user) {
    console.error("Error: User is not defined");
    throw new Error("User is not defined");
  }
  const mnemonic = user.mnemonic;
  const token = await callWalletCreateSession(mnemonic);

  // Update the client token using the stored grpcClientManager
  if (store.grpcClientManager) {
    console.log("Updating client token");
    if (store.currentClientNumber) {
      store.grpcClientManager.updateClientToken(
        store.currentClientNumber,
        token
      );
    } else {
      console.error("Error: Current client number is not defined");
      throw new Error("Current client number is not defined");
    }
  }

  await callAccountCreate(userNumber);
});

Given("the user logs in to their account", async () => {
  const userNumber = store.currentUserNumber;
  if (!userNumber) {
    console.error("Error: Current user number is not defined");
    throw new Error("Current user number is not defined");
  }
  await callWalletRecover(userNumber);
  const user = store.users.get(userNumber);
  if (!user) {
    console.error("Error: User is not defined");
    throw new Error("User is not defined");
  }
  const mnemonic = user.mnemonic;
  const token = await callWalletCreateSession(mnemonic);
  // Update the client token using the stored grpcClientManager
  if (store.grpcClientManager) {
    console.log("Updating client token");
    if (store.currentClientNumber) {
      store.grpcClientManager.updateClientToken(
        store.currentClientNumber,
        token
      );
    } else {
      console.error("Error: Current client number is not defined");
      throw new Error("Current client number is not defined");
    }
  }
  await callAccountSelect(userNumber);
});
