import { getCurrentClient } from "../../helpers/proxy";
import { store } from "../../helpers/store";
import { isVersion035OrMore, makeGrpcCall } from "../services/utils";
import {
  Rpc_Object_Open_Request,
  Rpc_Object_Create_Request,
  Rpc_Object_Create_Response,
  Rpc_Object_Open_Response,
  Rpc_Object_Open_Response_Error_Code,
  Rpc_Object_ListSetDetails_Request,
  Rpc_Object_ListSetDetails_Response,
  Rpc_Object_Search_Request,
  Rpc_Object_SubscribeIds_Request,
  Rpc_Object_SubscribeIds_Response,
  Rpc_Object_Search_Response,
} from "../../../pb/pb/protos/commands";
import { Struct } from "../../../pb/google/protobuf/struct";

/**
 * Calls the objectCreate method on the gRPC client and handles the response.
 * @param objectNumber The number to associate with the created object in the store.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callCreateObject(objectNumber: number): Promise<void> {
  console.log("### Initiating object creation...");
  const client = getCurrentClient();
  const currentUser = store.currentUser;

  if (!currentUser?.accountSpaceId) {
    throw new Error("Error: spaceId not found for the current user.");
  }
  console.log(`Using spaceId: ${currentUser.accountSpaceId}`);
  const request: Rpc_Object_Create_Request = {
    details: {
      fields: {
        type: {
          kind: {
            oneofKind: "stringValue",
            stringValue: "ot-task",
          },
        },
      },
    },
    internalFlags: [{ value: 2 }, { value: 0 }],
    templateId: "",
    spaceId: currentUser.accountSpaceId,
    objectTypeUniqueKey: "ot-task",
    withChat: false,
  };

  try {
    const response = await makeGrpcCall<Rpc_Object_Create_Response>(
      client.objectCreate,
      request
    );

    if (response.objectId) {
      store.objects.set(objectNumber, {
        objectId: response.objectId,
        spaceId: currentUser.accountSpaceId,
      });
      console.log(
        `Object ${objectNumber} successfully created and saved in store.`
      );
    } else {
      throw new Error("Error: objectId not returned in the response.");
    }
  } catch (error) {
    console.error("Failed to create object:", error);
    throw error;
  }
}

/**
 * Opens an object by sending a gRPC request to the server.
 * @param objectNumber The number of the object in the store to open.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callOpenObject(
  objectId: string,
  spaceId: string
): Promise<void> {
  console.log(
    `### Initiating object open for object with id ${objectId} and spaceId ${spaceId}...`
  );

  const client = getCurrentClient();
  if (
    store.currentServerVersion &&
    isVersion035OrMore(store.currentServerVersion)
  ) {
    console.log(
      "Heart verison 35, Waiting for 15 seconds before objectOpening..."
    );
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }

  const request: Rpc_Object_Open_Request = {
    contextId: "",
    objectId: objectId,
    traceId: "",
    spaceId: spaceId,
    includeRelationsAsDependentObjects: false,
  };

  try {
    const response = await makeGrpcCall<Rpc_Object_Open_Response>(
      client.objectOpen,
      request
    );
    console.log(`Object opened successfully:`, response);
  } catch (error: any) {
    console.error(`Failed to open object. Error details:`, error);

    if (error && typeof error.code === "number") {
      const errorCodeName =
        Rpc_Object_Open_Response_Error_Code[error.code] || "UNKNOWN";
      console.error(`Error Code: ${error.code} (${errorCodeName})`);
    }

    if (error && error.details) {
      console.error(`Error Details: ${error.details}`);
    }

    if (error && error.metadata) {
      console.error(`Error Metadata:`, error.metadata.getMap());
    }

    throw error;
  }
}

export async function setDescription(
  objectId: string,
  value: string
): Promise<void> {
  console.log("### Initiating object list set details...");
  const client = getCurrentClient();

  try {
    const request: Rpc_Object_ListSetDetails_Request = {
      objectIds: [objectId],
      details: [
        {
          key: "description",
          value: {
            kind: {
              oneofKind: "stringValue",
              stringValue: value,
            },
          },
        },
      ],
    };

    const response = await makeGrpcCall<Rpc_Object_ListSetDetails_Response>(
      client.objectListSetDetails,
      request
    );
    console.log("Object list set details successful:", response);
  } catch (error) {
    console.error("Failed to set object list details:", error);
    throw error;
  }
}

export async function callObjectSubscribeIds(
  objectIds: string[],
  spaceId: string
): Promise<Struct[]> {
  console.log(
    `### Initiating object search for object with id ${objectIds} and spaceId ${spaceId}...`
  );
  const client = getCurrentClient();
  try {
    const request: Rpc_Object_SubscribeIds_Request = {
      spaceId: spaceId,
      subId: "",
      ids: objectIds,
      keys: ["description", "iconImage", "name"],
      noDepSubscription: true,
    };
    console.log("Request:", request);
    const response = await makeGrpcCall<Rpc_Object_SubscribeIds_Response>(
      client.objectSubscribeIds,
      request
    );
    console.log("Object subscribe ids successful:", response);
    console.log(
      "json parse:",
      Rpc_Object_SubscribeIds_Response.toJson(response)
    );
    return response.records;
  } catch (error) {
    console.error("Failed to search object:", error);
    throw error;
  }
}

export async function callObjectSearchProfile(
  profileId: string,
  spaceId: string
): Promise<void> {
  console.log(
    `### Initiating object search for object with id ${profileId} and spaceId ${spaceId}...`
  );
  const client = getCurrentClient();
  const searchRequestJson = {
    spaceId: spaceId,
    filters: [
      {
        id: "",
        operator: 0, // Corresponds to Block_Content_Dataview_Filter_Operator.AND
        RelationKey: "id",
        relationProperty: "",
        condition: 1, // Keeping the original value
        value: {
          stringValue: profileId,
        },
        quickOption: 0, // Corresponds to Block_Content_Dataview_Filter_QuickOption.NONE
        format: 0, // Corresponds to RelationFormat.DEFAULT
        includeTime: false,
      },
    ],
    limit: 0,
    offset: 0,
    keys: [
      "id",
      "spaceId",
      "name",
      "description",
      "snippet",
      "iconEmoji",
      "iconImage",
      "iconOption",
      "relationFormat",
      "type",
      "layout",
      "isHidden",
      "isArchived",
      "isReadonly",
      "isDeleted",
      "isFavorite",
      "done",
      "fileExt",
      "fileMimeType",
      "sizeInBytes",
      "restrictions",
      "defaultTemplateId",
      "identityProfileLink",
      "createdDate",
    ],
  };
  try {
    // Convert JSON to Rpc_Object_Search_Request
    const request: Rpc_Object_Search_Request =
      Rpc_Object_Search_Request.fromJson(searchRequestJson);

    // Make the gRPC call
    const response = await makeGrpcCall<Rpc_Object_Search_Response>(
      client.objectSearch,
      request
    );
    console.log("Object search successful:", response);
  } catch (error) {
    console.error("Failed to search object:", error);
    throw error;
  }
}
