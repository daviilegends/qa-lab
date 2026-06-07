"use client";

import Image from "next/image";
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
        <Link href="/products" className="flex items-center gap-2">
          <Image
            src="/brand/logo-mark.svg"
            alt="MiniCommerce QA Lab logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg"
            priority
          />
          <span className="font-heading text-lg font-semibold text-zinc-900">MiniCommerce QA Lab</span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium text-zinc-600">
          <Link href="/products" className="transition-colors hover:text-brand-700">
            Products
          </Link>
          <Link href="/doc" className="transition-colors hover:text-brand-700" data-testid="nav-doc-link">
            Doc
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 transition-colors hover:text-brand-700"
            data-testid="nav-cart-link"
          >
            Cart
            {cartCount > 0 ? (
              <span
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cta-500 px-1 text-xs font-semibold text-white"
                data-testid="cart-count-badge"
              >
                {cartCount}
              </span>
            ) : null}
          </Link>

          {currentUser ? (
            <>
              <Link href="/account" className="transition-colors hover:text-brand-700" data-testid="nav-account-link">
                {currentUser.name}
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700 transition-colors hover:border-brand-600 hover:text-brand-700"
                data-testid="logout-button"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-white transition-colors hover:bg-brand-700"
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
