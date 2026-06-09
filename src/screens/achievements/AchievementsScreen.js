/**
 * AchievementsScreen — Tüm rozetlerin grid'i (kilitli + açık).
 * Kategoriye göre gruplanmış, tier rengiyle renklendirilmiş.
 */
import { radius } from "../../themes/tokens";
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { useAchievements } from "../../contexts/AchievementsContext";
import {
  ACHIEVEMENTS,
  CATEGORIES,
  TIER_COLORS,
  groupByCategory,
} from "../../lib/achievements";
import Icon, { ICONS } from "../../components/design/Icon";
import StaggerEnter from "../../components/design/StaggerEnter";

export default function AchievementsScreen({ navigation }) {
  const { c } = useTheme();
  const { unlocked } = useAchievements();
  const s = useMemo(() => makeStyles(c), [c]);

  const grouped = useMemo(() => groupByCategory(ACHIEVEMENTS), []);
  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlocked.size;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={[s.back, { backgroundColor: c.bgSurface, borderColor: c.border }]}
          >
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
            Başarımlar
          </Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
          {/* Overall progress */}
          <View style={[s.overall, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
            <LinearGradient
              colors={[c.accentGlow, "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.overallRow}>
              <View
                style={[
                  s.overallBadge,
                  { backgroundColor: c.accentGlow, borderColor: c.borderAccent },
                ]}
              >
                <Icon d={ICONS.trophy} size={28} stroke={c.accent} fill={c.accentGlow} sw={1.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.overallNum, { color: c.textPrimary, fontFamily: c.fontNum }]}>
                  {unlockedCount} / {totalCount}
                </Text>
                <Text style={[s.overallLbl, { color: c.textSec, fontFamily: c.fontBody }]}>
                  Toplam rozet ({pct}%)
                </Text>
              </View>
            </View>
            <View style={[s.progressTrack, { backgroundColor: c.bgSurface }]}>
              <View
                style={[
                  s.progressFill,
                  { width: `${pct}%`, backgroundColor: c.accent },
                ]}
              />
            </View>
          </View>

          {/* Categories */}
          {CATEGORIES.map((cat) => {
            const list = grouped[cat.key] || [];
            if (!list.length) return null;
            const catUnlocked = list.filter((a) => unlocked.has(a.key)).length;
            return (
              <View key={cat.key} style={{ marginTop: 22 }}>
                <View style={s.catHeader}>
                  <Text style={[s.catTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                    {cat.label}
                  </Text>
                  <Text style={[s.catCount, { color: c.textMuted, fontFamily: c.fontNum }]}>
                    {catUnlocked} / {list.length}
                  </Text>
                </View>
                <View style={s.grid}>
                  {list.map((ach, idx) => {
                    const isUnlocked = unlocked.has(ach.key);
                    const tier = TIER_COLORS[ach.tier];
                    return (
                      <StaggerEnter key={ach.key} index={Math.min(idx, 6)} delay={55} style={{ width: "48.5%" }}>
                      <View
                        style={[
                          s.card,
                          {
                            width: "100%",
                            backgroundColor: c.bgElevated,
                            borderColor: isUnlocked ? tier.color : c.border,
                            opacity: isUnlocked ? 1 : 0.55,
                          },
                        ]}
                      >
                        {isUnlocked && (
                          <LinearGradient
                            colors={[tier.color + "22", "transparent"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                        )}
                        <View
                          style={[
                            s.iconBox,
                            {
                              backgroundColor: isUnlocked ? tier.color + "22" : c.bgSurface,
                              borderColor: isUnlocked ? tier.color + "55" : c.border,
                            },
                          ]}
                        >
                          {isUnlocked ? (
                            <Icon d={ach.icon} size={22} stroke={tier.color} fill={tier.color + "33"} sw={1.6} />
                          ) : (
                            <Icon d={ICONS.lock} size={18} stroke={c.textMuted} sw={1.6} />
                          )}
                        </View>
                        <Text
                          style={[
                            s.cardTitle,
                            { color: isUnlocked ? c.textPrimary : c.textMuted, fontFamily: c.fontBodyBold },
                          ]}
                          numberOfLines={1}
                        >
                          {ach.label}
                        </Text>
                        <Text
                          style={[
                            s.cardDesc,
                            { color: isUnlocked ? c.textSec : c.textMuted, fontFamily: c.fontBody },
                          ]}
                          numberOfLines={2}
                        >
                          {ach.description}
                        </Text>
                        <View style={[s.tierBadge, { backgroundColor: tier.color + "1A", borderColor: tier.color + "44" }]}>
                          <Text style={[s.tierBadgeTxt, { color: tier.color, fontFamily: c.fontBodyBold }]}>
                            {tier.label}
                          </Text>
                        </View>
                      </View>
                      </StaggerEnter>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      gap: 12,
    },
    back: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 22,
    },
    overall: {
      borderRadius: radius.md,
      borderWidth: 1,
      padding: 18,
      overflow: "hidden",
    },
    overallRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginBottom: 12,
    },
    overallBadge: {
      width: 60,
      height: 60,
      borderRadius: radius.md,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    overallNum: { fontSize: 28, lineHeight: 30 },
    overallLbl: { fontSize: 12, marginTop: 4 },
    progressTrack: {
      height: 8,
      borderRadius: radius.full,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: radius.full,
    },
    catHeader: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    catTitle: {
      fontSize: 15,
      letterSpacing: 0.3,
    },
    catCount: {
      fontSize: 13,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    card: {
      width: "48.5%",
      borderRadius: radius.md,
      borderWidth: 1,
      padding: 14,
      overflow: "hidden",
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.sm,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 13,
    },
    cardDesc: {
      fontSize: 11,
      lineHeight: 14,
      marginTop: 3,
      minHeight: 28,
    },
    tierBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: radius.full,
      borderWidth: 1,
      marginTop: 8,
    },
    tierBadgeTxt: { fontSize: 9, letterSpacing: 0.5 },
  });
}
