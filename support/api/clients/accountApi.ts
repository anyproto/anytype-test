import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
import { callListenSessionEvents } from "../services/streamRequest";
import {
  Rpc_Account_Create_Request,
  Rpc_Account_Create_Response,
  Rpc_Account_Delete_Request,
  Rpc_Account_Delete_Response,
  Rpc_Account_Migrate_Request,
  Rpc_Account_Migrate_Response,
  Rpc_Account_NetworkMode,
  Rpc_Account_Recover_Request,
  Rpc_Account_Recover_Response,
  Rpc_Account_Select_Request,
  Rpc_Account_Select_Response,
  Rpc_Account_Select_Response_Error_Code,
  Rpc_Account_Stop_Request,
  Rpc_Account_Stop_Response,
} from "../../../pb/pb/protos/commands";
import { getTempDirectory, makeGrpcCall } from "../services/utils";
import * as path from "path";
import * as fs from "fs";
import { Account } from "../../../pb/pkg/lib/pb/model/protos/models";
import { logger } from "../helpers/loggerConfig";

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
    const configPath = path.resolve(__dirname, `../../../config.yml`);
    logger.info(`Staging config path: ${configPath}`);
    
    // Check if file exists and content is not empty
    if (!fs.existsSync(configPath)) {
      throw new Error(`Staging config file not found: ${configPath}`);
    }
    const content = fs.readFileSync(configPath, 'utf8').trim();
    if (!content) {
      throw new Error(`Staging config file is empty: ${configPath}`);
    }

    return {
      mode: Rpc_Account_NetworkMode.CustomConfig,
      configPath: configPath,
    };
  }
  if (networkType === "docker") {
    const configPath = path.resolve(__dirname, `../../../myDocker.yml`);
    logger.info(`Docker config path: ${configPath}`);
    return {
      mode: Rpc_Account_NetworkMode.CustomConfig,
      configPath: configPath,
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
): Promise<Rpc_Account_Create_Response> {
  logger.info("### Initiating account creation...", { user: userNumber });

  const userData = store.users.get(userNumber);
  if (!userData) {
    throw new Error(`User data not found for user number ${userNumber}`);
  }

  const { mode, configPath } = getNetworkConfig(networkType);
  logger.info(
    `Using network mode: ${Rpc_Account_NetworkMode[mode]}, config path: ${configPath}`,
    { user: userNumber }
  );

  const request: Rpc_Account_Create_Request = {
    name: userData.name || "test",
    avatar: {
      oneofKind: "avatarLocalPath",
      avatarLocalPath: "../../assets/anytype.jpg",
    },
    storePath: "",
    icon: BigInt(5),
    disableLocalNetworkSync: true,
    networkMode: mode,
    networkCustomConfigFilePath: configPath,
    preferYamuxTransport: false,
    jsonApiListenAddr: "",
  };

  try {
    const response = await makeGrpcCall<Rpc_Account_Create_Response>(
      getCurrentClient().accountCreate,
      request
    );
    logger.info(
      `Account created successfully: ${JSON.stringify(response.account?.info)}`,
      { user: userNumber }
    );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred during account creation");
    }
  }
}

export async function callAccountSelect(
  accountId: string,
  networkType: string = "local only"
): Promise<Account> {
  logger.info("### Initiating account selection...");

  try {
    const { mode, configPath } = getNetworkConfig(networkType);
    logger.info(
      `Using network mode: ${Rpc_Account_NetworkMode[mode]}, config path: ${configPath}`
    );

    const request: Rpc_Account_Select_Request = {
      id: accountId,
      rootPath: getTempDirectory(),
      disableLocalNetworkSync: true,
      networkMode: mode,
      networkCustomConfigFilePath: configPath,
      preferYamuxTransport: false,
      jsonApiListenAddr: "",
    };

    logger.info("Request:", request);

    try {
      const response = await makeGrpcCall<Rpc_Account_Select_Response>(
        getCurrentClient().accountSelect,
        request,
        [Rpc_Account_Select_Response_Error_Code.ACCOUNT_STORE_NOT_MIGRATED]
      );

      // Check if there's a migration needed error in the response
      if (response.error?.code === Rpc_Account_Select_Response_Error_Code.ACCOUNT_STORE_NOT_MIGRATED) {
        logger.info("Account needs migration, initiating migration process...");
        await callAccountMigrate(accountId, getTempDirectory());
        
        // Retry account selection after migration
        const retryResponse = await makeGrpcCall<Rpc_Account_Select_Response>(
          getCurrentClient().accountSelect,
          request
        );
        
        if (retryResponse.account) {
          return retryResponse.account;
        } else {
          throw new Error("No account found in the response after migration");
        }
      }

      // If no migration error, proceed normally
      logger.info("Account selected successfully:", response);
      if (response.account) {
        return response.account;
      } else {
        throw new Error("No account found in the response");
      }
    } catch (grpcError: any) {
      throw grpcError;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      logger.error("An unknown error occurred:", error);
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
      if (error.message.includes("Call cancelled")) {
        console.log(
          "Account stop call cancelled, but this is expected during shutdown."
        );
      } else {
        throw error.message;
      }
    } else {
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
    rootPath: getTempDirectory(),
  };

  try {
    // Start listening for events before initiating recovery
    const eventPromise = new Promise<string>((resolve) => {
      store.onAccountShowEvent = (accountId: string) => {
        resolve(accountId);
      };
    });

    const clientNumber = store.currentClientNumber;
    if (!clientNumber) {
      throw new Error("No client number set");
    }
    // Call listenSessionEvents in the background
    callListenSessionEvents(clientNumber);
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

export async function callAccountMigrate(
  accountId: string,
  rootPath: string
): Promise<void> {
  console.log("### Initiating account migration...");
  const request: Rpc_Account_Migrate_Request = {
    id: accountId,
    rootPath: getTempDirectory(),
  };
  const response = await makeGrpcCall<Rpc_Account_Migrate_Response>(
    getCurrentClient().accountMigrate,
    request
  );
  console.log("Account migration initiated successfully:", response);
}
