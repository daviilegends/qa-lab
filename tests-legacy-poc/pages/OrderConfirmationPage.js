export class OrderConfirmationPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByTestId("confirmation-heading");
    this.orderNumber = page.getByTestId("order-number");
    this.orderTotal = page.getByTestId("order-total");
    this.orderPoints = page.getByTestId("order-points");
  }
}
