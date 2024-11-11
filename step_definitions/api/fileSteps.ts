import { Given } from "@cucumber/cucumber";
import { clearDirectoryContents } from "../../support/api/services/utils";

Given("data is deleted", async () => {
  await clearDirectoryContents();
});
