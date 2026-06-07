export const subscriptions = [
  {
    id: "sub-active-protein",
    userId: "user-subscribed",
    productId: "prod-protein-powder",
    frequencyMonths: 1,
    status: "active",
    startedOn: "2026-04-15",
    nextDeliveryOn: "2026-07-15",
  },
  {
    id: "sub-expired-coffee",
    userId: "user-subscribed",
    productId: "prod-coffee-beans",
    frequencyMonths: 3,
    status: "expired",
    startedOn: "2025-09-01",
    nextDeliveryOn: null,
  },
];

export function findSubscriptionsByUserId(userId) {
  return subscriptions.filter((subscription) => subscription.userId === userId);
}
