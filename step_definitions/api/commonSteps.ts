import { Given, setDefaultTimeout } from "@cucumber/cucumber";
import {
  callInitialSetParameters,
  callMetricsSetParameters,
} from "../../support/api/clients/metricsApi";
import { heartResolve } from "../../support/api/services/heartResolve";
import { store } from "../../support/helpers/store";
import {
  GRPCServerManager,
  stopServer,
} from "../../support/api/services/gprcServerManager";
import { GRPCClientManager } from "../../support/api/services/gprcClient";
import { Logger } from "@origranot/ts-logger";
import { stopListenSessionEvents } from "../../support/api/services/streamRequest";
import { callAccountStop } from "../../support/api/clients/accountApi";
import {
  isVersion037OrMore,
  setUserAsCurrentUser,
} from "../../support/api/services/utils";
import { exec } from "child_process";

const logger = new Logger();

interface Paths {
  binPath: string;
  workingDir: string;
}

// Set default timeout for Cucumber steps
setDefaultTimeout(120 * 1000);

/**
 * Sets the current client in the store.
 * @param clientNumber The client number to set as current.
 */
export const setClientAsCurrentClient = (clientNumber: number): void => {
  store.currentClientNumber = clientNumber;
  logger.info(`Switched to client number ${clientNumber}`);
  logger.debug("Current stored clients:", Array.from(store.clients.entries()));
};

/**
 * Starts the gRPC server and client, storing their instances.
 * @param heartVersion The heart version string.
 * @param serverNumber The server number identifier.
 */
Given(
  "the server {string} {int} is running",
  async (heartVersion: string, serverNumber: number) => {
    logger.info(
      `Starting server for version: ${heartVersion}, server number: ${serverNumber}`
    );

    /* // Check Go installation
    const isGoInstalled = await checkGoInstallation();
    if (!isGoInstalled) {
      logger.error(
        "Go is not installed or not in PATH. Please install Go and add it to your PATH."
      );
      throw new Error("Go is not installed or not in PATH");
    } */

    try {
      const paths: Paths = await resolveHeartPaths(heartVersion);
      logger.debug(`Resolved paths: ${JSON.stringify(paths)}`);

      const grpcServerManager = new GRPCServerManager(
        paths.binPath,
        paths.workingDir,
        heartVersion
      );
      logger.debug(`Attempting to start server with binPath: ${paths.binPath}`);

      await grpcServerManager.startServer(serverNumber);

      const server = store.servers.get(serverNumber);
      if (!server) {
        throw new Error(
          `Failed to start the server for version: ${heartVersion}`
        );
      }
      server.version = heartVersion;

      logger.info(
        `Server started at: ${server.address}, version: ${heartVersion}`
      );

      const grpcClientManager = new GRPCClientManager(server.address);
      store.grpcClientManager = grpcClientManager;
      grpcClientManager.createClient(serverNumber);
      setClientAsCurrentClient(serverNumber);
    } catch (error) {
      logger.error(`Failed to start server ${serverNumber}:`, error);
      throw error;
    }
    try {
      if (isVersion037OrMore(heartVersion)) {
        await callInitialSetParameters();
      } else {
        await callMetricsSetParameters();
      }
      logger.info("Metrics/Initial parameters set successfully");
    } catch (error) {
      logger.error("Failed to set metrics/initial parameters:", error);
      throw error;
    }
  }
);

Given("client {int} is used", (clientNumber: number) => {
  setClientAsCurrentClient(clientNumber);
});

Given(
  /^the user(?: (\d+))? is using client (\d+)$/,
  (userNumber: number, clientNumber: number) => {
    // Default userNumber to 1 if not provided
    userNumber = userNumber ? userNumber : 1;
    setClientAsCurrentClient(clientNumber);
    setUserAsCurrentUser(userNumber);
  }
);

Given("the server {int} is stopped", async (serverNumber: number) => {
  logger.info(`STEP: the server ${serverNumber} is stopped`);
  try {
    logger.info(`Call account stop`);
    await callAccountStop();
  } catch (error) {
    logger.warn(`Error during account stop: ${error}`);
  }

  try {
    logger.info(`Stop listen session events`);
    stopListenSessionEvents();
  } catch (error) {
    logger.warn(`Error stopping listen session events: ${error}`);
  }

  try {
    logger.info(`Stopping server number: ${serverNumber}`);
    stopServer(serverNumber);
    logger.info(`Server ${serverNumber} stopped successfully`);
  } catch (error) {
    logger.error(`Failed to stop server ${serverNumber}:`, error);
    throw error;
  }
});

/**
 * Resolves the paths for the given heart version.
 * @param heartVersion The version of the heart to resolve.
 * @returns The resolved paths.
 * @throws If heart resolution fails.
 */
async function resolveHeartPaths(heartVersion: string): Promise<Paths> {
  try {
    logger.debug(`Resolving paths for heart version: ${heartVersion}`);
    const paths = await heartResolve(heartVersion);
    logger.debug("Resolved paths:", paths);
    return paths;
  } catch (error) {
    logger.error(
      `Failed to resolve paths for heart version ${heartVersion}:`,
      error
    );
    throw error;
  }
}

/**
 * Checks if Go is installed and in the system PATH.
 * @returns A promise that resolves to true if Go is installed and in PATH, false otherwise.
 */
function checkGoInstallation(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("go version", (error, stdout, stderr) => {
      if (error) {
        logger.error("Error checking Go installation:", error);
        resolve(false);
      } else if (stderr) {
        logger.error("Error output while checking Go installation:", stderr);
        resolve(false);
      } else {
        logger.info("Go is installed and in PATH:", stdout.trim());
        resolve(true);
      }
    });
  });
}