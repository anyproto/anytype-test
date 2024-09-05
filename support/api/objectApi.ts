import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
import { isVersion035, makeGrpcCall } from "../helpers/utils";
import {
  Rpc_Object_Open_Request,
  Rpc_Object_Create_Request,
  Rpc_Object_Create_Response,
  Rpc_Object_Open_Response,
  Rpc_Object_Open_Response_Error_Code,
} from "../../pb/pb/protos/commands";

/**
 * Calls the objectCreate method on the gRPC client and handles the response.
 * @param objectNumber The number to associate with the created object in the store.
 * @returns A promise that resolves when the gRPC call completes.
 */
export async function callCreateObject(objectNumber: number): Promise<void> {
  console.log("### Initiating object creation...");
  const client = getCurrentClient();
  const currentUser = store.currentUser;

  if (!currentUser?.spaceId) {
    throw new Error("Error: spaceId not found for the current user.");
  }
  console.log(`Using spaceId: ${currentUser.spaceId}`);

  const request: Rpc_Object_Create_Request = {
    internalFlags: [{ value: 2 }, { value: 0 }],
    templateId: "",
    spaceId: currentUser.spaceId,
    objectTypeUniqueKey: "ot-task",
  };

  try {
    const response = await makeGrpcCall<Rpc_Object_Create_Response>(
      client.objectCreate,
      request
    );

    if (response.objectId) {
      store.objects.set(objectNumber, {
        objectId: response.objectId,
        spaceId: currentUser.spaceId,
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
export async function callOpenObject(objectNumber: number): Promise<void> {
  console.log(
    `### Initiating object open for object number ${objectNumber}...`
  );

  const client = getCurrentClient();
  //wait for 60 seconds
  if (store.currentServerVersion && isVersion035(store.currentServerVersion)) {
    console.log(
      "Heart verison 35, Waiting for 15 seconds before objectOpening..."
    );
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }

  const object = store.objects.get(objectNumber);

  if (!object) {
    throw new Error(`Object with number ${objectNumber} not found in store.`);
  }

  const request: Rpc_Object_Open_Request = {
    contextId: "",
    objectId: object.objectId,
    traceId: "",
    spaceId: object.spaceId,
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
