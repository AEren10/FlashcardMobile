/**
 * DynamicStatusBar — tema değişimine göre status bar style ayarlanır.
 * Dark mode: light-content (icons beyaz)
 * Light mode: dark-content (icons siyah)
 */
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../contexts/ThemeContext";

export default function DynamicStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} animated />;
}
