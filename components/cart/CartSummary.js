export default function CartSummary({ subtotal, discount, shipping, total }) {
  return (
    <dl className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 text-sm" data-testid="cart-summary">
      <div className="flex justify-between">
        <dt className="text-zinc-600">Subtotal</dt>
        <dd className="font-medium text-zinc-900" data-testid="summary-subtotal">
          ${subtotal.toFixed(2)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-zinc-600">Discount</dt>
        <dd className="font-medium text-zinc-900" data-testid="summary-discount">
          -${discount.toFixed(2)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-zinc-600">Shipping</dt>
        <dd className="font-medium text-zinc-900" data-testid="summary-shipping">
          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
        </dd>
      </div>
      <div className="flex justify-between border-t border-zinc-200 pt-2 text-base">
        <dt className="font-semibold text-zinc-900">Total</dt>
        <dd className="font-semibold text-zinc-900" data-testid="summary-total">
          ${total.toFixed(2)}
        </dd>
      </div>
    </dl>
  );
}
