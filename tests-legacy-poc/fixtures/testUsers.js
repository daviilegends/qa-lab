// Mirrors data/users.js — kept here so specs don't import app source directly.

export const testUsers = {
  standard: { email: "standard@test.com", password: "Password123" },
  newUser: { email: "newuser@test.com", password: "Password123" },
  subscribed: { email: "subscribed@test.com", password: "Password123" },
  blocked: { email: "blocked@test.com", password: "Password123" },
};

export const dummyCards = {
  approved: "4111111111111111",
  declined: "4000000000000002",
  insufficientFunds: "4000000000009995",
};

export const sampleAddress = {
  fullName: "QA Tester",
  street: "1 Test Street",
  city: "Testville",
  postalCode: "00000",
  country: "Testland",
};
