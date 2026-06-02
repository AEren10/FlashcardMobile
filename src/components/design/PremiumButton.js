/**
 * PremiumButton — her tıklamada haptic + scale 0.96 + spring back.
 * Variants: primary (accent fill + glow shadow), secondary (outline), ghost.
 * Premium feel: subtle inner highlight (top edge brighter).
 */
import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

export default function PremiumButton({
  onPress,
  label,
  variant = "primary",
  icon,
  iconPosition = "right",
  block = false,
  size = "md",
  disabled = false,
  loading = false,
  hapticStyle = "light",
}) {
  const { c } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(opacity, {
        toValue: 0.92,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 280,
        damping: 22,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (hapticStyle === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (hapticStyle === "medium") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.selectionAsync();
    }
    onPress?.();
  };

  const sizeMap = {
    sm: { py: 10, px: 16, fs: 13, h: 38 },
    md: { py: 14, px: 24, fs: 15, h: 50 },
    lg: { py: 18, px: 32, fs: 17, h: 56 },
  }[size];

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDestructive = variant === "destructive";

  const bgColor = isPrimary
    ? c.accent
    : isDestructive
      ? c.error
      : "transparent";
  const borderColor = isSecondary
    ? c.borderAccent
    : isDestructive
      ? c.error
      : "transparent";
  const textColor = isPrimary
    ? c.textOnAccent
    : isDestructive
      ? "#FFFFFF"
      : c.accent;

  return (
    <Animated.View
      style={[
        s.wrap,
        block && { width: "100%" },
        {
          transform: [{ scale }],
          opacity: disabled ? 0.4 : opacity,
          shadowColor: isPrimary ? c.accent : "transparent",
          shadowOpacity: isPrimary ? 0.4 : 0,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
          elevation: isPrimary ? 6 : 0,
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          s.btn,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: isSecondary || isDestructive ? 1.5 : 0,
            paddingVertical: sizeMap.py,
            paddingHorizontal: sizeMap.px,
            minHeight: sizeMap.h,
            borderRadius: 14,
          },
        ]}
      >
        {/* Top inner highlight for primary buttons (premium depth) */}
        {isPrimary && (
          <LinearGradient
            colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}

        <View style={s.content}>
          {icon && iconPosition === "left" && (
            <View style={{ marginRight: 8 }}>{icon}</View>
          )}
          <Text
            style={[
              s.label,
              {
                color: textColor,
                fontSize: sizeMap.fs,
                fontFamily: c.fontBodyBold,
              },
            ]}
          >
            {loading ? "..." : label}
          </Text>
          {icon && iconPosition === "right" && (
            <View style={{ marginLeft: 8 }}>{icon}</View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
    borderRadius: 14,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    letterSpacing: 0.2,
  },
});
