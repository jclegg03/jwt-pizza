import { test, expect } from 'playwright-test-coverage';
import { login, mockAPI } from './utils';
import { Page } from '@playwright/test';

test('order pizza', async ({ page }) => {
    await setup(page);

    await page.getByRole('link', { name: 'Order' }).click();

    
});

async function setup(page: Page) {
    await login(page);
    await mockAPI(page, 'menu', 'franchises');
}