/**
 * StreakChip — sol stat kartı. Animasyonlu alev + glow pulse + counter.
 * Streak > 0: warming glow + amber accent.
 * Streak = 0: soft muted, "başla" mood.
 */
import { radius } from "../../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Easing } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import useCountUp from "../../../hooks/useCountUp";
import Icon, { ICONS } from "../../../components/design/Icon";

export default function StreakChip({ streak = 0, onPress }) {
  const { c } = useTheme();
  const active = streak > 0;
  const fillColor = active ? c.warning : c.textMuted;
  const animStreak = useCountUp(streak, 1000);

  // Glow pulse — sadece aktifken
  const glow = useRef(new Animated.Value(0.4)).current;
  const flameRot = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      glow.setValue(0);
      flameRot.setValue(0);
      return;
    }
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.85,
          duration: 1400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.4,
          duration: 1400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    const rotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flameRot, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(flameRot, {
          toValue: -1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();
    rotLoop.start();
    return () => {
      glowLoop.stop();
      rotLoop.stop();
    };
  }, [active, glow, flameRot]);

  const rotation = flameRot.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-4deg", "4deg"],
  });

  const handlePressIn = () =>
    Animated.spring(press, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: press }], width: 110 }}>
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
            borderColor: active ? c.warning + "88" : c.warning + "33",
            borderWidth: active ? 2 : 1.5,
            shadowColor: c.warning,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: active ? 0.45 : 0.15,
            shadowRadius: 14,
            elevation: active ? 4 : 1,
          },
        ]}
      >
        {/* Glow halosu — alev arkasında */}
        {active && (
          <Animated.View
            pointerEvents="none"
            style={[
              s.glow,
              { backgroundColor: c.warning, opacity: glow },
            ]}
          />
        )}
        <LinearGradient
          colors={active ? [c.warning + "26", c.warning + "08"] : [c.warning + "0A", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={s.row}>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon d={ICONS.flame} size={20} stroke={c.warning} fill={c.warning} sw={1.2} />
          </Animated.View>
          <Text
            style={[
              s.num,
              { color: c.textPrimary, fontFamily: c.fontNum },
            ]}
          >
            {animStreak}
          </Text>
        </View>
        <Text
          style={[
            s.cap,
            { color: fillColor, fontFamily: c.fontBodyMed },
          ]}
          numberOfLines={1}
        >
          {active ? "gün üst üste" : "henüz seri yok"}
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
  glow: {
    position: "absolute",
    top: -30,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  num: { fontSize: 28, lineHeight: 30 },
  cap: { fontSize: 11, marginTop: 8, letterSpacing: 0.2 },
});
