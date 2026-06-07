"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { findAddressesByUserId } from "@/data/addresses";
import { findPaymentMethodsByUserId } from "@/data/payments";
import { findSubscriptionsByUserId } from "@/data/subscriptions";

const AccountContext = createContext(null);
const STORAGE_PREFIX = "minicommerce.account.";

const EMPTY_ACCOUNT_DATA = { addresses: [], paymentMethods: [], subscriptions: [] };

// Seeds a user's first visit from the predictable mock data, marking the
// first saved address/payment as primary so the UI always has a default.
function seedAccountData(userId) {
  return {
    addresses: findAddressesByUserId(userId).map((address, index) => ({
      ...address,
      isPrimary: index === 0,
    })),
    paymentMethods: findPaymentMethodsByUserId(userId).map((method, index) => ({
      ...method,
      isPrimary: index === 0,
    })),
    subscriptions: findSubscriptionsByUserId(userId),
  };
}

function readStoredAccountData(userId) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AccountProvider({ children }) {
  const { userId, isReady: isAuthReady } = useAuth();
  const [data, setData] = useState(EMPTY_ACCOUNT_DATA);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!userId) {
      setData(EMPTY_ACCOUNT_DATA);
      setIsReady(true);
      return;
    }
    setData(readStoredAccountData(userId) ?? seedAccountData(userId));
    setIsReady(true);
  }, [userId, isAuthReady]);

  useEffect(() => {
    if (isReady && userId) {
      window.localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(data));
    }
  }, [data, isReady, userId]);

  function saveAddress(address, { makePrimary = false } = {}) {
    if (!userId) return;
    setData((current) => {
      const id = `address-${userId}-${current.addresses.length + 1}`;
      const nextAddresses = makePrimary
        ? current.addresses.map((existing) => ({ ...existing, isPrimary: false }))
        : current.addresses;
      return {
        ...current,
        addresses: [...nextAddresses, { id, ...address, isPrimary: makePrimary || nextAddresses.length === 0 }],
      };
    });
  }

  function savePaymentMethod(method, { makePrimary = false } = {}) {
    if (!userId) return;
    setData((current) => {
      const id = `payment-${userId}-${current.paymentMethods.length + 1}`;
      const nextMethods = makePrimary
        ? current.paymentMethods.map((existing) => ({ ...existing, isPrimary: false }))
        : current.paymentMethods;
      return {
        ...current,
        paymentMethods: [...nextMethods, { id, ...method, isPrimary: makePrimary || nextMethods.length === 0 }],
      };
    });
  }

  function addSubscription({ productId, frequencyMonths, startedOn, nextDeliveryOn }) {
    if (!userId) return;
    setData((current) => {
      const id = `sub-${userId}-${current.subscriptions.length + 1}`;
      const existing = current.subscriptions.find(
        (subscription) => subscription.productId === productId && subscription.status === "active"
      );
      if (existing) return current;
      return {
        ...current,
        subscriptions: [
          ...current.subscriptions,
          { id, userId, productId, frequencyMonths, status: "active", startedOn, nextDeliveryOn },
        ],
      };
    });
  }

  function cancelSubscription(subscriptionId) {
    setData((current) => ({
      ...current,
      subscriptions: current.subscriptions.map((subscription) =>
        subscription.id === subscriptionId ? { ...subscription, status: "cancelled" } : subscription
      ),
    }));
  }

  const primaryAddress = data.addresses.find((address) => address.isPrimary) ?? data.addresses[0] ?? null;
  const primaryPaymentMethod =
    data.paymentMethods.find((method) => method.isPrimary) ?? data.paymentMethods[0] ?? null;

  return (
    <AccountContext.Provider
      value={{
        isReady,
        addresses: data.addresses,
        paymentMethods: data.paymentMethods,
        subscriptions: data.subscriptions,
        primaryAddress,
        primaryPaymentMethod,
        saveAddress,
        savePaymentMethod,
        addSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
