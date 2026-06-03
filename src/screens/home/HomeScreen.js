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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useSelector } from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import supabaseApiService from "../../services/supabaseApi";
import { getStudyStats } from "../../supabase/progress";
import { getMistakesList } from "../../supabase/mistakesList";
import { selectFavoriteWordIds } from "../../store/favoriteWordsSlice";
import Icon, { ICONS } from "../../components/design/Icon";
import CategoryCover from "../../components/design/CategoryCover";
import StaggerEnter from "../../components/design/StaggerEnter";
import SmartListCard from "../../components/design/SmartListCard";
import PressableScale from "../../components/design/PressableScale";
import DiscoveryRow from "./components/DiscoveryRow";
import HeroDashboard from "./components/HeroDashboard";
import HomeSearchBar from "./components/HomeSearchBar";
import LevelMiniCard from "./components/LevelMiniCard";
import { SkeletonContinueCard, SkeletonStatRow } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import usePublicLists from "../../hooks/usePublicLists";

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
  const { lists, loading: listsLoading, refreshing, refresh } = usePublicLists();
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [mistakesList, setMistakesList] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const favoriteWordIds = useSelector(selectFavoriteWordIds);
  const loading = listsLoading || authLoading;

  const s = useMemo(() => makeStyles(c), [c]);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated()) {
      setAuthLoading(false);
      return;
    }
    try {
      const [statsRes, mistakesRes] = await Promise.all([
        getStudyStats().catch(() => null),
        getMistakesList().catch(() => null),
      ]);
      if (statsRes) setStats(statsRes);
      if (mistakesRes?.success) setMistakesList(mistakesRes.data);
    } finally {
      setAuthLoading(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const userName = (getUserEmail() || "").split("@")[0] || "Hoşgeldin";
  const streak = stats.streakDays || 0;
  const dailyDone = Math.min(stats.totalWords || 0, DAILY_TOTAL);

  const startChallenge = () => {
    if (lists.length) {
      const pick = lists[Math.floor(Math.random() * Math.min(lists.length, 5))];
      navigation.navigate("Study", { listId: pick.id, listTitle: pick.title });
    }
  };

  const recentLists = lists.slice(0, 5);
  const popularLists = useMemo(
    () => [...lists].sort((a, b) => (b.study_count ?? 0) - (a.study_count ?? 0)).slice(0, 8),
    [lists]
  );
  const newestLists = useMemo(
    () =>
      [...lists]
        .sort((a, b) => (b.inserted_at || "").localeCompare(a.inserted_at || ""))
        .slice(0, 8),
    [lists]
  );

  // Kategorileri bir kez grupla — her DiscoveryRow için filter() çalıştırma maliyetini sıfırla
  const categoryMap = useMemo(() => {
    const map = {};
    for (const l of lists) {
      const k = (l.category || "").toLowerCase();
      if (!k) continue;
      (map[k] = map[k] || []).push(l);
    }
    return map;
  }, [lists]);

  const byCategory = useCallback(
    (cat) => (categoryMap[cat.toLowerCase()] || []).slice(0, 8),
    [categoryMap]
  );

  const openList = useCallback(
    (item) =>
      navigation.navigate("FlashcardDetail", {
        listId: item.id,
        listTitle: item.title,
        listLevel: item.level,
      }),
    [navigation]
  );

  const openExplorer = useCallback(
    (filter, options = {}) =>
      navigation.navigate("ListExplorer", { filter, ...options }),
    [navigation]
  );

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
                refresh();
                loadUserData();
              }}
              title="🔥 Çekip yenile..."
            />
          }
        >
          {/* Hero Dashboard — animasyonlu canlı üst alan */}
          {loading ? (
            <View style={{ marginBottom: 4 }}>
              <SkeletonStatRow />
            </View>
          ) : (
            <HeroDashboard
              greeting={greeting()}
              userName={userName}
              streak={streak}
              dailyDone={dailyDone}
              dailyTotal={DAILY_TOTAL}
              onStreakPress={() => navigation.navigate("Streak")}
              onGoalPress={startChallenge}
            />
          )}

          {/* Challenge hero card */}
          <PressableScale onPress={startChallenge} style={s.challengeCard}>
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
          </PressableScale>

          {/* Level mini card — challenge'tan sonra "ilerleme" sekansı */}
          {!loading && isAuthenticated() && (
            <LevelMiniCard
              totalWords={stats.totalWords || 0}
              onPress={() => navigation.navigate("Roadmap")}
            />
          )}

          {/* Search bar */}
          {!loading && (
            <HomeSearchBar
              onPress={() =>
                navigation.navigate("ListExplorer", {
                  title: "Liste Ara",
                  filter: "popular",
                  searchMode: true,
                })
              }
            />
          )}

          {/* Continue Et */}
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Devam Et</Text>
            <Pressable
              onPress={() =>
                navigation.getParent()?.navigate("MyLists") ??
                navigation.navigate("MyLists")
              }
            >
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
                    onPress={() => openList(item)}
                  />
                </StaggerEnter>
              ))}
            </ScrollView>
          )}

          {/* Senin İçin — kişisel akıllı kartlar */}
          {isAuthenticated() && (favoriteWordIds.length > 0 || mistakesList) && (
            <View style={{ marginTop: 26 }}>
              <Text style={s.discoveryHeader}>✨ Senin İçin</Text>
              {favoriteWordIds.length > 0 && (
                <SmartListCard
                  emoji="🔖"
                  title="Favori Kelimelerim"
                  subtitle="Kart üstündeki yer iminden eklediklerin."
                  count={favoriteWordIds.length}
                  accent={c.accent}
                  onPress={() =>
                    navigation.getParent()?.navigate("MyLists", {
                      screen: "FavoriteWords",
                    })
                  }
                />
              )}
              {mistakesList && (
                <SmartListCard
                  emoji="🎯"
                  title={mistakesList.title}
                  subtitle="Takıldığın kelimeler. 3 kez doğru bilince çıkar."
                  count={mistakesList.word_count ?? 0}
                  accent={c.error}
                  pulse
                  onPress={() => openList(mistakesList)}
                />
              )}
            </View>
          )}

          {/* Popüler listeler */}
          <DiscoveryRow
            title="🌟 Popüler"
            subtitle="En çok çalışılan listeler"
            items={popularLists}
            accent={c.warning}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("popular", { title: "🌟 Popüler", accent: c.warning })
            }
          />

          {/* Kategorik slider'lar — Spotify/App Store tarzı */}
          <DiscoveryRow
            title="💼 İş & Kariyer"
            subtitle="Profesyonel İngilizce"
            items={byCategory("business")}
            accent={c.cobalt}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("category", {
                title: "💼 İş & Kariyer",
                category: "business",
                accent: c.cobalt,
              })
            }
          />

          <DiscoveryRow
            title="✈️ Seyahat"
            subtitle="Yolda işine yarayacak"
            items={byCategory("travel")}
            accent={c.info}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("category", {
                title: "✈️ Seyahat",
                category: "travel",
                accent: c.info,
              })
            }
          />

          <DiscoveryRow
            title="🎓 Akademik"
            subtitle="Sınav ve akademi"
            items={byCategory("academic")}
            accent={c.accent}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("category", {
                title: "🎓 Akademik",
                category: "academic",
                accent: c.accent,
              })
            }
          />

          <DiscoveryRow
            title="💻 Teknoloji"
            subtitle="Modern yazılım & AI"
            items={byCategory("tech")}
            accent={c.success}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("category", {
                title: "💻 Teknoloji",
                category: "tech",
                accent: c.success,
              })
            }
          />

          <DiscoveryRow
            title="🍔 Yemek & Mutfak"
            subtitle="Restoran ve günlük yemek"
            items={byCategory("food")}
            accent={c.warning}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("category", {
                title: "🍔 Yemek & Mutfak",
                category: "food",
                accent: c.warning,
              })
            }
          />

          {/* Yeni eklendi */}
          <DiscoveryRow
            title="🆕 Yeni Eklendi"
            subtitle="Son hazır liste paketleri"
            items={newestLists}
            accent={c.cobalt}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("newest", { title: "🆕 Yeni Eklendi", accent: c.cobalt })
            }
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ContinueCard = React.memo(function ContinueCard({ title, count, pct, level, c, onPress }) {
  return (
    <PressableScale onPress={onPress} style={{ width: 165 }} scaleDown={0.96}>
      <View style={{ borderRadius: 16, overflow: "hidden", marginBottom: 10 }}>
        <CategoryCover difficulty={level} height={100} />
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
    </PressableScale>
  );
});

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
    discoveryHeader: {
      fontFamily: c.fontBodyBold,
      fontSize: 13,
      color: c.textSec,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 12,
    },
  });
}
