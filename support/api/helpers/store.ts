import {
  UserType,
  ServerType,
  ObjectType,
  ClientType,
} from "../../types/dataTypes";
import { IClientCommandsClient } from "../../../pb/pb/protos/service/service.grpc-client";
import { GRPCClientManager } from "../services/gprcClient";
import { logger } from "./loggerConfig";

export type storeType = {
  grpcClientManager?: GRPCClientManager;
  users: Map<number, UserType>;
  servers: Map<number, ServerType>;
  objects: Map<number, ObjectType>;
  clients: Map<number, ClientType>;
  currentUserNumber?: number;
  currentClientNumber?: number;
  currentServerVersion?: string;
  currentUser: UserType;
  currentClient: ClientType;
  getClientDirectory: (clientId: number) => string | undefined;
  getClientInstance: (clientId: number) => IClientCommandsClient | undefined;
  getClientAuthToken: (clientId: number) => string | undefined;
  clear: () => void;
  spaceSyncStatusReceived: boolean;
  onAccountShowEvent: ((accountId: string) => void) | null;
  setUserProperty: (
    userNumber: number,
    property: keyof UserType,
    value: UserType[keyof UserType]
  ) => void;
  tempDir: string | undefined;
  getServerVersionForClient: (clientId: number) => string;
};

export const store: storeType = {
  users: new Map(),
  servers: new Map(),
  objects: new Map(),
  clients: new Map(),
  grpcClientManager: undefined,
  spaceSyncStatusReceived: false,
  onAccountShowEvent: null,
  tempDir: undefined,

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

  get currentServerVersion(): string {
    if (this.currentClientNumber !== undefined) {
      const server = this.servers.get(this.currentClientNumber);
      if (server) {
        return server.version as string;
      } else {
        throw new Error(
          "Error in test scenario logic. Server with the current client number does not exist in server collection"
        );
      }
    } else {
      throw new Error(
        "Error in test scenario logic. Need to set current client before calling currentServerVersion getter"
      );
    }
  },

  get currentUser(): UserType {
    logger.info("Current users are called");
    if (this.currentUserNumber !== undefined) {
      logger.info(`Current user is user number ${this.currentUserNumber}`, {
        user: this.currentUserNumber,
      });
      const user = this.users.get(this.currentUserNumber) as UserType;
      if (user) {
        logger.info("User data:", JSON.stringify(user), {
          user: this.currentUserNumber,
        });
        return user;
      } else {
        logger.error("Users in store:", Array.from(this.users), {
          user: this.currentUserNumber,
        });
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
    this.onAccountShowEvent = null;
    this.tempDir = undefined;
  },

  setUserProperty<K extends keyof UserType>(
    userNumber: number,
    property: K,
    value: UserType[K]
  ): void {
    const user = this.users.get(userNumber);
    if (user) {
      user[property] = value;
      this.users.set(userNumber, user);
    } else {
      throw new Error(`User with number ${userNumber} not found`);
    }
  },

  getServerVersionForClient(clientId: number): string {
    const server = this.servers.get(clientId);
    if (server?.version) {
      return server.version;
    }
    throw new Error(`Server version not found for client ${clientId}`);
  },
};
