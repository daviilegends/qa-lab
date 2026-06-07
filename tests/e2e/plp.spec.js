import { test, expect } from "@playwright/test";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";

test.describe("Product search and details @smoke", () => {
  test("search narrows the product grid to matching products", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();

    await plp.searchFor("Headphones");

    await expect(plp.productCards).toHaveCount(1);
    await expect(plp.productCards.first()).toContainText("Wireless Headphones");
  });

  test("search with no matches shows an empty state", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();

    await plp.searchFor("Nonexistent Product XYZ");

    await expect(page.getByRole("status")).toHaveText("No products match your search.");
  });

  test("opening a product navigates to its details page", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();

    await plp.openProduct("Wireless Headphones");

    await expect(page.getByRole("heading", { name: "Wireless Headphones" })).toBeVisible();
    await expect(page.getByTestId("product-price")).toContainText("$89.99");
  });
});

test.describe("Filtering and sorting @regression", () => {
  test("category filter shows only products from the selected category", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();

    await plp.categorySelect.selectOption({ label: "Fitness" });

    const count = await plp.productCards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await expect(plp.productCards.nth(i)).toContainText("Fitness");
    }
  });

  test("sorting by price low to high orders products by effective price", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();

    await plp.sortSelect.selectOption({ label: "Price: low to high" });

    const firstCardPrice = await plp.productCards.first().getByText(/^\$\d+\.\d{2}$/).first().textContent();
    expect(firstCardPrice).toBe("$12.99");
  });
});

test.describe("Add to cart @cart", () => {
  test("adding a product from its details page increases the cart count", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();
    await plp.openProduct("Wireless Headphones");

    const pdp = new ProductDetailsPage(page);
    await pdp.setQuantity(2);
    await pdp.addToCart();

    await expect(pdp.feedback).toHaveText("Added 2 x Wireless Headphones to your cart.");
    await expect(page.getByTestId("cart-count-badge")).toHaveText("2");
  });

  test("out-of-stock products cannot be added to cart", async ({ page }) => {
    const plp = new ProductListPage(page);
    await plp.goto();
    await plp.openProduct("The Silent Orchard");

    const pdp = new ProductDetailsPage(page);
    await expect(pdp.addToCartButton).toBeDisabled();
    await expect(pdp.addToCartButton).toHaveText("Out of stock");
  });
});
