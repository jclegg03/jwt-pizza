import { test, expect } from 'playwright-test-coverage';
import { login, mockAPI } from './utils';
import { Page } from '@playwright/test';

test('order pizza', async ({ page }) => {
    await setup(page);

    expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled();

    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('link', { name: 'Order' }).click();
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await expect(page.locator('tbody')).toContainText('Veggie');

    await expect(page.locator('tfoot')).toContainText('1 pie');
    await page.getByRole('button', { name: 'Pay now' }).click();
});

async function setup(page: Page) {
    await login(page);
    await mockAPI(page, 'menu', 'franchises', 'me');
    await page.getByRole('link', { name: 'Order' }).click();
}