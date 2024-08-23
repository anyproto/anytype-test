import { ChannelCredentials } from "@grpc/grpc-js";
import {
  IClientCommandsClient,
  ClientCommandsClient,
} from "../pb/pb/protos/service/service.grpc-client";
import { store } from "./helpers/store";
import { ClientType } from "./dataTypes";

class GRPCClientManager {
  constructor(private address: string) {}

  // Method to create or get a client
  public createClient(clientId: number): IClientCommandsClient {
    const existingClient = store.clients.get(clientId);

    if (existingClient) {
      console.warn(`Client instance with ID ${clientId} already exists.`);
      return existingClient.client;
    }

    console.log(`Creating new client ${clientId}`);
    const newClient = new ClientCommandsClient(
      this.address,
      ChannelCredentials.createInsecure()
    );

    const clientData: ClientType = { client: newClient };
    store.clients.set(clientId, clientData);
    console.log(`New client created and stored with ID ${clientId}`);
    return newClient;
  }

  // Method to update the token for an existing client
  public updateClientToken(clientId: number, token: string): void {
    const clientEntry = store.clients.get(clientId);

    if (!clientEntry) {
      console.warn(`Client instance with ID ${clientId} does not exist.`);
      return;
    }

    // Update the authToken in the store
    clientEntry.authToken = token;
    store.clients.set(clientId, clientEntry);
    console.log(`Token updated for client ID ${clientId}`);
  }

  // Method to close a client
  public closeClient(clientId: number): void {
    if (store.clients.has(clientId)) {
      console.log(`Client instance with ID ${clientId} closed.`);
      store.clients.delete(clientId);
    } else {
      console.warn(`No client found with ID ${clientId}.`);
    }
  }
}

// Utility function to get the current client instance
function getCurrentClient(): IClientCommandsClient {
  if (!store.currentClientNumber) {
    console.error("Error: Current client number is not defined");
    throw new Error("Current client number is not defined");
  }

  const client = store.getClientInstance(store.currentClientNumber);

  if (!client) {
    throw new Error(
      "Error: Client instance not found for the current client number"
    );
  }

  return client;
}

export { GRPCClientManager, getCurrentClient };
