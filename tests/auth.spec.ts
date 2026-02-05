import { test, expect } from 'playwright-test-coverage';
import { mockAPI, login } from './utils';

test('register', async ({ page, context }) => {
  mockAPI(context, "auth");
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('j');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('j@test');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('monkeypie');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'j' }).click();
  await expect(page.getByRole('main')).toContainText('j@test');
  await expect(page.getByRole('main')).toContainText('diner');
});

test('login', async ({ page, context }) => {
  mockAPI(context, "auth");
  await login(page);

  await page.getByRole('link', { name: 'j' }).click();
  await expect(page.getByRole('main')).toContainText('j@test');
  await expect(page.getByRole('main')).toContainText('diner');
});

test('logout', async ({ page, context }) => {
  mockAPI(context, "auth");
  await login(page);

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});