import { Before, After, AfterAll, ITestCaseHookParameter } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { store } from "../api/helpers/store";
import { stopServer } from "../api/services/gprcServerManager";
import { createAndSetTempDirectory } from "../api/services/utils";
import { stopListenSessionEvents } from "../api/services/streamRequest";
import { execSync } from "child_process";

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  console.log("Before hook started");
  console.log("Clearing store");
  store.clear();
  console.log("Creating temp directory");
  createAndSetTempDirectory();
  console.log("Scenario name setting");
  this.scenario = scenario;
  console.log("Scenario name", this.scenario.pickle.name);
  console.log("Before hook finished");
});

After(async function () {
  console.log("After hook started");
  console.log("Stopping listen session events");
  stopListenSessionEvents();
  stopServer(2);
  console.log("After hook finished");
});

AfterAll(() => {
  // Force kill leftover “go run” or “grpc-server” processes if needed
  try {
    execSync("pkill -f 'go run'"); // or 'grpc-server'
    console.log("Cleaned up leftover go-run processes");
  } catch (error) {
    console.error("Error cleaning up leftover go-run processes:", error);
  }
});