/**
 * DailyGoalCard — sağ stat kartı. Animated progress + completion celebration.
 * progress < 1: lime fill + shimmer
 * progress >= 1: yeşil success + checkmark + gentle pulse
 */
import { radius } from "../../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Easing } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import useCountUp from "../../../hooks/useCountUp";

export default function DailyGoalCard({ done = 0, total = 10, onPress }) {
  const { c } = useTheme();
  const ratio = total ? Math.min(1, done / total) : 0;
  const completed = ratio >= 1;
  const tint = completed ? c.success : c.accent;
  const animDone = useCountUp(done, 1100);

  // Bar fill animation
  const fillAnim = useRef(new Animated.Value(0)).current;
  // Shimmer band sweep
  const shimmer = useRef(new Animated.Value(0)).current;
  // Press scale
  const press = useRef(new Animated.Value(1)).current;
  // Completion pulse
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: ratio,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [ratio, fillAnim]);

  useEffect(() => {
    if (completed) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.012,
            duration: 1500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, [completed, shimmer, pulse]);

  // ScaleX native driver — soldan büyüyen progress bar (60fps)
  const fillScaleX = fillAnim;
  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 320],
  });

  const handlePressIn = () =>
    Animated.spring(press, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: pulse }, { scale: press }], flex: 1 }}>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress?.();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          s.wrap,
          {
            backgroundColor: c.bgElevated,
            borderColor: completed ? c.success + "44" : c.border,
          },
        ]}
      >
        <LinearGradient
          colors={[tint + "12", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={s.head}>
          <Text style={[s.label, { color: c.textSec, fontFamily: c.fontBodySemi }]}>
            Günlük hedef
          </Text>
          <Text style={[s.num, { color: c.textPrimary, fontFamily: c.fontNum }]}>
            {animDone}
            <Text style={{ color: c.textMuted }}>/{total}</Text>
          </Text>
        </View>

        <View style={[s.track, { backgroundColor: c.bgSurface }]}>
          <Animated.View
            style={[
              s.fill,
              {
                width: "100%",
                backgroundColor: tint,
                transform: [{ scaleX: fillScaleX }],
                transformOrigin: "left",
              },
            ]}
          >
            {!completed && (
              <Animated.View
                pointerEvents="none"
                style={[
                  s.shimmerBand,
                  {
                    transform: [{ translateX: shimmerX }, { rotate: "20deg" }],
                  },
                ]}
              />
            )}
          </Animated.View>
        </View>

        <Text
          style={[
            s.cap,
            { color: completed ? c.success : c.textSec, fontFamily: c.fontBodyMed },
          ]}
        >
          {completed
            ? "✓ Hedef tamamlandı"
            : `${total - done} kelime kaldı`}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
    minHeight: 96,
    justifyContent: "space-between",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  label: { fontSize: 13 },
  num: { fontSize: 17 },
  track: {
    height: 9,
    borderRadius: radius.full,
    overflow: "hidden",
    marginTop: 4,
  },
  fill: {
    height: "100%",
    borderRadius: radius.full,
    overflow: "hidden",
  },
  shimmerBand: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 40,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  cap: { fontSize: 11.5, marginTop: 2, letterSpacing: 0.2 },
});
