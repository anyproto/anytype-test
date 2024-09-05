import { Before, After } from "@cucumber/cucumber";
import { store } from "./helpers/store";
import { stopServer } from "./server";

// Clear the store before each scenario to ensure a clean state
Before(function () {
  store.clear();
});

// after each scenario
After(function () {
  stopServer(2);
});
