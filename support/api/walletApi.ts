import { getCurrentClient, GRPCClientManager } from "../client";
import { store } from "../helpers/store";
import { UserType } from "../dataTypes";
import * as fs from "fs";
import * as path from "path";
import { faker } from "@faker-js/faker";
import { Rpc_Wallet_CreateSession_Request } from "../../pb/pb/protos/commands";
// Create a unique temporary directory inside the 'tmp' folder located two levels up from the current directory.
// 'path.resolve' navigates to the project root by moving up two levels ('../../') and then appending 'tmp'.
// 'fs.mkdtempSync' creates a new temporary directory with a unique name that starts with 'anytype-test-'.
const tempDir = fs.mkdtempSync(
  path.join(path.resolve(__dirname, "../../tmp"), "anytype-test-")
);

console.log(`Temporary directory created at: ${tempDir}`);

export async function callWalletCreate(userNumber: number): Promise<void> {
  console.log("### Calling method 'walletCreate'...");
  const client = getCurrentClient();
  const name = faker.person.firstName();

  return new Promise<void>((resolve, reject) => {
    const call = client.walletCreate({ rootPath: tempDir }, (err, value) => {
      if (err) {
        console.error("Error:", JSON.stringify(err, null, 2));
        reject(err);
        return;
      }

      if (!value) {
        console.error("No value returned");
        reject(new Error("No value returned"));
        return;
      }

      console.log("Response message:", JSON.stringify(value, null, 2));

      if (value.error?.code === 0) {
        const userToSave: UserType = {
          mnemonic: value.mnemonic,
          name: name,
        };
        store.users.set(userNumber, userToSave);
        console.log(
          `Saving user as user number ${userNumber}`,
          JSON.stringify(userToSave)
        );
        console.log(`Mnemonic for user ${userNumber} saved: ${value.mnemonic}`);
        resolve();
      } else {
        console.error(
          `Error: ${value.error ? value.error.description : "Unknown error"}`
        );
        reject(
          new Error(value.error ? value.error.description : "Unknown error")
        );
      }
    });

    call.on("metadata", (metadata) => {
      console.log("Response headers:", JSON.stringify(metadata, null, 2));
    });

    call.on("status", (status) => {
      console.log("Status:", JSON.stringify(status, null, 2));
    });
  });
}
export async function callWalletRecover(userNumber: number): Promise<void> {
  const client = getCurrentClient();
  console.log("### Calling method 'walletRecovery'...");
  const user = store.users.get(userNumber);

  if (!user || !user.mnemonic) {
    throw new Error(`Mnemonic not found for user number ${userNumber}`);
  }

  return new Promise<void>((resolve, reject) => {
    const call = client.walletRecover(
      {
        rootPath: tempDir,
        mnemonic: user.mnemonic,
      },
      (err, value) => {
        if (err) {
          console.error("Error:", JSON.stringify(err, null, 2));
          reject(err);
          return;
        }

        if (value) {
          console.log("Response message:", JSON.stringify(value, null, 2));
          resolve();
        } else {
          reject(new Error("No value returned"));
        }
      }
    );
    console.log(tempDir);
    call.on("metadata", (metadata) => {
      console.log("Response headers:", JSON.stringify(metadata, null, 2));
    });

    call.on("status", (status) => {
      console.log("Status:", JSON.stringify(status, null, 2));
    });
  });
}

export async function callWalletCreateSession(
  mnemonic: string
): Promise<string> {
  console.log("### Calling method 'walletCreateSession'...");
  const client = getCurrentClient();

  return new Promise<string>((resolve, reject) => {
    // Correctly type the request according to Rpc_Wallet_CreateSession_Request
    const request: Rpc_Wallet_CreateSession_Request = {
      auth: {
        oneofKind: "mnemonic",
        mnemonic: mnemonic,
      },
    };
    const call = client.walletCreateSession(request, (err, value) => {
      if (err) {
        console.error("Error:", JSON.stringify(err, null, 2));
        reject(err);
        return;
      }
      if (!value) {
        console.error("No value returned");
        reject(new Error("No value returned"));
        return;
      }

      console.log("Response message:", JSON.stringify(value, null, 2));

      if (value.error?.code === 0) {
        console.log(
          "Session created successfully, token returned: " + value.token
        );
        resolve(value.token); // Use resolve to return the token
      } else {
        console.error(
          `Error: ${value.error ? value.error.description : "Unknown error"}`
        );
        reject(
          new Error(value.error ? value.error.description : "Unknown error")
        );
      }
    });

    call.on("metadata", (metadata) => {
      console.log("Response headers:", JSON.stringify(metadata, null, 2));
    });

    call.on("status", (status) => {
      console.log("Status:", JSON.stringify(status, null, 2));
    });
  });
}
