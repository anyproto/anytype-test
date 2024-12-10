import {
  callCreateObject,
  callOpenObject,
} from "../../support/api/clients/objectApi";
import { Then } from "@cucumber/cucumber";
import { store } from "../../support/helpers/store";

Then(
  "the user creates an object {int} in the account",
  async (objectNumber: number) => {
    await callCreateObject(objectNumber);
    //set store sync status to false to see that this object will be synced too
    store.spaceSyncStatusReceived = false;
  }
);

Then("the user makes his first space shareable", async () => {
  await callMakeSpaceShareable(spaceId);
});

Then("the user can open the object {int}", async (objectNumber: number) => {
  const object = store.objects.get(objectNumber);

  if (!object) {
    throw new Error(`Object with number ${objectNumber} not found in store.`);
  }
  await callOpenObject(object.objectId, object.spaceId);
});
