"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StockBadge from "@/components/product/StockBadge";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { categories } from "@/data/categories";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const category = categories.find((item) => item.id === product.categoryId);
  const hasDiscount = Boolean(product.discountPrice);
  const isOutOfStock = product.stockStatus === "out-of-stock";

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      data-testid="product-card"
      aria-label={product.name}
    >
      <Link
        href={`/products/${product.id}`}
        aria-label={`View details for ${product.name}`}
        data-testid="product-thumbnail-link"
        className="relative block h-40 overflow-hidden rounded-lg bg-brand-50"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>

      <div className="flex items-center justify-between">
        <Badge>{category?.name ?? "Uncategorized"}</Badge>
        <StockBadge status={product.stockStatus} />
      </div>

      <h2 className="font-heading text-base font-semibold text-zinc-900">{product.name}</h2>

      <p className="flex items-center gap-1 text-sm text-zinc-600" aria-label="Rating">
        <span aria-hidden="true" className="text-amber-500">★</span>
        {product.rating.toFixed(1)} / 5
      </p>

      <div className="flex flex-wrap items-baseline gap-2">
        {hasDiscount ? (
          <>
            <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
            <span className="text-lg font-semibold text-brand-700">${product.discountPrice.toFixed(2)}</span>
          </>
        ) : (
          <span className="text-lg font-semibold text-zinc-900">${product.price.toFixed(2)}</span>
        )}
        {product.subscriptionEnabled ? <Badge tone="warning">Subscription available</Badge> : null}
      </div>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="cta"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          data-testid="card-add-to-cart-button"
        >
          {isOutOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </Button>
        <Link
          href={`/products/${product.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-brand-600 hover:text-brand-700"
          data-testid="view-details-link"
        >
          View details
        </Link>
      </div>

      {added ? (
        <p role="status" className="text-sm text-brand-700" data-testid="card-add-feedback">
          Added 1 x {product.name} to your cart.
        </p>
      ) : null}
    </article>
  );
}
