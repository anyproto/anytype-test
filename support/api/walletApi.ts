import { getCurrentClient } from "../client";
import { store } from "../helpers/store";
import { UserType } from "../dataTypes";
import * as fs from "fs";
import * as path from "path";
import { faker } from "@faker-js/faker";
import {
  Rpc_Wallet_Create_Request,
  Rpc_Wallet_Create_Response,
  Rpc_Wallet_Recover_Request,
  Rpc_Wallet_Recover_Response,
  Rpc_Wallet_CreateSession_Request,
  Rpc_Wallet_CreateSession_Response,
} from "../../pb/pb/protos/commands";
import { makeGrpcCall } from "../helpers/utils";

// Create a unique temporary directory inside the 'tmp' folder located two levels up from the current directory.
// 'path.resolve' navigates to the project root by moving up two levels ('../../') and then appending 'tmp'.
// 'fs.mkdtempSync' creates a new temporary directory with a unique name that starts with 'anytype-test-'.
const tempDir = fs.mkdtempSync(
  path.join(path.resolve(__dirname, "../../tmp"), "anytype-test-")
);

console.log(`Temporary directory created at: ${tempDir}`);

export async function callWalletCreate(userNumber: number): Promise<void> {
  console.log("### Calling method 'walletCreate'...");
  const name = faker.person.firstName();

  const request: Rpc_Wallet_Create_Request = {
    rootPath: tempDir,
  };

  try {
    const response = await makeGrpcCall<Rpc_Wallet_Create_Response>(
      getCurrentClient().walletCreate,
      request
    );

    if (response.error?.code === 0) {
      const userToSave: UserType = {
        mnemonic: response.mnemonic,
        name: name,
      };
      store.users.set(userNumber, userToSave);
      console.log(
        `Saving user as user number ${userNumber}`,
        JSON.stringify(userToSave)
      );
      console.log(
        `Mnemonic for user ${userNumber} saved: ${response.mnemonic}`
      );
    } else {
      throw new Error(
        response.error ? response.error.description : "Unknown error"
      );
    }
  } catch (error) {
    console.error("Failed to create wallet:", error);
    throw error;
  }
}

export async function callWalletRecover(userNumber: number): Promise<void> {
  console.log("### Calling method 'walletRecovery'...");
  const user = store.users.get(userNumber);

  if (!user || !user.mnemonic) {
    throw new Error(`Mnemonic not found for user number ${userNumber}`);
  }

  const request: Rpc_Wallet_Recover_Request = {
    rootPath: tempDir,
    mnemonic: user.mnemonic,
  };

  try {
    const response = await makeGrpcCall<Rpc_Wallet_Recover_Response>(
      getCurrentClient().walletRecover,
      request
    );
    console.log("Wallet recovered successfully:", response);
  } catch (error) {
    console.error("Failed to recover wallet:", error);
    throw error;
  }
}

export async function callWalletCreateSession(
  mnemonic: string
): Promise<string> {
  console.log("### Calling method 'walletCreateSession'...");

  const request: Rpc_Wallet_CreateSession_Request = {
    auth: {
      oneofKind: "mnemonic",
      mnemonic: mnemonic,
    },
  };

  try {
    const response = await makeGrpcCall<Rpc_Wallet_CreateSession_Response>(
      getCurrentClient().walletCreateSession,
      request
    );

    if (response.error?.code === 0) {
      console.log(
        "Session created successfully, token returned: " + response.token
      );
      return response.token;
    } else {
      throw new Error(
        response.error ? response.error.description : "Unknown error"
      );
    }
  } catch (error) {
    console.error("Failed to create wallet session:", error);
    throw error;
  }
}
