// Predictable dummy users covering every account state needed for QA scenarios.
// Passwords are plain dummy strings — never real credentials.

export const users = [
  {
    id: "user-standard",
    email: "standard@test.com",
    password: "Password123",
    name: "Standard Tester",
    state: "standard",
    isNewUser: false,
    isBlocked: false,
    loyaltyPoints: 120,
    savedAddressId: null,
    savedPaymentId: null,
  },
  {
    id: "user-new",
    email: "newuser@test.com",
    password: "Password123",
    name: "New Tester",
    state: "new",
    isNewUser: true,
    isBlocked: false,
    loyaltyPoints: 0,
    savedAddressId: null,
    savedPaymentId: null,
  },
  {
    id: "user-subscribed",
    email: "subscribed@test.com",
    password: "Password123",
    name: "Subscribed Tester",
    state: "subscribed",
    isNewUser: false,
    isBlocked: false,
    loyaltyPoints: 340,
    // Subscribed within the last 3 months -> eligible for double points in June/July.
    subscribedSince: "2026-04-01",
    savedAddressId: "address-subscribed-home",
    savedPaymentId: "payment-subscribed-visa",
  },
  {
    id: "user-blocked",
    email: "blocked@test.com",
    password: "Password123",
    name: "Blocked Tester",
    state: "blocked",
    isNewUser: false,
    isBlocked: true,
    loyaltyPoints: 0,
    savedAddressId: null,
    savedPaymentId: null,
  },
  {
    id: "user-saved-address",
    email: "savedaddress@test.com",
    password: "Password123",
    name: "Saved Address Tester",
    state: "saved-address",
    isNewUser: false,
    isBlocked: false,
    loyaltyPoints: 60,
    savedAddressId: "address-saved-home",
    savedPaymentId: null,
  },
  {
    id: "user-saved-payment",
    email: "savedpayment@test.com",
    password: "Password123",
    name: "Saved Payment Tester",
    state: "saved-payment",
    isNewUser: false,
    isBlocked: false,
    loyaltyPoints: 60,
    savedAddressId: null,
    savedPaymentId: "payment-saved-visa",
  },
];

export function findUserByCredentials(email, password) {
  return users.find((user) => user.email === email && user.password === password) ?? null;
}
