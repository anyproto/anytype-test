import {
  callBlockTextSetTextForTitle,
  callBlockTextSetTextForTitleExpectError,
  callCreateObject,
  callOpenObject,
  callOpenObjectWithExpectedError,
} from "../../support/api/clients/objectApi";
import { Then } from "@cucumber/cucumber";
import { store } from "../../support/api/helpers/store";
import { Block, ObjectView } from "../../pb/pkg/lib/pb/model/protos/models";
import assert from "assert";

function findTitleBlock(objectView: ObjectView): Block | undefined {
  return objectView.blocks.find((block) => block.id === "title");
}

Then(
  "the user creates an object {int} in the account",
  async (objectNumber: number) => {
    await callCreateObject(objectNumber);
    //set store sync status to false to see that this object will be synced too
    store.spaceSyncStatusReceived = false;
  }
);

Then(
  "the user can open the object {int}",
  { timeout: 120 * 1000 },
  async (objectNumber: number) => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `STEP: the user can open the object ${objectNumber}`
    );
    const object = store.objects.get(objectNumber);

    if (!object) {
      throw new Error(`Object with number ${objectNumber} not found in store.`);
    }
    await callOpenObject(object.objectId, object.spaceId);
  }
);

Then(
  "the user can't open the object {int}",
  { timeout: 120 * 1000 },
  async (objectNumber: number) => {
    console.log(`STEP: the user can't open the object ${objectNumber}`);
    const object = store.objects.get(objectNumber);

    if (!object) {
      throw new Error(`Object with number ${objectNumber} not found in store.`);
    }
    await callOpenObjectWithExpectedError(object.objectId, object.spaceId);
  }
);

Then(
  "the user can rename the object {int}",
  { timeout: 120 * 1000 },
  async (objectNumber: number) => {
    console.log(`STEP: the user can rename the object ${objectNumber}`);
    const object = store.objects.get(objectNumber);

    if (!object) {
      throw new Error(`Object with number ${objectNumber} not found in store.`);
    }
    console.log("Object found, attempting to rename...");
    await callBlockTextSetTextForTitle(object.objectId, "Very Important Task");
    console.log("Block text set completed, attempting to open object...");

    const objectViewResponse = await callOpenObject(
      object.objectId,
      object.spaceId
    );
    console.log("Object opened successfully, checking title block...");

    const titleBlock = findTitleBlock(objectViewResponse);
    console.log("Title block details:", {
      id: titleBlock?.id,
      content: titleBlock?.content,
      fields: titleBlock?.fields,
    });

    if (!titleBlock) {
      console.error("Title block not found in response!");
      throw new Error("Title block not found after rename operation");
    }

    if (!titleBlock.content) {
      console.error("Title block has no content:", titleBlock);
      throw new Error("Title block content is missing");
    }

    if (titleBlock.content.oneofKind !== "text") {
      throw new Error(
        `Expected title block content to be text, but got ${titleBlock.content.oneofKind}`
      );
    }
    assert.strictEqual(titleBlock.content.text.text, "Very Important Task");
    console.log("Wow, the text was correctly set to 'Very Important Task'");
  }
);

Then("the user can't rename the object {int}", async (objectNumber: number) => {
  console.log(`STEP: the user can rename the object ${objectNumber}`);
  const object = store.objects.get(objectNumber);

  if (!object) {
    throw new Error(`Object with number ${objectNumber} not found in store.`);
  }
  console.log("Object found, attempting to rename...");

  await callBlockTextSetTextForTitleExpectError(
    object.objectId,
    "Very Important Task"
  );
  console.log("Block text set failed as expected");
});
