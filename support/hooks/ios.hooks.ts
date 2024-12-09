import { browser } from "@wdio/globals";
import { AfterStep, After } from "@cucumber/cucumber";
import { Logger } from "@origranot/ts-logger";
import { GRPCServerManager } from "../api/services/gprcServerManager";
import { GRPCClientManager } from "../api/services/gprcClient";
import { store } from "../helpers/store";
import { callAccountDelete } from "../api/clients/accountApi";
import { callWalletCreateSession } from "../api/clients/walletApi";
import { updateClientToken } from "../api/clients/tokenManager";

const logger = new Logger({ name: "custom" });

AfterStep(async function (stepResult: { result: { status: string } }) {
  if (stepResult.result.status === "failed") {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const screenshotPath = `./screenshots/failed-${timestamp}.png`;
    await browser.saveScreenshot(screenshotPath);
    console.log(`Screenshot saved: ${screenshotPath}`);
  }
});

After(async function () {
  try {
    const grpcServerManager = new GRPCServerManager(
      "heart",
      process.cwd(),
      "default"
    );

    await grpcServerManager.startServer(1);

    const server = store.servers.get(1);
    if (!server) {
      throw new Error("Failed to start the server");
    }

    const grpcClientManager = new GRPCClientManager(server.address);
    store.grpcClientManager = grpcClientManager;
    grpcClientManager.createClient(1);

    if (store.users.size > 0) {
      for (const [userNumber, user] of store.users) {
        if (user.mnemonic) {
          const token = await callWalletCreateSession(user.mnemonic);
          updateClientToken(token);

          await callAccountDelete();
          logger.info(`Deleted account for user ${userNumber}`);
        }
      }
    }
  } catch (error) {
    logger.error("Failed to cleanup accounts:", error);
  } finally {
    store.clear();
  }
});
