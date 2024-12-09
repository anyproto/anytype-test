import type { IClientCommandsClient } from "../../pb/pb/protos/service/service.grpc-client";
import type { ChildProcess } from "child_process";

interface UserType {
  mnemonic: string;
  name: string;
  accountId?: string;
  spaceId?: string;
  analyticsId?: string;
  profileObjectId?: string;
  techSpaceId?: string;
  iconImage?: string;
  accountSpaceId?: string;
}

interface ServerType {
  address: string;
  process: ChildProcess;
  version?: string;
}

interface ClientType {
  client: IClientCommandsClient;
  dir?: string;
  authToken?: string;
}

interface ObjectType {
  objectId: string;
  spaceId: string;
}

export { UserType, ServerType, ClientType, ObjectType };
