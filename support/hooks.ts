import { Before, After } from "@cucumber/cucumber";
import { store } from "./helpers/store";

// Clear the store before each scenario to ensure a clean state
Before(function () {
  store.clear();
});

// Optionally, clear the store after each scenario to ensure no residual state
After(function () {});
