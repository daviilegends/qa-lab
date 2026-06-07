import { dummyCardOutcomes } from "@/data/payments";

const PAYMENT_ERROR_MESSAGES = {
  declined: "Your card was declined. Please try a different payment method.",
  "insufficient-funds": "Payment failed due to insufficient funds.",
  unknown: "We couldn't recognize this card number. Please check and try again.",
};

export function authorizePayment(cardNumber) {
  const outcome = dummyCardOutcomes[cardNumber.trim()] ?? "unknown";
  if (outcome === "approved") {
    return { success: true };
  }
  return { success: false, reason: outcome, message: PAYMENT_ERROR_MESSAGES[outcome] };
}

export function generateOrderNumber(sequence = Date.now()) {
  return `ORD-${String(sequence).slice(-8)}`;
}

// All dummy card numbers used in this lab start with 4 (Visa test ranges).
export function detectCardBrand(cardNumber) {
  return cardNumber.trim().startsWith("4") ? "Visa" : "Card";
}

export function addMonthsToDate(dateString, months) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}
