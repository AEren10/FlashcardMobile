import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import useUserLevel from "../../../hooks/useUserLevel";
import Icon, { ICONS } from "../../../components/design/Icon";
import PressableScale from "../../../components/design/PressableScale";

export default function LevelMiniCard({ totalWords = 0, onPress }) {
  const { c } = useTheme();
  const level = useUserLevel(totalWords);
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: level.progress,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [level.progress, fill]);

  // Native scaleX progress — eski width interpolation yerine
  const fillWidth = fill.interpolate({ // legacy unused (saklı)
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <PressableScale
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={[s.wrap, { borderColor: c.borderAccent }]}
      scaleDown={0.985}
      accessibilityLabel="Yol haritam"
    >
      <LinearGradient
        colors={[c.bgElevated, c.bgSurface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Glow blob — challenge card'ın aynısı ama farklı pozisyon/renk */}
      <View style={[s.glow, { backgroundColor: c.cobaltGlow }]} />
      <LinearGradient
        colors={["rgba(255,255,255,0.06)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
        pointerEvents="none"
      />

      <View style={s.row}>
        <View style={[s.badge, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
          <Icon d={ICONS.star} size={18} stroke={c.accent} fill={c.accentGlow} sw={1.6} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={s.titleRow}>
            <Text style={[s.lvChip, { color: c.accent, backgroundColor: c.accentGlow, fontFamily: c.fontBodyBold }]}>
              LV {level.lv}
            </Text>
            <Text style={[s.titleTxt, { color: c.textPrimary, fontFamily: c.fontBodySemi }]}>
              {level.title}
            </Text>
          </View>
          <View style={[s.track, { backgroundColor: c.bgBase }]}>
            <Animated.View
              style={[s.fill, {
                width: "100%",
                backgroundColor: c.accent,
                transform: [{ scaleX: fill }],
                transformOrigin: "left",
              }]}
            />
          </View>
        </View>
        <Icon d={ICONS.arrow} size={14} stroke={c.textMuted} sw={2} />
      </View>

      {level.lv < level.nextMilestone.lv && (
        <Text style={[s.next, { color: c.textSec, fontFamily: c.fontBody }]}>
          {level.xpToNext} XP → {level.nextMilestone.title}
        </Text>
      )}
    </PressableScale>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    bottom: -30,
    left: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.7,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  lvChip: {
    fontSize: 11,
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  titleTxt: { fontSize: 14 },
  track: {
    height: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 999 },
  next: {
    fontSize: 11,
    marginTop: 10,
    marginLeft: 54,
    letterSpacing: 0.2,
  },
});
