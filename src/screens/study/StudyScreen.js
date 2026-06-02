/**
 * StudyScreen — Claude Design v2.
 * Sub-hooks: useStudyEngine (session+state) + useStudySwipe (gesture+anims)
 *
 * Tap=çevir · Swipe sağ=Biliyorum · Swipe sol=Bilmiyorum
 * Stack peek, verdict badges, ✓/✗ feedback pop, confetti (streak ≥5), shake
 */
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated as RNAnimated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import ConfettiCannon from "react-native-confetti-cannon";

import FlipCard from "../../components/design/FlipCard";
import EmptyState from "../../components/EmptyState";
import ProgressBar from "../../components/design/ProgressBar";
import StudyResultScreen from "../../components/design/StudyResultScreen";
import MistakesListModal from "../../components/design/MistakesListModal";
import { Skeleton, SkeletonFlipCard } from "../../components/design/Skeleton";
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

  const handleAnswer = (know) => {
    if (feedback || !engine.current) return;
    setFeedback(know ? "know" : "dont");

    const result = engine.answer(know);
    if (!result) return;

    // Visual: kart kayar / shake
    swipe.triggerCommit(know);
    if (!know) swipe.triggerShake();

    const delay = know ? 380 : 600;
    setTimeout(() => {
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

  if (engine.loading) return <LoadingState s={s} c={c} />;

  if (engine.done) {
    return (
      <DoneState
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
            emoji="📭"
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
                pron={engine.current.pron}
                flipped={flipped}
                onPress={() => {}}
                disabled={!!feedback}
              />
              <VerdictBadges s={s} c={c} know={knowAmt} dont={dontAmt} />
              {feedback && <CenterPop s={s} c={c} type={feedback} scale={swipe.popScale} />}
            </RNAnimated.View>
          </View>
        </View>

        <View style={s.actions}>
          <Pressable onPress={() => handleAnswer(false)} disabled={!!feedback} style={s.arrowBtn} hitSlop={16}>
            <Text style={[s.arrowTxt, { color: c.error }]}>← Bilmiyorum</Text>
          </Pressable>
          <Pressable onPress={() => handleAnswer(true)} disabled={!!feedback} style={s.arrowBtn} hitSlop={16}>
            <Text style={[s.arrowTxt, { color: c.success }]}>Biliyorum →</Text>
          </Pressable>
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
        <Text style={s.flame}>🔥</Text>
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

function CenterPop({ s, c, type, scale }) {
  return (
    <RNAnimated.View
      pointerEvents="none"
      style={[s.centerPop, { backgroundColor: type === "know" ? c.success : c.error, transform: [{ scale }] }]}
    >
      <Text style={s.popIcon}>{type === "know" ? "✓" : "✕"}</Text>
    </RNAnimated.View>
  );
}

function LoadingState({ s, c }) {
  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1, padding: 20, gap: 18 }} edges={["top"]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton width={40} height={40} radius={12} />
          <Skeleton width={50} height={20} radius={6} />
        </View>
        <Skeleton width="100%" height={6} radius={3} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <SkeletonFlipCard />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8 }}>
          <Skeleton width={110} height={20} radius={6} />
          <Skeleton width={110} height={20} radius={6} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function DoneState({ engine, navigation, listId }) {
  const correctWords = engine.correctIds.map((id) => engine.words.find((w) => w.id === id)).filter(Boolean);
  const wrongWordsList = engine.wrongIds
    .map((id) => engine.words.find((w) => w.id === id))
    .filter(Boolean)
    .map((w) => ({ ...w, list_id: listId }));

  const goToMistakesList = () => {
    engine.setShowMistakesModal(false);
    if (engine.mistakesListId) {
      navigation.replace("Study", {
        listId: engine.mistakesListId,
        listTitle: "Bilemediğin Kelimeler",
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StudyResultScreen
        total={engine.words.length}
        correct={engine.correct}
        durationSec={engine.finalDuration}
        correctWords={correctWords}
        wrongWords={wrongWordsList}
        mistakesAdded={engine.mistakesAdded}
        onRetryMistakes={engine.mistakesAdded > 0 ? goToMistakesList : undefined}
        onFinish={() => navigation.goBack()}
      />
      <MistakesListModal
        visible={engine.showMistakesModal}
        addedCount={engine.mistakesAdded}
        onStudy={goToMistakesList}
        onLater={() => engine.setShowMistakesModal(false)}
      />
    </>
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
  });
}
