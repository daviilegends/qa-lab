export class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.quantityInput = page.getByLabel("Quantity");
    this.addToCartButton = page.getByTestId("add-to-cart-button");
    this.subscribeCheckbox = page.getByTestId("subscribe-checkbox");
    this.frequencySelect = page.getByTestId("subscription-frequency-select");
    this.confirmSubscriptionButton = page.getByTestId("confirm-subscription-button");
    this.feedback = page.getByTestId("product-feedback");
  }

  async setQuantity(value) {
    await this.quantityInput.fill(String(value));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async subscribeWithFrequency(months) {
    await this.subscribeCheckbox.check();
    await this.frequencySelect.selectOption(String(months));
    await this.confirmSubscriptionButton.click();
  }
}
