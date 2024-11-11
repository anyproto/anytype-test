import { Struct } from "../../../pb/google/protobuf/struct";
import {
  Rpc_Object_SubscribeIds_Response,
  Rpc_Workspace_Open_Response,
} from "../../../pb/pb/protos/commands";

import { Rpc_Workspace_Open_Request } from "../../../pb/pb/protos/commands";
import { Account_Info } from "../../../pb/pkg/lib/pb/model/protos/models";
import { getCurrentClient } from "../../helpers/proxy";
import { makeGrpcCall } from "../services/utils";

export async function callWorkspaceOpen(
  spaceId: string
): Promise<Account_Info> {
  console.log(`### Initiating workspace open...`);
  const client = getCurrentClient();
  try {
    const request: Rpc_Workspace_Open_Request = {
      spaceId: spaceId,
      withChat: false,
    };
    console.log("Request:", request);
    const response = await makeGrpcCall<Rpc_Workspace_Open_Response>(
      client.workspaceOpen,
      request
    );
    console.log("Workspace open successful:", response);
    console.log("json parse:", Rpc_Workspace_Open_Response.toJson(response));
    if (response.info) {
      return response.info;
    } else {
      throw new Error("No info in response");
    }
  } catch (error) {
    console.error("Failed to open workspace:", error);
    throw error;
  }
}
