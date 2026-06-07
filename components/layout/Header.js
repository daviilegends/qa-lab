"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { users } from "@/data/users";

export default function Header() {
  const { userId, signOut } = useAuth();
  const { items } = useCart();

  const currentUser = users.find((user) => user.id === userId) ?? null;
  const cartCount = items
    .filter((item) => !item.savedForLater)
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/products" className="text-lg font-semibold text-zinc-900">
          MiniCommerce QA Lab
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm font-medium text-zinc-700">
          <Link href="/products" className="hover:text-zinc-900">
            Products
          </Link>
          <Link href="/cart" className="hover:text-zinc-900" data-testid="nav-cart-link">
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>

          {currentUser ? (
            <>
              <Link href="/account" className="hover:text-zinc-900" data-testid="nav-account-link">
                {currentUser.name}
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
                data-testid="logout-button"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
              data-testid="nav-login-link"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
