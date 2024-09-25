import { store } from "./store";
import { Logger } from "@origranot/ts-logger";

const logger = new Logger();

export function updateClientToken(token: string): void {
  if (store.grpcClientManager) {
    logger.info("Updating client token");
    if (store.currentClientNumber) {
      store.grpcClientManager.updateClientToken(
        store.currentClientNumber,
        token
      );
    } else {
      logger.error("Error: Current client number is not defined");
      throw new Error("Current client number is not defined");
    }
  }
}
