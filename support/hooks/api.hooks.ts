import { Before, After } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { store } from "../api/helpers/store";
import { stopServer } from "../api/services/gprcServerManager";
import { createAndSetTempDirectory } from "../api/services/utils";
import { stopListenSessionEvents } from "../api/services/streamRequest";

Before(async function (this: CustomWorld) {
  console.log("Before hook started");
  console.log("Clearing store");
  store.clear();
  console.log("Creating temp directory");
  createAndSetTempDirectory();
  console.log("Before hook finished");
});

After(async function () {
  console.log("After hook started");
  console.log("Stopping listen session events");
  stopListenSessionEvents();
  stopServer(2);
  console.log("After hook finished");
});
