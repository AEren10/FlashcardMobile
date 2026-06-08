/**
 * StreakScreen — Claude Design v2 spec.
 * Hero flame (animated float) + 3 stat tiles with trends + 35-day grid + badges.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { getStudyStats, getDailyActivity } from "../../supabase/progress";
import { STREAK_BADGES, WORDS_BADGES, getStreakBadge } from "../../lib/badges";
import Icon, { ICONS } from "../../components/design/Icon";
import AnimatedFlame from "../../components/design/AnimatedFlame";
import AchievementModal from "../../components/design/AchievementModal";
import Last30BarChart from "../../components/design/Last30BarChart";
import Last7DaysDots from "../../components/design/Last7DaysDots";
import useBadgeWatcher from "../../hooks/useBadgeWatcher";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import { getFreezeStatus, consumeStreakFreeze } from "../../supabase/streakFreeze";

export default function StreakScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [days, setDays] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [freeze, setFreeze] = useState({ canUse: false, nextResetAt: null });
  const toast = useToast();

  const { newBadge, dismiss } = useBadgeWatcher({
    streakDays: stats.streakDays,
    totalWords: stats.totalWords,
  });

  const load = useCallback(async () => {
    try {
      const [statsRes, daysRes, freezeRes] = await Promise.allSettled([
        getStudyStats(),
        getDailyActivity(35),
        getFreezeStatus(),
      ]);
      if (statsRes.status === "fulfilled" && statsRes.value) setStats(statsRes.value);
      if (daysRes.status === "fulfilled" && Array.isArray(daysRes.value)) setDays(daysRes.value);
      if (freezeRes.status === "fulfilled" && freezeRes.value?.success) {
        setFreeze({
          canUse: freezeRes.value.canUse,
          nextResetAt: freezeRes.value.nextResetAt,
        });
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onFreezePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!freeze.canUse) {
      const days = freeze.nextResetAt
        ? Math.ceil((new Date(freeze.nextResetAt) - new Date()) / 86400000)
        : 7;
      toast?.show?.({
        message: `Donuk Kalkan ${days} gün sonra yenilenir`,
        type: "info",
      });
      return;
    }
    Alert.alert(
      "Donuk Kalkan",
      "Bugün çalışmasan bile serini koruyacak. Bu hakkın haftada bir yenileniyor.",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Kullan",
          onPress: async () => {
            const r = await consumeStreakFreeze();
            if (r.success) {
              setFreeze({ canUse: false, nextResetAt: r.nextResetAt });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              toast?.show?.({ message: "❄️ Serin korunuyor", type: "success" });
            } else {
              toast?.show?.({ message: "Kullanılamadı: " + (r.message || r.error), type: "error" });
            }
          },
        },
      ]
    );
  }, [freeze, toast]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  const accuracy = stats.totalSessions
    ? Math.round((stats.totalWords / Math.max(stats.totalSessions * 10, 1)) * 100)
    : 0;

  const streak = getStreakBadge(stats.streakDays);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<FlameRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Header */}
          <View style={s.header}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={s.back}>
              <Svg width={10} height={16} viewBox="0 0 8 14">
                <Path
                  d="M7 1L1 7l6 6"
                  stroke={c.textPrimary}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
            <Text style={s.headerTitle}>İstatistikler</Text>
            <View style={{ width: 34 }} />
          </View>

          {/* Hero flame */}
          <View style={s.hero}>
            <AnimatedFlame size={64} streak={stats.streakDays} />
            <Text style={s.heroNum}>{stats.streakDays}</Text>
            <Text style={s.heroCap}>
              {stats.streakDays === 0
                ? "henüz seri yok — bugün başla"
                : stats.streakDays === 1
                  ? "ilk gün — devam et"
                  : "gün üst üste"}
            </Text>
            {stats.streakDays === 0 && (
              <Text style={[s.heroNext, { color: c.warning, fontFamily: c.fontBodySemi }]}>
                Bugün 5 dakikalık çalışma seri başlatır
              </Text>
            )}
            {streak.next && (
              <Text style={s.heroNext}>
                Sonraki:{" "}
                {streak.next.icon ? (
                  <Icon d={streak.next.icon} size={14} stroke={c.textMuted} sw={1.5} />
                ) : (
                  streak.next.emoji
                )}{" "}
                {streak.next.label} —{" "}
                {streak.next.threshold - stats.streakDays} gün
              </Text>
            )}
          </View>

          {/* Donuk Kalkan — haftada 1 hak, seriyi koru */}
          <Pressable
            onPress={onFreezePress}
            style={({ pressed }) => [
              s.freezeChip,
              {
                borderColor: freeze.canUse ? c.cobalt + "AA" : c.border,
                backgroundColor: freeze.canUse ? c.cobalt + "1A" : c.bgElevated,
                opacity: freeze.canUse ? 1 : 0.55,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                shadowColor: freeze.canUse ? c.cobalt : "transparent",
                shadowOpacity: freeze.canUse ? 0.35 : 0,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: freeze.canUse ? 4 : 0,
              },
            ]}
            accessibilityLabel="Donuk Kalkan"
          >
            <Text style={{ fontSize: 18 }}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.freezeTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                {freeze.canUse ? "Donuk Kalkan hazır" : "Donuk Kalkan kullanıldı"}
              </Text>
              <Text style={[s.freezeSub, { color: c.textSec, fontFamily: c.fontBody }]}>
                {freeze.canUse
                  ? "Bugün çalışmasan bile serini koruyabilirsin"
                  : freeze.nextResetAt
                    ? `${Math.max(1, Math.ceil((new Date(freeze.nextResetAt) - new Date()) / 86400000))} gün sonra yenilenir`
                    : "Haftada 1 hak"}
              </Text>
            </View>
            {freeze.canUse && (
              <Text style={{ color: c.cobalt, fontSize: 13, fontFamily: c.fontBodyBold }}>Kullan</Text>
            )}
          </Pressable>

          {/* Bu hafta — 7 gün yuvarlaklar */}
          <View style={{ marginTop: 8 }}>
            <Last7DaysDots days={days} />
          </View>

          {/* Stat tiles */}
          <View style={s.tileRow}>
            <StatTile
              value={stats.totalWords}
              label="Kelime"
              trend="12% bu hafta"
              accent={c.warning}
              c={c}
              s={s}
            />
            <StatTile
              value={stats.totalSessions}
              label="Seans"
              trend={`${Math.min(7, stats.totalSessions)} bu hafta`}
              accent={c.cobalt}
              c={c}
              s={s}
            />
            <StatTile
              value={`%${accuracy}`}
              label="Doğruluk"
              trend="%3"
              accent={c.success}
              c={c}
              s={s}
            />
          </View>

          {/* Last 30 days canlı bar chart */}
          <View style={{ marginTop: 18 }}>
            <Last30BarChart days={days} />
          </View>

          {/* Badges */}
          <Text style={s.sectionTitle}>Rozetler</Text>
          <View style={s.badgeRow}>
            {STREAK_BADGES.slice(0, 5).map((b) => (
              <BadgeCell
                key={b.key}
                badge={b}
                unlocked={stats.streakDays >= b.threshold}
                c={c}
                s={s}
              />
            ))}
          </View>

          <Text style={[s.sectionTitle, { marginTop: 18 }]}>Kelime Rozetleri</Text>
          <View style={s.badgeRow}>
            {WORDS_BADGES.slice(0, 5).map((b) => (
              <BadgeCell
                key={b.key}
                badge={b}
                unlocked={stats.totalWords >= b.threshold}
                c={c}
                s={s}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <AchievementModal visible={!!newBadge} badge={newBadge} onClose={dismiss} />
    </View>
  );
}

function StatTile({ value, label, trend, accent, c, s }) {
  return (
    <View style={[
      s.tile,
      {
        borderTopColor: accent,
        borderTopWidth: 3,
        borderColor: accent + "44",
        shadowColor: accent,
      },
    ]}>
      <View
        style={[
          s.tileHalo,
          {
            backgroundColor: accent + "55",
          },
        ]}
      />
      <Text style={[s.tileVal, { color: accent }]}>{value}</Text>
      <Text style={s.tileLbl}>{label}</Text>
      <View style={[s.trendChip, { backgroundColor: c.successDim }]}>
        <Text style={[s.trendTxt, { color: c.success }]}>↑ {trend}</Text>
      </View>
    </View>
  );
}

function BadgeCell({ badge, unlocked, c, s }) {
  const color = badge.color || c.accent;
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View
        style={[
          s.badgeBox,
          unlocked
            ? {
                backgroundColor: color + "22",
                borderColor: color + "55",
                opacity: 1,
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
              }
            : { backgroundColor: c.bgSurface, borderColor: c.border, opacity: 0.4 },
        ]}
      >
        <Icon
          d={badge.icon}
          size={26}
          stroke={unlocked ? color : c.textMuted}
          fill={unlocked ? color + "33" : "none"}
          sw={1.6}
        />
      </View>
      <Text
        style={[
          s.badgeLbl,
          unlocked && { color: color, fontFamily: c.fontBodyBold },
        ]}
      >
        {badge.label}
      </Text>
    </View>
  );
}

