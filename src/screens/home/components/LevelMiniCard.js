/**
 * LevelMiniCard — width: aynı (challenge card ile aynı), height: düşük.
 * Lv X · Ünvan + XP progress bar + sonraki ünvana kalan.
 * Tap → Roadmap.
 */
import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import useUserLevel from "../../../hooks/useUserLevel";
import Icon, { ICONS } from "../../../components/design/Icon";

export default function LevelMiniCard({ totalWords = 0, onPress }) {
  const { c } = useTheme();
  const level = useUserLevel(totalWords);
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: level.progress,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [level.progress, fill]);

  const fillWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        s.wrap,
        {
          backgroundColor: c.bgElevated,
          borderColor: level.color + "44",
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
      accessibilityLabel="Yol haritam"
    >
      <LinearGradient
        colors={[level.color + "14", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.row}>
        <View style={[s.badge, { backgroundColor: level.color + "22", borderColor: level.color + "55" }]}>
          <Text style={{ fontSize: 20 }}>{level.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={s.titleRow}>
            <Text style={[s.lvNum, { color: level.color, fontFamily: c.fontBodyBold }]}>
              LV {level.lv}
            </Text>
            <Text style={[s.titleTxt, { color: c.textPrimary, fontFamily: c.fontBodySemi }]}>
              · {level.title}
            </Text>
          </View>
          <View style={[s.track, { backgroundColor: c.bgSurface }]}>
            <Animated.View
              style={[
                s.fill,
                { width: fillWidth, backgroundColor: level.color },
              ]}
            />
          </View>
        </View>
        <Icon d={ICONS.arrow} size={14} stroke={c.textMuted} sw={2} />
      </View>

      <Text style={[s.next, { color: c.textMuted, fontFamily: c.fontBody }]}>
        {level.lv >= level.nextMilestone.lv
          ? "👑 Tüm seviyeler tamamlandı"
          : `${level.xpToNext} XP sonra: ${level.nextMilestone.emoji} ${level.nextMilestone.title}`}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 6 },
  lvNum: { fontSize: 13, letterSpacing: 0.5 },
  titleTxt: { fontSize: 13 },
  track: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 999 },
  next: {
    fontSize: 11,
    marginTop: 8,
    marginLeft: 52,
    letterSpacing: 0.2,
  },
});
