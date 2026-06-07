export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.getByTestId("cart-item");
    this.couponInput = page.getByTestId("coupon-input");
    this.applyCouponButton = page.getByTestId("apply-coupon-button");
    this.couponMessage = page.getByTestId("coupon-message");
    this.summaryTotal = page.getByTestId("summary-total");
    this.checkoutLink = page.getByTestId("checkout-link");
  }

  async goto() {
    await this.page.goto("/cart");
  }

  itemFor(productName) {
    return this.cartItems.filter({ hasText: productName });
  }

  async increaseQuantity(productName) {
    await this.itemFor(productName).getByRole("button", { name: `Increase quantity of ${productName}` }).click();
  }

  async decreaseQuantity(productName) {
    await this.itemFor(productName).getByRole("button", { name: `Decrease quantity of ${productName}` }).click();
  }

  async removeItem(productName) {
    await this.itemFor(productName).getByRole("button", { name: `Remove ${productName} from cart` }).click();
  }

  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  async goToCheckout() {
    await this.checkoutLink.click();
  }
}