function ContributionGrid({ days, c }) {
  // 35 cells: 7 columns × 5 rows
  // days array sorted oldest→newest. Group into rows of 7.
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = days[i];
    const sessions = d?.sessions || 0;
    const level = sessionsToLevel(sessions);
    return level;
  });

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
      {cells.map((lvl, i) => (
        <View
          key={i}
          style={{
            width: "calc(100% / 7 - 5px)",
            // RN doesn't support calc — fallback below
            aspectRatio: 1,
            borderRadius: 3,
            backgroundColor: intensity(lvl, c),
            borderWidth: lvl === 0 ? 1 : 0,
            borderColor: c.border,
            shadowColor: lvl === 4 ? c.accent : "transparent",
            shadowOpacity: lvl === 4 ? 0.6 : 0,
            shadowRadius: 8,
            // approximate fixed width for 7 cols in 280px container
            flexBasis: "13%",
            flexGrow: 0,
          }}
        />
      ))}
    </View>
  );
}

function sessionsToLevel(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 5) return 3;
  return 4;
}

function intensity(lvl, c) {
  if (lvl === 0) return c.bgSurface;
  if (lvl === 1) return mix(c.bgSurface, c.accent, 0.3);
  if (lvl === 2) return mix(c.bgSurface, c.accent, 0.55);
  if (lvl === 3) return mix(c.bgSurface, c.accent, 0.78);
  return c.accent;
}

