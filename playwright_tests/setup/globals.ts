// globals.ts
import { ElectronApplication, Page } from 'playwright';
import * as dotenv from 'dotenv';
dotenv.config();

export let electronApp: ElectronApplication;
export let page: Page;
export let translations: any;
export const storage: Record<string, any> = {
	"vaultKey": process.env.DEFAULT_VAULT_KEY || "",
	"testAccountName": "UI auto",
	"testEmail": "test@test.test",
	"defaultSpaceName": "My First Space",
	"testSpaceName": "Test Space",
	"default_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit elit eu iaculis consectetur. Aliquam erat volutpat. Suspendisse ultricies consectetur metus non tempus. Phasellus et posuere justo. Mauris non efficitur ex. Aliquam ultrices a ligula in viverra. Praesent vulputate enim sed risus sollicitudin malesuada. Suspendisse tempor libero dolor, et placerat metus laoreet eget.",
};

export function setElectronApp(app: ElectronApplication) {
	electronApp = app;
}

export function setPage(p: Page) {
	page = p;
}

export function setTranslations(t: any) {
	translations = t;
}