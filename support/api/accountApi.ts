import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
import { callListenSessionEvents } from "./streamRequest";
import {
  Rpc_Account_Create_Request,
  Rpc_Account_Create_Response,
  Rpc_Account_Delete_Request,
  Rpc_Account_Delete_Response,
  Rpc_Account_NetworkMode,
  Rpc_Account_Recover_Request,
  Rpc_Account_Recover_Response,
  Rpc_Account_Select_Request,
  Rpc_Account_Select_Response,
  Rpc_Account_Stop_Request,
  Rpc_Account_Stop_Response,
} from "../../pb/pb/protos/commands";
import { makeGrpcCall } from "../helpers/utils";
import * as path from "path";
import * as fs from "fs";

interface NetworkConfig {
  mode: Rpc_Account_NetworkMode;
  configPath: string;
}

function getNetworkConfig(networkType: string): NetworkConfig {
  if (networkType === "prod") {
    return {
      mode: Rpc_Account_NetworkMode.DefaultConfig,
      configPath: "",
    };
  }
  if (networkType === "local only") {
    return {
      mode: Rpc_Account_NetworkMode.LocalOnly,
      configPath: "",
    };
  }
  if (networkType === "staging") {
    return {
      mode: Rpc_Account_NetworkMode.CustomConfig,
      configPath: path.resolve(__dirname, `../../config.yml`),
    };
  } else {
    const configPath = path.resolve(__dirname, `../../${networkType}.yml`);
    if (!fs.existsSync(configPath)) {
      throw new Error(`Network configuration file not found: ${configPath}`);
    }
    return {
      mode: Rpc_Account_NetworkMode.CustomConfig,
      configPath: configPath,
    };
  }
}

export async function callAccountCreate(
  userNumber: number,
  networkType: string = "local"
): Promise<void> {
  console.log("### Initiating account creation...");

  const userData = store.users.get(userNumber);
  if (!userData) {
    throw new Error(`User data not found for user number ${userNumber}`);
  }

  const { mode, configPath } = getNetworkConfig(networkType);
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      // If it's not an Error instance, log it and throw a generic error
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred during account selection");
    }
  }
}

export async function callAccountSelect(
  accountId: string,
  networkType: string = "local only"
): Promise<void> {
  console.log("### Initiating account selection...");

  try {
    const { mode, configPath } = getNetworkConfig(networkType);
    console.log(`Using network mode: ${mode}, config path: ${configPath}`);

    const request: Rpc_Account_Select_Request = {
      id: accountId,
      rootPath: "",
      disableLocalNetworkSync: false,
      networkMode: mode,
      networkCustomConfigFilePath: configPath,
      preferYamuxTransport: false,
    };

    const response = await makeGrpcCall<Rpc_Account_Select_Response>(
      getCurrentClient().accountSelect,
      request
    );

    console.log("Account selected successfully:", response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      // If it's not an Error instance, log it and throw a generic error
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred during account selection");
    }
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      // If it's not an Error instance, log it and throw a generic error
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred during account stop");
    }
  }
}

export async function callAccountDelete(): Promise<void> {
  console.log("### Initiating account deletion...");

  const request: Rpc_Account_Delete_Request = {};
  try {
    const response = await makeGrpcCall<Rpc_Account_Delete_Response>(
      getCurrentClient().accountDelete,
      request
    );
    console.log("Account deleted successfully:", response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      // If it's not an Error instance, log it and throw a generic error
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred during account deletion");
    }
  }
}

export async function callAccountRecover(): Promise<string> {
  console.log("### Initiating account recovery...");

  const request: Rpc_Account_Recover_Request = {
    rootPath: "",
  };

  try {
    // Start listening for events before initiating recovery
    const eventPromise = new Promise<string>((resolve) => {
      store.onAccountShowEvent = (accountId: string) => {
        resolve(accountId);
      };
    });

    // Call listenSessionEvents in the background
    callListenSessionEvents();

    // Initiate account recovery
    const response = await makeGrpcCall<Rpc_Account_Recover_Response>(
      getCurrentClient().accountRecover,
      request
    );
    console.log("Account recovery initiated successfully:", response);

    // Wait for the AccountShow event
    const accountId = await eventPromise;
    console.log("Received AccountShow event with account ID:", accountId);

    return accountId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred during account recovery");
    }
  } finally {
    // Clean up the event listener
    store.onAccountShowEvent = null;
  }
}