function mix(base, accent, t) {
  // basit hex/rgba interpolation. accent zaten brand renk, base bgSurface rgba olabilir.
  // CSS color-mix yerine: simply return accent with adjusted opacity via rgba.
  // accent hex (#RRGGBB) → rgba(r,g,b, t).
  const m = accent.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const r = parseInt(m[1].slice(0, 2), 16);
    const g = parseInt(m[1].slice(2, 4), 16);
    const b = parseInt(m[1].slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${t})`;
  }
  return accent;
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    back: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 16,
      fontFamily: c.fontBodySemi,
      color: c.textSec,
    },
    hero: { alignItems: "center", paddingVertical: 16 },
    flame: { fontSize: 64, textShadowColor: c.warning, textShadowRadius: 24 },
    heroNum: {
      fontFamily: c.fontNum,
      fontSize: 64,
      lineHeight: 64,
      color: c.textPrimary,
      marginTop: 4,
    },
    heroCap: { fontFamily: c.fontBody, fontSize: 12, color: c.textSec, marginTop: 4 },
    heroNext: { fontFamily: c.fontBody, fontSize: 11, color: c.textMuted, marginTop: 10 },

    tileRow: { flexDirection: "row", gap: 12, marginTop: 10 },
    freezeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 12,
    },
    freezeTitle: { fontSize: 14 },
    freezeSub: { fontSize: 11, marginTop: 2, lineHeight: 14 },
    tile: {
      flex: 1,
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: c.border,
      padding: 16,
      paddingTop: 14,
      alignItems: "center",
      overflow: "hidden",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 3,
    },
    tileHalo: {
      position: "absolute",
      top: -22,
      width: 90,
      height: 46,
      borderRadius: 99,
      opacity: 0.9,
    },
    tileVal: { fontFamily: c.fontNum, fontSize: 28, color: c.textPrimary },
    tileLbl: { fontFamily: c.fontBody, fontSize: 11, color: c.textSec, marginTop: 2 },
    trendChip: {
      marginTop: 9,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 99,
    },
    trendTxt: { fontFamily: c.fontBodyBold, fontSize: 10 },

    gridCard: {
      marginTop: 18,
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
    },
    gridHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 14,
    },
    gridTitle: { fontFamily: c.fontBodySemi, fontSize: 15, color: c.textPrimary },
    gridDays: { fontFamily: c.fontBody, fontSize: 11, color: c.textMuted },
    legend: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      justifyContent: "flex-end",
      marginTop: 14,
    },
    legendCap: { fontFamily: c.fontBody, fontSize: 11, color: c.textMuted },
    legendCell: { width: 12, height: 12, borderRadius: 3, borderWidth: 0 },

    sectionTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 17,
      color: c.textPrimary,
      marginTop: 24,
      marginBottom: 14,
    },
    badgeRow: { flexDirection: "row", gap: 10 },
    badgeBox: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeLbl: {
      fontFamily: c.fontBody,
      fontSize: 10,
      color: c.textSec,
      marginTop: 6,
      textAlign: "center",
    },
  });
}
