import { test } from 'playwright-test-coverage';
import { mockAPI, login } from './utils';
import { BrowserContext, Page } from '@playwright/test';

test("login as franchisee", async ({ page, context }) => {
    await loginFranchisee(page, context);
    // await page.getByRole('link', { name: 'Franchise' }).click();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
});

async function loginFranchisee(page: Page, context: BrowserContext) {
    await mockAPI(context, 'franchisee', 'franchises', 'getFranchise');
    await login(page);
}