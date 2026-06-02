/**
 * FavoritesScreen → Çalış (Study tab) — Claude Design v2.
 * Segmented: Bugün · Zor Kelimeler · Quiz
 *
 * Bugün:    Hero "X kelime bugün hazır" + kategoriler (Yeni/Tekrar/Unutulmuş)
 * Zor:      lapses ≥ 2 olan kelimeler — mini progress
 * Quiz:     2 kolon grid, liste cover'ları
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import supabaseApiService from "../../services/supabaseApi";
import { getDueCount } from "../../supabase/progress";
import Segmented from "../../components/design/Segmented";
import CategoryCover from "../../components/design/CategoryCover";
import Icon, { ICONS } from "../../components/design/Icon";
import EmptyState from "../../components/EmptyState";

const TABS = ["Bugün", "Zor Kelimeler", "Quiz"];


export default function FavoritesScreen() {
  const { c } = useTheme();
  const navigation = useNavigation();
  const [tab, setTab] = useState("Bugün");
  const [dueCount, setDueCount] = useState(0);
  const [lists, setLists] = useState([]);
  const [hardWords, setHardWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const s = useMemo(() => makeStyles(c), [c]);

  const load = useCallback(async () => {
    try {
      const [due, pub, hard] = await Promise.all([
        getDueCount().catch(() => 0),
        supabaseApiService.getAllPublicLists().catch(() => ({ success: false })),
        supabaseApiService.getHardWords?.().catch?.(() => ({ success: false })) ?? Promise.resolve({ success: false }),
      ]);
      setDueCount(due || 0);
      if (pub.success) setLists(pub.data || []);
      if (hard?.success) setHardWords(hard.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
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
            <ActivityIndicator color={c.accent} style={{ marginTop: 60 }} />
          ) : (
            <View style={{ marginTop: 18 }}>
              {tab === "Bugün" && (
                <BugunTab dueCount={dueCount} c={c} s={s} navigation={navigation} lists={lists} />
              )}
              {tab === "Zor Kelimeler" && <ZorTab hardWords={hardWords} c={c} s={s} />}
              {tab === "Quiz" && <QuizTab lists={lists} c={c} s={s} navigation={navigation} />}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BugunTab({ dueCount, c, s, navigation, lists }) {
  const startSrs = () => {
    if (lists.length) {
      const pick = lists[0];
      navigation.navigate("Study", { listId: pick.id, listTitle: pick.title });
    } else {
      navigation.navigate("HardWords");
    }
  };
  return (
    <>
      {/* Hero card */}
      <Pressable onPress={startSrs} style={s.heroCard}>
        <LinearGradient
          colors={[c.bgElevated, c.bgSurface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.heroGlow} />
        {/* Top edge highlight — premium depth */}
        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
          pointerEvents="none"
        />
        <Text style={s.heroNum}>{dueCount || 12}</Text>
        <Text style={s.heroLabel}>kelime bugün hazır</Text>
        <View style={s.heroCTA}>
          <Text style={s.heroCTATxt}>Çalışmaya Başla</Text>
          <Icon d={ICONS.arrow} size={18} stroke={c.textOnAccent} sw={2.2} />
        </View>
      </Pressable>

      <Text style={s.sectionTitle}>Kategoriler</Text>
      <DueRow label="Yeni" count={5} color={c.cobalt} icon={ICONS.plus} c={c} s={s} />
      <DueRow label="Tekrar" count={4} color={c.accent} icon={ICONS.bolt} c={c} s={s} />
      <DueRow label="Unutulmuş" count={3} color={c.error} icon={ICONS.flame} c={c} s={s} />
    </>
  );
}

function ZorTab({ hardWords, c, s }) {
  if (!hardWords.length) {
    return (
      <View style={{ minHeight: 420 }}>
        <EmptyState
          kind="search"
          title="Henüz zor kelime yok"
          subtitle="Çalışmaya devam et, zorlandığın kelimeler burada listelenecek."
        />
      </View>
    );
  }
  return (
    <View>
      {hardWords.slice(0, 20).map((w) => (
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
                    {
                      backgroundColor: k < (w.lapses || 0) ? c.error : c.bgSurface,
                    },
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
          <CategoryCover difficulty={l.level} height={70} />
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

function DueRow({ label, count, color, icon, c, s }) {
  return (
    <View style={s.dueRow}>
      <View style={[s.dueIcon, { backgroundColor: color + "22" }]}>
        <Icon d={icon} size={20} stroke={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.dueLabel}>{label}</Text>
      </View>
      <Text style={s.dueCount}>{count}</Text>
    </View>
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
      borderRadius: 20,
      padding: 24,
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
      gap: 8,
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 14,
    },
    heroCTATxt: { fontFamily: c.fontBodyBold, fontSize: 15, color: c.textOnAccent },

    sectionTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 18,
      color: c.textPrimary,
      marginTop: 24,
      marginBottom: 12,
    },

    dueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 14,
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    dueIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    dueLabel: { fontFamily: c.fontBodySemi, fontSize: 15, color: c.textPrimary },
    dueCount: { fontFamily: c.fontNum, fontSize: 20, color: c.textPrimary },

    hardCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    hardWord: { fontFamily: c.fontBodyBold, fontSize: 16, color: c.textPrimary },
    hardMeaning: { fontFamily: c.fontBody, fontSize: 12, color: c.textSec, marginTop: 2 },
    hardDot: { width: 7, height: 7, borderRadius: 4 },
    hardMiss: { fontFamily: c.fontBody, fontSize: 11, marginTop: 5 },

    quizGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    quizCard: {
      width: "47.5%",
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    quizTitle: { fontFamily: c.fontBodySemi, fontSize: 14, color: c.textPrimary },
    quizSub: { fontFamily: c.fontBody, fontSize: 11, color: c.textSec, marginTop: 3 },

    emptyTitle: { fontSize: 16, marginTop: 14 },
    emptySub: { fontSize: 13, marginTop: 6, textAlign: "center", maxWidth: 240, paddingHorizontal: 20 },
  });
}
