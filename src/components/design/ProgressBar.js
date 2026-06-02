/**
 * ProgressBar — fill + ambient shimmer band.
 * Design v2: fm-fill + fm-shimmer.
 * GPU-friendly: only transform/opacity animations.
 */
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProgressBar({ progress = 0, height = 8, showShimmer = true }) {
  const { c } = useTheme();
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (!showShimmer) return;
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [showShimmer, shimmer]);

  const shimmerStyle = {
    transform: [
      {
        translateX: shimmer.interpolate({
          inputRange: [-1, 1],
          outputRange: ["-100%", "220%"],
        }),
      },
    ],
  };

  return (
    <View
      style={[
        s.track,
        { height, backgroundColor: c.bgSurface },
      ]}
    >
      <View
        style={[
          s.fill,
          {
            width: `${Math.max(0, Math.min(100, progress * 100))}%`,
            backgroundColor: c.accent,
            shadowColor: c.accent,
          },
        ]}
      >
        {showShimmer && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              shimmerStyle,
              { backgroundColor: "rgba(255,255,255,0.45)" },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  track: {
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: "hidden",
  },
});
