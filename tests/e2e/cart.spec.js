import { test, expect } from "@playwright/test";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";

async function addProductToCart(page, productName) {
  const plp = new ProductListPage(page);
  await plp.goto();
  await plp.openProduct(productName);

  const pdp = new ProductDetailsPage(page);
  await pdp.addToCart();
}

test.describe("Cart quantity and removal @cart @smoke", () => {
  test("increasing quantity updates the line total", async ({ page }) => {
    await addProductToCart(page, "Non-Slip Yoga Mat");

    const cart = new CartPage(page);
    await cart.goto();

    await cart.increaseQuantity("Non-Slip Yoga Mat");

    await expect(cart.itemFor("Non-Slip Yoga Mat").getByTestId("cart-item-quantity")).toHaveText("2");
    await expect(cart.itemFor("Non-Slip Yoga Mat").getByTestId("cart-item-line-total")).toHaveText("$59.98");
  });

  test("removing an item takes it out of the cart", async ({ page }) => {
    await addProductToCart(page, "Non-Slip Yoga Mat");

    const cart = new CartPage(page);
    await cart.goto();
    await cart.removeItem("Non-Slip Yoga Mat");

    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  });

  test("saving an item for later moves it out of the active cart list", async ({ page }) => {
    await addProductToCart(page, "Non-Slip Yoga Mat");

    const cart = new CartPage(page);
    await cart.goto();
    await cart.itemFor("Non-Slip Yoga Mat").getByRole("button", { name: "Save for later" }).click();

    await expect(page.getByRole("heading", { name: "Saved for later" })).toBeVisible();
    await expect(cart.itemFor("Non-Slip Yoga Mat").getByRole("button", { name: "Move to cart" })).toBeVisible();
  });
});

test.describe("Coupons @cart @promotions", () => {
  test("a valid free-shipping coupon removes the shipping cost on large orders", async ({ page }) => {
    await addProductToCart(page, "Wireless Headphones");

    const cart = new CartPage(page);
    await cart.goto();
    // 12 x $89.99 = $1,079.88, comfortably above the $999 free-shipping threshold.
    for (let i = 0; i < 11; i += 1) {
      await cart.increaseQuantity("Wireless Headphones");
    }

    await cart.applyCoupon("FREESHIP");

    await expect(cart.couponMessage).toContainText('Coupon "FREESHIP" applied');
    await expect(page.getByTestId("summary-shipping")).toHaveText("Free");
  });

  test("an expired coupon is rejected with a clear message @negative", async ({ page }) => {
    await addProductToCart(page, "Non-Slip Yoga Mat");

    const cart = new CartPage(page);
    await cart.goto();
    await cart.applyCoupon("SUMMER5");

    await expect(cart.couponMessage).toHaveText("This coupon has expired.");
  });

  test("an unknown coupon code is rejected @negative", async ({ page }) => {
    await addProductToCart(page, "Non-Slip Yoga Mat");

    const cart = new CartPage(page);
    await cart.goto();
    await cart.applyCoupon("DOESNOTEXIST");

    await expect(cart.couponMessage).toHaveText("This coupon code does not exist.");
  });
});
