import { getCurrentClient } from "../client";
import { store } from "../helpers/store";
import {
  Rpc_Account_Create_Request,
  Rpc_Account_Create_Response,
  Rpc_Account_NetworkMode,
  Rpc_Account_Select_Request,
  Rpc_Account_Select_Response,
} from "../../pb/pb/protos/commands";
import { makeGrpcCall } from "../helpers/utils";
import * as path from "path";
/**
 * Calls the accountCreate method on the gRPC client and handles the response.
 * @param userNumber The number associated with the user in the store.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callAccountCreate(userNumber: number): Promise<void> {
  console.log("### Initiating account creation...");

  const userData = store.users.get(userNumber);
  if (!userData) {
    throw new Error(`User data not found for user number ${userNumber}`);
  }
  //check if "../../config.yml" is the correct path
  const configPath = path.resolve(__dirname, "../../config.yml");
  console.log(`Using config path: ${configPath}`);

  const request: Rpc_Account_Create_Request = {
    name: userData.name || "test",
    avatar: { oneofKind: undefined },
    storePath: "",
    icon: BigInt(5),
    disableLocalNetworkSync: false,
    networkMode: Rpc_Account_NetworkMode.CustomConfig,
    networkCustomConfigFilePath: configPath,
    preferYamuxTransport: false,
  };

  try {
    const response = await makeGrpcCall<Rpc_Account_Create_Response>(
      getCurrentClient().accountCreate,
      request
    );

    const spaceIdToSave = response.account?.info?.accountSpaceId;
    const accountIdToSave = response.account?.id;

    if (spaceIdToSave && accountIdToSave) {
      userData.spaceId = spaceIdToSave;
      userData.accountId = accountIdToSave;
      store.users.set(userNumber, userData);
      console.log(
        `AccountSpaceId for user ${userNumber} saved: ${spaceIdToSave}`
      );
    } else {
      throw new Error("Account or space ID not returned in the response.");
    }
  } catch (error) {
    console.error("Failed to create account:", error);
    throw error;
  }
}

/**
 * Calls the accountSelect method on the gRPC client and handles the response.
 * @param userNumber The number associated with the user in the store.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callAccountSelect(userNumber: number): Promise<void> {
  console.log("### Initiating account selection...");
  const configPath = path.resolve(__dirname, "../../config.yml");
  console.log(`Using config path: ${configPath}`);

  const userData = store.users.get(userNumber);
  if (!userData || !userData.accountId) {
    throw new Error(
      `User data for user ${userNumber} is incomplete or missing`
    );
  }

  const request: Rpc_Account_Select_Request = {
    id: userData.accountId,
    rootPath: "",
    disableLocalNetworkSync: false,
    networkMode: Rpc_Account_NetworkMode.CustomConfig,
    networkCustomConfigFilePath: configPath,
    preferYamuxTransport: false,
  };

  try {
    const response = await makeGrpcCall<Rpc_Account_Select_Response>(
      getCurrentClient().accountSelect,
      request
    );
    console.log("Account selected successfully:", response);
  } catch (error) {
    console.error("Failed to select account:", error);
    throw error;
  }
}
