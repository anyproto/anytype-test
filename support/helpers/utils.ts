import { getCurrentClient } from "./proxy";
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
