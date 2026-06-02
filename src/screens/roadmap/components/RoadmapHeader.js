/**
 * RoadmapHeader — kullanıcının mevcut seviye + XP progress bar + sonraki ünvan.
 */
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import useCountUp from "../../../hooks/useCountUp";

export default function RoadmapHeader({ level }) {
  const { c } = useTheme();
  const xpAnim = useCountUp(level.xp, 1200);
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: level.progress,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [level.progress, fill]);

  const fillWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[s.wrap, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
      <LinearGradient
        colors={[level.color + "22", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.row}>
        <View style={[s.badge, { backgroundColor: level.color + "22", borderColor: level.color + "55" }]}>
          <Text style={s.emoji}>{level.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.titleTxt, { color: level.color, fontFamily: c.fontBodyBold }]}>
            {level.title}
          </Text>
          <Text style={[s.lvTxt, { color: c.textPrimary, fontFamily: c.fontNum }]}>
            Seviye {level.lv}
          </Text>
        </View>
        <View style={s.xpBox}>
          <Text style={[s.xpNum, { color: c.textPrimary, fontFamily: c.fontNum }]}>
            {xpAnim}
          </Text>
          <Text style={[s.xpLbl, { color: c.textMuted, fontFamily: c.fontBody }]}>XP</Text>
        </View>
      </View>

      <View style={[s.track, { backgroundColor: c.bgSurface }]}>
        <Animated.View
          style={[s.fill, { width: fillWidth, backgroundColor: level.color }]}
        />
      </View>

      <Text style={[s.next, { color: c.textSec, fontFamily: c.fontBody }]}>
        {level.lv >= level.nextMilestone.lv ? (
          "👑 Tüm seviyeleri tamamladın!"
        ) : (
          <>
            <Text style={{ fontFamily: c.fontBodyBold, color: c.textPrimary }}>
              {level.xpToNext} XP
            </Text>{" "}
            sonra: <Text style={{ color: level.nextMilestone.color }}>
              {level.nextMilestone.emoji} {level.nextMilestone.title}
            </Text>
          </>
        )}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    margin: 20,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 26 },
  titleTxt: { fontSize: 14, letterSpacing: 0.3, marginBottom: 2 },
  lvTxt: { fontSize: 22 },
  xpBox: { alignItems: "flex-end" },
  xpNum: { fontSize: 24, lineHeight: 26 },
  xpLbl: { fontSize: 10, letterSpacing: 0.5 },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 999 },
  next: { fontSize: 12, marginTop: 10, lineHeight: 18 },
});
