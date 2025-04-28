import { test, expect } from '@playwright/test';
import { page } from '../setup/globals';
import { delay } from '../setup/helpers';
import { createTitleWithSelectionTarget, createTitleWithEditorTitle, deleteObjectByName } from '../utils/spaceUtils';

export const createObjectTest = () => {
  test("Create and delete various object types", async () => {
    console.log("Starting object creation test...");
    
    // Открываем меню создания объекта
    const arrowButton = page.locator("div#widget-space-arrow");
    await expect(arrowButton).toBeVisible({ timeout: 5000 });
    await arrowButton.click();
    await delay(2000);

    const menuTypeSuggest = page.locator("div#menuTypeSuggest");
    await expect(menuTypeSuggest).toBeVisible({ timeout: 5000 });

    // 🔹 Helper-функция для создания объекта
    const createObject = async (name: string, label: string, createTitleFn: typeof createTitleWithSelectionTarget | typeof createTitleWithEditorTitle) => {
      console.log(`Creating ${label} object...`);
      const menuItem = menuTypeSuggest.locator(`div.name:has-text('${label}')`);
      await expect(menuItem).toBeVisible({ timeout: 5000 });
      await delay(1000);
      await menuItem.click({ force: true });
      await delay(2000);

      await createTitleFn(page, name);
      console.log(`${label} object created successfully`);

      // Возврат в главное меню
      const backArrow = page.locator("div#widget-space-arrow");
      await expect(backArrow).toBeVisible({ timeout: 5000 });
      await backArrow.click();
      await delay(2000);
    };

    // Создаем разные типы объектов
    await createObject("Bookmark UItest", "Bookmark", createTitleWithSelectionTarget);
    await createObject("Collection UItest", "Collection", createTitleWithEditorTitle);
    await createObject("Note UItest", "Note", createTitleWithSelectionTarget);
    await createObject("Page UItest", "Page", createTitleWithSelectionTarget);
    await createObject("Project UItest", "Project", createTitleWithSelectionTarget);
    await createObject("Query UItest", "Query", createTitleWithEditorTitle);
    await createObject("Task UItest", "Task", createTitleWithSelectionTarget);

    console.log("✅ All object types created successfully");

    // Удаляем созданные объекты
    console.log("Cleaning up: Deleting all created objects...");
    await deleteObjectByName(page, "Bookmark UItest", true, "Bookmarks");
    await deleteObjectByName(page, "Collection UItest", true, "Lists");
    await deleteObjectByName(page, "Note UItest", true, "Pages");
    await deleteObjectByName(page, "Page UItest", true, "Pages");
    await deleteObjectByName(page, "Project UItest", true, "Pages");
    await deleteObjectByName(page, "Query UItest", true, "Lists");
    await deleteObjectByName(page, "Task UItest", true, "Pages");

    console.log("✅ All object types deleted successfully");
  });
};
