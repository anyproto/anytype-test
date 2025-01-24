import { Metadata } from "@grpc/grpc-js";
import { getCurrentClient as getClientInstance } from "../services/gprcClient";
import { store } from "./store";

// Define the list of methods to exclude from metadata injection
const excludedMethods = [
  "setMetrics",
  "accountCreate",
  "accountSelect",
  "initialSetParameters",
];

// Wrap the client methods to inject metadata
function getCurrentClient() {
  console.log("current client with proxy is called");
  const client = getClientInstance();

  // This function will return a proxy that intercepts all gRPC calls to add metadata
  return new Proxy(client, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);
      if (typeof originalMethod === "function") {
        return (...args: any[]) => {
          // Add this check to show both method names when it's a unary request
          if (prop.toString() === "makeUnaryRequest" && args[0]) {
            console.log(
              `Intercepting gRPC call: ${args[0]} (internal: makeUnaryRequest)`
            );
          } else {
            console.log(`Intercepting call to method: ${prop.toString()}`);
          }

          const currentClientNumber = store.currentClientNumber;
          if (!currentClientNumber) {
            throw new Error("No client number set");
          }
          const token = store.getClientAuthToken(currentClientNumber);

          // Check if the method is in the excluded list
          if (excludedMethods.includes(prop.toString())) {
            console.log(`Skipping metadata for method ${prop.toString()}`);
            // Directly call the original method without injecting metadata
            return originalMethod.apply(target, args);
          }

          // Create metadata and add the token for other methods
          let metadata = new Metadata();
          if (token) {
            metadata.add("token", `${token}`);
          }

          console.log(`Adding metadata to method ${prop.toString()}`);
          console.log(`The used token is ${token}`);

          // Find the correct position to insert or merge metadata
          const lastArg = args[args.length - 1];
          const secondLastArg = args[args.length - 2];

          if (lastArg instanceof Metadata) {
            // If the last argument is already Metadata, merge our metadata with it
            lastArg.merge(metadata);
          } else if (
            typeof lastArg === "function" &&
            secondLastArg instanceof Metadata
          ) {
            // If the second-to-last argument is Metadata (common in gRPC), merge with it
            secondLastArg.merge(metadata);
          } else if (typeof lastArg === "function") {
            // If the last argument is a function (callback), insert metadata before it
            args.splice(args.length - 1, 0, metadata);
          } else {
            // Otherwise, add metadata as the last argument
            args.push(metadata);
          }

          // Call the original method with the modified arguments
          return originalMethod.apply(target, args);
        };
      }
      return originalMethod;
    },
  });
}

export { getCurrentClient };
