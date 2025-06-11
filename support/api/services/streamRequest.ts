import { getCurrentClient } from "../helpers/proxy";
import { store } from "../helpers/store";
import { StreamRequest } from "../../../pb/pb/protos/commands";
import {
  Event,
  Event_Message,
  Event_Space_Network,
  Event_Space_Status,
  Event_Space_SyncError,
  Event_Status_Thread_SyncStatus,
} from "../../../pb/pb/protos/events";
import { logger } from "../helpers/loggerConfig";
import { isVersion034OrLess } from "./utils";
import { Metadata } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";

let streamCalls: Map<number, any> = new Map();

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000; // 2 seconds

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
export async function callListenSessionEvents(
  clientNumber: number
): Promise<void> {
  logger.info(`Initiating listenSessionEvents for client ${clientNumber}...`, {
    user: "stream",
  });

  const client = getCurrentClient();

  if (!store.getServerVersionForClient(clientNumber)) {
    throw new Error("No server version set");
  }

  const token = store.getClientAuthToken(clientNumber);
  if (!token) {
    throw new Error("No token found for client number");
  }

  const request = StreamRequest.create({
    token: token,
  });

  try {
    // Store the call in the map with client number as key
    const streamCall = client.listenSessionEvents(request);
    streamCalls.set(clientNumber, streamCall);

    // Update the error handler to be more specific about cancellation
    streamCall.on("error", (error: any) => {
      if (
        error.code === 1 &&
        (error.details === "Call cancelled" ||
          error.details === "Cancelled on client")
      ) {
        logger.info("Stream was intentionally cancelled", {
          user: "stream",
        });
        return;
      }

      logger.error(
        "Stream error details:",
        { user: "stream" },
        {
          code: error?.code,
          details: error?.details,
          metadata: error?.metadata,
          stack: error?.stack,
        }
      );

      // Add reconnection logic for serialization error
      if (error.code === 13) {
        logger.error(
          "Serialization error detected. Request object:",
          { user: "stream" },
          request
        );

        // Stop the current stream before attempting to reconnect
        stopListenSessionEvents(clientNumber);

        // Attempt to reconnect with clientNumber
        reconnectStream(clientNumber).catch((reconnectError) => {
          logger.error(
            `Failed to reconnect client ${clientNumber} after serialization error`,
            { user: "stream" },
            reconnectError
          );
        });
      }
    });

    // Handle the 'data' event to receive each Event message from the stream
    streamCall.on("data", (event: Event) => {
      logger.info(
        `Received event with contextId: ${event.contextId}, traceId: ${event.traceId}`,
        { user: "stream" }
      );

      // Iterate over the messages array in the event
      event.messages.forEach((message: Event_Message, index: number) => {
        logger.info(`Processing message ${index + 1}:`, {
          user: "stream",
        });
        switch (message.value.oneofKind) {
          case "spaceSyncStatusUpdate":
            logger.info(
              `Space Sync Status Update for client ${clientNumber}:`,
              { user: "stream" },
              safeStringify({
                ...message.value.spaceSyncStatusUpdate,
                syncingObjectsCounter:
                  message.value.spaceSyncStatusUpdate.syncingObjectsCounter.toString(),
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
              logger.info(
                `Desired spaceSyncStatusUpdate received for client ${clientNumber}:`,
                { user: "stream" },
                message.value.spaceSyncStatusUpdate
              );
              store.spaceSyncStatusReceived = true;
            } else {
              logger.info(
                `Received spaceSyncStatusUpdate for client ${clientNumber} with id ${id} and status ${Event_Space_Status[status]} (${status}), but conditions not met.`,
                { user: "stream" }
              );
            }
            break;

          case "threadStatus":
            logger.info(
              "Thread Status Update:",
              { user: "stream" },
              safeStringify(message.value.threadStatus)
            );

            const cafeStatus = message.value.threadStatus.cafe?.status;

            if (
              cafeStatus === 3 &&
              isVersion034OrLess(store.getServerVersionForClient(clientNumber))
            ) {
              logger.info(
                "Desired threadStatus received with cafe.status = 3:",
                { user: "stream" },
                message.value.threadStatus
              );
              store.spaceSyncStatusReceived = true; // Set the flag to true
            } else {
              logger.info(
                `Received threadStatus with cafe.status ${cafeStatus}, but conditions not met.`,
                { user: "stream" }
              );
            }
            break;

          case "accountUpdate":
            logger.info(
              "Account Update:",
              { user: "stream" },
              safeStringify(message.value.accountUpdate)
            );
            // Add any specific handling for accountUpdate if needed
            break;

          case "membershipUpdate":
            logger.info(
              "Membership Update:",
              { user: "stream" },
              safeStringify(message.value.membershipUpdate)
            );
            break;

          case "accountShow":
            logger.info(
              "Account Show:",
              { user: "stream" },
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
            logger.info(
              "Account Details:",
              { user: "stream" },
              safeStringify(message.value.accountDetails)
            );
            break;
          case "fileSpaceUsage":
            logger.info(
              "File Space Usage:",
              { user: "stream" },
              safeStringify(message.value.fileSpaceUsage)
            );
            break;
          case "p2PStatusUpdate":
            logger.info(
              "P2P Status Update:",
              { user: "stream" },
              safeStringify(message.value.p2PStatusUpdate)
            );
            break;
          case "blockSetText":
            logger.info(
              "Block Set Text:",
              { user: "stream" },
              safeStringify(message.value.blockSetText)
            );
            break;

          case "objectDetailsAmend":
            logger.info(
              "Object Details Amend:",
              { user: "stream" },
              safeStringify(message.value.objectDetailsAmend)
            );
            break;

          default:
            logger.warn(
              "Unknown or unhandled message type:",
              { user: "stream" },
              message.value.oneofKind
            );
            break;
        }
      });
    });

    // Modified end handling
    await new Promise<void>((resolve) => {
      streamCall.on("end", () => {
        streamCalls.delete(clientNumber);
        resolve();
      });
    });

    logger.info("listenSessionEvents completed successfully.", {
      user: "stream",
    });
  } catch (error) {
    streamCalls.delete(clientNumber);
    logger.error(
      "Failed to initialize listenSessionEvents:",
      { user: "stream" },
      {
        error: error,
        request: safeStringify(request),
      }
    );
    throw error;
  }
}

// Modified stop function to handle multiple streams
export function stopListenSessionEvents(clientNumber?: number) {
  if (clientNumber !== undefined) {
    // Stop specific client stream
    const streamCall = streamCalls.get(clientNumber);
    if (streamCall) {
      logger.info(`Stopping the gRPC stream for client ${clientNumber}...`, {
        user: "stream",
      });
      streamCall.cancel();
      streamCalls.delete(clientNumber);
    }
  } else {
    // Stop all streams
    streamCalls.forEach((streamCall, clientNum) => {
      logger.info(`Stopping the gRPC stream for client ${clientNum}...`, {
        user: "stream",
      });
      streamCall.cancel();
    });
    streamCalls.clear();
  }
}

// Add this new function for reconnection logic
async function reconnectStream(
  clientNumber: number,
  attempt: number = 1
): Promise<void> {
  if (attempt > MAX_RECONNECT_ATTEMPTS) {
    logger.error(
      `Max reconnection attempts reached for client ${clientNumber}`,
      { user: "stream" }
    );
    throw new Error("Failed to reconnect after maximum attempts");
  }

  logger.info(
    `Attempting to reconnect client ${clientNumber} (attempt ${attempt})...`,
    {
      user: "stream",
    }
  );

  try {
    await new Promise((resolve) => setTimeout(resolve, RECONNECT_DELAY));
    await callListenSessionEvents(clientNumber);
  } catch (error) {
    await reconnectStream(clientNumber, attempt + 1);
  }
}
