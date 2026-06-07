export const orders = [
  {
    id: "order-1001",
    userId: "user-standard",
    placedOn: "2026-05-20",
    status: "completed",
    items: [
      { productId: "prod-headphones", quantity: 1, unitPrice: 89.99 },
      { productId: "prod-yoga-mat", quantity: 2, unitPrice: 29.99 },
    ],
    subtotal: 149.97,
    discount: 0,
    shipping: 9.99,
    total: 159.96,
    loyaltyPointsEarned: 150,
  },
];

export function findOrdersByUserId(userId) {
  return orders.filter((order) => order.userId === userId);
}
