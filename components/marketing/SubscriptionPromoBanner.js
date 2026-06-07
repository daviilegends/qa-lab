import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function SubscriptionPromoBanner({ featuredProduct }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-6 py-10 text-white sm:px-10"
      data-testid="subscription-promo-banner"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cta-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-brand-400/20 blur-3xl"
      />

      <div className="relative flex flex-col gap-3 sm:max-w-xl">
        <Badge tone="warning">Subscribe &amp; save</Badge>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Never run out — subscribe and earn extra loyalty points
        </h2>
        <p className="text-sm text-brand-100">
          Eligible products can be set up for recurring delivery at a member price, and every
          subscriber order earns points at a bonus rate toward future discounts.
        </p>
        {featuredProduct ? (
          <Link
            href={`/products/${featuredProduct.id}`}
            className="mt-1 inline-flex w-fit items-center justify-center rounded-md bg-cta-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cta-600"
            data-testid="subscription-promo-link"
          >
            Explore {featuredProduct.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
