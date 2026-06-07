import Image from "next/image";
import Button from "@/components/ui/Button";
import { getEffectivePrice } from "@/lib/pricing";

export default function CartItem({ product, quantity, savedForLater, onIncrease, onDecrease, onRemove, onSaveForLater, onMoveToCart }) {
  const lineTotal = getEffectivePrice(product) * quantity;

  return (
    <li
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
      data-testid="cart-item"
      aria-label={product.name}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
          <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
        </div>
        <div>
          <p className="font-medium text-zinc-900">{product.name}</p>
          <p className="text-sm text-zinc-600">${getEffectivePrice(product).toFixed(2)} each</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!savedForLater && (
          <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${product.name}`}>
            <Button variant="secondary" type="button" onClick={onDecrease} aria-label={`Decrease quantity of ${product.name}`}>
              −
            </Button>
            <span className="w-8 text-center" data-testid="cart-item-quantity">
              {quantity}
            </span>
            <Button variant="secondary" type="button" onClick={onIncrease} aria-label={`Increase quantity of ${product.name}`}>
              +
            </Button>
          </div>
        )}

        <span className="w-20 text-right font-medium text-zinc-900" data-testid="cart-item-line-total">
          ${lineTotal.toFixed(2)}
        </span>

        {savedForLater ? (
          <Button variant="secondary" type="button" onClick={onMoveToCart}>
            Move to cart
          </Button>
        ) : (
          <Button variant="secondary" type="button" onClick={onSaveForLater}>
            Save for later
          </Button>
        )}

        <Button variant="danger" type="button" onClick={onRemove} aria-label={`Remove ${product.name} from cart`}>
          Remove
        </Button>
      </div>
    </li>
  );
}
