import { test, expect } from 'playwright-test-coverage';
import { mockAPI, login } from './utils';
import { BrowserContext, Page } from '@playwright/test';

test("login as franchisee", async ({ page, context }) => {
    await loginFranchisee(page, context);
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

    await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise. Your gateway to success.');
});

test("create store", async ({ page, context }) => {
    await loginFranchisee(page, context);
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('cool store');
    await expect(page.locator('form')).toContainText('Cancel');
    await page.getByRole('button', { name: 'Create' }).click();
});

test("delete store", async ({ page, context }) => {
    await loginFranchisee(page, context);
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();


    await expect(page.locator('tbody')).toContainText('store');
    await page.getByRole('row', { name: 'store ₿ Close' }).getByRole('button').click();
    await expect(page.getByRole('main')).toContainText('store');
    await page.getByRole('button', { name: 'Close' }).click();
});

async function loginFranchisee(page: Page, context: BrowserContext) {
    await mockAPI(context, 'franchisee', 'franchises', 'getFranchise');
    await login(page);
}