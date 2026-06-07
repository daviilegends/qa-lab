import Link from "next/link";
import StockBadge from "@/components/product/StockBadge";
import Badge from "@/components/ui/Badge";
import { categories } from "@/data/categories";

export default function ProductCard({ product }) {
  const category = categories.find((item) => item.id === product.categoryId);
  const hasDiscount = Boolean(product.discountPrice);

  return (
    <article
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      data-testid="product-card"
      aria-label={product.name}
    >
      <div className="flex h-40 items-center justify-center rounded-lg bg-brand-50 text-sm font-medium text-brand-700">
        {product.name}
      </div>

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

      <Link
        href={`/products/${product.id}`}
        className="mt-auto inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-brand-600 hover:text-brand-700"
        data-testid="view-details-link"
      >
        View details
      </Link>
    </article>
  );
}
