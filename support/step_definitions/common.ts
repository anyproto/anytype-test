import { Given, setDefaultTimeout } from "@cucumber/cucumber";
import { callMetricsSetParameters } from "../api/metricsApi";
import { heartResolve } from "../heartResolve";
import { store } from "../helpers/store";
import { GRPCServerManager, stopServer } from "../server";
import { GRPCClientManager } from "../client";
import { setUserAsCurrentUser } from "./accountSteps";

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
export const setClientAsCurrentClient = (clientNumber: number) => {
  store.currentClientNumber = clientNumber;
  console.log(`Switched to client number ${clientNumber}`);

  console.log(
    "Current stored clients:",
    JSON.stringify(Array.from(store.clients.entries()))
  );
  return store;
};

Given("the metrics parameters are set", async () => {
  await callMetricsSetParameters();
});

/**
 * Starts the gRPC server and client, storing their instances.
 * @param heartVersion The heart version string.
 * @param serverNumber The server number identifier.
 */
Given(
  "the server {string} {int} is running",
  async (heartVersion: string, serverNumber: number) => {
    console.log(
      `Starting server for version: ${heartVersion}, server number: ${serverNumber}`
    );

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

    console.log(
      `Server started at: ${server.address}, version: ${heartVersion}`
    );

    // Initialize and store the GRPCClientManager
    const grpcClientManager = new GRPCClientManager(server.address);
    store.grpcClientManager = grpcClientManager;
    grpcClientManager.createClient(serverNumber);
    setClientAsCurrentClient(serverNumber);
  }
);

/**
 * Step to set a specific client as the active client.
 * @param clientNumber The client number to use.
 */
Given("client {int} is used", (clientNumber: number) => {
  setClientAsCurrentClient(clientNumber);
});
/**
 * Step to set a specific client as the active client and the user as the active user.
 * @param userNumber The user number to use. Defaults to 1.
 * @param clientNumber The client number to use.
 */
Given(
  /^the user(?: (\d+))? is using client (\d+)$/,
  function (userNumber: number | undefined, clientNumber: number) {
    // Default userNumber to 1 if not provided
    userNumber = userNumber ? userNumber : 1;
    clientNumber = clientNumber;

    setClientAsCurrentClient(clientNumber);
    setUserAsCurrentUser(userNumber);
  }
);

/**
 * Kills the gRPC server
 * @param serverNumber The server number identifier.
 */
Given("the server {int} is stopped", async (serverNumber: number) => {
  console.log(`Stoping server number: ${serverNumber}`);
  stopServer(serverNumber);
});

/**
 * Resolves the paths for the given heart version.
 * @param heartVersion The version of the heart to resolve.
 * @returns The resolved paths.
 * @throws If heart resolution fails.
 */
async function resolveHeartPaths(heartVersion: string): Promise<Paths> {
  try {
    console.log(`Resolving paths for heart version: ${heartVersion}`);
    const paths = await heartResolve(heartVersion);
    console.log("Resolved paths:", paths);
    return paths;
  } catch (error) {
    console.error(
      `Failed to resolve paths for heart version ${heartVersion}:`,
      error
    );
    throw error;
  }
}
