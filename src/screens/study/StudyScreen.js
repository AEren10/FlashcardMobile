/**
 * StudyScreen — Claude Design v2.
 * Sub-hooks: useStudyEngine (session+state) + useStudySwipe (gesture+anims)
 *
 * Tap=çevir · Swipe sağ=Biliyorum · Swipe sol=Bilmiyorum
 * Stack peek, verdict badges, ✓/✗ feedback pop, confetti (streak ≥5), shake
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated as RNAnimated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import ConfettiCannon from "react-native-confetti-cannon";

import FlipCard from "../../components/design/FlipCard";
import Icon, { ICONS } from "../../components/design/Icon";
import EmptyState from "../../components/EmptyState";
import ProgressBar from "../../components/design/ProgressBar";
import StudyLoadingState from "./components/StudyLoadingState";
import StudyDoneState from "./components/StudyDoneState";
import { useTheme } from "../../contexts/ThemeContext";
import useStudyEngine from "../../hooks/useStudyEngine";
import useStudySwipe from "../../hooks/useStudySwipe";

const { width: SCREEN_W } = Dimensions.get("window");

export default function StudyScreen({ route, navigation }) {
  const { listId, listTitle, presetWords, presetTitle, presetMode } = route.params ?? {};
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const title = presetTitle ?? listTitle ?? "Çalış";

  // Business logic — session + mistakes
  const engine = useStudyEngine({ listId, presetWords, presetMode });

  // UI-only state
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'know' | 'dont' | null

  // Gesture + animations
  const swipe = useStudySwipe({
    enabled: !feedback,
    onTap: () => {
      if (feedback) return;
      Haptics.selectionAsync();
      setFlipped((f) => !f);
    },
    onSwipe: (know) => handleAnswer(know),
  });

  // Tab bar'ı tamamen sakla — Study ekranı full-screen deneyim olsun
  useLayoutEffect(() => {
    const stack = navigation.getParent();
    const tab = stack?.getParent();
    tab?.setOptions({ tabBarStyle: { display: "none" } });
    return () => tab?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  // Çalışma yarıda kalmışken çıkış engelleme — Alert ile onay
  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      // Henüz hiç cevap verilmediyse veya bitti ise serbest çık
      if (engine.done || engine.loading) return;
      if (!engine.words?.length) return;
      if (engine.index === 0 && !feedback) return;

      e.preventDefault();
      Alert.alert(
        "Çalışmayı bırakmak istiyor musun?",
        "İlerlemen kaydedilmeyecek ve baştan başlaman gerekecek.",
        [
          { text: "Devam et", style: "cancel", onPress: () => {} },
          {
            text: "Çık",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsub;
  }, [navigation, engine.done, engine.loading, engine.index, engine.words, feedback]);

  // Cleanup guard — unmount sonrası setState'i engelle (memory leak fix)
  const unmountedRef = useRef(false);
  useEffect(() => () => { unmountedRef.current = true; }, []);

  const handleAnswer = (know) => {
    if (feedback || !engine.current) return;
    setFeedback(know ? "know" : "dont");

    const result = engine.answer(know);
    if (!result) return;

    // Visual: kart kayar / shake
    swipe.triggerCommit(know);
    if (!know) swipe.triggerShake();

    // Hem doğru hem yanlış için aynı süre — tik/çarpı tam görünür
    const delay = know ? 620 : 700;
    setTimeout(() => {
      if (unmountedRef.current) return; // unmount edildi → state update yapma
      if (result.isLast) {
        engine.finishSeason(know, know ? null : result.wordId);
      } else {
        engine.advance();
        swipe.resetCard();
        setFlipped(false);
        setFeedback(null);
      }
    }, delay);
  };

  if (engine.loading) return <StudyLoadingState s={s} />;

  if (engine.done) {
    return (
      <StudyDoneState
        engine={engine}
        navigation={navigation}
        listId={listId}
      />
    );
  }

  if (!engine.words.length) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <EmptyState
            kind="search"
            title="Bu listede kelime yok"
            subtitle="Önce listeye kelime ekle."
            actionLabel="Geri dön"
            onAction={() => navigation.goBack()}
          />
        </SafeAreaView>
      </View>
    );
  }

  const progress = (engine.index + 1) / engine.words.length;
  const showConfetti = engine.confettiKey > 0 && engine.streak >= 5;

  // Derived animated styles
  const rotate = swipe.dx.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ["-13deg", "0deg", "13deg"],
  });
  const knowAmt = swipe.dx.interpolate({ inputRange: [30, 150], outputRange: [0, 1], extrapolate: "clamp" });
  const dontAmt = swipe.dx.interpolate({ inputRange: [-150, -30], outputRange: [1, 0], extrapolate: "clamp" });
  const greenGlow = swipe.dx.interpolate({ inputRange: [0, 150], outputRange: [0, 1], extrapolate: "clamp" });
  const redGlow = swipe.dx.interpolate({ inputRange: [-150, 0], outputRange: [1, 0], extrapolate: "clamp" });
  const cardX = RNAnimated.add(swipe.dx, swipe.shakeX);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <Header c={c} s={s} title={title} streak={engine.streak} onBack={() => navigation.goBack()} />
        <View style={s.progressRow}>
          <View style={{ flex: 1 }}>
            <ProgressBar progress={progress} />
          </View>
          <Text style={s.counter}>
            {engine.index + 1}/{engine.words.length}
          </Text>
        </View>

        <View style={s.stageWrap}>
          <View style={s.stage}>
            <View style={[s.peekCard, { transform: [{ scale: 0.84 }, { translateY: 22 }], opacity: 0.45, backgroundColor: c.bgElevated, borderColor: c.border }]} />
            <View style={[s.peekCard, { transform: [{ scale: 0.92 }, { translateY: 12 }], opacity: 0.72, backgroundColor: c.bgElevated, borderColor: c.border }]} />

            <RNAnimated.View
              {...swipe.panHandlers}
              style={[s.cardPan, { transform: [{ translateX: cardX }, { rotate }] }]}
            >
              <GlowOverlays s={s} c={c} green={greenGlow} red={redGlow} />
              <FlipCard
                key={engine.current.id}
                wordId={engine.current.id}
                listId={listId}
                word={engine.current.word}
                meaning={engine.current.meaning}
                example={engine.current.example}
                exampleTr={engine.current.example_tr || engine.current.exampleTr}
                pron={engine.current.pron}
                flipped={flipped}
                onPress={() => {}}
                disabled={!!feedback}
                onGraduate={() => engine.graduateCurrent?.()}
                onReport={() => engine.reportCurrent?.()}
              />
              <VerdictBadges s={s} c={c} know={knowAmt} dont={dontAmt} />
              {feedback && <CenterPop s={s} c={c} type={feedback} />}
              {feedback && <ScreenFlash type={feedback} />}
            </RNAnimated.View>
          </View>
        </View>

        {/* Swipe rehberi — containersız, sade SVG ok + text */}
        <View style={s.swipeGuide} pointerEvents="none">
          <View style={s.guideSide}>
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.error} sw={2.4} />
            <Text style={[s.guideTxt, { color: c.error, fontFamily: c.fontBodySemi }]}>
              Bilmiyorum
            </Text>
          </View>
          <View style={s.guideCenter}>
            {/* Tap-to-flip: parmak + döngü ipucu SVG */}
            <Icon
              d="M9 11V6a3 3 0 0 1 6 0v8m-3 0v3m-5-4a5 5 0 0 0 10 0V8"
              size={20}
              stroke={c.textMuted}
              sw={1.8}
            />
          </View>
          <View style={s.guideSide}>
            <Text style={[s.guideTxt, { color: c.success, fontFamily: c.fontBodySemi }]}>
              Biliyorum
            </Text>
            <Icon d="M9 6l6 6-6 6" size={18} stroke={c.success} sw={2.4} />
          </View>
        </View>

        {showConfetti && (
          <ConfettiCannon
            key={engine.confettiKey}
            count={40}
            origin={{ x: SCREEN_W / 2, y: 200 }}
            fadeOut
            autoStart
            fallSpeed={2200}
            colors={[c.accent, c.cobalt, c.success, c.warning]}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

/* —————— Sub-components —————— */

function Header({ c, s, title, streak, onBack }) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack} hitSlop={12} style={s.headerLeft} accessibilityLabel="Geri">
        <Svg width={10} height={16} viewBox="0 0 8 14">
          <Path d="M7 1L1 7l6 6" stroke={c.textSec} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={s.deckTitle} numberOfLines={1}>{title}</Text>
      </Pressable>
      <View style={s.streakBox}>
        <Icon d={ICONS.flame} size={16} stroke={c.warning} fill={c.warning} sw={1.2} />
        <Text style={s.streakNum}>{streak}</Text>
      </View>
    </View>
  );
}

