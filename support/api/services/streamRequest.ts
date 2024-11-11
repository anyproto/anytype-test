import { getCurrentClient } from "../../helpers/proxy";
import { store } from "../../helpers/store";
import { StreamRequest } from "../../../pb/pb/protos/commands";
import {
  Event,
  Event_Message,
  Event_Space_Network,
  Event_Space_Status,
  Event_Space_SyncError,
  Event_Status_Thread_SyncStatus,
} from "../../../pb/pb/protos/events";
import { Logger } from "@origranot/ts-logger";
import { isVersion034OrLess } from "./utils";

let call: any; // Declare the 'call' variable outside to manage its lifecycle
const logger = new Logger();
/**
 * Utility function to safely convert an object to a JSON string,
 * handling BigInt values by converting them to strings.
 */
function safeStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

/**
 * Calls the listenSessionEvents method on the gRPC client and handles the server stream response.
 */
export async function callListenSessionEvents(): Promise<void> {
  console.log("### Initiating listenSessionEvents...");

  // Get the current gRPC client
  const client = getCurrentClient();
  const currentClientNumber = store.currentClientNumber;
  if (!currentClientNumber) {
    throw new Error("No client number set");
  }
  if (!store.currentServerVersion) {
    throw new Error("No server version set");
  }
  const heartVersion = store.currentServerVersion;
  const token = store.getClientAuthToken(currentClientNumber);
  if (!token) {
    throw new Error("No token found for client number");
  }

  // Log the request object for debugging
  const request = StreamRequest.create({
    token: token,
  });
  console.log("Request object:", safeStringify(request));

  try {
    // Initiate the server-side streaming call using the client and request
    const call = client.listenSessionEvents(request);

    // Add error handler before other event handlers
    call.on("error", (error: any) => {
      console.error("Stream error details:", {
        code: error?.code,
        details: error?.details,
        metadata: error?.metadata,
        stack: error?.stack,
      });

      // Check if it's a serialization error
      if (error.code === 13) {
        console.error("Serialization error detected. Request object:", request);
      }
    });

    // Handle the 'data' event to receive each Event message from the stream
    call.on("data", (event: Event) => {
      console.log(
        `Received event with contextId: ${event.contextId}, traceId: ${event.traceId}`
      );

      // Iterate over the messages array in the event
      event.messages.forEach((message: Event_Message, index: number) => {
        console.log(`Processing message ${index + 1}:`);
        switch (message.value.oneofKind) {
          case "spaceSyncStatusUpdate":
            console.log(
              "Space Sync Status Update:",
              safeStringify({
                ...message.value.spaceSyncStatusUpdate,
                status:
                  Event_Space_Status[
                    message.value.spaceSyncStatusUpdate.status
                  ],
                network:
                  Event_Space_Network[
                    message.value.spaceSyncStatusUpdate.network
                  ],
                error:
                  Event_Space_SyncError[
                    message.value.spaceSyncStatusUpdate.error
                  ],
              })
            );

            const { id, status } = message.value.spaceSyncStatusUpdate;
            const syncingObjectsCounter =
              message.value.spaceSyncStatusUpdate.syncingObjectsCounter;
            // Check if the ID matches the current user's spaceId and status is 0
            if (
              id === store.currentUser.accountSpaceId &&
              (status === 0 || status + 0 === 4) &&
              syncingObjectsCounter === 0n
            ) {
              console.log(
                "Desired spaceSyncStatusUpdate received:",
                message.value.spaceSyncStatusUpdate
              );
              store.spaceSyncStatusReceived = true; // Set the flag to true
            } else {
              console.log(
                `Received spaceSyncStatusUpdate with id ${id} and status ${status}, but conditions not met.`
              );
            }
            break;

          case "threadStatus":
            console.log(
              "Thread Status Update:",
              safeStringify(message.value.threadStatus)
            );

            const cafeStatus = message.value.threadStatus.cafe?.status;

            if (cafeStatus === 3 && isVersion034OrLess(heartVersion)) {
              console.log(
                "Desired threadStatus received with cafe.status = 3:",
                message.value.threadStatus
              );
              store.spaceSyncStatusReceived = true; // Set the flag to true
            } else {
              console.log(
                `Received threadStatus with cafe.status ${cafeStatus}, but conditions not met.`
              );
            }
            break;

          case "accountUpdate":
            console.log(
              "Account Update:",
              safeStringify(message.value.accountUpdate)
            );
            // Add any specific handling for accountUpdate if needed
            break;

          case "membershipUpdate":
            console.log(
              "Membership Update:",
              safeStringify(message.value.membershipUpdate)
            );
            break;

          // Handle other known message types
          case "accountShow":
            console.log(
              "Account Show:",
              safeStringify(message.value.accountShow)
            );
            if (
              store.onAccountShowEvent &&
              message.value.accountShow.account?.id
            ) {
              store.onAccountShowEvent(message.value.accountShow.account.id);
            }
            break;
          case "accountDetails":
            console.log(
              "Account Details:",
              safeStringify(message.value.accountDetails)
            );
            break;
          case "fileSpaceUsage":
            console.log(
              "File Space Usage:",
              safeStringify(message.value.fileSpaceUsage)
            );
            break;
          case "p2PStatusUpdate":
            console.log(
              "P2P Status Update:",
              safeStringify(message.value.p2PStatusUpdate)
            );
            break;
          // ... (add more cases as needed for other types)

          default:
            console.warn(
              "Unknown or unhandled message type:",
              message.value.oneofKind
            );
            break;
        }
      });
    });

    call.on("metadata", (metadata) => {
      console.log("Received metadata: ", metadata);
    });

    call.on("status", (status) => {
      console.log("Received status: ", status);
    });

    call.on("end", () => {
      console.log("Stream ended.");
    });

    await new Promise<void>((resolve) => {
      call.on("end", () => resolve());
    });

    console.log("listenSessionEvents completed successfully.");
  } catch (error) {
    console.error("Failed to initialize listenSessionEvents:", {
      error: error,
      request: safeStringify(request),
    });
    throw error;
  }
}

// Function to stop the gRPC stream
export function stopListenSessionEvents() {
  if (call) {
    console.log("Stopping the gRPC stream...");
    call.cancel();
  } else {
    console.log("No active gRPC stream to stop.");
  }
}
