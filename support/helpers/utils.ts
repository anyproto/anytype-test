import { getCurrentClient } from "./proxy";
import * as fs from "fs";
import * as path from "path";

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
          return reject(err);
        }

        // Type assertion to access 'error' property
        const errorCode = (response as any)?.error?.code;
        if (errorCode !== undefined && errorCode !== 0) {
          console.error(`gRPC call failed with error code: ${errorCode}`);
          return reject(
            new Error(`gRPC call failed with error code: ${errorCode}`)
          );
        }

        resolve(response);
      }
    );

    call.on("metadata", (metadata: any) => {
      console.log("Received response headers:", metadata);
    });

    call.on("status", (status: any) => {
      console.log("Call status:", status);
    });
  });
}

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
