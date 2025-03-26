// globals.ts
import { ElectronApplication, Page } from 'playwright';

export let electronApp: ElectronApplication;
export let page: Page;
export let translations: any;
export const storage: Record<string, string> = {};

export function setElectronApp(app: ElectronApplication) {
	electronApp = app;
}

export function setPage(p: Page) {
	page = p;
}

export function setTranslations(t: any) {
	translations = t;
}