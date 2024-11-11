import { Before, After } from "@cucumber/cucumber";
import { ICustomWorld } from "../world";
import { store } from "../helpers/store";
import { stopServer } from "../api/services/gprcServerManager";
import { createAndSetTempDirectory } from "../api/services/utils";

Before(async function (this: ICustomWorld) {
  store.clear();
  createAndSetTempDirectory();
});

After(async function () {
  stopServer(2);
});
