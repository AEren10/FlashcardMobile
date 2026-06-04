/**
 * PerfectScoreOverlay — Study/Quiz sonu yüksek skorda özel başlık katmanı.
 *
 * tier:
 *   "perfect" (100%)   — altın patlama, "Mükemmel" başlık
 *   "excellent" (≥80%) — cobalt vurgu, "Harika"
 *   yoksa render null
 *
 * Sonuç ekranının üstüne yerleştirilir (mevcut DonutChart vs altta kalır).
 */
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "../design/Icon";
import WarmConfetti from "./WarmConfetti";

export default function PerfectScoreOverlay({ ratio, total = 0, correct = 0 }) {
  const { c } = useTheme();
  const tier = ratio >= 1 ? "perfect" : ratio >= 0.8 ? "excellent" : null;

  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(16)).current;
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!tier) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.08,
          useNativeDriver: true,
          stiffness: 180,
          damping: 11,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 150,
        damping: 14,
      }),
    ]).start();

    // Sürekli yumuşak halo nefes
    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    haloLoop.start();
    return () => haloLoop.stop();
  }, [tier, scale, opacity, slideUp, halo]);

  if (!tier) return null;

  const isPerfect = tier === "perfect";
  const tint = isPerfect ? c.accent : c.cobalt;
  const titleTxt = isPerfect ? "Mükemmel" : "Harika";
  const subTxt = isPerfect
    ? `${total}/${total} — hepsini bildin`
    : `${correct}/${total} — neredeyse hepsi`;
  const icon = isPerfect ? ICONS.trophy : ICONS.sparkle;

  const haloOpacity = halo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });
  const haloScale = halo.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  return (
    <Animated.View style={[s.wrap, { opacity }]}>
      {isPerfect && <WarmConfetti count={50} origin="top" />}

      {/* Halo glow */}
      <Animated.View
        style={[
          s.halo,
          {
            backgroundColor: tint,
            opacity: haloOpacity,
            transform: [{ scale: haloScale }],
          },
        ]}
      />

      {/* Icon */}
      <Animated.View
        style={[
          s.iconRing,
          {
            backgroundColor: tint + "1A",
            borderColor: tint + "AA",
            shadowColor: tint,
            transform: [{ scale }, { translateY: slideUp }],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.12)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.6 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 36 }]}
          pointerEvents="none"
        />
        <Icon d={icon} size={36} stroke={tint} fill={tint + "44"} sw={1.7} />
      </Animated.View>

      {/* Tag */}
      <Animated.View
        style={[
          s.tag,
          {
            borderColor: tint + "55",
            backgroundColor: tint + "1A",
            opacity,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        <Text style={[s.tagTxt, { color: tint, fontFamily: c.fontBodyBold }]}>
          {isPerfect ? "%100" : `%${Math.round(ratio * 100)}`}
        </Text>
      </Animated.View>

      {/* Title */}
      <Animated.Text
        style={[
          s.title,
          {
            color: c.textPrimary,
            fontFamily: c.fontDisplay,
            opacity,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        {titleTxt}
      </Animated.Text>

      <Animated.Text
        style={[
          s.sub,
          {
            color: c.textSec,
            fontFamily: c.fontBody,
            opacity,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        {subTxt}
      </Animated.Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
  },
  halo: {
    position: "absolute",
    top: 0,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 14,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 10,
  },
  tagTxt: {
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    textAlign: "center",
  },
  sub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
});
