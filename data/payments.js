// Dummy card numbers used by lib/checkout.js to simulate payment outcomes.
// These are NOT real card numbers — they are well-known test values.

export const dummyCardOutcomes = {
  "4111111111111111": "approved",
  "4000000000000002": "declined",
  "4000000000009995": "insufficient-funds",
};

export const savedPaymentMethods = [
  {
    id: "payment-subscribed-visa",
    userId: "user-subscribed",
    brand: "Visa",
    last4: "1111",
    cardNumber: "4111111111111111",
    expiry: "12/29",
  },
  {
    id: "payment-saved-visa",
    userId: "user-saved-payment",
    brand: "Visa",
    last4: "1111",
    cardNumber: "4111111111111111",
    expiry: "11/28",
  },
];

export function findPaymentMethodsByUserId(userId) {
  return savedPaymentMethods.filter((method) => method.userId === userId);
}
