import { test, expect } from 'playwright-test-coverage';
import { login, mockAPI } from './utils';
import { Page } from '@playwright/test';
import { BrowserContext } from '@playwright/test';

// test('order pizza, then more', async ({ page, context}) => {
//     await orderPizza(page, context);
//     await expect(page.getByText('easy.JWT.pizza')).toHaveCSS('color', 'rgb(239, 68, 68)');

//     await page.getByRole('button', { name: 'Order more' }).click();
// });

// test('order pizza, then verify', async ({ page, context}) => {
//     await orderPizza(page, context);

//     await page.getByRole('button', { name: 'Verify' }).click();

//     await expect(page.locator('h3')).toContainText('JWT Pizza - valid');
// });

async function orderPizza(page: Page, context: BrowserContext) {
    await setup(page, context);

    await expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled();

    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('link', { name: 'Order' }).click();
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tfoot')).toContainText('1 pie');

    await page.getByRole('button', { name: 'Pay now' }).click();
}

async function setup(page: Page, context: BrowserContext) {
    await mockAPI(context, 'auth', 'menu', 'verify', 'franchises', 'me', 'order');
    await login(page);
    await page.getByRole('link', { name: 'Order' }).click();
}