// Coupon evaluation rules — kept separate from UI and cart state for predictable testing.

export function evaluateCoupon(coupon, { user, subtotal }) {
  if (!coupon) {
    return { valid: false, reason: "not-found" };
  }
  if (coupon.status === "expired") {
    return { valid: false, reason: "expired" };
  }
  if (coupon.eligibility === "new-user" && !user?.isNewUser) {
    return { valid: false, reason: "not-eligible" };
  }
  if (coupon.eligibility === "subscribed-user" && user?.state !== "subscribed") {
    return { valid: false, reason: "not-eligible" };
  }
  if (subtotal < coupon.minOrderAmount) {
    return { valid: false, reason: "minimum-not-met" };
  }
  return { valid: true, reason: "ok" };
}

export function calculateCouponDiscount(coupon, subtotal) {
  if (coupon.type === "percent") {
    return Math.round(subtotal * (coupon.value / 100) * 100) / 100;
  }
  return 0;
}
