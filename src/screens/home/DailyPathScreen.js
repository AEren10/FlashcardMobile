/**
 * DailyPathScreen — Günün Yolu.
 * Bugün yapılacak adımlar: yeni kelime, quiz, hata tekrar, favori gözden geçir.
 * Her adım tamamlandıkça çizgi ilerler + kutlama animasyonu.
 *
 * Görevler ekran DIŞINDAKİ aktivitelerden de beslenir (useStudyEngine → incrementDailyGoal).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fontSize, radius, spacing } from "../../themes/tokens";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { getDailyGoal } from "../../lib/dailyGoal";
import { getMistakesList } from "../../supabase/mistakesList";
import Icon, { ICONS } from "../../components/design/Icon";
import { getCached, setCache } from "../../lib/dataCache";

const BASE_STEPS = [
  { key: "study", title: "Yeni Kelime Öğren", icon: ICONS.books, color: "#4A90D8", action: "study" },
  { key: "quiz", title: "Quiz Tamamla", icon: ICONS.bolt, color: "#E8A425", action: "quiz" },
  { key: "mistakes", title: "Hatalarını Tekrarla", icon: ICONS.bookmark, color: "#E05540", action: "mistakes" },
  { key: "review", title: "Favori Kelimelerin", icon: ICONS.sparkle, color: "#8848B8", action: "favorites" },
];

function buildSteps(daily, mistakes) {
  const remaining = Math.max(0, (daily.goal || 10) - (daily.done || 0));
  return BASE_STEPS.map((step) => {
    let desc = "";
    if (step.key === "study") {
      desc = remaining > 0 ? `${remaining} kelime seni bekliyor` : "Bugünlük tamamladın!";
    } else if (step.key === "quiz") {
      desc = daily.done >= 5 ? "Öğrendiklerini test et" : "Önce birkaç kelime çalış";
    } else if (step.key === "mistakes") {
      desc = mistakes > 0 ? `${mistakes} hatalı kelimen var` : "Hata yok, harika gidiyorsun!";
    } else if (step.key === "review") {
      desc = daily.done > 0 ? "Bugün öğrendiklerini pekiştir" : "Favorilerini gözden geçir";
    }
    return { ...step, desc };
  });
}

export default function DailyPathScreen() {
  const { c, isDark } = useTheme();
  const navigation = useNavigation();
  const { isGuestUser } = useAuth();
  const toast = useToast();
  const [daily, setDaily] = useState({ goal: 10, done: 0, pct: 0, completed: false });
  const [mistakes, setMistakes] = useState(0);
  const s = useMemo(() => makeStyles(c), [c]);
  const celebratedRef = useRef(false);

  // Hero entrance
  const heroScale = useRef(new Animated.Value(0.92)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, { toValue: 1, useNativeDriver: true, stiffness: 140, damping: 14 }),
      Animated.timing(heroOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [heroScale, heroOpacity]);

  useEffect(() => {
    getCached("dailyPath").then((v) => v && setDaily(v));
    getDailyGoal(10).then((d) => { setDaily(d); setCache("dailyPath", d); }).catch(() => {});
    getMistakesList().then((r) => setMistakes(r?.length || 0)).catch(() => {});
  }, []);

  const steps = useMemo(() => buildSteps(daily, mistakes), [daily, mistakes]);

  const completedSteps = useMemo(() => {
    const done = new Set();
    if (daily.done >= 5) done.add("study");
    if (daily.done >= 8) done.add("quiz");
    if (mistakes === 0 && daily.done > 0) done.add("mistakes");
    if (daily.completed) done.add("review");
    return done;
  }, [daily, mistakes]);

  // Tüm görevler tamamlandığında kutlama
  useEffect(() => {
    if (daily.completed && completedSteps.size >= 3 && !celebratedRef.current) {
      celebratedRef.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast?.show?.({ message: "Bugünün görevleri tamam, harikasın!", type: "success", duration: 3500 });
    }
  }, [daily.completed, completedSteps.size, toast]);

  const handleStep = useCallback((step) => {
    Haptics.selectionAsync();
    if (step.action === "study") {
      navigation.navigate("ListExplorer", { title: "Liste Seç", filter: "popular" });
    } else if (step.action === "quiz") {
      navigation.navigate("ListExplorer", { title: "Quiz için Liste", filter: "recent" });
    } else if (step.action === "mistakes") {
      navigation.navigate("HardWords");
    } else if (step.action === "favorites") {
      navigation.navigate("FavoriteWords");
    }
  }, [navigation]);

  const pct = daily.pct || 0;
  const doneCount = completedSteps.size;

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={s.backBtn}>
            <Icon d={ICONS.arrow} size={20} stroke={c.textPrimary} sw={2} style={{ transform: [{ rotate: "180deg" }] }} />
          </Pressable>
          <Text style={s.headerTitle}>Günün Yolu</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.md }}>
          {/* Progress hero */}
          <Animated.View style={{ transform: [{ scale: heroScale }], opacity: heroOpacity }}>
            <View style={s.heroCard}>
              <LinearGradient
                colors={daily.completed ? [c.success, c.success + "CC"] : [c.cobalt, c.cobalt + "CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={s.heroTitle}>
                {daily.completed ? "Bugünü tamamladın!" : "Bugünün ilerlemen"}
              </Text>
              <Text style={s.heroPct}>%{pct}</Text>
              <Text style={s.heroSub}>{daily.done} / {daily.goal} kelime · {doneCount}/{steps.length} adım</Text>
              {/* Progress bar */}
              <View style={s.heroBar}>
                <View style={[s.heroBarFill, { width: `${Math.min(100, pct)}%` }]} />
              </View>
            </View>
          </Animated.View>

          {/* Steps trail */}
          <View style={{ marginTop: 28 }}>
            {steps.map((step, i) => {
              const done = completedSteps.has(step.key);
              const isLast = i === steps.length - 1;
              return (
                <StepRow
                  key={step.key}
                  step={step}
                  done={done}
                  isLast={isLast}
                  index={i}
                  c={c}
                  s={s}
                  onPress={() => handleStep(step)}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/** Animated step row — stagger + done pulse */
function StepRow({ step, done, isLast, index, c, s, onPress }) {
  const slideY = useRef(new Animated.Value(30)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(done ? 1 : 0.6)).current;

  useEffect(() => {
    const delay = 200 + index * 100;
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 400, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    if (done) {
      Animated.spring(dotScale, { toValue: 1, delay: delay + 200, useNativeDriver: true, stiffness: 200, damping: 10 }).start();
    }
  }, [fadeIn, slideY, dotScale, index, done]);

  return (
    <Animated.View style={{ flexDirection: "row", opacity: fadeIn, transform: [{ translateY: slideY }] }}>
      {/* Trail line + dot */}
      <View style={{ alignItems: "center", width: 40 }}>
        <Animated.View
          style={[
            s.dot,
            {
              backgroundColor: done ? step.color : c.bgSurface,
              borderColor: done ? step.color : c.border,
              transform: [{ scale: dotScale }],
            },
          ]}
        >
          {done && <Icon d={ICONS.check} size={12} stroke="#fff" sw={2.5} />}
        </Animated.View>
        {!isLast && (
          <View style={[s.line, { backgroundColor: done ? step.color + "55" : c.border }]} />
        )}
      </View>
      {/* Card */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          s.stepCard,
          {
            borderColor: done ? step.color + "55" : c.border,
            backgroundColor: done ? step.color + "0A" : c.bgElevated,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <View style={[s.stepIcon, { backgroundColor: step.color + "18" }]}>
          <Icon d={step.icon} size={20} stroke={step.color} sw={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.stepTitle, { color: done ? step.color : c.textPrimary }]}>
            {step.title}
          </Text>
          <Text style={s.stepDesc}>{step.desc}</Text>
        </View>
        {done ? (
          <View style={[s.doneBadge, { backgroundColor: step.color }]}>
            <Icon d={ICONS.check} size={12} stroke="#fff" sw={2.5} />
          </View>
        ) : (
          <Icon d={ICONS.arrow} size={16} stroke={c.textMuted} sw={1.8} />
        )}
      </Pressable>
    </Animated.View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: radius.sm,
      backgroundColor: c.bgElevated, borderWidth: 1, borderColor: c.border,
      alignItems: "center", justifyContent: "center",
    },
    headerTitle: {
      fontFamily: c.fontBodyBold, fontSize: fontSize.lg, color: c.textPrimary,
    },
    heroCard: {
      borderRadius: radius.lg, padding: 22, overflow: "hidden",
      shadowColor: c.cobalt, shadowOpacity: 0.25, shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 }, elevation: 4,
    },
    heroTitle: {
      fontFamily: c.fontBodySemi, fontSize: fontSize.md, color: "rgba(255,255,255,0.85)",
    },
    heroPct: {
      fontFamily: c.fontNum, fontSize: 48, color: "#FFFFFF", marginTop: 4,
    },
    heroSub: {
      fontFamily: c.fontBody, fontSize: fontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2,
    },
    heroBar: {
      height: 6, marginTop: 16, backgroundColor: "rgba(255,255,255,0.25)",
      borderRadius: radius.full, overflow: "hidden",
    },
    heroBarFill: {
      height: "100%", backgroundColor: "#FFFFFF", borderRadius: radius.full,
    },
    dot: {
      width: 32, height: 32, borderRadius: 16,
      borderWidth: 2.5, alignItems: "center", justifyContent: "center",
      marginTop: 18,
    },
    line: {
      width: 2, flex: 1, marginVertical: 6,
    },
    stepCard: {
      flex: 1, flexDirection: "row", alignItems: "center",
      gap: 14, padding: 18, borderRadius: radius.lg,
      borderWidth: 1.5, marginLeft: 10, marginBottom: 8,
      shadowColor: c.textPrimary, shadowOpacity: 0.06, shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    stepIcon: {
      width: 52, height: 52, borderRadius: radius.md,
      alignItems: "center", justifyContent: "center",
    },
    stepTitle: {
      fontFamily: c.fontBodyBold, fontSize: 16,
    },
    stepDesc: {
      fontFamily: c.fontBody, fontSize: 13, color: c.textSec, marginTop: 3,
    },
    doneBadge: {
      width: 28, height: 28, borderRadius: 14,
      alignItems: "center", justifyContent: "center",
    },
  });
}
