import { test } from "@playwright/test";
import { setupTestContext, createAccount } from "./setup/helpers";

test.beforeAll(async () => {
	console.log('🧪 Setting up test context...');
	await setupTestContext();
	await createAccount();
});

test.afterAll(() => {})