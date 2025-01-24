import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
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
  Rpc_BlockText_SetText_Request,
  Rpc_BlockText_SetText_Response,
  Rpc_Object_ImportUseCase_Request,
  Rpc_Object_ImportUseCase_Request_UseCase,
  Rpc_Object_ImportUseCase_Response,
} from "../../../pb/pb/protos/commands";
import { Struct } from "../../../pb/google/protobuf/struct";
import {
  Block_Content_Dataview_Filter,
  ObjectView,
} from "../../../pb/pkg/lib/pb/model/protos/models";
import { ObjectTypeKeys } from "../constants";
import { ObjectTypeValue } from "../constants";

/**
 * Calls the objectCreate method on the gRPC client and handles the response.
 * @param objectNumber The number to associate with the created object in the store.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callCreateObject(
  objectNumber: number,
  objectType: ObjectTypeValue = ObjectTypeKeys.task
): Promise<string> {
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
            stringValue: objectType,
          },
        },
      },
    },
    internalFlags: [{ value: 2 }, { value: 0 }],
    templateId: "",
    spaceId: currentUser.accountSpaceId,
    objectTypeUniqueKey: objectType,
    withChat: false,
  };

  try {
    const response = await makeGrpcCall<Rpc_Object_Create_Response>(
      client.objectCreate,
      request
    );
    console.log("Create object response:", JSON.stringify(response, null, 2));

    if (response.objectId) {
      store.objects.set(objectNumber, {
        objectId: response.objectId,
        spaceId: currentUser.accountSpaceId,
      });
      console.log(
        `Object ${objectNumber} successfully created and saved in store.`
      );
      return response.objectId;
    } else {
      throw new Error("Error: objectId not returned in the response.");
    }
  } catch (error) {
    console.error("Failed to create object:", error);
    throw error;
  }
}

export async function callObjectSearch(
  filters: Block_Content_Dataview_Filter[],
  spaceId: string
): Promise<Struct[]> {
  console.log("### Initiating object search...");
  const client = getCurrentClient();
  const request: Rpc_Object_Search_Request = {
    spaceId: spaceId,
    filters: filters,
    limit: 0,
    offset: 0,
    keys: [],
    sorts: [],
    fullText: "",
    objectTypeFilter: [],
  };
  const response = await makeGrpcCall<Rpc_Object_Search_Response>(
    client.objectSearch,
    request
  );
  console.log("Object search response:", JSON.stringify(response, null, 2));
  return response.records;
}
/**
 * Opens an object by sending a gRPC request to the server.
 * @param objectId The ID of the object to open.
 * @param spaceId The space ID where the object is located.
 * @returns A promise that resolves to an ObjectView when the gRPC call completes.
 */
