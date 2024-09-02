import { Given } from "@cucumber/cucumber";
import { clearDirectoryContents } from "../helpers/utils";
import path from "path";

Given("data is deleted", async () => {
  console.log(`Current directory: ${__dirname}`);

  // Resolve the absolute path for the directory to clear
  const dirToClear = path.resolve(__dirname, "../../tmp");
  console.log(`Absolute path to clear: ${dirToClear}`);

  // Await the clearing of directory contents
  await clearDirectoryContents(dirToClear);
});
