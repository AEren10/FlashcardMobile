/**
 * RoadmapScreen — kullanıcının seviye yolu (Duolingo path tarzı).
 * LEVELS milestone'ları zigzag layout. Tamamlanmış / aktif / locked durumları.
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getStudyStats } from "../../supabase/progress";
import useUserLevel, { LEVELS } from "../../hooks/useUserLevel";
import Icon from "../../components/design/Icon";
import RoadmapHeader from "./components/RoadmapHeader";
import RoadmapNode from "./components/RoadmapNode";
import { Skeleton } from "../../components/design/Skeleton";
import { getCached, setCache } from "../../lib/dataCache";

export default function RoadmapScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ totalWords: 0, totalSessions: 0, streakDays: 0 });
  const [loading, setLoading] = useState(true);
  const level = useUserLevel(stats.totalWords);

  useEffect(() => {
    getCached("roadmapStats").then((v) => v && setStats(v));
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    getStudyStats()
      .then((d) => { if (d) { setStats(d); setCache("roadmapStats", d); } })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={s.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={s.back}
            accessibilityLabel="Geri"
          >
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Text style={s.title}>Yol Haritam</Text>
          <View style={{ width: 38 }} />
        </View>

        {loading ? (
          <View style={{ padding: 22, gap: spacing.lg }}>
            <Skeleton height={130} radius={20} />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={80} radius={20} style={{ marginTop: spacing.sm }} />
            ))}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <RoadmapHeader level={level} />

            <View style={s.path}>
              {LEVELS.map((milestone, i) => {
                const isCurrent = milestone.lv === level.lv ||
                  (milestone.lv < level.lv && (LEVELS[i + 1]?.lv ?? Infinity) > level.lv);
                const isDone = level.lv > milestone.lv;
                const isLocked = level.lv < milestone.lv;
                // Zigzag offset
                const offset = i % 2 === 0 ? -40 : 40;

                return (
                  <RoadmapNode
                    key={milestone.lv}
                    milestone={milestone}
                    isCurrent={isCurrent}
                    isDone={isDone}
                    isLocked={isLocked}
                    offset={offset}
                    isLast={i === LEVELS.length - 1}
                    index={i}
                    currentXP={level.xp}
                  />
                );
              })}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    back: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
      backgroundColor: c.bgSurface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 24,
      fontFamily: c.fontDisplay,
      color: c.textPrimary,
    },
    path: { alignItems: "center", paddingVertical: 30, gap: 0 },
  });
}
