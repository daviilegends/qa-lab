import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/testUsers";

test.describe("Login @auth @smoke", () => {
  test("standard user can log in with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginAs(testUsers.standard.email, testUsers.standard.password);

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("nav-account-link")).toBeVisible();
  });

  test("logged-in user can log out", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(testUsers.standard.email, testUsers.standard.password);

    await page.getByTestId("logout-button").click();

    await expect(page.getByTestId("nav-login-link")).toBeVisible();
  });
});

test.describe("Login @auth @negative", () => {
  test("shows an error for invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginAs("standard@test.com", "wrong-password");

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText("Invalid email or password.");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows a specific error for a blocked account", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginAs(testUsers.blocked.email, testUsers.blocked.password);

    await expect(loginPage.errorMessage).toHaveText("This account has been blocked.");
  });
});