function GlowOverlays({ s, c, green, red }) {
  return (
    <>
      <RNAnimated.View pointerEvents="none" style={[s.glowOverlay, { opacity: green, borderColor: c.success, shadowColor: c.success }]} />
      <RNAnimated.View pointerEvents="none" style={[s.glowOverlay, { opacity: red, borderColor: c.error, shadowColor: c.error }]} />
    </>
  );
}

function VerdictBadges({ s, c, know, dont }) {
  return (
    <>
      <RNAnimated.View pointerEvents="none" style={[s.verdict, { right: 18, backgroundColor: c.success, opacity: know, transform: [{ scale: know }] }]}>
        <Text style={s.verdictIcon}>✓</Text>
      </RNAnimated.View>
      <RNAnimated.View pointerEvents="none" style={[s.verdict, { left: 18, backgroundColor: c.error, opacity: dont, transform: [{ scale: dont }] }]}>
        <Text style={s.verdictIcon}>✕</Text>
      </RNAnimated.View>
    </>
  );
}

function CenterPop({ s, c, type }) {
  const scale = useRef(new RNAnimated.Value(0)).current;
  const opacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.sequence([
        RNAnimated.spring(scale, {
          toValue: 1.25,
          useNativeDriver: true,
          tension: 180,
          friction: 7,
        }),
        RNAnimated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 130,
          friction: 9,
        }),
      ]),
      RNAnimated.sequence([
        RNAnimated.timing(opacity, { toValue: 1, duration: 130, useNativeDriver: true }),
        // Çarpı ile tikin aynı uzunlukta belirgin kalması — 420ms tam durma
        RNAnimated.delay(420),
        RNAnimated.timing(opacity, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start();
  }, [scale, opacity, type]);

  const isKnow = type === "know";
  return (
    <RNAnimated.View
      pointerEvents="none"
      style={[
        s.centerPop,
        {
          backgroundColor: isKnow ? c.success : c.error,
          opacity,
          transform: [{ scale }],
          shadowColor: isKnow ? c.success : c.error,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 28,
          elevation: 12,
        },
      ]}
    >
      <Text style={s.popIcon}>{isKnow ? "✓" : "✕"}</Text>
    </RNAnimated.View>
  );
}

