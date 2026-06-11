/**
 * SmartListCard — "Senin İçin" pinli özel listeler için kart.
 * Shimmer + sparkle vurgusu, normal liste kartlarından ayrılır.
 */
import React, { useEffect, useRef } from "react";
import { fontSize, radius, spacing } from "../../themes/tokens";
import { Pressable, Text, View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

/**
 * Tüm SmartListCard'ların paylaştığı tek shimmer clock.
 * Module-level — modül import edildiğinde başlar ve hep aynı fazda tutar.
 * Her kart bu değeri okur, hepsi tam senkron kayar.
 */
const SHARED_SHIMMER = new Animated.Value(0);
let SHARED_LOOP_STARTED = false;
function startSharedShimmerLoop() {
  if (SHARED_LOOP_STARTED) return;
  SHARED_LOOP_STARTED = true;
  Animated.loop(
    Animated.sequence([
      Animated.timing(SHARED_SHIMMER, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(SHARED_SHIMMER, { toValue: 0, duration: 0, useNativeDriver: true }),
    ])
  ).start();
}

export default function SmartListCard({
  emoji,
  iconPath,
  title,
  subtitle,
  count = 0,
  accent,
  pulse = false,
  onPress,
}) {
  const { c } = useTheme();
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const fillColor = accent || c.accent;

  // Shared shimmer — bu modüldeki tek clock, hepsi aynı anda kayar
  useEffect(() => {
    startSharedShimmerLoop();
  }, []);

  useEffect(() => {
    let pulseLoop;
    if (pulse) {
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.015,
            duration: 1600,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
    }
    return () => {
      pulseLoop?.stop();
    };
  }, [pulseScale, pulse]);

  const translateX = SHARED_SHIMMER.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 320],
  });

  const onPressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulseScale }, { scale: pressScale }] }}>
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[s.wrap, {
        borderColor: fillColor + "77",
        shadowColor: fillColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 3,
      }]}
    >
      <LinearGradient
        colors={[fillColor + "55", fillColor + "22"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Shimmer band */}
      <Animated.View
        pointerEvents="none"
        style={[
          s.shimmer,
          { backgroundColor: fillColor + "44", transform: [{ translateX }, { rotate: "20deg" }] },
        ]}
      />

      <View style={[s.iconBox, { backgroundColor: fillColor + "33", borderColor: fillColor + "66" }]}>
        {iconPath ? (
          <Icon d={iconPath} size={20} stroke={fillColor} sw={1.8} />
        ) : (
          <Text style={{ fontSize: fontSize.xl }}>{emoji || "📖"}</Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={s.titleRow}>
          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontBodyBold }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={[s.aiBadge, { backgroundColor: fillColor + "33", borderColor: fillColor + "66" }]}>
            <Text style={{ fontSize: fontSize.xs, color: fillColor, fontFamily: c.fontBodyBold, letterSpacing: 0.5 }}>
              AKILLI
            </Text>
          </View>
        </View>
        <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={s.footer}>
          <Text style={[s.count, { color: fillColor, fontFamily: c.fontNum }]}>{count}</Text>
          <Text style={[s.countLbl, { color: c.textMuted, fontFamily: c.fontBody }]}>kelime</Text>
          <View style={{ flex: 1 }} />
          <Icon d={ICONS.arrow} size={16} stroke={fillColor} sw={2} />
        </View>
      </View>
    </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  shimmer: {
    position: "absolute",
    top: -40,
    bottom: -40,
    width: 100,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { fontSize: fontSize.lg, flex: 1 },
  aiBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  sub: { fontSize: fontSize.sm, marginTop: 3, lineHeight: 16 },
  footer: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.sm },
  count: { fontSize: fontSize.lg },
  countLbl: { fontSize: fontSize.sm },
});
