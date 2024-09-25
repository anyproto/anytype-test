import { Given, setDefaultTimeout } from "@cucumber/cucumber";
import { callMetricsSetParameters } from "../api/metricsApi";
import { heartResolve } from "../heartResolve";
import { store } from "../helpers/store";
import { GRPCServerManager, stopServer } from "../server";
import { GRPCClientManager } from "../client";
import { Logger } from "@origranot/ts-logger";
import { stopListenSessionEvents } from "../api/streamRequest";
import { callAccountStop } from "../api/accountApi";
import { setUserAsCurrentUser } from "../helpers/utils";

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

Given("the metrics parameters are set", async () => {
  try {
    await callMetricsSetParameters();
    logger.info("Metrics parameters set successfully");
  } catch (error) {
    logger.error("Failed to set metrics parameters:", error);
    throw error;
  }
});

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

    try {
      const paths: Paths = await resolveHeartPaths(heartVersion);
      const grpcServerManager = new GRPCServerManager(
        paths.binPath,
        paths.workingDir,
        heartVersion
      );
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
    logger.info(`Stop listen session events`);
    stopListenSessionEvents();
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
