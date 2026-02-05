import { test, expect } from 'playwright-test-coverage';
import { login, mockAPI } from './utils';
import { Page } from '@playwright/test';
import { BrowserContext } from '@playwright/test';

test('order pizza', async ({ page, context}) => {
    await setup(page, context);

    await expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled();

    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('link', { name: 'Order' }).click();
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tfoot')).toContainText('1 pie');

    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByText('easy.JWT.pizza')).toHaveCSS('color', 'rgb(239, 68, 68)');
});

async function setup(page: Page, context: BrowserContext) {
    await login(page, context);
    await mockAPI(context, 'menu', 'verify', 'franchises', 'me', 'order');
    await page.getByRole('link', { name: 'Order' }).click();
}