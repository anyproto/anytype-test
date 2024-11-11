import { getCurrentClient } from "../services/gprcClient";
import { getTempDirectory, makeGrpcCall } from "../services/utils";
import {
  Rpc_Wallet_Create_Request,
  Rpc_Wallet_Create_Response,
  Rpc_Wallet_Recover_Request,
  Rpc_Wallet_Recover_Response,
  Rpc_Wallet_CreateSession_Request,
  Rpc_Wallet_CreateSession_Response,
} from "../../../pb/pb/protos/commands";

export async function callWalletCreate(): Promise<string> {
  console.log("### Calling method 'walletCreate'...");

  const request: Rpc_Wallet_Create_Request = {
    rootPath: getTempDirectory(),
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
    rootPath: getTempDirectory(),
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
      console.log("response is", JSON.stringify(response, null, 2));
      if (response.accountId) {
        console.log("returned accountId is ", response.accountId);
      } else {
        console.log("no accountId in response");
      }
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
