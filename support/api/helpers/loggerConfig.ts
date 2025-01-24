// logger.ts
import { Logger, ConsoleTransport } from "@origranot/ts-logger";
import { MyColoredFormatter } from "./myColoredFormatter";

const myColoredFormatter = new MyColoredFormatter();
const myColoredConsoleTransport = new ConsoleTransport({
  formatter: myColoredFormatter,
});

// Now create the logger with ONLY this custom transport
export const logger = new Logger({
  name: "custom",
  transports: [myColoredConsoleTransport],
});

logger.info("Hello from custom color logger", { user: 1 });
logger.info("Hello from custom color logger", { user: 2 });
logger.info("Hello from custom color logger", { user: "stream" });
