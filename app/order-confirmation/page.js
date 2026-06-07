"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoyaltyBanner from "@/components/loyalty/LoyaltyBanner";
import { findProductById } from "@/data/products";
import { subscriptionFrequencyLabels } from "@/lib/subscriptions";

function parseOrderItems(itemsParam) {
  if (!itemsParam) return [];
  return itemsParam
    .split(",")
    .map((entry) => {
      const [productId, quantity, frequency] = entry.split(":");
      const product = findProductById(productId);
      if (!product) return null;
      const frequencyNumber = Number(frequency) || 0;
      return {
        product,
        quantity: Number(quantity) || 1,
        subscription: frequencyNumber > 0 ? { frequency: frequencyNumber } : null,
      };
    })
    .filter(Boolean);
}

export default function OrderConfirmationPage({ searchParams }) {
  const params = use(searchParams);
  const orderNumber = params?.orderNumber ?? "N/A";
  const total = params?.total ?? "0.00";
  const points = params?.points ?? "0";
  const orderItems = parseOrderItems(params?.items);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-green-700" data-testid="confirmation-heading">
        Order placed successfully
      </h1>
      <p className="text-sm text-zinc-600">Thank you — this is a dummy order for QA automation practice.</p>

      <dl className="grid w-full grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left text-sm sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Order number</dt>
          <dd className="font-medium text-zinc-900" data-testid="order-number">
            {orderNumber}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Total charged</dt>
          <dd className="font-medium text-zinc-900" data-testid="order-total">
            ${total}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Loyalty points earned</dt>
          <dd className="font-medium text-zinc-900" data-testid="order-points">
            {points}
          </dd>
        </div>
      </dl>

      <LoyaltyBanner
        testId="confirmation-points-banner"
        title={`You earned ${points} loyalty points`}
        message="Points have been added to your account balance and can be redeemed on future orders."
      />

      {orderItems.length > 0 ? (
        <ul className="flex w-full flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left" data-testid="confirmation-order-items">
          {orderItems.map(({ product, quantity, subscription }) => (
            <li key={product.id} className="flex items-center gap-3 text-sm" data-testid="confirmation-order-item">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-800">
                  {product.name} <span className="text-zinc-500">x{quantity}</span>
                </span>
                {subscription ? (
                  <span data-testid="confirmation-item-subscription">
                    <Badge tone="warning">
                      Subscribed — {subscriptionFrequencyLabels[subscription.frequency]}
                    </Badge>
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <Link href="/products">
        <Button type="button" variant="secondary">
          Continue shopping
        </Button>
      </Link>
    </div>
  );
}
