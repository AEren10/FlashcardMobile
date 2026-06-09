/**
 * GoalSlide — Onboarding 4. ekran: kullanıcı hedefi.
 * 4 kart: Sınav / Kariyer / Seyahat / Hobi.
 * Tap → onSelect(slug). Seçilen kart highlighted.
 */
import { radius, spacing } from "../../../themes/tokens";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon, { ICONS } from "../../../components/design/Icon";

const GOALS = [
  { key: "exam", label: "Sınav", sub: "YDS · YÖKDİL · IELTS · TOEFL", icon: ICONS.target, color: "#D4AE5E" },
  { key: "career", label: "Kariyer", sub: "İş İngilizcesi, mülakat", icon: ICONS.briefcase, color: "#8BA4C4" },
  { key: "travel", label: "Seyahat", sub: "Yolda, otelde, restoranda", icon: ICONS.plane, color: "#C17B5A" },
  { key: "hobby", label: "Hobi / Genel", sub: "Sadece İngilizce'yi sevdiğim için", icon: ICONS.sparkle, color: "#84B19B" },
];

export default function GoalSlide({ c, selected, onSelect }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
        Neden buradasın?
      </Text>
      <Text style={[styles.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
        Sana en uygun listeleri önerelim
      </Text>
      <View style={styles.grid}>
        {GOALS.map((g) => {
          const active = selected === g.key;
          return (
            <Pressable
              key={g.key}
              onPress={() => onSelect(g.key)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: active ? g.color + "22" : c.bgElevated,
                  borderColor: active ? g.color : c.border,
                  borderWidth: active ? 2 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  shadowColor: active ? g.color : "transparent",
                  shadowOpacity: active ? 0.3 : 0,
                  shadowRadius: 10,
                  elevation: active ? 4 : 0,
                },
              ]}
              accessibilityLabel={g.label}
            >
              <Icon
                d={g.icon}
                size={28}
                stroke={active ? g.color : c.textSec}
                fill={active ? g.color + "33" : "none"}
                sw={1.7}
              />
              <Text style={[styles.label, { color: active ? g.color : c.textPrimary, fontFamily: c.fontBodyBold }]}>
                {g.label}
              </Text>
              <Text style={[styles.cardSub, { color: c.textSec, fontFamily: c.fontBody }]} numberOfLines={2}>
                {g.sub}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const GOAL_KEYS = GOALS.map((g) => g.key);

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.xxl, paddingTop: spacing.sm, alignItems: "stretch", width: "100%" },
  heading: { fontSize: 32, lineHeight: 36, textAlign: "center" },
  sub: { fontSize: 14, textAlign: "center", marginTop: spacing.sm, opacity: 0.85 },
  grid: {
    marginTop: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  card: {
    width: "47%",
    minHeight: 130,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  label: { fontSize: 15, marginTop: 10 },
  cardSub: { fontSize: 11, marginTop: spacing.xs, lineHeight: 14 },
});
