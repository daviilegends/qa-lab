"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/users";
import { findAddressesByUserId } from "@/data/addresses";
import { findPaymentMethodsByUserId } from "@/data/payments";
import { findSubscriptionsByUserId } from "@/data/subscriptions";
import { findProductById } from "@/data/products";
import { subscriptionFrequencyLabels } from "@/lib/subscriptions";

export default function AccountPage() {
  const { userId, isReady } = useAuth();
  const currentUser = users.find((user) => user.id === userId) ?? null;
  const [subscriptions, setSubscriptions] = useState(() =>
    currentUser ? findSubscriptionsByUserId(currentUser.id) : []
  );

  if (isReady && !currentUser) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">You are not logged in</h1>
        <Link href="/login" className="text-sm font-medium text-zinc-900 underline" data-testid="account-login-link">
          Go to login
        </Link>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const addresses = findAddressesByUserId(currentUser.id);
  const paymentMethods = findPaymentMethodsByUserId(currentUser.id);

  function handleCancelSubscription(subscriptionId) {
    setSubscriptions((current) =>
      current.map((subscription) =>
        subscription.id === subscriptionId ? { ...subscription, status: "cancelled" } : subscription
      )
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">My account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {currentUser.name} — <span data-testid="loyalty-points">{currentUser.loyaltyPoints} loyalty points</span>
        </p>
      </div>

      <section aria-labelledby="subscriptions-heading" className="flex flex-col gap-3">
        <h2 id="subscriptions-heading" className="text-lg font-semibold text-zinc-900">
          Subscriptions
        </h2>
        {subscriptions.length === 0 ? (
          <p className="text-sm text-zinc-500">No active subscriptions.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {subscriptions.map((subscription) => {
              const product = findProductById(subscription.productId);
              return (
                <li
                  key={subscription.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  data-testid="subscription-item"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{product?.name}</p>
                    <p className="text-sm text-zinc-600">{subscriptionFrequencyLabels[subscription.frequencyMonths]}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={subscription.status === "active" ? "success" : subscription.status === "cancelled" ? "neutral" : "warning"}>
                      {subscription.status}
                    </Badge>
                    {subscription.status === "active" ? (
                      <Button variant="secondary" type="button" onClick={() => handleCancelSubscription(subscription.id)} data-testid="cancel-subscription-button">
                        Cancel subscription
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="addresses-heading" className="flex flex-col gap-3">
        <h2 id="addresses-heading" className="text-lg font-semibold text-zinc-900">
          Saved addresses
        </h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-zinc-500">No saved addresses.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {addresses.map((address) => (
              <li key={address.id} className="rounded-lg border border-zinc-200 bg-white p-4 text-sm">
                <p className="font-medium text-zinc-900">{address.label}</p>
                <p className="text-zinc-600">
                  {address.fullName}, {address.street}, {address.city} {address.postalCode}, {address.country}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="payment-methods-heading" className="flex flex-col gap-3">
        <h2 id="payment-methods-heading" className="text-lg font-semibold text-zinc-900">
          Saved payment methods
        </h2>
        {paymentMethods.length === 0 ? (
          <p className="text-sm text-zinc-500">No saved payment methods.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {paymentMethods.map((method) => (
              <li key={method.id} className="rounded-lg border border-zinc-200 bg-white p-4 text-sm">
                {method.brand} ending in {method.last4} — expires {method.expiry}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
