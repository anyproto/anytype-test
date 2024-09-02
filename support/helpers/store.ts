import { UserType, ServerType, ObjectType, ClientType } from "./../dataTypes";
import { IClientCommandsClient } from "../../pb/pb/protos/service/service.grpc-client";
import { GRPCClientManager } from "../client";

export type storeType = {
  grpcClientManager?: GRPCClientManager;
  users: Map<number, UserType>;
  servers: Map<number, ServerType>;
  objects: Map<number, ObjectType>;
  clients: Map<number, ClientType>;
  currentUserNumber?: number;
  currentClientNumber?: number;
  currentUser: UserType;
  currentClient: ClientType;
  getClientDirectory: (clientId: number) => string | undefined;
  getClientInstance: (clientId: number) => IClientCommandsClient | undefined;
  getClientAuthToken: (clientId: number) => string | undefined;
  clear: () => void;
  spaceSyncStatusReceived: boolean;
};

export const store: storeType = {
  users: new Map(),
  servers: new Map(),
  objects: new Map(),
  clients: new Map(),
  grpcClientManager: undefined,
  spaceSyncStatusReceived: false,

  get currentClient(): ClientType {
    if (this.currentClientNumber !== undefined) {
      const client = this.clients.get(this.currentClientNumber) as ClientType;
      if (client) {
        return client;
      } else {
        throw new Error(
          "Error in test scenario logic. Client with the current client number does not exist in client collection"
        );
      }
    } else {
      throw new Error(
        "Error in test scenario logic. Need to set current client before calling currentClient getter"
      );
    }
  },

  get currentUser(): UserType {
    console.log("Current users are called");
    if (this.currentUserNumber !== undefined) {
      console.log("STORED USERS ARE" + JSON.stringify(this.users));
      const user = this.users.get(this.currentUserNumber) as UserType;
      if (user) {
        return user;
      } else {
        console.log(this.users);
        throw new Error(
          "Error in test scenario logic. User with the current user number does not exist in users collection"
        );
      }
    } else {
      throw new Error(
        "Error in test scenario logic. Need to set current user before calling currentUser getter"
      );
    }
  },

  getClientDirectory(clientId: number): string | undefined {
    const client = this.clients.get(clientId);
    return client?.dir;
  },

  getClientInstance(clientId: number): IClientCommandsClient | undefined {
    const client = this.clients.get(clientId);
    return client?.client;
  },

  getClientAuthToken(clientId: number): string | undefined {
    const client = this.clients.get(clientId);
    return client?.authToken;
  },

  clear: function () {
    this.users = new Map();
    this.servers = new Map();
    this.objects = new Map();
    this.clients = new Map();
    this.spaceSyncStatusReceived = false;
  },
};
