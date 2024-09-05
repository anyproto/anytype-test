import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
import {
  Rpc_Account_Create_Request,
  Rpc_Account_Create_Response,
  Rpc_Account_NetworkMode,
  Rpc_Account_Select_Request,
  Rpc_Account_Select_Response,
  Rpc_Account_Stop_Request,
  Rpc_Account_Stop_Response,
} from "../../pb/pb/protos/commands";
import { makeGrpcCall } from "../helpers/utils";
import * as path from "path";

interface NetworkConfig {
  mode: Rpc_Account_NetworkMode;
  configPath: string;
}

function getNetworkConfig(isProd: boolean): NetworkConfig {
  if (isProd) {
    return {
      mode: Rpc_Account_NetworkMode.DefaultConfig,
      configPath: "",
    };
  } else {
    return {
      mode: Rpc_Account_NetworkMode.CustomConfig,
      configPath: path.resolve(__dirname, "../../config.yml"),
    };
  }
}

export async function callAccountCreate(
  userNumber: number,
  isProd: boolean = false
): Promise<void> {
  console.log("### Initiating account creation...");

  const userData = store.users.get(userNumber);
  if (!userData) {
    throw new Error(`User data not found for user number ${userNumber}`);
  }

  const { mode, configPath } = getNetworkConfig(isProd);
  console.log(`Using network mode: ${mode}, config path: ${configPath}`);

  const request: Rpc_Account_Create_Request = {
    name: userData.name || "test",
    avatar: { oneofKind: undefined },
    storePath: "",
    icon: BigInt(5),
    disableLocalNetworkSync: false,
    networkMode: mode,
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

export async function callAccountSelect(
  userNumber: number,
  isProd: boolean = false
): Promise<void> {
  console.log("### Initiating account selection...");

  const userData = store.users.get(userNumber);
  if (!userData || !userData.accountId) {
    throw new Error(
      `User data for user ${userNumber} is incomplete or missing`
    );
  }

  const { mode, configPath } = getNetworkConfig(isProd);
  console.log(`Using network mode: ${mode}, config path: ${configPath}`);

  const request: Rpc_Account_Select_Request = {
    id: userData.accountId,
    rootPath: "",
    disableLocalNetworkSync: false,
    networkMode: mode,
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

/**
 * Calls the accountStop method on the gRPC client and handles the response.
 * @param userNumber The number associated with the user in the store.
 * @param removeData Flag to determine if the local data should be removed.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callAccountStop(): Promise<void> {
  console.log("### Initiating account stop...");

  const request: Rpc_Account_Stop_Request = {
    removeData: false,
  };

  try {
    const response = await makeGrpcCall<Rpc_Account_Stop_Response>(
      getCurrentClient().accountStop,
      request
    );
    console.log("Account stopped successfully:", response);
  } catch (error) {
    console.error("Failed to stop account:", error);
    throw error;
  }
}
