/**
 * ThemeContext — Light/Dark/System toggle.
 * tokens(isDark) ile light/dark token seti döndürülür.
 * AsyncStorage'da kullanıcı tercihi saklanır.
 *
 * Kullanım: const { c, isDark, preference, setPreference, toggle } = useTheme();
 *   - c: token seti (mevcut moda göre)
 *   - isDark: boolean
 *   - preference: "light" | "dark" | "system"
 *   - setPreference(next), toggle()
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokens } from "../themes/tokens";

const STORAGE_KEY = "@fc:themePreference";

const ThemeContext = createContext({
  c: tokens(true),
  isDark: true,
  preference: "dark",
  setPreference: () => {},
  toggle: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPref] = useState("dark");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setPref(saved);
        }
      } catch {}
    })();
  }, []);

  const setPreference = async (next) => {
    setPref(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const isDark =
    preference === "system"
      ? (systemScheme ?? Appearance.getColorScheme() ?? "dark") === "dark"
      : preference === "dark";

  const toggle = () => setPreference(isDark ? "light" : "dark");

  const value = useMemo(
    () => ({
      c: tokens(isDark),
      colors: tokens(isDark), // legacy alias
      isDark,
      scheme: isDark ? "dark" : "light",
      preference,
      setPreference,
      toggle,
    }),
    [isDark, preference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
