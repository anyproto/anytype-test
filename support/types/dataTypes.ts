import { IClientCommandsClient } from "../../pb/pb/protos/service/service.grpc-client";
import { ChildProcess } from "child_process";

export type UserType = {
  mnemonic: string;
  name: string;
  accountId?: string;
  spaceId?: string;
  analyticsId?: string;
  profileObjectId?: string;
  techSpaceId?: string;
  iconImage?: string;
  accountSpaceId?: string;
};

export type ServerType = {
  address: string;
  process: ChildProcess;
  version?: string;
};

export type ClientType = {
  client: IClientCommandsClient;
  dir?: string;
  authToken?: string; // Optional token for authenticated requests
};

export type ObjectType = {
  objectId: string;
  spaceId: string;
};
