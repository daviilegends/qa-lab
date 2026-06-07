// Predictable coupon set: one valid for new users, one shipping coupon,
// one expired and one not-applicable — covering positive and negative paths.

export const coupons = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    description: "10% off for new users",
    status: "valid",
    eligibility: "new-user",
    minOrderAmount: 0,
  },
  {
    code: "FREESHIP",
    type: "free-shipping",
    value: 0,
    description: "Free shipping on orders above $999",
    status: "valid",
    eligibility: "any",
    minOrderAmount: 999,
  },
  {
    code: "SUMMER5",
    type: "percent",
    value: 5,
    description: "5% off — expired promotional coupon",
    status: "expired",
    eligibility: "any",
    minOrderAmount: 0,
  },
  {
    code: "VIPONLY",
    type: "percent",
    value: 20,
    description: "20% off — restricted to subscribed members",
    status: "valid",
    eligibility: "subscribed-user",
    minOrderAmount: 0,
  },
];

export function findCouponByCode(code) {
  return coupons.find((coupon) => coupon.code.toLowerCase() === code.trim().toLowerCase()) ?? null;
}
