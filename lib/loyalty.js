import { promotions } from "@/data/promotions";

// Loyalty points: subscribers earn a bonus rate, and anyone subscribed within
// the last `doublePointsSubscriptionWindowMonths` earns double points in June/July.

function monthsBetween(fromDateString, toDateString) {
  const from = new Date(fromDateString);
  const to = new Date(toDateString);
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

export function calculateLoyaltyPoints({ user, orderTotal, orderDate }) {
  const ratePerDollar =
    promotions.baseLoyaltyPointsPerDollar +
    (user?.state === "subscribed" ? promotions.subscriberBonusPointsPerDollar : 0);

  let points = Math.floor(orderTotal * ratePerDollar);

  const orderMonth = new Date(orderDate).getMonth() + 1;
  const isDoublePointsMonth = promotions.doublePointsMonths.includes(orderMonth);
  const subscribedRecently =
    user?.subscribedSince &&
    monthsBetween(user.subscribedSince, orderDate) <= promotions.doublePointsSubscriptionWindowMonths;

  if (isDoublePointsMonth && subscribedRecently) {
    points *= 2;
  }

  return points;
}

// Preview helper for "you'd earn N points" banners — uses today's date so the
// estimate matches what calculateLoyaltyPoints would award if the order were
// placed right now.
export function estimateLoyaltyPoints(user, orderTotal) {
  const today = new Date().toISOString().slice(0, 10);
  return calculateLoyaltyPoints({ user, orderTotal, orderDate: today });
}
