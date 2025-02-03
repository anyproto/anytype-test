import { getCurrentClient } from "../helpers/proxy";
import * as fs from "fs";
import * as path from "path";
import { status as grpcStatus } from "@grpc/grpc-js";
import { store } from "../helpers/store";
import { Logger } from "@origranot/ts-logger";

const logger = new Logger({ name: "custom" });

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
  if (version === "default") {
    return true;
  }
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
 * Formats and logs a gRPC error, then returns a new Error instance.
 * @param error The error object (either from gRPC or an application-level error).
 * @returns A new Error instance with a JSON representation of the error details.
 */
function formatGrpcError(error: {
  code: number;
  details?: string;
  message?: string;
  description?: string;
}, methodName: string, request: any) {
  const errorDetails = {
    code: error.code,
    method: methodName,
    description: error.details || error.message || error.description,
    request: request
  };
  console.error("gRPC call failed with error:", errorDetails);
  return new Error(
    `gRPC call failed: ${JSON.stringify(errorDetails, null, 2)}`
  );
}

/**
 * Generic function to make gRPC calls and handle common error scenarios.
 * If `expectedErrors` includes an encountered error code, the function will
 * log the error but still resolve the promise.
 *
 * @param grpcMethod The gRPC method to call.
 * @param request The request object.
 * @param expectedErrors (optional) An array of error codes that should be treated as non-fatal.
 * @returns A promise that resolves with the gRPC response.
 */
export function makeGrpcCall<T>(
  grpcMethod: Function,
  request: any,
  expectedErrors?: number[]
): Promise<T> {
  return new Promise((resolve, reject) => {
    const client = getCurrentClient();
    const methodName = grpcMethod.name || 'unknown';

    const call = grpcMethod.call(client, request, (err: any, response: T) => {
      if (err) {
        if (expectedErrors?.includes(err.code)) {
          console.warn("Encountered an expected error code:", err.code);
          return resolve(response); 
        }
        return reject(formatGrpcError(err, methodName, request));
      }

      // Check for application-level error in the response
      const responseError = (response as any)?.error;
      if (
        responseError &&
        responseError.code !== undefined &&
        responseError.code !== 0
      ) {
        if (expectedErrors?.includes(responseError.code)) {
          console.warn(
            "Encountered an expected error code:",
            responseError.code
          );
          return resolve(response);
        }
        return reject(formatGrpcError(responseError, methodName, request));
      }

      resolve(response);
    });

    call.on("status", (status: any) => {
      if (status.code !== grpcStatus.OK) {
        // Log status errors but do not reject here since the main callback handles errors.
        console.error("gRPC call non-OK status:", {
          code: status.code,
          description: status.details,
        });
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
  // Create the tmp directory if it doesn't exist
  const tmpBasePath = path.resolve(__dirname, "../../../tmp");
  if (!fs.existsSync(tmpBasePath)) {
    fs.mkdirSync(tmpBasePath, { recursive: true });
  }

  const tempDir = fs.mkdtempSync(path.join(tmpBasePath, "anytype-test-"));
  console.log(`Temporary directory created at: ${tempDir}`);
  setTempDirectory(tempDir);
  return tempDir;
};
