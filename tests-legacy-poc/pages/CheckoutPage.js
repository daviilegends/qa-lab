export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.fullNameInput = page.getByTestId("address-fullname-input");
    this.streetInput = page.getByTestId("address-street-input");
    this.cityInput = page.getByTestId("address-city-input");
    this.postalCodeInput = page.getByTestId("address-postal-input");
    this.countryInput = page.getByTestId("address-country-input");
    this.cardNumberInput = page.getByTestId("card-number-input");
    this.expiryInput = page.getByTestId("card-expiry-input");
    this.cvcInput = page.getByTestId("card-cvc-input");
    this.placeOrderButton = page.getByTestId("place-order-button");
    this.paymentError = page.getByTestId("payment-error");
  }

  async goto() {
    await this.page.goto("/checkout");
  }

  async fillShippingAddress({ fullName, street, city, postalCode, country }) {
    await this.fullNameInput.fill(fullName);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.postalCodeInput.fill(postalCode);
    await this.countryInput.fill(country);
  }

  async fillCard({ cardNumber, expiry, cvc }) {
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryInput.fill(expiry);
    await this.cvcInput.fill(cvc);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
