import { getCurrentClient } from "../client";
import { store } from "../helpers/store";
import * as fs from "fs";
import * as path from "path";
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

export async function callWalletCreate(): Promise<string> {
  console.log("### Calling method 'walletCreate'...");

  const request: Rpc_Wallet_Create_Request = {
    rootPath: tempDir,
  };

  try {
    const response = await makeGrpcCall<Rpc_Wallet_Create_Response>(
      getCurrentClient().walletCreate,
      request
    );

    if (response.error?.code === 0) {
      console.log(`Mnemonic created: ${response.mnemonic}`);
      return response.mnemonic;
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

export async function callWalletRecover(mnemonic: string): Promise<void> {
  const request: Rpc_Wallet_Recover_Request = {
    rootPath: tempDir,
    mnemonic: mnemonic,
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
      console.log("repsponse is", JSON.stringify(response, null, 2));
      console.log("returned accountId is ", response.accountId);
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
