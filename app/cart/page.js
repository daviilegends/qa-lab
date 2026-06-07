"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/users";
import { findProductById } from "@/data/products";
import { findCouponByCode } from "@/data/coupons";
import { promotions } from "@/data/promotions";
import { calculateSubtotal, calculateShipping, roundToCents } from "@/lib/pricing";
import { evaluateCoupon, calculateCouponDiscount } from "@/lib/promotions";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import CouponForm from "@/components/cart/CouponForm";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoyaltyBanner from "@/components/loyalty/LoyaltyBanner";
import { estimateLoyaltyPoints } from "@/lib/loyalty";
import { subscriptionFrequencyLabels } from "@/lib/subscriptions";

export default function CartPage() {
  const { items, updateQuantity, removeItem, saveForLater, moveToCart } = useCart();
  const { userId } = useAuth();
  const currentUser = users.find((user) => user.id === userId) ?? null;

  const [couponMessage, setCouponMessage] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const cartLines = items
    .map((item) => ({ ...item, product: findProductById(item.productId) }))
    .filter((item) => item.product);

  const activeLines = cartLines.filter((line) => !line.savedForLater);
  const savedLines = cartLines.filter((line) => line.savedForLater);

  const subtotal = useMemo(() => roundToCents(calculateSubtotal(activeLines)), [activeLines]);

  const discount = useMemo(() => {
    if (!appliedCoupon || appliedCoupon.type !== "percent") return 0;
    return calculateCouponDiscount(appliedCoupon, subtotal);
  }, [appliedCoupon, subtotal]);

  const shipping = useMemo(() => {
    const baseShipping = calculateShipping(subtotal, promotions.freeShippingThreshold);
    if (appliedCoupon?.type === "free-shipping") return 0;
    return baseShipping;
  }, [subtotal, appliedCoupon]);

  const total = useMemo(() => roundToCents(Math.max(0, subtotal - discount + shipping)), [subtotal, discount, shipping]);

  const projectedPoints = useMemo(() => estimateLoyaltyPoints(currentUser, total), [currentUser, total]);
  const subscribedLines = activeLines.filter((line) => line.subscription);

  function handleApplyCoupon(code) {
    if (!code.trim()) {
      setCouponMessage({ tone: "error", text: "Enter a coupon code." });
      return;
    }

    const coupon = findCouponByCode(code);
    const evaluation = evaluateCoupon(coupon, { user: currentUser, subtotal });

    if (!evaluation.valid) {
      const reasons = {
        "not-found": "This coupon code does not exist.",
        expired: "This coupon has expired.",
        "not-eligible": "This coupon is not applicable to your account.",
        "minimum-not-met": "Your order does not meet the minimum amount for this coupon.",
      };
      setAppliedCoupon(null);
      setCouponMessage({ tone: "error", text: reasons[evaluation.reason] ?? "This coupon cannot be applied." });
      return;
    }

    setAppliedCoupon(coupon);
    setCouponMessage({ tone: "success", text: `Coupon "${coupon.code}" applied: ${coupon.description}` });
  }

  if (cartLines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Your cart is empty</h1>
        <p className="text-sm text-zinc-600">Browse the catalog and add a product to get started.</p>
        <Link href="/products" className="text-sm font-medium text-zinc-900 underline">
          Go to products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Your cart</h1>
        </div>

        {currentUser ? (
          <LoyaltyBanner
            testId="cart-points-banner"
            title={`This order earns ~${projectedPoints} loyalty points`}
            message={`You currently have ${currentUser.loyaltyPoints} points — checking out adds to your balance.`}
          />
        ) : null}

        {subscribedLines.length > 0 ? (
          <div
            className="flex flex-col gap-2 rounded-lg border border-brand-100 bg-brand-50 p-4"
            data-testid="cart-subscription-summary"
          >
            <p className="font-heading text-sm font-semibold text-brand-700">Active subscriptions in this order</p>
            <ul className="flex flex-col gap-1.5">
              {subscribedLines.map((line) => (
                <li key={line.productId} className="flex items-center gap-2 text-sm text-zinc-700">
                  <Badge tone="warning">{subscriptionFrequencyLabels[line.subscription.frequency]}</Badge>
                  {line.product.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeLines.length > 0 ? (
          <ul className="flex flex-col gap-3" aria-label="Cart items">
            {activeLines.map((line) => (
              <CartItem
                key={line.productId}
                product={line.product}
                quantity={line.quantity}
                subscription={line.subscription}
                savedForLater={false}
                onIncrease={() => updateQuantity(line.productId, line.quantity + 1)}
                onDecrease={() => updateQuantity(line.productId, line.quantity - 1)}
                onRemove={() => removeItem(line.productId)}
                onSaveForLater={() => saveForLater(line.productId)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-600">No items in your cart. Check your saved-for-later list below.</p>
        )}

        {savedLines.length > 0 ? (
          <section aria-labelledby="saved-for-later-heading" className="flex flex-col gap-3">
            <h2 id="saved-for-later-heading" className="text-lg font-semibold text-zinc-900">
              Saved for later
            </h2>
            <ul className="flex flex-col gap-3" aria-label="Saved for later items">
              {savedLines.map((line) => (
                <CartItem
                  key={line.productId}
                  product={line.product}
                  quantity={line.quantity}
                  savedForLater
                  onRemove={() => removeItem(line.productId)}
                  onMoveToCart={() => moveToCart(line.productId)}
                />
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <CouponForm onApply={handleApplyCoupon} message={couponMessage} />
        <CartSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
        <Link href="/checkout" data-testid="checkout-link">
          <Button type="button" variant="cta" className="w-full" disabled={activeLines.length === 0}>
            Continue to checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
