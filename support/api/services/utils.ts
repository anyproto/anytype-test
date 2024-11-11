import { getCurrentClient } from "../../helpers/proxy";
import * as fs from "fs";
import * as path from "path";
import { status as grpcStatus } from "@grpc/grpc-js";
import { store } from "../../helpers/store";
import { Logger } from "@origranot/ts-logger";

const logger = new Logger();

export const setUserAsCurrentUser = (userNumber: number) => {
  store.currentUserNumber = userNumber;
  logger.info(`Current user is user number ${userNumber}`);

  // returning this here to make this function chainable and reuse somewhere else
  logger.info("Stored users", JSON.stringify(Array.from(store.users)));
  return;
};

export function getCurrentUserNumber(): number {
  const userNumber = store.currentUserNumber;
  if (!userNumber) {
    logger.error("Error: Current user number is not defined");
    throw new Error("Current user number is not defined");
  }
  return userNumber;
}

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
 * Checks if the current server version is 0.35 or more.
 * @param version - The server version string (e.g., "v0.33.2" or "v0.34.7").
 * @returns {boolean} - Returns true if the server version is 0.35 or more, false otherwise.
 */
export function isVersion035OrMore(version: string): boolean {
  // Remove the 'v' prefix if it exists
  if (version.startsWith("v")) {
    version = version.slice(1);
  }

  // Split the version string to extract major and minor versions
  const [, minor] = version.split(".").map(Number);

  // Check if the minor version is 35
  if (minor >= 35) {
    return true;
  }

  return false;
}

/**
 * Checks if the current server version is 0.37 or more.
 * @param version - The server version string (e.g., "v0.33.2" or "v0.34.7").
 * @returns {boolean} - Returns true if the server version is 0.37 or more, false otherwise.
 */
export function isVersion037OrMore(version: string): boolean {
  // Remove the 'v' prefix if it exists
  if (version.startsWith("v")) {
    version = version.slice(1);
  }

  // Split the version string to extract major and minor versions
  const [, minor] = version.split(".").map(Number);

  // Check if the minor version is 37
  if (minor >= 37) {
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
          const errorDetails = {
            code: err.code,
            description: err.details || err.message,
          };
          console.error("gRPC call failed with error:", errorDetails);

          return reject(
            new Error(
              `gRPC call failed: ${JSON.stringify(errorDetails, null, 2)}`
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
          const errorDetails = {
            code: responseError.code,
            description: responseError.description || responseError.message,
          };
          console.error("gRPC call failed with error:", errorDetails);

          return reject(
            new Error(
              `gRPC call failed: ${JSON.stringify(errorDetails, null, 2)}`
            )
          );
        }

        resolve(response);
      }
    );

    call.on("status", (status: any) => {
      if (status.code !== grpcStatus.OK) {
        const statusError = {
          code: status.code,
          description: status.details,
        };
        console.error("gRPC call failed with status:", statusError);
      }
    });
  });
}

// Function to delete contents of a directory but keep the directory itself
export const clearDirectoryContents = async (
  dirPath: string = getTempDirectory()
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

/**
 * Utility function to wait for a condition to be true with a timeout.
 * @param conditionFn A function that returns a boolean indicating if the condition is met.
 * @param timeoutMs The maximum time to wait in milliseconds.
 * @param intervalMs The interval to check the condition in milliseconds.
 * @returns A promise that resolves if the condition becomes true within the timeout, otherwise rejects.
 */
export async function waitForCondition(
  conditionFn: () => boolean,
  timeoutMs: number = 10000, // Default timeout of 10 seconds
  intervalMs: number = 100 // Check every 100 milliseconds
): Promise<void> {
  const start = Date.now();

  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (conditionFn()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start >= timeoutMs) {
        clearInterval(interval);
        reject(
          new Error("Timeout: Condition not met within the specified time.")
        );
      }
    }, intervalMs);
  });
}

export const setTempDirectory = (dir: string) => {
  store.tempDir = dir;
};

export const getTempDirectory = (): string => {
  if (!store.tempDir) {
    throw new Error("Temporary directory not set");
  }
  return store.tempDir;
};

export const createAndSetTempDirectory = (): string => {
  const tempDir = fs.mkdtempSync(
    path.join(path.resolve(__dirname, "../../../tmp"), "anytype-test-")
  );
  console.log(`Temporary directory created at: ${tempDir}`);
  setTempDirectory(tempDir);
  return tempDir;
};
