import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
import { StreamRequest } from "../../pb/pb/protos/commands";
import { Event, Event_Message } from "../../pb/pb/protos/events";
import { Logger } from "@origranot/ts-logger";

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
  const token = store.getClientAuthToken(currentClientNumber);
  if (!token) {
    throw new Error("No token found for client number");
  }
  console.log(`Using token: ${token}`);

  // Create the request with the token
  const request: StreamRequest = {
    token: token,
  };

  try {
    // Initiate the server-side streaming call using the client and request
    const call = client.listenSessionEvents(request);

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
              safeStringify(message.value.spaceSyncStatusUpdate)
            );

            const { id, status } = message.value.spaceSyncStatusUpdate;
            logger.info("DEBUG CurrentUser is ", store.currentUserNumber);
            // Check if the ID matches the current user's spaceId and status is 0
            if (
              (id === store.currentUser.spaceId && status === 0) ||
              status + 0 === 4
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

            if (cafeStatus === 3) {
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
            // Add any specific handling for membershipUpdate if needed
            break;

          // Handle other known message types
          case "accountShow":
            console.log(
              "Account Show:",
              safeStringify(message.value.accountShow)
            );
            break;
          case "accountDetails":
            console.log(
              "Account Details:",
              safeStringify(message.value.accountDetails)
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

    call.on("error", (error) => {
      console.error("Received error: ", error);
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
    console.error("Failed to call listenSessionEvents:", error);
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
