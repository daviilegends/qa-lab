import { test, expect } from "@playwright/test";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { dummyCards, sampleAddress } from "../fixtures/testUsers";

async function goToCheckoutWithProduct(page, productName) {
  const plp = new ProductListPage(page);
  await plp.goto();
  await plp.openProduct(productName);

  const pdp = new ProductDetailsPage(page);
  await pdp.addToCart();

  const cart = new CartPage(page);
  await cart.goto();
  await cart.goToCheckout();
}

test.describe("Checkout @checkout @smoke", () => {
  test("a successful payment leads to the order confirmation page", async ({ page }) => {
    await goToCheckoutWithProduct(page, "Non-Slip Yoga Mat");

    const checkout = new CheckoutPage(page);
    await checkout.fillShippingAddress(sampleAddress);
    await checkout.fillCard({ cardNumber: dummyCards.approved, expiry: "12/29", cvc: "123" });
    await checkout.placeOrder();

    await expect(page).toHaveURL(/\/order-confirmation/);
    const confirmation = new OrderConfirmationPage(page);
    await expect(confirmation.heading).toBeVisible();
    await expect(confirmation.orderNumber).toContainText("ORD-");
  });
});

test.describe("Checkout @checkout @negative", () => {
  test("a declined card shows a payment error and stays on checkout", async ({ page }) => {
    await goToCheckoutWithProduct(page, "Non-Slip Yoga Mat");

    const checkout = new CheckoutPage(page);
    await checkout.fillShippingAddress(sampleAddress);
    await checkout.fillCard({ cardNumber: dummyCards.declined, expiry: "12/29", cvc: "123" });
    await checkout.placeOrder();

    await expect(checkout.paymentError).toHaveText(
      "Your card was declined. Please try a different payment method."
    );
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("a card with insufficient funds is rejected with a specific message", async ({ page }) => {
    await goToCheckoutWithProduct(page, "Non-Slip Yoga Mat");

    const checkout = new CheckoutPage(page);
    await checkout.fillShippingAddress(sampleAddress);
    await checkout.fillCard({ cardNumber: dummyCards.insufficientFunds, expiry: "12/29", cvc: "123" });
    await checkout.placeOrder();

    await expect(checkout.paymentError).toHaveText("Payment failed due to insufficient funds.");
  });

  test("submitting an incomplete form shows field-level validation errors", async ({ page }) => {
    await goToCheckoutWithProduct(page, "Non-Slip Yoga Mat");

    const checkout = new CheckoutPage(page);
    await checkout.placeOrder();

    await expect(page.getByText("Full name is required.")).toBeVisible();
    await expect(page.getByText("Enter a valid 16-digit card number.")).toBeVisible();
  });
});
