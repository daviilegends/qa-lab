import { test, expect } from "@playwright/test";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/testUsers";

test.describe("Subscription checkout @subscriptions", () => {
  test("a subscription-enabled product offers frequency options and confirms subscription", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();
    await plp.openProduct("Whey Protein Powder");

    const pdp = new ProductDetailsPage(page);
    await pdp.subscribeWithFrequency(2);

    await expect(pdp.feedback).toHaveText(
      "Subscribed to Whey Protein Powder 1kg (Every 2 months) and added it to your cart."
    );
  });

  test("a non-subscription product does not show a subscribe option", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();
    await plp.openProduct("Wireless Headphones");

    await expect(page.getByTestId("subscribe-checkbox")).toHaveCount(0);
  });
});

test.describe("Subscriptions in account @subscriptions @regression", () => {
  test("a subscribed user can see and cancel an active subscription", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(testUsers.subscribed.email, testUsers.subscribed.password);

    const subscriptionItem = page.getByTestId("subscription-item").filter({ hasText: "Whey Protein Powder" });
    await expect(subscriptionItem.getByText("active")).toBeVisible();

    await subscriptionItem.getByTestId("cancel-subscription-button").click();

    await expect(subscriptionItem.getByText("cancelled")).toBeVisible();
    await expect(subscriptionItem.getByTestId("cancel-subscription-button")).toHaveCount(0);
  });
});
