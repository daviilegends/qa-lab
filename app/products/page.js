"use client";

import { useMemo, useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { getEffectivePrice } from "@/lib/pricing";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>
        <p className="mt-1 text-sm text-zinc-600">Browse the dummy catalog used for QA automation practice.</p>
      </div>

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
  );
}