export async function callOpenObject(
  objectId: string,
  spaceId: string
): Promise<ObjectView> {
  console.log(
    `### Initiating object open for object with id ${objectId} and spaceId ${spaceId}...`
  );

  const client = getCurrentClient();
  if (
    store.currentServerVersion &&
    isVersion035OrMore(store.currentServerVersion)
  ) {
    console.log(
      "Heart verison 35 or more, Waiting for 5 seconds before objectOpening..."
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const request: Rpc_Object_Open_Request = {
    contextId: "",
    objectId: objectId,
    traceId: "",
    spaceId: spaceId,
    includeRelationsAsDependentObjects: false,
  };
  console.log("Request to open object with client", JSON.stringify(client));
  try {
    const response = await makeGrpcCall<Rpc_Object_Open_Response>(
      client.objectOpen,
      request
    );
    console.log(
      "Object opened successfully:",
      JSON.stringify(response, null, 2)
    );
    if (!response.objectView) {
      throw new Error("Object view not returned in response");
    }
    return response.objectView;
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
    console.log(
      "Object list set details successful:",
      JSON.stringify(response, null, 2)
    );
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
    console.log(
      "Object subscribe ids successful:",
      JSON.stringify(response, null, 2)
    );
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
        condition: 1,
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
    console.log("Object search successful:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Failed to search object:", error);
    throw error;
  }
}

export async function callBlockTextSetTextForTitle(
  objectId: string,
  text: string
): Promise<void> {
  console.log("### Initiating object list set details...");
  const client = getCurrentClient();
  try {
    const request: Rpc_BlockText_SetText_Request = {
      blockId: "title",
      contextId: objectId,
      text: text,
    };
    const response = await makeGrpcCall<Rpc_BlockText_SetText_Response>(
      client.blockTextSetText,
      request
    );
    console.log(
      "Block text set text successful:",
      JSON.stringify(response, null, 2)
    );
  } catch (error) {
    console.error("Failed to set object list details:", error);
    throw error;
  }
}

export async function callBlockTextSetText(
  objectId: string,
  blockId: string,
  text: string
): Promise<void> {
  console.log("### Initiating object list set details...");
  const client = getCurrentClient();
  try {
    const request: Rpc_BlockText_SetText_Request = {
      blockId: blockId,
      contextId: objectId,
      text: text,
    };
    const response = await makeGrpcCall<Rpc_BlockText_SetText_Response>(
      client.blockTextSetText,
      request
    );
    console.log(
      "Block text set text successful:",
      JSON.stringify(response, null, 2)
    );
  } catch (error) {
    console.error("Failed to set object list details:", error);
    throw error;
  }
}

export async function callBlockTextSetTextForTitleExpectError(
  objectId: string,
  text: string
): Promise<boolean> {
  console.log("### Checking block text set permissions...");
  const request: Rpc_BlockText_SetText_Request = {
    blockId: "title",
    contextId: objectId,
    text: text,
  };

  try {
    console.log(
      "Setting block text, expecting error code 1 - insufficient permissions"
    );
    const response = await makeGrpcCall<Rpc_BlockText_SetText_Response>(
      getCurrentClient().blockTextSetText,
      request,
      [1]
    );

    if (!response.error || response.error.code === 0) {
      return false;
    }

    // Check if error code is 1 (insufficient permissions)
    return response.error.code === 1;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      return (error as { code: number }).code === 1; // Expected permission error
    }
    console.error("Failed to set block text:", error);
    throw error; // Re-throw if it's a different error
  }
}

export async function callImportUseCase(
  spaceId: string,
  useCase: string
): Promise<void> {
  console.log("### Initiating object import use case...");
  const client = getCurrentClient();

  // Map string to enum value
  const useCaseEnum =
    Rpc_Object_ImportUseCase_Request_UseCase[
      useCase as keyof typeof Rpc_Object_ImportUseCase_Request_UseCase
    ] ?? Rpc_Object_ImportUseCase_Request_UseCase.NONE;

  const request: Rpc_Object_ImportUseCase_Request = {
    spaceId: spaceId,
    useCase: useCaseEnum,
  };

  try {
    const response = await makeGrpcCall<Rpc_Object_ImportUseCase_Response>(
      client.objectImportUseCase,
      request
    );
    console.log(
      "Use case import successful:",
      JSON.stringify(response, null, 2)
    );
  } catch (error) {
    console.error("Failed to import use case:", error);
    throw error;
  }
}

export async function callOpenObjectWithExpectedError(
  objectId: string,
  spaceId: string
): Promise<boolean> {
  console.log("### Checking object open permissions...");
  const request: Rpc_Object_Open_Request = {
    contextId: "",
    objectId: objectId,
    traceId: "",
    spaceId: spaceId,
    includeRelationsAsDependentObjects: false,
  };

  try {
    console.log(
      "Opening object, expecting error code 1 - failed to load space"
    );
    const response = await makeGrpcCall<Rpc_Object_Open_Response>(
      getCurrentClient().objectOpen,
      request,
      [1] // Expected error code
    );

    if (!response.error || response.error.code === 0) {
      return false;
    }
    console.log("Error code:", response.error.code);
    // Check if error code is 1 (failed to load space)
    return response.error.code === 1;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      return (error as { code: number }).code === 1; // Expected space loading error
    }
    console.error("Failed to open object:", error);
    throw error; // Re-throw if it's a different error
  }
}
