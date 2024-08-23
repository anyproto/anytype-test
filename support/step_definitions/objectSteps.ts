import { callCreateObject, callOpenObject } from "../api/objectApi";
import { Then } from "@cucumber/cucumber";

Then(
  "the user creates an object {int} in the account",
  async (objectNumber: number) => {
    await callCreateObject(objectNumber);
  }
);

Then("the user can open the object {int}", async (objectNumber: number) => {
  await callOpenObject(objectNumber);
});
