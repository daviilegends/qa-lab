// Helpers for subscription pricing and frequency labels.

export const subscriptionFrequencyLabels = {
  1: "Every 1 month",
  2: "Every 2 months",
  3: "Every 3 months",
};

export function getSubscriptionPrice(product) {
  const basePrice = product.discountPrice ?? product.price;
  if (!product.subscriptionEnabled || !product.subscriptionDiscountPercent) {
    return basePrice;
  }
  const discounted = basePrice * (1 - product.subscriptionDiscountPercent / 100);
  return Math.round(discounted * 100) / 100;
}
