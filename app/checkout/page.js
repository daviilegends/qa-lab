"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/users";
import { findProductById } from "@/data/products";
import { findAddressesByUserId } from "@/data/addresses";
import { promotions } from "@/data/promotions";
import { calculateSubtotal, calculateShipping, roundToCents } from "@/lib/pricing";
import { authorizePayment, generateOrderNumber } from "@/lib/checkout";
import { calculateLoyaltyPoints, estimateLoyaltyPoints } from "@/lib/loyalty";
import LoyaltyBanner from "@/components/loyalty/LoyaltyBanner";
import { subscriptionFrequencyLabels } from "@/lib/subscriptions";

const EMPTY_ADDRESS = { fullName: "", street: "", city: "", postalCode: "", country: "" };
const EMPTY_CARD = { cardNumber: "", expiry: "", cvc: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { userId } = useAuth();
  const currentUser = users.find((user) => user.id === userId) ?? null;
  const savedAddress = currentUser ? findAddressesByUserId(currentUser.id)[0] : null;

  const [address, setAddress] = useState(savedAddress ?? EMPTY_ADDRESS);
  const [card, setCard] = useState(EMPTY_CARD);
  const [errors, setErrors] = useState({});
  const [paymentError, setPaymentError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartLines = items
    .filter((item) => !item.savedForLater)
    .map((item) => ({ ...item, product: findProductById(item.productId) }))
    .filter((item) => item.product);

  const subtotal = useMemo(() => roundToCents(calculateSubtotal(cartLines)), [cartLines]);
  const shipping = useMemo(() => calculateShipping(subtotal, promotions.freeShippingThreshold), [subtotal]);
  const total = useMemo(() => roundToCents(subtotal + shipping), [subtotal, shipping]);
  const projectedPoints = useMemo(() => estimateLoyaltyPoints(currentUser, total), [currentUser, total]);

  function updateAddressField(field, value) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  function updateCardField(field, value) {
    setCard((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!address.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!address.street.trim()) nextErrors.street = "Street address is required.";
    if (!address.city.trim()) nextErrors.city = "City is required.";
    if (!address.postalCode.trim()) nextErrors.postalCode = "Postal code is required.";
    if (!address.country.trim()) nextErrors.country = "Country is required.";
    if (!/^\d{16}$/.test(card.cardNumber.trim())) nextErrors.cardNumber = "Enter a valid 16-digit card number.";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim())) nextErrors.expiry = "Use MM/YY format.";
    if (!/^\d{3}$/.test(card.cvc.trim())) nextErrors.cvc = "Enter a 3-digit security code.";
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setPaymentError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsPlacingOrder(true);
    const authorization = authorizePayment(card.cardNumber);

    if (!authorization.success) {
      setPaymentError(authorization.message);
      setIsPlacingOrder(false);
      return;
    }

    const orderDate = new Date().toISOString().slice(0, 10);
    const orderNumber = generateOrderNumber();
    const loyaltyPointsEarned = calculateLoyaltyPoints({ user: currentUser, orderTotal: total, orderDate });

    const itemsSummary = cartLines
      .map((line) => `${line.productId}:${line.quantity}:${line.subscription?.frequency ?? 0}`)
      .join(",");

    clearCart();
    const params = new URLSearchParams({
      orderNumber,
      total: total.toFixed(2),
      points: String(loyaltyPointsEarned),
      items: itemsSummary,
    });
    router.push(`/order-confirmation?${params.toString()}`);
  }

  if (cartLines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Nothing to check out</h1>
        <p className="text-sm text-zinc-600">Add a product to your cart before starting checkout.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-2" aria-label="Checkout form" noValidate>
        <section aria-labelledby="shipping-heading" className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h2 id="shipping-heading" className="text-lg font-semibold text-zinc-900">
            Shipping address
          </h2>
          <Input id="fullName" label="Full name" value={address.fullName} onChange={(e) => updateAddressField("fullName", e.target.value)} error={errors.fullName} data-testid="address-fullname-input" />
          <Input id="street" label="Street address" value={address.street} onChange={(e) => updateAddressField("street", e.target.value)} error={errors.street} data-testid="address-street-input" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input id="city" label="City" value={address.city} onChange={(e) => updateAddressField("city", e.target.value)} error={errors.city} data-testid="address-city-input" />
            <Input id="postalCode" label="Postal code" value={address.postalCode} onChange={(e) => updateAddressField("postalCode", e.target.value)} error={errors.postalCode} data-testid="address-postal-input" />
            <Input id="country" label="Country" value={address.country} onChange={(e) => updateAddressField("country", e.target.value)} error={errors.country} data-testid="address-country-input" />
          </div>
        </section>

        <section aria-labelledby="payment-heading" className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h2 id="payment-heading" className="text-lg font-semibold text-zinc-900">
            Payment details
          </h2>
          <p className="text-xs text-zinc-500">
            Use a dummy card: 4111111111111111 (success), 4000000000000002 (declined), 4000000000009995 (insufficient funds).
          </p>
          <Input id="cardNumber" label="Card number" inputMode="numeric" value={card.cardNumber} onChange={(e) => updateCardField("cardNumber", e.target.value)} error={errors.cardNumber} data-testid="card-number-input" />
          <div className="grid grid-cols-2 gap-4">
            <Input id="expiry" label="Expiry (MM/YY)" placeholder="12/29" value={card.expiry} onChange={(e) => updateCardField("expiry", e.target.value)} error={errors.expiry} data-testid="card-expiry-input" />
            <Input id="cvc" label="Security code" inputMode="numeric" value={card.cvc} onChange={(e) => updateCardField("cvc", e.target.value)} error={errors.cvc} data-testid="card-cvc-input" />
          </div>

          {paymentError ? (
            <p role="alert" className="text-sm text-red-600" data-testid="payment-error">
              {paymentError}
            </p>
          ) : null}
        </section>

        <Button type="submit" variant="cta" disabled={isPlacingOrder} data-testid="place-order-button">
          {isPlacingOrder ? "Placing order…" : "Place order"}
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Order summary</h2>

        {currentUser ? (
          <LoyaltyBanner
            testId="checkout-points-banner"
            title={`Placing this order earns ~${projectedPoints} loyalty points`}
            message={`Your balance is currently ${currentUser.loyaltyPoints} points.`}
          />
        ) : null}

        <ul className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4" data-testid="checkout-order-items">
          {cartLines.map((line) => (
            <li key={line.productId} className="flex items-center gap-3 text-sm" data-testid="checkout-order-item">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                <Image src={line.product.image} alt={line.product.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-zinc-800">
                  {line.product.name} <span className="text-zinc-500">x{line.quantity}</span>
                </span>
                {line.subscription ? (
                  <span data-testid="checkout-item-subscription">
                    <Badge tone="warning">
                      Subscribed — {subscriptionFrequencyLabels[line.subscription.frequency]}
                    </Badge>
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <CartSummary subtotal={subtotal} discount={0} shipping={shipping} total={total} />
      </div>
    </div>
  );
}
