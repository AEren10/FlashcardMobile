/**
 * ExamHomeScreen — "Sınav Modu" ana sayfa.
 *
 * Tasarım:
 *   - HeroDashboard (streak, daily goal — paylaşımlı kullanıcı verileri)
 *   - ModeSegment (üstte Normal/Sınav toggle — şu an "Sınav" seçili)
 *   - Senin İçin (Random review + Favorites + Mistakes — paylaşımlı)
 *   - Sınava göre slider'lar: YDS, YÖKDİL, IELTS, TOEFL, YKS-DİL
 *     (DB'deki category='exam' listelerin title prefix'ine göre gruplanmış)
 *
 * Mod tercihi AsyncStorage'da '@fc:homeMode' altında tutulur.
 */
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector } from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getStudyStats } from "../../supabase/progress";
import { getMistakesList } from "../../supabase/mistakesList";
import { selectFavoriteWordIds } from "../../store/favoriteWordsSlice";
import { ICONS } from "../../components/design/Icon";
import SmartListCard from "../../components/design/SmartListCard";
import RandomReviewModal from "../../components/design/RandomReviewModal";
import ModeSegment from "../../components/design/ModeSegment";
import DiscoveryRow from "./components/DiscoveryRow";
import HeroDashboard from "./components/HeroDashboard";
import { SkeletonStatRow } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import usePublicLists from "../../hooks/usePublicLists";
import { EXAM_ORDER, EXAMS, matchExam } from "../../lib/examMeta";

const MODE_KEY = "@fc:homeMode";

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

export default function ExamHomeScreen({ navigation }) {
  const { c } = useTheme();
  const { isAuthenticated, getUserEmail } = useAuth();
  const { lists, loading, refreshing, refresh } = usePublicLists();
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [mistakesList, setMistakesList] = useState(null);
  const [randomReviewOpen, setRandomReviewOpen] = useState(false);
  const favoriteWordIds = useSelector(selectFavoriteWordIds);

  const s = useMemo(() => makeStyles(c), [c]);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const [statsRes, mistakesRes] = await Promise.all([
        getStudyStats().catch(() => null),
        getMistakesList().catch(() => null),
      ]);
      if (statsRes) setStats(statsRes);
      if (mistakesRes?.success) setMistakesList(mistakesRes.data);
    } catch {}
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
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
    (kind, opts) =>
      navigation.navigate("ListExplorer", { mode: kind, ...opts }),
    [navigation]
  );

  // Sadece exam kategorisindeki listeleri al
  const examLists = useMemo(
    () => lists.filter((l) => (l.category || "").toLowerCase() === "exam"),
    [lists]
  );

  // Title prefix'e göre sınava göre grupla
  const examSections = useMemo(() => {
    const buckets = {};
    for (const l of examLists) {
      const key = matchExam(l.title);
      if (!key) continue;
      (buckets[key] = buckets[key] || []).push(l);
    }
    return EXAM_ORDER.filter((key) => (buckets[key] || []).length > 0).map(
      (key) => ({ key, meta: EXAMS[key], items: buckets[key] })
    );
  }, [examLists]);

  // Mod değişimi → Normal'a dön
  const handleModeChange = useCallback(
    async (nextMode) => {
      if (nextMode === "normal") {
        await AsyncStorage.setItem(MODE_KEY, "normal").catch(() => {});
        navigation.replace("HomeMain");
      }
    },
    [navigation]
  );

  const userName = useMemo(() => {
    const email = getUserEmail?.();
    if (!email) return "Misafir";
    return email.split("@")[0];
  }, [getUserEmail]);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <FlameRefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          {loading ? (
            <View style={{ marginBottom: 4 }}>
              <SkeletonStatRow />
            </View>
          ) : (
            <HeroDashboard
              greeting={greeting()}
              userName={userName}
              streak={stats.streakDays}
              dailyDone={Math.min(10, stats.totalWords % 10)}
              dailyTotal={10}
              onStreakPress={() => navigation.navigate("Streak")}
              onGoalPress={() => navigation.navigate("Streak")}
            />
          )}

          <ModeSegment
            mode="exam"
            examCount={examLists.length}
            onChange={handleModeChange}
          />

          {/* Senin İçin — paylaşımlı */}
          {isAuthenticated() && (favoriteWordIds.length > 0 || mistakesList || stats.totalWords > 0) && (
            <View style={{ marginTop: 22 }}>
              <Text style={s.smartHeader}>Senin İçin</Text>
              {stats.totalWords > 0 && (
                <SmartListCard
                  iconPath={ICONS.refresh || ICONS.flame}
                  title="Bildiklerinden Tekrar"
                  subtitle="Sınav öncesi taze tutmak için rastgele eski kelimeler."
                  count={stats.totalWords}
                  accent={c.cobalt}
                  onPress={() => setRandomReviewOpen(true)}
                />
              )}
              {mistakesList && (
                <SmartListCard
                  iconPath={ICONS.target}
                  title={mistakesList.title}
                  subtitle="Sınav günü hatırlaman için takıldığın kelimeler."
                  count={mistakesList.word_count ?? 0}
                  accent={c.error}
                  pulse
                  onPress={() => openList(mistakesList)}
                />
              )}
            </View>
          )}

          {/* Sınav slider'ları — dinamik */}
          {examSections.length === 0 && !loading ? (
            <View style={[s.empty, { borderColor: c.border }]}>
              <Text style={[s.emptyTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                Sınav listeleri yükleniyor
              </Text>
              <Text style={[s.emptySub, { color: c.textSec, fontFamily: c.fontBody }]}>
                YDS, YÖKDİL, IELTS, TOEFL ve YKS-DİL setleri yakında bu sayfada listelenecek.
              </Text>
            </View>
          ) : (
            examSections.map((sec) => (
              <DiscoveryRow
                key={sec.key}
                title={sec.meta.name}
                subtitle={sec.meta.subtitle}
                items={sec.items}
                accent={sec.meta.accent}
                loading={loading}
                onItemPress={openList}
                onSeeAll={() =>
                  openExplorer("category", {
                    title: sec.meta.name,
                    category: "exam",
                    accent: sec.meta.accent,
                  })
                }
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>

      <RandomReviewModal
        visible={randomReviewOpen}
        onClose={() => setRandomReviewOpen(false)}
        navigation={navigation}
      />
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    smartHeader: {
      fontFamily: c.fontBodyBold,
      fontSize: 13,
      color: c.textSec,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    empty: {
      marginTop: 26,
      padding: 22,
      borderRadius: 18,
      borderWidth: 1,
      borderStyle: "dashed",
      alignItems: "center",
    },
    emptyTitle: { fontSize: 15, marginBottom: 6 },
    emptySub: { fontSize: 12, lineHeight: 18, textAlign: "center" },
  });
}
