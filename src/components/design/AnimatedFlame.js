/**
 * AnimatedFlame — premium alev animasyonu.
 * 3 katmanlı genişleyen halka (stagger) + scale/rotate emoji + soft glow.
 * Streak ≥ 30: amber → red intensified.
 */
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function AnimatedFlame({ size = 64, streak = 0 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const { c } = useTheme();

  useEffect(() => {
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    const rotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(rot, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rot, {
          toValue: -1,
          duration: 1400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    const makeRing = (val) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    scaleLoop.start();
    rotLoop.start();
    const r1 = makeRing(ring1);
    const r2 = makeRing(ring2);
    const r3 = makeRing(ring3);
    r1.start();
    const t2 = setTimeout(() => r2.start(), 730);
    const t3 = setTimeout(() => r3.start(), 1460);

    return () => {
      scaleLoop.stop();
      rotLoop.stop();
      r1.stop();
      r2.stop();
      r3.stop();
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scale, rot, ring1, ring2, ring3]);

  const isHot = streak >= 30;
  const ringColor = isHot ? c.error : c.warning;

  const rotation = rot.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-3deg", "3deg"],
  });

  const ringStyle = (val) => ({
    width: size * 0.85,
    height: size * 0.85,
    borderRadius: size,
    borderWidth: 1.5,
    borderColor: ringColor,
    position: "absolute",
    opacity: val.interpolate({
      inputRange: [0, 0.15, 1],
      outputRange: [0, 0.55, 0],
    }),
    transform: [
      {
        scale: val.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 2.4],
        }),
      },
    ],
  });

  return (
    <View style={[s.wrap, { width: size + 40, height: size + 40 }]}>
      <Animated.View pointerEvents="none" style={ringStyle(ring1)} />
      <Animated.View pointerEvents="none" style={ringStyle(ring2)} />
      <Animated.View pointerEvents="none" style={ringStyle(ring3)} />
      <Animated.Text
        style={[
          s.emoji,
          {
            fontSize: size,
            transform: [{ scale }, { rotate: rotation }],
            textShadowColor: ringColor,
            textShadowRadius: 18,
            textShadowOffset: { width: 0, height: 0 },
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
  emoji: {
    lineHeight: undefined,
  },
});
