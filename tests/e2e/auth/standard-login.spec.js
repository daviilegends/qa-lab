import { test, expect } from '../../fixtures/index.js';

test.describe('@auth @smoke Standard user login', () => {
  test('standard user can log in and sees account nav', async ({ loggedInPage }) => {
    const page = loggedInPage;
    await page.goto('/account');
    await expect(page.getByTestId('nav-account-link')).toBeVisible();
    await expect(page).toHaveURL(/\/account/);
  });
});
