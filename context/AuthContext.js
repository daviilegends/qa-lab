"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "minicommerce.session.userId";

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUserId(window.localStorage.getItem(STORAGE_KEY));
    setIsReady(true);
  }, []);

  function signIn(user) {
    window.localStorage.setItem(STORAGE_KEY, user.id);
    setUserId(user.id);
  }

  function signOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ userId, isReady, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
