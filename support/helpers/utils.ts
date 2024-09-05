import { getCurrentClient } from "./proxy";
import * as fs from "fs";
import * as path from "path";
import { status as grpcStatus } from "@grpc/grpc-js";

/**
 * Checks if the current server version is 0.34 or less.
 * @param version - The server version string (e.g., "v0.33.2" or "v0.34.7").
 * @returns {boolean} - Returns true if the server version is 0.34 or less, false otherwise.
 */
export function isVersion034OrLess(version: string): boolean {
  // Remove the 'v' prefix if it exists
  if (version.startsWith("v")) {
    version = version.slice(1);
  }

  // Split the version string to extract major and minor versions
  const [, minor] = version.split(".").map(Number);

  // Check if the minor version is 34 or less
  if (minor <= 34) {
    return true;
  }

  return false;
}

/**
 * Checks if the current server version is 0.34 or less.
 * @param version - The server version string (e.g., "v0.33.2" or "v0.34.7").
 * @returns {boolean} - Returns true if the server version is 0.34 or less, false otherwise.
 */
export function isVersion035(version: string): boolean {
  // Remove the 'v' prefix if it exists
  if (version.startsWith("v")) {
    version = version.slice(1);
  }

  // Split the version string to extract major and minor versions
  const [, minor] = version.split(".").map(Number);

  // Check if the minor version is 35
  if (minor == 35) {
    return true;
  }

  return false;
}
/**
 * Generic function to make gRPC calls and handle common error scenarios.
 * @param grpcMethod The gRPC method to call.
 * @param request The request object.
 * @returns A promise that resolves with the gRPC response.
 */
export function makeGrpcCall<T>(
  grpcMethod: Function,
  request: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    const call = grpcMethod.call(
      getCurrentClient(),
      request,
      (err: any, response: T) => {
        if (err) {
          console.error("gRPC call error:", err);
          const errorDetails = {
            code: err.code,
            details: err.details,
            metadata: err.metadata ? err.metadata.getMap() : {},
            name: err.name,
            stack: err.stack,
          };
          console.error(
            "Detailed gRPC error:",
            JSON.stringify(errorDetails, null, 2)
          );
          return reject(
            new Error(
              `gRPC call failed: ${err.message}\nDetails: ${JSON.stringify(
                errorDetails
              )}`
            )
          );
        }

        // Type assertion to access 'error' property
        const responseError = (response as any)?.error;
        if (
          responseError &&
          responseError.code !== undefined &&
          responseError.code !== 0
        ) {
          console.error(`gRPC call failed with error:`, responseError);
          return reject(
            new Error(
              `gRPC call failed with error code: ${
                responseError.code
              }, message: ${responseError.message || "Unknown error"}`
            )
          );
        }

        resolve(response);
      }
    );

    call.on("metadata", (metadata: any) => {
      console.log("Received response headers:", metadata.getMap());
    });

    call.on("status", (status: any) => {
      console.log("Call status:", {
        code: status.code,
        details: status.details,
        metadata: status.metadata ? status.metadata.getMap() : {},
      });
      if (status.code !== grpcStatus.OK) {
        console.error(
          `gRPC call failed with status code: ${status.code} (${
            grpcStatus[status.code]
          })`
        );
      }
    });
  });
}

// ... (rest of the file remains the same)

// Function to delete contents of a directory but keep the directory itself
export const clearDirectoryContents = async (
  dirPath: string
): Promise<void> => {
  try {
    if (fs.existsSync(dirPath)) {
      const files = await fs.promises.readdir(dirPath);
      for (const file of files) {
        const curPath = path.join(dirPath, file);
        const stat = await fs.promises.stat(curPath);
        if (stat.isDirectory()) {
          // Recursively clear subdirectory contents
          await clearDirectoryContents(curPath);
          // Remove the now-empty subdirectory
          await fs.promises.rmdir(curPath);
        } else {
          // Delete file
          await fs.promises.unlink(curPath);
        }
      }
      console.log(`Contents of directory ${dirPath} cleared successfully.`);
    } else {
      console.log(`Directory ${dirPath} does not exist.`);
    }
  } catch (error) {
    console.error(`Error clearing directory contents of ${dirPath}:`, error);
  }
};
