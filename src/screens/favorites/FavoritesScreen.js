/**
 * FavoritesScreen → Çalış (Study tab) — Claude Design v2.
 * Segmented: Bugün · Zor Kelimeler · Quiz
 *
 * Bugün:    Hero "X kelime bugün hazır" + kategoriler (Yeni/Tekrar/Unutulmuş)
 * Zor:      lapses ≥ 2 olan kelimeler — mini progress
 * Quiz:     2 kolon grid, liste cover'ları
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { getDueCount, getCategorizedDueWords } from "../../supabase/progress";
import { getHardWords } from "../../supabase/views";
import usePublicLists from "../../hooks/usePublicLists";
import Segmented from "../../components/design/Segmented";
import CategoryCover from "../../components/design/CategoryCover";
import Icon, { ICONS } from "../../components/design/Icon";
import EmptyState from "../../components/EmptyState";
import { Skeleton, SkeletonListItem } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import StaggerEnter from "../../components/design/StaggerEnter";

const TABS = ["Bugün", "Zor Kelimeler", "Quiz"];


export default function FavoritesScreen() {
  const { c } = useTheme();
  const navigation = useNavigation();
  const [tab, setTab] = useState("Bugün");
  const [dueCount, setDueCount] = useState(0);
  const { lists, loading: listsLoading, refresh: refreshLists } = usePublicLists();
  const [hardWords, setHardWords] = useState([]);
  const [categories, setCategories] = useState({
    newWords: [],
    reviewWords: [],
    lapsedWords: [],
  });
  const [otherLoading, setOtherLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loading = listsLoading || otherLoading;

  const s = useMemo(() => makeStyles(c), [c]);

  const load = useCallback(async () => {
    try {
      const [due, hard, cats] = await Promise.all([
        getDueCount().catch(() => 0),
        getHardWords().catch(() => []),
        getCategorizedDueWords().catch(() => ({ newWords: [], reviewWords: [], lapsedWords: [] })),
      ]);
      setDueCount(due || 0);
      setHardWords(Array.isArray(hard) ? hard : []);
      setCategories(cats);
    } finally {
      setOtherLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([load(), refreshLists?.()].filter(Boolean));
  }, [load, refreshLists]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<FlameRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={s.title}>Çalış</Text>

          <Segmented
            items={TABS}
            value={tab}
            onChange={(v) => {
              Haptics.selectionAsync();
              setTab(v);
            }}
          />

          {loading ? (
            <View style={{ marginTop: 18, gap: spacing.md }}>
              <Skeleton height={130} radius={20} />
              <Skeleton width="40%" height={14} radius={6} style={{ marginTop: 10 }} />
              {[0, 1, 2].map((i) => (
                <SkeletonListItem key={i} />
              ))}
            </View>
          ) : (
            <View style={{ marginTop: 18 }}>
              {tab === "Bugün" && (
                <BugunTab
                  dueCount={dueCount}
                  categories={categories}
                  c={c}
                  s={s}
                  navigation={navigation}
                  lists={lists}
                />
              )}
              {tab === "Zor Kelimeler" && (
                <ZorTab
                  hardWords={hardWords}
                  lapsedWords={categories.lapsedWords}
                  c={c}
                  s={s}
                  navigation={navigation}
                />
              )}
              {tab === "Quiz" && <QuizTab lists={lists} c={c} s={s} navigation={navigation} />}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BugunTab({ dueCount, categories, c, s, navigation, lists }) {
  const { newWords, reviewWords, lapsedWords } = categories;
  const totalReady =
    dueCount || newWords.length + reviewWords.length + lapsedWords.length;

  const startWith = (words, title) => {
    if (!words?.length) {
      // Fallback: mevcut listelerin ilkinden başla
      if (lists.length) {
        const pick = lists[0];
        navigation.navigate("Study", { listId: pick.id, listTitle: pick.title });
      }
      return;
    }
    navigation.navigate("Study", {
      presetWords: words,
      presetTitle: title,
      presetMode: "srs",
    });
  };

  const startMixed = () => {
    const all = [...newWords, ...reviewWords, ...lapsedWords];
    if (all.length) startWith(all, "Bugünün Karması");
    else if (lists.length) {
      const pick = lists[0];
      navigation.navigate("Study", { listId: pick.id, listTitle: pick.title });
    }
  };

  return (
    <>
      {/* Hero card */}
      <Pressable onPress={startMixed} style={s.heroCard}>
        <LinearGradient
          colors={[c.bgElevated, c.bgSurface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.heroGlow} />
        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius.lg }]}
          pointerEvents="none"
        />
        <Text style={s.heroNum}>{totalReady}</Text>
        <Text style={s.heroLabel}>
          {totalReady === 0
            ? "henüz kelime yok — listeden başla"
            : "kelime bugün hazır"}
        </Text>
        <View style={s.heroCTA}>
          <Text style={s.heroCTATxt}>Çalışmaya Başla</Text>
          <Icon d={ICONS.arrow} size={18} stroke={c.textOnAccent} sw={2.2} />
        </View>
      </Pressable>

      <Text style={s.sectionTitle}>Kategoriler</Text>
      <StaggerEnter index={0} delay={70}>
        <DueRow
          label="Yeni"
          sub="Hiç görmediğin kelimeler"
          count={newWords.length}
          color={c.cobalt}
          icon={ICONS.plus}
          c={c}
          s={s}
          onPress={() => startWith(newWords, "Yeni Kelimeler")}
        />
      </StaggerEnter>
      <StaggerEnter index={1} delay={70}>
        <DueRow
          label="Tekrar"
          sub="SRS aralığı dolan kelimeler"
          count={reviewWords.length}
          color={c.accent}
          icon={ICONS.bolt}
          c={c}
          s={s}
          onPress={() => startWith(reviewWords, "Tekrar")}
        />
      </StaggerEnter>
      <StaggerEnter index={2} delay={70}>
        <DueRow
          label="Unutulmuş"
          sub="Daha önce yanlış cevapladığın"
          count={lapsedWords.length}
          color={c.error}
          icon={ICONS.flame}
          c={c}
          s={s}
          onPress={() => startWith(lapsedWords, "Unutulmuş Kelimeler")}
        />
      </StaggerEnter>
    </>
  );
}

