/**
 * HomeScreen — Claude Design v2 spec.
 * Greeting + 2 stat box + glow challenge card + horizontal "Devam Et" carousel.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useAchievements } from "../../contexts/AchievementsContext";
import supabaseApiService from "../../services/supabaseApi";
import { getStudyStats } from "../../supabase/progress";
import { getMistakesList } from "../../supabase/mistakesList";
import { getTopLikedLists } from "../../supabase/social";
import { getDailyGoal } from "../../lib/dailyGoal";
import { selectFavoriteWordIds } from "../../store/favoriteWordsSlice";
import Icon, { ICONS } from "../../components/design/Icon";
import CategoryCover from "../../components/design/CategoryCover";
import StaggerEnter from "../../components/design/StaggerEnter";
import SmartListCard from "../../components/design/SmartListCard";
import PressableScale from "../../components/design/PressableScale";
import DiscoveryRow from "./components/DiscoveryRow";
import HeroDashboard from "./components/HeroDashboard";
import ContinueCard from "./components/ContinueCard";
import { pickGreeting } from "../../lib/greetings";
import { useProfile } from "../../contexts/ProfileContext";
import useMilestoneWatcher from "../../hooks/useMilestoneWatcher";
import MilestoneModal from "../../components/celebration/MilestoneModal";
import useBadgeWatcher from "../../hooks/useBadgeWatcher";
import AchievementModal from "../../components/design/AchievementModal";
import useNudge from "../../hooks/useNudge";
import NudgeModal from "../../components/design/NudgeModal";
import { getKnownWordsCount } from "../../supabase/progress";
import HomeSearchBar from "./components/HomeSearchBar";
import LevelMiniCard from "./components/LevelMiniCard";
import RandomReviewModal from "../../components/design/RandomReviewModal";
import ModeSegment from "../../components/design/ModeSegment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SkeletonContinueCard, SkeletonStatRow } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import usePublicLists from "../../hooks/usePublicLists";
import {
  DISCOVERY_CATEGORIES,
  normalizeCategorySlug,
  getCategoryMeta,
} from "../../lib/categoryMeta";

const DAILY_TOTAL = 10;

// greeting() artık pickGreeting() ile değişti (saat + streak-aware havuz, lib/greetings.js)


export default function HomeScreen({ navigation }) {
  const { c } = useTheme();
  const { isAuthenticated, getUserEmail } = useAuth();
  const { lists, loading: listsLoading, refreshing, refresh } = usePublicLists();
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [mistakesList, setMistakesList] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [randomReviewOpen, setRandomReviewOpen] = useState(false);
  const [trendingLists, setTrendingLists] = useState([]);
  const [daily, setDaily] = useState({ goal: 10, done: 0, pct: 0, completed: false });
  const favoriteWordIds = useSelector(selectFavoriteWordIds);
  const { syncStats: syncAchievements } = useAchievements();
  const loading = listsLoading || authLoading;

  const s = useMemo(() => makeStyles(c), [c]);

  const [dataError, setDataError] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated()) {
      setAuthLoading(false);
      return;
    }
    try {
      const [statsRes, mistakesRes] = await Promise.allSettled([
        getStudyStats(),
        getMistakesList(),
      ]);

      const statsOk = statsRes.status === "fulfilled" && statsRes.value;
      const mistakesOk = mistakesRes.status === "fulfilled";

      // Her ikisi de fail olduysa kullanıcıya bilgi ver — kısmi veri sessiz devam etsin
      setDataError(!statsOk && !mistakesOk);

      if (statsOk) {
        setStats(statsRes.value);
        const accuracy = statsRes.value.totalSessions
          ? Math.round((statsRes.value.totalWords / Math.max(statsRes.value.totalSessions * 10, 1)) * 100)
          : 0;
        syncAchievements({
          streakDays: statsRes.value.streakDays || 0,
          totalWords: statsRes.value.totalWords || 0,
          totalSessions: statsRes.value.totalSessions || 0,
          accuracy,
          favoritedWords: favoriteWordIds.length,
        });
      }
      if (mistakesOk && mistakesRes.value?.success) setMistakesList(mistakesRes.value.data);
    } finally {
      setAuthLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, favoriteWordIds.length, syncAchievements]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  // Trending (en çok like alan) listeleri yükle — sosyal proof
  useEffect(() => {
    let mounted = true;
    getTopLikedLists(8)
      .then((r) => {
        if (mounted && r.success) setTrendingLists(r.data || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Daily goal — focus geldiğinde yenile (oturum sonrası güncel kalsın)
  useFocusEffect(
    useCallback(() => {
      getDailyGoal(10).then(setDaily).catch(() => {});
    }, [])
  );

  const { profile } = useProfile();
  // Önce display_name (EditProfile'da yazdığı isim), yoksa email'den ilk parça
  const userName =
    profile?.display_name?.trim() ||
    (getUserEmail() || "").split("@")[0] ||
    "Hoşgeldin";
  const streak = stats.streakDays || 0;
  const dailyDone = Math.min(stats.totalWords || 0, DAILY_TOTAL);
  const greetingPair = useMemo(
    () => pickGreeting({ name: userName, streak }),
    [userName, streak]
  );

  // Milestone watcher — ilk-X anları
  const milestoneStats = useMemo(
    () => ({
      totalWords: stats.totalWords || 0,
      streakDays: stats.streakDays || 0,
      listsCompleted: stats.listsCompleted || 0,
      perfectQuizCount: stats.perfectQuizCount || 0,
      favoriteWordsCount: favoriteWordIds.length || 0,
    }),
    [stats.totalWords, stats.streakDays, stats.listsCompleted, stats.perfectQuizCount, favoriteWordIds.length]
  );
  const { current: currentMilestone, dismiss: dismissMilestone } =
    useMilestoneWatcher(milestoneStats);

  // Streak/Words rozet watcher — yeni rozet kazanılınca AchievementModal
  const { newBadge, dismiss: dismissBadge } = useBadgeWatcher({
    streakDays: stats.streakDays || 0,
    totalWords: stats.totalWords || 0,
  });

  // Bilinen kelime sayısı — Nudge için
  const [knownWordsCount, setKnownWordsCount] = useState(0);
  useEffect(() => {
    if (!isAuthenticated()) return;
    getKnownWordsCount().then(setKnownWordsCount).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.totalWords]);

  // Tatlı öneri pop-up — kullanıcı arada bir görsün
  const mistakesCount = mistakesList?.word_count || 0;
  const { nudge, accept: acceptNudge, dismiss: dismissNudge } = useNudge({
    stats,
    mistakesCount,
    knownCount: knownWordsCount,
    ready: !loading && !authLoading,
  });

  // Modal flicker fix: bir modal dismiss olduğunda 320ms bekle, sonraki açılır
  const [overlayLocked, setOverlayLocked] = useState(false);
  const lockedDismiss = (fn) => () => {
    fn?.();
    setOverlayLocked(true);
    setTimeout(() => setOverlayLocked(false), 320);
  };

  const handleNudgeAccept = async () => {
    const action = await acceptNudge();
    if (action === "open_random_review") {
      setRandomReviewOpen(true);
    } else if (action === "open_challenge") {
      startChallenge();
    } else if (action === "open_mistakes" && mistakesList?.id) {
      navigation.navigate("FlashcardDetail", {
        listId: mistakesList.id,
        listTitle: "Bilemediğin Kelimeler",
      });
    }
  };

  const startChallenge = () => {
    if (!lists.length) return;
    // 1-tap Çalış: recent list varsa ilk recent'i öncelikli aç,
    // yoksa popüler/yeni listelerden random pick (kullanıcı sürpriz alır)
    const recent = recentLists?.[0];
    const pick = recent || lists[Math.floor(Math.random() * Math.min(lists.length, 5))];
    navigation.navigate("Study", { listId: pick.id, listTitle: pick.title });
  };

  const recentLists = useMemo(() => lists.slice(0, 5), [lists]);
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

  // Kategorileri bir kez grupla — DB'den gelen kategorileri canonical slug'a normalize et
  const categoryMap = useMemo(() => {
    const map = {};
    for (const l of lists) {
      const slug = normalizeCategorySlug(l.category);
      if (!slug || slug === "other") continue;
      (map[slug] = map[slug] || []).push(l);
    }
    return map;
  }, [lists]);

  // DB'de gerçekten veri olan kategoriler — DISCOVERY_CATEGORIES sırasına göre.
  // Normal modda "exam" slider'ını GİZLE — Sınav modunda ayrı sayfa var.
  // Az dolu kategoriler (1 liste) "Karışık" sliderına havuzlanır — sayfa boş hissetmesin.
  const DENSE_MIN = 2;
  const discoverySections = useMemo(() => {
    const candidates = DISCOVERY_CATEGORIES.filter((slug) => slug !== "exam");
    const dense = [];
    const sparseItems = [];
    for (const slug of candidates) {
      const arr = categoryMap[slug] || [];
      if (arr.length >= DENSE_MIN) {
        dense.push({
          slug,
          meta: getCategoryMeta(slug),
          items: arr.slice(0, 8),
        });
      } else if (arr.length > 0) {
        // 1 listesi olan kategorilerin tek listesi "Karışık" havuzuna gider
        sparseItems.push(...arr);
      }
    }

    const sections = [...dense];
    if (sparseItems.length > 0) {
      sections.push({
        slug: "mixed",
        meta: {
          name: "Karışık Konular",
          subtitle: "Farklı kategorilerden seçmeler",
          accent: "#C8A96E",
        },
        items: sparseItems.slice(0, 12),
      });
    }
    return sections;
  }, [categoryMap]);

  // ModeSegment'in "Sınav" badge'i için: exam kategorisindeki liste sayısı
  const examCount = useMemo(() => (categoryMap.exam || []).length, [categoryMap]);

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
              title="Yenile"
            />
          }
        >
          {/* Bağlantı sorunu banner — istatistikler yüklenemediyse */}
          {dataError && !loading && (
            <Pressable
              onPress={() => loadUserData()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: c.warning + "1A",
                borderWidth: 1,
                borderColor: c.warning + "55",
                marginBottom: 14,
              }}
            >
              <Text style={{ flex: 1, color: c.warning, fontFamily: c.fontBodySemi, fontSize: 12 }}>
                İstatistikler yüklenemedi — yenilemek için dokun
              </Text>
              <Text style={{ color: c.warning, fontSize: 14 }}>↻</Text>
            </Pressable>
          )}

          {/* Hero Dashboard — animasyonlu canlı üst alan */}
          {loading ? (
            <View style={{ marginBottom: 4 }}>
              <SkeletonStatRow />
            </View>
          ) : (
            <HeroDashboard
              greeting={greetingPair.headline}
              greetingSub={greetingPair.subline}
              userName={userName}
              streak={streak}
              dailyDone={dailyDone}
              dailyTotal={DAILY_TOTAL}
              onStreakPress={() => navigation.navigate("Streak")}
              onGoalPress={startChallenge}
            />
          )}

          {/* ModeSegment (Normal/Sınav toggle) askıya alındı — kullanıcı tasarım eleştirisinde
              "üst kalabalık" dedi. Exam modu Profile menüsünden veya ayrı bir entry'den
              erişilebilir hale getirilebilir. ModeSegment component kalıyor. */}

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
              <Text style={s.chipAccentTxt}>BUGÜN</Text>
            </View>
            <Text style={s.challengeTitle}>
              {recentLists.length > 0 ? "Hemen Çalış" : "5 Yeni Kelime Öğren"}
            </Text>
            <Text style={s.challengeSub} numberOfLines={1}>
              {recentLists.length > 0
                ? `📚 ${recentLists[0]?.title || "Devam Et"}`
                : "~2 dakika · kolay tempo"}
            </Text>
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

          {/* Daily goal chip — mint glow (canlı renk, accent overload'dan kaçınma) */}
          {!loading && isAuthenticated() && (
            <View
              style={{
                marginTop: 14,
                marginBottom: 4,
                padding: 16,
                borderRadius: 16,
                backgroundColor: daily.completed ? c.success + "26" : (c.mint || c.cobalt) + "26",
                borderWidth: 1.5,
                borderColor: daily.completed ? c.success + "AA" : (c.mint || c.cobalt) + "AA",
                shadowColor: daily.completed ? c.success : (c.mint || c.cobalt),
                shadowOpacity: 0.45,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 6,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 16 }}>{daily.completed ? "✅" : "🎯"}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.textPrimary, fontFamily: c.fontBodyBold, fontSize: 13 }}>
                    {daily.completed ? "Bugünün hedefi tamam!" : "Bugünün hedefi"}
                  </Text>
                  <Text style={{ color: c.textSec, fontFamily: c.fontBody, fontSize: 11, marginTop: 2 }}>
                    {daily.done} / {daily.goal} kelime
                  </Text>
                </View>
                <Text style={{
                  color: daily.completed ? c.success : (c.mint || c.cobalt),
                  fontFamily: c.fontBodyBold,
                  fontSize: 16,
                }}>
                  %{daily.pct}
                </Text>
              </View>
              {/* Progress bar */}
              <View style={{ height: 4, marginTop: 10, backgroundColor: c.bgSurface, borderRadius: 99, overflow: "hidden" }}>
                <View style={{
                  width: `${daily.pct}%`,
                  height: "100%",
                  backgroundColor: daily.completed ? c.success : (c.mint || c.cobalt),
                  borderRadius: 99,
                }} />
              </View>
            </View>
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
            <PressableScale
              onPress={() =>
                navigation.getParent()?.navigate("MyLists", { screen: "MyListsMain" })
              }
              style={s.emptyCta}
              scaleDown={0.97}
              accessibilityLabel="Kütüphaneye git"
            >
              <LinearGradient
                colors={[c.accentGlow, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[s.emptyCtaIcon, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
                <Icon d={ICONS.plus} size={22} stroke={c.accent} sw={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.emptyCtaTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                  Henüz liste yok
                </Text>
                <Text style={[s.emptyCtaSub, { color: c.textSec, fontFamily: c.fontBody }]}>
                  Hazır listelerden birini seç veya kendi listeni oluştur.
                </Text>
              </View>
              <Icon d={ICONS.arrow} size={18} stroke={c.accent} sw={2} />
            </PressableScale>
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
                    imageUrl={item.image_url}
                    c={c}
                    onPress={() => openList(item)}
                  />
                </StaggerEnter>
              ))}
            </ScrollView>
          )}

          {/* Senin İçin — kişisel akıllı kartlar */}
          {isAuthenticated() && (
            <View style={{ marginTop: 26 }}>
              <Text style={s.discoveryHeader}>Senin İçin</Text>

              {/* Bildiklerinden Tekrar — herkese görünür (auth varsa) */}
              {stats.totalWords > 0 && (
                <SmartListCard
                  iconPath={ICONS.refresh || ICONS.flame}
                  title="Bildiklerinden Tekrar"
                  subtitle="Rastgele eski kelimeler — unutmadan tazele."
                  count={stats.totalWords}
                  accent={c.cobalt}
                  onPress={() => setRandomReviewOpen(true)}
                />
              )}

              {/* Favori Kelimelerim SmartCard askıya alındı — MyLists "Favoriler" sekmesinde
                  ve sticky bookmark butonlarında zaten erişilebilir. HomeScreen sadelik için çıkarıldı. */}
              {mistakesList && (
                <SmartListCard
                  iconPath={ICONS.target}
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

          {/* Trending — en çok beğenilen listeler (sosyal proof) */}
          {trendingLists.length > 0 && (
            <DiscoveryRow
              title="🔥 Trend"
              subtitle="Topluluğun en çok beğendiği listeler"
              items={trendingLists}
              accent={c.rose || c.coral}
              loading={false}
              onItemPress={openList}
              onSeeAll={() =>
                openExplorer("popular", { title: "Trend", accent: c.rose || c.coral })
              }
            />
          )}

          {/* Popüler listeler */}
          <DiscoveryRow
            title="Popüler"
            subtitle="En çok çalışılan listeler"
            items={popularLists}
            accent={c.warning}
            loading={loading}
            onItemPress={openList}
            onSeeAll={() =>
              openExplorer("popular", { title: "Popüler", accent: c.warning })
            }
          />

          {/* Kategorik slider'lar — DB'deki dolu kategorilerden DINAMIK render.
              Boş kategori otomatik gizlenir (DiscoveryRow zaten null döner). */}
          {discoverySections.map((sec) => (
            <DiscoveryRow
              key={sec.slug}
              title={sec.meta.name}
              subtitle={sec.meta.subtitle}
              items={sec.items}
              accent={sec.meta.accent}
              loading={loading}
              onItemPress={openList}
              onSeeAll={() => {
                if (sec.slug === "mixed") {
                  openExplorer("newest", {
                    title: sec.meta.name,
                    accent: sec.meta.accent,
                  });
                } else {
                  openExplorer("category", {
                    title: sec.meta.name,
                    category: sec.slug,
                    accent: sec.meta.accent,
                  });
                }
              }}
            />
          ))}

          {/* "Yeni Eklendi" row askıya alındı — Trend + Popüler zaten yeni'leri kapsıyor.
              "Tüm yeni" istek olursa Explore'da newest filter zaten var. */}
        </ScrollView>
      </SafeAreaView>

      <RandomReviewModal
        visible={randomReviewOpen}
        onClose={() => setRandomReviewOpen(false)}
        navigation={navigation}
      />

      {/* Overlay sırası — aynı anda sadece 1 modal görünsün.
          Priority: milestone (en zengin) > achievement > nudge */}
      <MilestoneModal
        milestone={currentMilestone}
        visible={!!currentMilestone && !overlayLocked}
        onDismiss={lockedDismiss(dismissMilestone)}
      />
      <AchievementModal
        visible={!currentMilestone && !!newBadge && !overlayLocked}
        badge={newBadge}
        onClose={lockedDismiss(dismissBadge)}
      />
      <NudgeModal
        visible={!currentMilestone && !newBadge && !!nudge && !overlayLocked}
        nudge={nudge}
        onAccept={handleNudgeAccept}
        onDismiss={lockedDismiss(dismissNudge)}
      />
    </View>
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
    challengeCard: {
      marginTop: 16,
      borderRadius: 20,
      padding: 22,
      borderWidth: 1.5,
      borderColor: c.accent + "66",
      overflow: "hidden",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 40,
      elevation: 8,
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
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.32,
      shadowRadius: 14,
      elevation: 6,
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
      fontSize: 22,
      lineHeight: 26,
      color: c.textPrimary,
      letterSpacing: 0.1,
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
    emptyCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.borderAccent,
      backgroundColor: c.bgElevated,
      marginTop: 8,
      overflow: "hidden",
    },
    emptyCtaIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyCtaTitle: {
      fontSize: 15,
    },
    emptyCtaSub: {
      fontSize: 12,
      marginTop: 3,
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
