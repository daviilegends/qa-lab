// Pure pricing helpers — UI-free so they can be unit tested directly.

export function getEffectivePrice(product) {
  return product.discountPrice ?? product.price;
}

export function calculateSubtotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0);
}

export function calculateShipping(subtotal, freeShippingThreshold, baseShippingCost = 9.99) {
  return subtotal >= freeShippingThreshold ? 0 : baseShippingCost;
}

export function roundToCents(amount) {
  return Math.round(amount * 100) / 100;
}
