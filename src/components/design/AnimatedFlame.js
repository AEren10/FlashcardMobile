/**
 * AnimatedFlame — ambient flame: float + rotate + glow flicker.
 * Streak ≥ 30: amber → red intensified.
 * Spec: scale 1→1.08 1600ms, rot ±2° 2400ms, glow 1200ms (3 independent periods).
 */
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function AnimatedFlame({ size = 64, streak = 0 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.6)).current;
  const { c } = useTheme();

  useEffect(() => {
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    const rotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(rot, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rot, {
          toValue: -1,
          duration: 1200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.6,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    scaleLoop.start();
    rotLoop.start();
    glowLoop.start();
    return () => {
      scaleLoop.stop();
      rotLoop.stop();
      glowLoop.stop();
    };
  }, [scale, rot, glow]);

  const isHot = streak >= 30;
  const glowColor = isHot ? c.error : c.warning;

  const rotation = rot.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-2deg", "2deg"],
  });

  return (
    <View style={[s.wrap, { width: size + 24, height: size + 24 }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          s.glow,
          {
            backgroundColor: glowColor,
            opacity: glow,
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: size,
          },
        ]}
      />
      <Animated.Text
        style={[
          s.emoji,
          {
            fontSize: size,
            transform: [{ scale }, { rotate: rotation }],
            textShadowColor: glowColor,
            textShadowRadius: 24,
          },
        ]}
      >
        🔥
      </Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    opacity: 0.6,
  },
  emoji: {
    lineHeight: undefined,
  },
});
