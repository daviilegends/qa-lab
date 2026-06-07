export const addresses = [
  {
    id: "address-subscribed-home",
    userId: "user-subscribed",
    label: "Home",
    fullName: "Subscribed Tester",
    street: "120 Market Street",
    city: "Springfield",
    postalCode: "12345",
    country: "USA",
  },
  {
    id: "address-saved-home",
    userId: "user-saved-address",
    label: "Home",
    fullName: "Saved Address Tester",
    street: "45 Oak Avenue",
    city: "Riverside",
    postalCode: "54321",
    country: "USA",
  },
];

export function findAddressesByUserId(userId) {
  return addresses.filter((address) => address.userId === userId);
}
