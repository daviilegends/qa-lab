import fs from 'fs';
import path from 'path';
import { test as base } from '@playwright/test';
import { env } from '../support/env.js';
import { LoginPage } from '../pages/LoginPage.js';
import { saveTestScreenshot } from '../utils/evidence.js';

const STORAGE_DIR = path.resolve(process.cwd(), 'tests', '.auth');
const STANDARD_STATE = path.join(STORAGE_DIR, 'standard.json');

async function ensureLoggedInStorage(browser) {
  if (fs.existsSync(STANDARD_STATE)) return STANDARD_STATE;
  const context = await browser.newContext();
  const page = await context.newPage();
  const login = new LoginPage(page);
  await page.goto('/login');
  await login.login(env.STANDARD_USER_EMAIL, env.STANDARD_USER_PASSWORD);
  // wait for nav account link to appear
  await page.getByTestId('nav-account-link').waitFor({ state: 'visible', timeout: 5000 });
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
  await context.storageState({ path: STANDARD_STATE });
  await context.close();
  return STANDARD_STATE;
}

export const test = base.extend({
  // Provides a browser context already authenticated as the standard user
  loggedInContext: async ({ browser }, use) => {
    const statePath = await ensureLoggedInStorage(browser);
    const context = await browser.newContext({ storageState: statePath });
    await use(context);
    await context.close();
  },

  // Provides a page tied to the logged-in context
  loggedInPage: async ({ loggedInContext }, use) => {
    const page = await loggedInContext.newPage();
    await use(page);
    await page.close();
  },

  // Provides a logged-in page with one product already in the cart
  cartWithItem: async ({ loggedInPage }, use) => {
    const page = loggedInPage;
    await page.goto('/products');
    const addBtn = page.getByTestId('card-add-to-cart-button').first();
    await addBtn.click();
    await page.goto('/cart');
    await page.getByTestId('checkout-link').waitFor({ state: 'visible' });
    await use(page);
  },
});

export { expect } from '@playwright/test';

// Global afterEach to always capture screenshot evidence using the naming convention `test_name_date`.
test.afterEach(async ({ page }, testInfo) => {
  try {
    if (page) {
      await saveTestScreenshot(page, testInfo.title || testInfo.file);
    }
  } catch (err) {
    // do not fail tests due to evidence saving errors
    // eslint-disable-next-line no-console
    console.error('Failed to save test screenshot evidence:', err?.message ?? err);
  }
});
