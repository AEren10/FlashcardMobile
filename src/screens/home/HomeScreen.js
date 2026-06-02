/**
 * HomeScreen — Claude Design v2 spec.
 * Greeting + 2 stat box + glow challenge card + horizontal "Devam Et" carousel.
 */
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import supabaseApiService from "../../services/supabaseApi";
import { getStudyStats } from "../../supabase/progress";
import Icon, { ICONS } from "../../components/design/Icon";
import CategoryCover from "../../components/design/CategoryCover";
import ProgressBar from "../../components/design/ProgressBar";
import StaggerEnter from "../../components/design/StaggerEnter";
import { SkeletonContinueCard } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";

const DAILY_TOTAL = 10;

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}


export default function HomeScreen({ navigation }) {
  const { c } = useTheme();
  const { isAuthenticated, getUserEmail } = useAuth();
  const [lists, setLists] = useState([]);
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const s = useMemo(() => makeStyles(c), [c]);

  const load = useCallback(async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        supabaseApiService.getAllPublicLists(),
        isAuthenticated() ? getStudyStats().catch(() => null) : Promise.resolve(null),
      ]);
      if (listRes.success) setLists(listRes.data || []);
      if (statsRes) setStats(statsRes);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const userName = (getUserEmail() || "").split("@")[0] || "Hoşgeldin";
  const streak = stats.streakDays || 0;
  const dailyDone = Math.min(stats.totalWords || 0, DAILY_TOTAL);
  const remaining = Math.max(0, DAILY_TOTAL - dailyDone);
  const progress = DAILY_TOTAL ? dailyDone / DAILY_TOTAL : 0;

  const startChallenge = () => {
    if (lists.length) {
      const pick = lists[Math.floor(Math.random() * Math.min(lists.length, 5))];
      navigation.navigate("Study", { listId: pick.id, listTitle: pick.title });
    }
  };

  const recentLists = lists.slice(0, 5);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <FlameRefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              title="🔥 Çekip yenile..."
            />
          }
        >
          {/* Greeting */}
          <Text style={s.greet}>{greeting()} 👋</Text>
          <Text style={s.name}>{userName}</Text>

          {/* Stats row */}
          <View style={s.statsRow}>
            <Pressable
              onPress={() => navigation.navigate("Streak")}
              style={[s.statBox, { width: 104 }]}
            >
              <View style={s.streakTop}>
                <Icon
                  d={ICONS.flame}
                  size={18}
                  fill={c.warning}
                  stroke={c.warning}
                  sw={1.6}
                />
                <Text style={s.streakNum}>{streak}</Text>
              </View>
              <Text style={s.statCap}>günlük seri</Text>
            </Pressable>

            <View style={[s.statBox, { flex: 1 }]}>
              <View style={s.goalHeader}>
                <Text style={s.goalLabel}>Günlük hedef</Text>
                <Text style={s.goalNum}>
                  {dailyDone}
                  <Text style={[s.goalNum, { color: c.textMuted }]}>/{DAILY_TOTAL}</Text>
                </Text>
              </View>
              <View style={{ marginTop: 14 }}>
                <ProgressBar progress={progress} />
              </View>
              <Text style={s.statCap}>
                {remaining === 0 ? "Hedef tamamlandı 🎉" : `${remaining} kelime kaldı`}
              </Text>
            </View>
          </View>

          {/* Challenge hero card */}
          <Pressable onPress={startChallenge} style={s.challengeCard}>
            <LinearGradient
              colors={[c.bgElevated, c.bgSurface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.challengeGlow} />
            {/* Top edge inner highlight - premium depth */}
            <LinearGradient
              colors={["rgba(255,255,255,0.08)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.4 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
              pointerEvents="none"
            />

            <View style={s.chipAccent}>
              <Icon d={ICONS.bolt} size={13} fill={c.accent} stroke={c.accent} sw={1.5} />
              <Text style={s.chipAccentTxt}>GÜNÜN MEYDAN OKUMASI</Text>
            </View>
            <Text style={s.challengeTitle}>5 Yeni Kelime Öğren</Text>
            <Text style={s.challengeSub}>~2 dakika · kolay tempo</Text>
            <View style={s.primaryBtn}>
              <Text style={s.primaryBtnTxt}>Başla</Text>
              <Icon d={ICONS.arrow} size={17} stroke={c.textOnAccent} sw={2.2} />
            </View>
          </Pressable>

          {/* Continue Et */}
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Devam Et</Text>
            <Pressable onPress={() => navigation.navigate("Library")}>
              <Text style={s.sectionLink}>Tümü</Text>
            </Pressable>
          </View>

          {loading ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingTop: 4, paddingBottom: 8 }}
            >
              {[0, 1, 2].map((i) => (
                <SkeletonContinueCard key={i} />
              ))}
            </ScrollView>
          ) : recentLists.length === 0 ? (
            <Text style={s.empty}>Henüz liste yok. İlk listeni oluştur ✨</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingTop: 4, paddingBottom: 8 }}
            >
              {recentLists.map((item, i) => (
                <StaggerEnter key={String(item.id)} index={i} delay={80}>
                  <ContinueCard
                    title={item.title}
                    count={item.word_count ?? 0}
                    pct={Math.min(100, (item.study_count ?? 0) * 5)}
                    level={item.level}
                    c={c}
                    onPress={() =>
                      navigation.navigate("FlashcardDetail", {
                        listId: item.id,
                        listTitle: item.title,
                        listLevel: item.level,
                      })
                    }
                  />
                </StaggerEnter>
              ))}
            </ScrollView>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ContinueCard({ title, count, pct, level, c, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ width: 150 }}>
      <View style={{ borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
        <CategoryCover difficulty={level} height={86} />
      </View>
      <Text
        numberOfLines={1}
        style={{ fontFamily: c.fontBodySemi, fontSize: 14, color: c.textPrimary }}
      >
        {title}
      </Text>
      <Text style={{ marginTop: 2, fontSize: 12, color: c.textSec, fontFamily: c.fontBody }}>
        {count} kelime · %{pct}
      </Text>
      <View
        style={{
          marginTop: 8,
          height: 5,
          backgroundColor: c.bgSurface,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: c.accent,
            borderRadius: 99,
          }}
        />
      </View>
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    greet: {
      fontFamily: c.fontBody,
      fontSize: 13,
      color: c.textSec,
      letterSpacing: 0.3,
    },
    name: {
      fontFamily: c.fontDisplay,
      fontSize: 38,
      lineHeight: 42,
      color: c.textPrimary,
      marginTop: 2,
    },
    statsRow: { flexDirection: "row", gap: 12, marginTop: 20 },
    statBox: {
      borderRadius: 16,
      backgroundColor: c.bgElevated,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      justifyContent: "space-between",
    },
    streakTop: { flexDirection: "row", alignItems: "center", gap: 6 },
    flame: { fontSize: 18 },
    streakNum: {
      fontFamily: c.fontNum,
      fontSize: 26,
      color: c.textPrimary,
    },
    statCap: {
      fontFamily: c.fontBody,
      fontSize: 12,
      color: c.textSec,
      marginTop: 6,
    },
    goalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    goalLabel: {
      fontFamily: c.fontBodySemi,
      fontSize: 14,
      color: c.textSec,
    },
    goalNum: {
      fontFamily: c.fontNum,
      fontSize: 15,
      color: c.textPrimary,
    },
    track: {
      height: 8,
      borderRadius: 999,
      backgroundColor: c.bgSurface,
      overflow: "hidden",
      marginTop: 14,
    },
    fill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: c.accent,
    },
    challengeCard: {
      marginTop: 16,
      borderRadius: 20,
      padding: 22,
      borderWidth: 1,
      borderColor: c.borderAccent,
      overflow: "hidden",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 40,
      elevation: 6,
    },
    challengeGlow: {
      position: "absolute",
      top: -40,
      right: -30,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: c.accentGlow,
    },
    chipAccent: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: c.accentGlow,
      borderColor: c.borderAccent,
      borderWidth: 1,
      borderRadius: 999,
      paddingVertical: 5,
      paddingHorizontal: 11,
    },
    chipAccentTxt: {
      fontFamily: c.fontBodyBold,
      fontSize: 11,
      color: c.accent,
      letterSpacing: 0.5,
    },
    challengeTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 24,
      color: c.textPrimary,
      marginTop: 14,
      lineHeight: 28,
    },
    challengeSub: {
      fontFamily: c.fontBody,
      fontSize: 13,
      color: c.textSec,
      marginTop: 4,
    },
    primaryBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 18,
    },
    primaryBtnTxt: {
      fontFamily: c.fontBodyBold,
      fontSize: 15,
      color: c.textOnAccent,
    },
    sectionHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 26,
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 18,
      color: c.textPrimary,
    },
    sectionLink: {
      fontFamily: c.fontBodySemi,
      fontSize: 12,
      color: c.cobalt,
    },
    empty: {
      textAlign: "center",
      color: c.textMuted,
      fontFamily: c.fontBody,
      marginTop: 16,
      fontSize: 13,
    },
  });
}
