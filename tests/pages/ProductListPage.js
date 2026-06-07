export class ProductListPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByLabel("Search products");
    this.categorySelect = page.getByLabel("Category");
    this.sortSelect = page.getByLabel("Sort by");
    this.productCards = page.getByTestId("product-card");
  }

  async goto() {
    await this.page.goto("/products");
  }

  async searchFor(term) {
    await this.searchInput.fill(term);
  }

  async openProduct(productName) {
    await this.page
      .getByTestId("product-card")
      .filter({ hasText: productName })
      .getByRole("link", { name: "View details" })
      .click();
  }
}
