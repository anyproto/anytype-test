// MyColoredFormatter.ts
import { Formatter, FormatterPayload, LOG_LEVEL } from "@origranot/ts-logger";
import chalk from "chalk";

/**
 * A simple user-based color mapping
 */
const userColors = new Map<number | "stream", chalk.Chalk>([
  [1, chalk.magenta],
  [2, chalk.green],
  ["stream", chalk.blue],
]);

export class MyColoredFormatter implements Formatter {
  /**
   * format() is called by the transport to turn the payload into a string.
   */
  format({ level, args, options }: FormatterPayload): string {
    const { name, timestamp } = options || {};

    // Our final output starts with an optional timestamp
    let prefix = "";
    if (timestamp) {
      prefix += `[${timestamp.toISOString()}] `;
    }

    // Then we put the level and optionally the logger name
    prefix += level.toUpperCase();
    if (name) {
      prefix += ` [${name}]`;
    }

    // Now let's parse the arguments.
    // "args" is every argument passed to logger.info(...args).
    // We'll check if there's an object with a `user` property to color the message.
    let userId: number | "stream" | undefined;

    // We'll also build up a single message string from all args
    const messages: string[] = [];

    const convertBigIntsToString = (obj: any): any => {
      if (typeof obj === "bigint") {
        return obj.toString();
      }
      if (Array.isArray(obj)) {
        return obj.map(convertBigIntsToString);
      }
      if (typeof obj === "object" && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = convertBigIntsToString(obj[key]);
        }
        return newObj;
      }
      return obj;
    };

    // Convert any BigInt values before stringifying
    const processedArgs = convertBigIntsToString(args);

    for (const arg of processedArgs) {
      if (typeof arg === "object" && arg !== null && "user" in arg) {
        const candidate = (arg as { user?: number | "stream" }).user;
        if (typeof candidate === "number" || candidate === "stream") {
          userId = candidate;
        }
      }

      // If it's an object, we might want to JSON-stringify it
      if (typeof arg === "object" && arg !== null) {
        messages.push(JSON.stringify(arg, null, 2));
      } else {
        messages.push(String(arg));
      }
    }

    // Join the entire log message into one block
    const finalMessage = messages.join(" ");

    // Check userColors map to see if we should colorize
    if (userId && userColors.has(userId)) {
      // Color the message
      const chalkFn = userColors.get(userId)!;
      return `${prefix} ${chalkFn(finalMessage)}`;
    } else {
      // Fallback: no color
      return `${prefix} ${finalMessage}`;
    }
  }
}
