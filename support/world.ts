import { setWorldConstructor, IWorldOptions, World } from "@cucumber/cucumber";
import { store, storeType } from "./api/helpers/store";
import { setDefaultTimeout } from "@cucumber/cucumber";

// Set global timeout for all steps
setDefaultTimeout(120 * 1000);

export class CustomWorld extends World {
  inviteContentId?: string;
  inviteFileKey?: string;
  scenarioStore: storeType;

  constructor(options: IWorldOptions) {
    super(options);

    // Initialize scenario-specific properties
    this.inviteContentId = undefined;
    this.inviteFileKey = undefined;

    // Create a new instance of the store for each scenario.
    // This ensures that no state leaks between scenarios.
    this.scenarioStore = {
      ...store,
      users: new Map(),
      servers: new Map(),
      objects: new Map(),
      clients: new Map(),
      // You can keep or remove other store properties as needed
    };
  }
}

setWorldConstructor(CustomWorld);
