export class ProductListPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByLabel("Search products");
    // The page also has a "Shop by category" nav landmark, whose accessible
    // name contains "category" — getByLabel("Category") would strict-mode
    // violate against it, so target the filter select by its stable test id.
    this.categorySelect = page.getByTestId("category-filter-select");
    this.sortSelect = page.getByLabel("Sort by");
    // Scoped to the "All products" grid — the page also has a "Popular products"
    // row that reuses ProductCard, so an unscoped lookup would over-count.
    this.productGrid = page.getByTestId("product-grid");
    this.productCards = this.productGrid.getByTestId("product-card");
  }

  async goto() {
    await this.page.goto("/products");
  }

  async searchFor(term) {
    await this.searchInput.fill(term);
  }

  async openProduct(productName) {
    await this.productCards
      .filter({ hasText: productName })
      .getByTestId("view-details-link")
      .click();
  }
}
