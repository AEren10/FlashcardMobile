/**
 * AnimatedFAB — Floating action button with ambient idle pulse + press feedback.
 * Idle: scale 1→1.05→1 every 4 seconds (subtle attention)
 * Press: scale 0.94, 200ms (haptic by parent)
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { Pressable, Animated, StyleSheet, Easing } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

export default function AnimatedFAB({ onPress, icon = ICONS.plus, accessibilityLabel = "Yeni" }) {
  const { c } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(3500),
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const handlePressIn = () => {
    Animated.timing(press, {
      toValue: 0.94,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(press, {
      toValue: 1,
      stiffness: 280,
      damping: 24,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        s.wrap,
        {
          backgroundColor: c.accent,
          shadowColor: c.accent,
          transform: [{ scale: Animated.multiply(pulse, press) }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={s.touch}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <Icon d={icon} size={26} stroke={c.textOnAccent} sw={2.4} />
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 18,
    bottom: 104,
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  touch: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
});
