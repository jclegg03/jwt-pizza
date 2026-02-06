import { test } from 'playwright-test-coverage';
import { mockAPI, login } from './utils';
import { BrowserContext, Page } from '@playwright/test';

test("login as admin", async ({ page, context }) => {
    await loginAdmin(page, context);
    await page.getByRole('link', { name: 'Admin' }).click();
});

test("Delete franchise", async ({ page, context }) => {
    await loginAdmin(page, context);
    await page.getByRole('link', { name: 'Admin' }).click();

    await page.getByRole('row', { name: 'franchise Close' }).getByRole('button').click();
    await mockCloseFranchise(context);

    await page.getByRole('button', { name: 'Close' }).click();
});

test("Add Franchise", async ({page, context}) => {
    await loginAdmin(page, context);
    await page.getByRole('link', { name: 'Admin' }).click();

    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('cool franchise');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('cool@cool');
    await page.getByRole('button', { name: 'Create' }).click();
});

async function mockCloseFranchise(context: BrowserContext) {
    await context.route('**/api/franchise/1', async (route) => {
        const franchiseRes = {
            franchises: [],
            "more": false
        }

        await route.fulfill({ json: franchiseRes });
    });
}

async function loginAdmin(page: Page, context: BrowserContext) {
    await mockAPI(context, 'admin', 'franchises');
    await login(page);
}