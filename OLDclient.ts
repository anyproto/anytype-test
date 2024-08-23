import { ChannelCredentials } from "@grpc/grpc-js";
import {
  IClientCommandsClient,
  ClientCommandsClient,
} from "./pb/pb/protos/service/service.grpc-client";

const client = new ClientCommandsClient(
  "127.0.0.1:31007",
  ChannelCredentials.createInsecure(),
  {},
  {}
);

async function main() {
  await callMetricsSetParameters(client);
  await callWalletCreate(client);
  await callAccountCreate(client);
}

function callWalletCreate(client: IClientCommandsClient) {
  console.log(`### calling method "walletCreate"...`);

  const call = client.walletCreate(
    {
      rootPath: "/Users/shamray/workspace/anytype-test/tmp",
    },
    (err, value) => {
      if (err) {
        console.log("got err: ", JSON.stringify(err, null, 2));
      }
      if (value) {
        console.log("got response message: ", value);
      }
    }
  );

  call.on("metadata", (arg1) => {
    console.log("got response headers: ", arg1);
  });

  call.on("status", (arg1) => {
    console.log("got status: ", arg1);
  });

  return new Promise<void>((resolve) => {
    call.on("status", () => resolve());
  });
}

function callAccountCreate(client: IClientCommandsClient) {
  console.log(`### calling method "accountCreate"...`);

  const call = client.accountCreate(
    {
      name: "test",
      avatar: { oneofKind: undefined },
      storePath: "/Users/shamray/Library/Application Support/anytype/beta/data",
      icon: BigInt(5),
      disableLocalNetworkSync: false,
      networkMode: 0,
      networkCustomConfigFilePath: "",
      preferYamuxTransport: false,
    },
    (err, value) => {
      if (err) {
        console.log("got err: ", err);
      }
      if (value) {
        console.log("got response message: ", value);
      }
    }
  );

  call.on("metadata", (arg1) => {
    console.log("got response headers: ", arg1);
  });

  return new Promise<void>((resolve) => {
    call.on("status", () => resolve());
  });
}

function callMetricsSetParameters(client: IClientCommandsClient) {
  console.log(`### calling method ""...`);

  const call = client.metricsSetParameters(
    {
      platform: "test",
      version: "0.0.1",
    },
    (err, value) => {
      if (err) {
        console.log("got err: ", err);
      }
      if (value) {
        console.log("got response message: ", value);
      }
    }
  );

  call.on("metadata", (arg1) => {
    console.log("got response headers: ", arg1);
  });

  return new Promise<void>((resolve) => {
    call.on("status", () => resolve());
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
