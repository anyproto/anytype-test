import { Before, After } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { store } from "../api/helpers/store";
import { stopServer } from "../api/services/gprcServerManager";
import { createAndSetTempDirectory } from "../api/services/utils";
import { stopListenSessionEvents } from "../api/services/streamRequest";

Before(async function (this: CustomWorld) {
  store.clear();
  createAndSetTempDirectory();
});

After(async function () {
  console.log("After hook")
  stopServer(2);
  stopListenSessionEvents();
});
