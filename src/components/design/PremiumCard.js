/**
 * PremiumCard — feature/hero card with layered depth.
 * Layers:
 *   1) Gradient bg
 *   2) Radial accent glow (top-right or configurable)
 *   3) Top edge inner highlight (1px brighter)
 *   4) Subtle film grain (optional)
 *   5) Outer accent shadow (glow)
 */
import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

export default function PremiumCard({
  children,
  onPress,
  glowPosition = "top-right", // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  glowColor, // override accent
  intensity = 0.4,
  padding = 22,
  radius = 20,
  style,
}) {
  const { c } = useTheme();
  const glowSize = 170;

  const glowPos = {
    "top-right": { top: -50, right: -40 },
    "top-left": { top: -50, left: -40 },
    "bottom-right": { bottom: -50, right: -40 },
    "bottom-left": { bottom: -50, left: -40 },
  }[glowPosition];

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[
        s.outer,
        {
          borderRadius: radius,
          borderColor: c.borderAccent,
          shadowColor: glowColor || c.accent,
          shadowOpacity: intensity,
        },
        style,
      ]}
    >
      {/* Base gradient */}
      <LinearGradient
        colors={[c.bgElevated, c.bgSurface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial accent glow */}
      <View
        style={[
          s.radialGlow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: (glowColor || c.accent) + "33", // 20% alpha
            ...glowPos,
          },
        ]}
      />

      {/* Top edge inner highlight (premium depth) — light'ta minimal, dark'ta beyaz tint */}
      <LinearGradient
        colors={[
          c.isDark === false ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.04 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        pointerEvents="none"
      />

      {/* Content */}
      <View style={{ padding, position: "relative", zIndex: 1 }}>{children}</View>
    </Container>
  );
}

const s = StyleSheet.create({
  outer: {
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
    elevation: 6,
  },
  radialGlow: {
    position: "absolute",
    opacity: 0.7,
  },
});
