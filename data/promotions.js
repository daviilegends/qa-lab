// Promotion rules referenced by lib/promotions.js and lib/loyalty.js.
// Kept as data so QA can see exact thresholds without reading logic.

export const promotions = {
  freeShippingThreshold: 999,
  doublePointsMonths: [6, 7], // June and July
  doublePointsSubscriptionWindowMonths: 3,
  baseLoyaltyPointsPerDollar: 1,
  subscriberBonusPointsPerDollar: 0.5,
};
