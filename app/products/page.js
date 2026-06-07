"use client";

import { useMemo, useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductCard from "@/components/product/ProductCard";
import SubscriptionPromoBanner from "@/components/marketing/SubscriptionPromoBanner";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { getEffectivePrice } from "@/lib/pricing";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const POPULAR_RATING_THRESHOLD = 4.5;

const popularProducts = [...products]
  .filter((product) => product.rating >= POPULAR_RATING_THRESHOLD)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4);

const featuredSubscriptionProduct =
  [...products]
    .filter((product) => product.subscriptionEnabled)
    .sort((a, b) => b.rating - a.rating)[0] ?? null;

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    if (categoryId !== "all") {
      result = result.filter((product) => product.categoryId === categoryId);
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    }

    return result;
  }, [searchTerm, categoryId, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-zinc-900 sm:text-3xl">Shop the catalog</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            A predictable dummy product catalog — search, filter and sort to find products in stock,
            on sale or available for subscription.
          </p>
        </div>

        <nav aria-label="Shop by category" className="flex flex-wrap gap-2" data-testid="category-pill-nav">
          <button
            type="button"
            onClick={() => setCategoryId("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              categoryId === "all"
                ? "bg-brand-600 text-white"
                : "border border-zinc-300 text-zinc-700 hover:border-brand-600 hover:text-brand-700"
            }`}
            data-testid="category-pill-all"
          >
            View all
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categoryId === category.id
                  ? "bg-brand-600 text-white"
                  : "border border-zinc-300 text-zinc-700 hover:border-brand-600 hover:text-brand-700"
              }`}
              data-testid={`category-pill-${category.id}`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      <SubscriptionPromoBanner featuredProduct={featuredSubscriptionProduct} />

      {popularProducts.length > 0 ? (
        <section aria-labelledby="popular-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 id="popular-heading" className="font-heading text-xl font-semibold text-zinc-900">
              Popular products
            </h2>
            <span className="text-sm text-zinc-500">Highest rated in the catalog</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" data-testid="popular-products-row">
            {popularProducts.map((product) => (
              <div key={product.id} className="w-64 shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold text-zinc-900">All products</h2>

        <form className="flex flex-col gap-4 sm:flex-row sm:items-end" role="search" aria-label="Product search and filters">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="search" className="text-sm font-medium text-zinc-800">
              Search products
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              data-testid="product-search-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-sm font-medium text-zinc-800">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              data-testid="category-filter-select"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sort" className="text-sm font-medium text-zinc-800">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              data-testid="sort-select"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
