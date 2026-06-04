/**
 * PremiumContext — Pro abonelik durumunu global state'te tut.
 *
 * Kullanım:
 *   const { isPro, refresh, openPaywall } = usePremium();
 *
 * Auth değişimine reactive — kullanıcı login olunca RevenueCat init edilir,
 * logout'ta reset olur.
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import {
  initPurchases,
  isPro as checkPro,
  addCustomerInfoListener,
  IS_STUB,
} from "../lib/purchases";

const PremiumContext = createContext({
  isPro: false,
  loading: true,
  refresh: () => {},
  openPaywall: () => {},
  setPaywallHandler: () => {},
});

export function PremiumProvider({ children }) {
  const { getUserId, isAuthenticated } = useAuth();
  const [isProState, setIsProState] = useState(false);
  const [loading, setLoading] = useState(true);
  const paywallHandlerRef = useRef(null);

  const refresh = useCallback(async () => {
    const v = await checkPro();
    setIsProState(v);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsProState(false);
      setLoading(false);
      return;
    }
    const userId = getUserId();
    initPurchases(userId).then(() => refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated()]);

  useEffect(() => {
    const unsub = addCustomerInfoListener((nowPro) => setIsProState(nowPro));
    return unsub;
  }, []);

  const openPaywall = useCallback(
    (source = "unknown") => {
      // Paywall'ı açacak handler navigation root'tan set'lenir
      if (paywallHandlerRef.current) {
        paywallHandlerRef.current(source);
      } else {
        console.warn("[PremiumContext] openPaywall called but no handler set");
      }
    },
    []
  );

  const setPaywallHandler = useCallback((handler) => {
    paywallHandlerRef.current = handler;
  }, []);

  return (
    <PremiumContext.Provider
      value={{
        isPro: isProState,
        loading,
        refresh,
        openPaywall,
        setPaywallHandler,
        isStub: IS_STUB(),
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
