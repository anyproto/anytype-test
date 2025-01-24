import { Before, After } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { store } from "../api/helpers/store";
import { stopServer } from "../api/services/gprcServerManager";
import { createAndSetTempDirectory } from "../api/services/utils";

Before(async function (this: CustomWorld) {
  store.clear();
  createAndSetTempDirectory();
});

After(async function () {
  stopServer(2);
});
