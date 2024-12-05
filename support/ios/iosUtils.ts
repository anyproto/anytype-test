import { driver } from "@wdio/globals";
import { config } from "../../config/ios.conf";

export function getUserDriver(user: string): WebdriverIO.Browser {
  const userKey = user.replace(/\s+/g, "");

  if (driver[userKey]) {
    return driver[userKey];
  } else {
    throw new Error(`Driver instance not found for user: ${user}`);
  }
}

/**
 * Gets the UDID for a specific user from the iOS capabilities configuration
 * @param user The user identifier (e.g. 'UserA' or 'UserB')
 * @returns The UDID string for the specified user
 * @throws Error if the user or UDID is not found
 */
export function getDeviceUdidForUser(user: string): string {
  const userKey = user.replace(/\s+/g, "");
  const { capabilities } = config;

  if (capabilities[userKey]) {
    return capabilities[userKey].capabilities["appium:udid"];
  } else {
    throw new Error(`UDID not found for user: ${user}`);
  }
}
