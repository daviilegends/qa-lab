import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { users } from '../../data/users.js';

test.describe('@auth Login page', () => {
  test('@smoke @auth shows login form and can log in with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // verify placeholder exists and matches expected value by checking the actual DOM
    const placeholder = await login.emailInput.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
    expect(placeholder).toBe(users.standard.email);

    // perform login with fixture user
    await login.login(users.standard.email, users.standard.password);

    // after successful login it should show account nav link and/or redirect
    await expect(login.accountNavLink).toBeVisible();
    await expect(page).toHaveURL(/\/account/);
  });

  test('@negative @auth shows error message for invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('wrong@test.com', 'badpassword');

    // the real error has data-testid="login-error" with exact text
    await expect(login.loginError).toBeVisible();
    await expect(login.loginError).toHaveText('Invalid email or password.');
  });

  test('@auth @smoke logout re-renders account page as logged out', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // login first using fixture
    await login.login(users.standard.email, users.standard.password);
    await expect(login.accountNavLink).toBeVisible();

    // click logout button in nav
    await expect(login.logoutButton).toBeVisible();
    await login.logoutButton.click();

    // After logout the app stays on /account but shows logged-out state
    await expect(page).toHaveURL(/\/account/);
    await expect(login.navLoginLink).toBeVisible();
    await expect(page.getByRole('heading', { name: 'You are not logged in' })).toBeVisible();
  });
});
