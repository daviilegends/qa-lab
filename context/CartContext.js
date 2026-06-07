"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "minicommerce.cart.items";

// Each item: { productId, quantity, savedForLater }
function readStoredItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isReady]);

  function addItem(productId, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId && !item.savedForLater);
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { productId, quantity, savedForLater: false }];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function saveForLater(productId) {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, savedForLater: true } : item
      )
    );
  }

  function moveToCart(productId) {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, savedForLater: false } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isReady,
        addItem,
        updateQuantity,
        removeItem,
        saveForLater,
        moveToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