function ZorTab({ hardWords, c, s, lapsedWords, navigation }) {
  // hardWords view: lapses>=2. Client fallback: lapses>=1 olanlar (categorize'dan)
  const combined = useMemo(() => {
    const map = new Map();
    [...(hardWords || []), ...(lapsedWords || [])].forEach((w) => {
      if (!w?.id) return;
      const existing = map.get(w.id);
      // Daha yüksek lapses olanı tut
      if (!existing || (w.lapses ?? 0) > (existing.lapses ?? 0)) {
        map.set(w.id, w);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => (b.lapses ?? 0) - (a.lapses ?? 0)
    );
  }, [hardWords, lapsedWords]);

  if (!combined.length) {
    return (
      <View style={{ minHeight: 420, paddingTop: spacing.xl }}>
        <View style={[s.emptyHelper, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
          <View style={{ alignItems: "center", marginBottom: 10 }}><Icon d={ICONS.target} size={32} stroke={c.accent} sw={1.5} /></View>
          <Text style={[s.emptyTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
            Henüz zor kelimen yok
          </Text>
          <Text style={[s.emptyDesc, { color: c.textSec, fontFamily: c.fontBody }]}>
            Bir kelimeyi quiz veya çalışma sırasında{" "}
            <Text style={{ color: c.error, fontFamily: c.fontBodyBold }}>yanlış cevapladığında</Text>{" "}
            burada birikir. SRS, bu kelimeleri sık aralıklarla tekrar gösterir.
          </Text>
          <Pressable
            onPress={() => navigation.getParent()?.navigate("MyLists")}
            style={({ pressed }) => [
              s.emptyCta,
              { backgroundColor: c.accent, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[s.emptyCtaTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
              Bir Listeye Başla
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const startStudy = () => {
    navigation.navigate("Study", {
      presetWords: combined,
      presetTitle: "Zor Kelimeler",
      presetMode: "srs",
    });
  };

  return (
    <View>
      <Pressable onPress={startStudy} style={[s.zorCta, { backgroundColor: c.accent }]}>
        <Text style={[s.zorCtaTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
          {combined.length} zor kelimeyi şimdi çalış
        </Text>
      </Pressable>
      {combined.slice(0, 30).map((w) => (
        <View key={w.id} style={s.hardCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.hardWord}>{w.word}</Text>
            <Text style={s.hardMeaning}>{w.meaning}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row", gap: 3 }}>
              {Array.from({ length: 4 }).map((_, k) => (
                <View
                  key={k}
                  style={[
                    s.hardDot,
                    { backgroundColor: k < (w.lapses || 0) ? c.error : c.bgSurface },
                  ]}
                />
              ))}
            </View>
            <Text style={[s.hardMiss, { color: c.error }]}>
              {w.lapses ?? 0}× yanlış
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function QuizTab({ lists, c, s, navigation }) {
  if (!lists.length) {
    return (
      <View style={{ minHeight: 420 }}>
        <EmptyState
          kind="list"
          title="Quiz için liste lazım"
          subtitle="Kütüphane'den bir liste seç veya kendi listeni oluştur."
          actionLabel="Kütüphaneye Git"
          onAction={() => navigation.getParent()?.navigate("MyLists")}
        />
      </View>
    );
  }
  return (
    <View style={s.quizGrid}>
      {lists.slice(0, 10).map((l) => (
        <Pressable
          key={String(l.id)}
          style={s.quizCard}
          onPress={() => navigation.navigate("Quiz", { listId: l.id, listTitle: l.title })}
        >
          <CategoryCover difficulty={l.level} imageUrl={l.image_url} height={70} />
          <View style={{ padding: 14 }}>
            <Text style={s.quizTitle} numberOfLines={1}>
              {l.title}
            </Text>
            <Text style={s.quizSub}>{l.word_count ?? "?"} kelime</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function DueRow({ label, sub, count, color, icon, c, s, onPress }) {
  const disabled = count === 0;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.dueRow,
        {
          opacity: disabled ? 0.55 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          borderColor: pressed ? color + "55" : c.border,
        },
      ]}
    >
      <View style={[s.dueIcon, { backgroundColor: color + "22" }]}>
        <Icon d={icon} size={20} stroke={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.dueLabel}>{label}</Text>
        {!!sub && <Text style={[s.dueSub, { color: c.textMuted }]}>{sub}</Text>}
      </View>
      <Text style={[s.dueCount, { color: disabled ? c.textMuted : color }]}>
        {count}
      </Text>
      {!disabled && (
        <Icon d={ICONS.arrow} size={16} stroke={color} sw={2} />
      )}
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    title: {
      fontFamily: c.fontDisplay,
      fontSize: 34,
      color: c.textPrimary,
      marginBottom: 18,
    },

    heroCard: {
      borderRadius: radius.lg,
      padding: spacing.xxl,
      borderWidth: 1,
      borderColor: c.borderAccent,
      overflow: "hidden",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 40,
      elevation: 6,
    },
    heroGlow: {
      position: "absolute",
      top: -50,
      right: -40,
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: c.accentGlow,
    },
    heroNum: {
      fontFamily: c.fontNum,
      fontSize: 46,
      lineHeight: 50,
      color: c.accent,
    },
    heroLabel: {
      fontFamily: c.fontBodyBold,
      fontSize: 20,
      color: c.textPrimary,
      marginTop: 2,
    },
    heroCTA: {
      marginTop: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: c.accent,
      borderRadius: radius.sm,
      paddingVertical: 14,
    },
    heroCTATxt: { fontFamily: c.fontBodyBold, fontSize: 15, color: c.textOnAccent },

    sectionTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 18,
      color: c.textPrimary,
      marginTop: spacing.xxl,
      marginBottom: spacing.md,
    },

    dueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 14,
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    dueIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    dueLabel: { fontFamily: c.fontBodySemi, fontSize: 15, color: c.textPrimary },
    dueSub: { fontFamily: c.fontBody, fontSize: 11, color: c.textMuted, marginTop: 2 },
    dueCount: { fontFamily: c.fontNum, fontSize: 20, color: c.textPrimary, marginRight: spacing.xs },

    hardCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.lg,
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    emptyHelper: {
      borderRadius: radius.md,
      borderWidth: 1,
      padding: spacing.xxl,
      margin: spacing.xl,
    },
    emptyTitle: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 10,
    },
    emptyDesc: {
      fontSize: 13,
      lineHeight: 19,
      textAlign: "center",
    },
    emptyCta: {
      marginTop: 18,
      alignSelf: "stretch",
      paddingVertical: spacing.md,
      borderRadius: radius.sm,
      alignItems: "center",
    },
    emptyCtaTxt: {
      fontSize: 14,
      letterSpacing: 0.3,
    },
    zorCta: {
      paddingVertical: 14,
      borderRadius: radius.md,
      alignItems: "center",
      marginBottom: 14,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 4,
    },
    zorCtaTxt: {
      fontSize: 14,
      letterSpacing: 0.3,
    },
    hardWord: { fontFamily: c.fontBodyBold, fontSize: 16, color: c.textPrimary },
    hardMeaning: { fontFamily: c.fontBody, fontSize: 12, color: c.textSec, marginTop: 2 },
    hardDot: { width: 7, height: 7, borderRadius: 4 },
    hardMiss: { fontFamily: c.fontBody, fontSize: 11, marginTop: 5 },

    quizGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
    quizCard: {
      width: "47.5%",
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    quizTitle: { fontFamily: c.fontBodySemi, fontSize: 14, color: c.textPrimary },
    quizSub: { fontFamily: c.fontBody, fontSize: 11, color: c.textSec, marginTop: 3 },

    emptyTitle: { fontSize: 16, marginTop: 14 },
    emptySub: { fontSize: 13, marginTop: 6, textAlign: "center", maxWidth: 240, paddingHorizontal: spacing.xl },
  });
}
