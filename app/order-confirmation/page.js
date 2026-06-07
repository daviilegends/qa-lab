"use client";

import { use } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function OrderConfirmationPage({ searchParams }) {
  const params = use(searchParams);
  const orderNumber = params?.orderNumber ?? "N/A";
  const total = params?.total ?? "0.00";
  const points = params?.points ?? "0";

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

      <Link href="/products">
        <Button type="button" variant="secondary">
          Continue shopping
        </Button>
      </Link>
    </div>
  );
}
