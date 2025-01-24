import { ChannelCredentials, ClientReadableStream } from "@grpc/grpc-js";
import {
  IClientCommandsClient,
  ClientCommandsClient,
} from "../../../pb/pb/protos/service/service.grpc-client";
import { store } from "../helpers/store";
import { ClientType } from "../../types/dataTypes";
import { EventEmitter } from "events";
import { StreamRequest } from "../../../pb/pb/protos/commands";
import { Event, Event_Message } from "../../../pb/pb/protos/events";

class GRPCClientManager {
  public eventEmitter: EventEmitter;
  private streams: Map<number, ClientReadableStream<Event>> = new Map();

  constructor(private address: string) {
    this.eventEmitter = new EventEmitter();
  }

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

  public updateClientToken(clientId: number, token: string): void {
    const clientEntry = store.clients.get(clientId);
    if (!clientEntry) {
      console.warn(`Client instance with ID ${clientId} does not exist.`);
      return;
    }
    clientEntry.authToken = token;
    store.clients.set(clientId, clientEntry);
    console.log(`Token updated for client ID ${clientId}`);
  }

  public closeClient(clientId: number): void {
    if (store.clients.has(clientId)) {
      this.closeStream(clientId);
      console.log(`Client instance with ID ${clientId} closed.`);
      store.clients.delete(clientId);
    } else {
      console.warn(`No client found with ID ${clientId}.`);
    }
  }

  public listenEvents(clientId: number): void {
    const clientEntry = store.clients.get(clientId);
    if (!clientEntry || !clientEntry.client || !clientEntry.authToken) {
      throw new Error(`No valid client or token found for ID ${clientId}`);
    }

    const request: StreamRequest = {
      token: clientEntry.authToken,
    };

    const stream = clientEntry.client.listenSessionEvents(request);
    this.streams.set(clientId, stream);

    stream.on("data", (event: Event) => {
      this.handleEvent(event);
    });

    stream.on("status", (status: { code: number }) => {
      if (status.code) {
        console.error(`[Client ${clientId}] Stream error:`, status);
        this.reconnect(clientId);
      }
    });

    stream.on("end", () => {
      console.error(`[Client ${clientId}] Stream ended, reconnecting`);
      this.reconnect(clientId);
    });
  }

  private handleEvent(event: Event): void {
    // Log the whole event to the console
    console.log("Received event!!!:", event);
    // Emit the whole event
    this.eventEmitter.emit("event", event);

    // Emit individual message types
    event.messages.forEach((message: Event_Message) => {
      if (message.value && message.value.oneofKind) {
        console.log(
          `Received message of type ${message.value.oneofKind}:`,
          message.value
        );

        // Type guard to ensure TypeScript understands the type
        switch (message.value.oneofKind) {
          case "accountShow":
            this.eventEmitter.emit("accountShow", message.value.accountShow);
            break;
          case "accountDetails":
            this.eventEmitter.emit(
              "accountDetails",
              message.value.accountDetails
            );
            break;
          case "accountConfigUpdate":
            this.eventEmitter.emit(
              "accountConfigUpdate",
              message.value.accountConfigUpdate
            );
            break;
          // Add more cases for other oneofKinds...
          // ...
          default:
            console.warn(`Unhandled oneofKind: ${message.value.oneofKind}`);
        }
      }
    });
  }

  private reconnect(clientId: number): void {
    setTimeout(() => {
      this.closeStream(clientId);
      this.listenEvents(clientId);
    }, 1000); // Reconnect after 1 second
  }

  private closeStream(clientId: number): void {
    const stream = this.streams.get(clientId);
    if (stream) {
      stream.cancel();
      this.streams.delete(clientId);
    }
  }

  public onEvent(eventType: string, callback: (data: any) => void): void {
    this.eventEmitter.on(eventType, callback);
  }

  public removeEventListener(
    eventType: string,
    callback: (data: any) => void
  ): void {
    this.eventEmitter.removeListener(eventType, callback);
  }
}

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
