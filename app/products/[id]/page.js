"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import StockBadge from "@/components/product/StockBadge";
import Badge from "@/components/ui/Badge";
import { findProductById } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { subscriptionFrequencyLabels, getSubscriptionPrice } from "@/lib/subscriptions";

export default function ProductDetailsPage({ params }) {
  const { id } = use(params);
  const product = findProductById(id);

  if (!product) {
    notFound();
  }

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wantsSubscription, setWantsSubscription] = useState(false);
  const [frequency, setFrequency] = useState(product.subscriptionFrequencies?.[0] ?? 1);
  const [feedback, setFeedback] = useState("");

  const isOutOfStock = product.stockStatus === "out-of-stock";

  function handleAddToCart() {
    addItem(product.id, quantity);
    setFeedback(`Added ${quantity} x ${product.name} to your cart.`);
  }

  function handleSubscribe() {
    setFeedback(`Subscribed to ${product.name} (${subscriptionFrequencyLabels[frequency]}).`);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex h-80 items-center justify-center rounded-lg bg-zinc-100 text-sm text-zinc-400">
        {product.name} image
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <StockBadge status={product.stockStatus} />
          {product.subscriptionEnabled ? <Badge tone="warning">Subscription available</Badge> : null}
        </div>

        <h1 className="text-2xl font-semibold text-zinc-900">{product.name}</h1>
        <p className="text-sm text-zinc-600">{product.description}</p>

        <div className="flex items-baseline gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-base text-zinc-400 line-through">${product.price.toFixed(2)}</span>
              <span className="text-2xl font-semibold text-zinc-900" data-testid="product-price">
                ${product.discountPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-semibold text-zinc-900" data-testid="product-price">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className="text-sm font-medium text-zinc-800">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
              className="w-20 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              data-testid="quantity-input"
            />
          </div>

          <Button type="button" onClick={handleAddToCart} disabled={isOutOfStock} data-testid="add-to-cart-button">
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>

        {product.subscriptionEnabled ? (
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
              <input
                type="checkbox"
                checked={wantsSubscription}
                onChange={(event) => setWantsSubscription(event.target.checked)}
                data-testid="subscribe-checkbox"
              />
              Subscribe and save {product.subscriptionDiscountPercent}%
            </label>

            {wantsSubscription ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-1">
                  <label htmlFor="frequency" className="text-sm font-medium text-zinc-800">
                    Delivery frequency
                  </label>
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(event) => setFrequency(Number(event.target.value))}
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                    data-testid="subscription-frequency-select"
                  >
                    {product.subscriptionFrequencies.map((months) => (
                      <option key={months} value={months}>
                        {subscriptionFrequencyLabels[months]}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-sm text-zinc-600">
                  Subscriber price: <span className="font-medium text-zinc-900">${getSubscriptionPrice(product).toFixed(2)}</span>
                </p>

                <Button type="button" variant="secondary" onClick={handleSubscribe} data-testid="confirm-subscription-button">
                  Confirm subscription
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {feedback ? (
          <p role="status" className="text-sm text-green-700" data-testid="product-feedback">
            {feedback}
          </p>
        ) : null}

        <section aria-labelledby="reviews-heading" className="flex flex-col gap-3">
          <h2 id="reviews-heading" className="text-lg font-semibold text-zinc-900">
            Reviews
          </h2>
          {product.reviews.length === 0 ? (
            <p className="text-sm text-zinc-500">No reviews yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {product.reviews.map((review) => (
                <li key={review.id} className="rounded-md border border-zinc-200 bg-white p-3 text-sm">
                  <p className="font-medium text-zinc-900">
                    {review.author} — {review.rating}/5
                  </p>
                  <p className="text-zinc-600">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
