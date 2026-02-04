import { test, expect } from 'playwright-test-coverage';
import { mockAPI } from './mock';
// import { MockMode, mockAPI } from 'mock.ts'

test('register', async ({ page }) => {
  // await initializeTest(page);
  await page.goto('http://localhost:5173/');
  mockAPI(page, "auth")

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