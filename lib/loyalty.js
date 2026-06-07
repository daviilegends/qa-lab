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