/** Tam ekran soft glow flash — swipe sonrası anlık görsel feedback */
function ScreenFlash({ type }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.sequence([
      RNAnimated.timing(opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
      RNAnimated.delay(160),
      RNAnimated.timing(opacity, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start();
  }, [opacity, type]);
  // Yeşil/kırmızı yumuşak gradient — kart üzerinde halo gibi
  const color = type === "know" ? "rgba(90, 184, 132, 0.22)" : "rgba(204, 92, 92, 0.22)";
  return (
    <RNAnimated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: color,
        opacity,
      }}
    />
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingTop: 6,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
    deckTitle: { fontFamily: c.fontBodySemi, fontSize: 16, color: c.textPrimary },
    streakBox: { flexDirection: "row", alignItems: "center", gap: 6 },
    flame: { fontSize: 16 },
    streakNum: { fontFamily: c.fontNum, fontSize: 15, color: c.warning },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 18,
      paddingTop: 16,
    },
    counter: { fontFamily: c.fontNum, fontSize: 13, color: c.textSec },
    stageWrap: { flex: 1, justifyContent: "center", paddingHorizontal: 18 },
    stage: {
      width: "84%",
      alignSelf: "center",
      aspectRatio: 0.72,
      maxHeight: 430,
      position: "relative",
    },
    peekCard: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
      borderWidth: 1,
    },
    cardPan: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
    glowOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
      borderWidth: 2,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      zIndex: 20,
    },
    verdict: {
      position: "absolute",
      top: 18,
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 25,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    verdictIcon: { color: "#FFFFFF", fontSize: 26, fontWeight: "700" },
    centerPop: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 80,
      height: 80,
      marginLeft: -40,
      marginTop: -40,
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 30,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
    },
    popIcon: { color: "#FFFFFF", fontSize: 40, fontWeight: "700" },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 28,
      paddingBottom: 30,
      paddingTop: 8,
    },
    arrowBtn: { paddingVertical: 12, paddingHorizontal: 6 },
    arrowTxt: { fontFamily: c.fontBodyBold, fontSize: 15, letterSpacing: 0.3 },
    swipeGuide: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 28,
      paddingBottom: 22,
      marginTop: 6,
    },
    guideSide: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    guideCenter: {
      width: 36,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.55,
    },
    guideTxt: {
      fontSize: 14,
      letterSpacing: 0.3,
    },
    swipeHint: {
      textAlign: "center",
      fontSize: 11,
      letterSpacing: 0.2,
      paddingHorizontal: 22,
      paddingBottom: 8,
      marginTop: -4,
      opacity: 0.7,
    },
  });
}
