/**
 * StudyScreen — Claude Design v2 spec.
 * Tap=çevir · Swipe sağ=Biliyorum · Swipe sol=Bilmiyorum.
 * Stack peek, tutorial overlay, verdict badges, ✓/✗ feedback pop, confetti (streak ≥5), shake.
 * SRS: Biliyorum→GOOD, Bilmiyorum→AGAIN.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  PanResponder,
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
import QuizResultScreen from "../../components/design/QuizResultScreen";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { getListWords } from "../../supabase/database";
import { startSession } from "../../supabase/progress";
import { safeRecordReview, safeFinishSession } from "../../lib/offlineQueue";
import { GRADE } from "../../lib/srs";
import { shuffle } from "../../utils/shuffle";
import { maybeRequestReview } from "../../utils/rateApp";

const SWIPE_THRESHOLD = 60;
const TAP_THRESHOLD = 8;
const COMMIT_DISTANCE = 480;

const { width: SCREEN_W } = Dimensions.get("window");

export default function StudyScreen({ route, navigation }) {
  const { listId, listTitle, presetWords, presetTitle, presetMode } = route.params ?? {};
  const { c } = useTheme();
  const toast = useToast();
  const s = useMemo(() => makeStyles(c), [c]);

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'know' | 'dont' | null
  const [flipped, setFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctIds, setCorrectIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [finalDuration, setFinalDuration] = useState(0);

  const sessionRef = useRef(null);
  const startedAt = useRef(Date.now());
  const title = presetTitle ?? listTitle ?? "Çalış";
  const confettiKey = useRef(0);

  // Anim values
  const dx = useRef(new RNAnimated.Value(0)).current;
  const shakeX = useRef(new RNAnimated.Value(0)).current;
  const popScale = useRef(new RNAnimated.Value(0)).current;
  const dxValueRef = useRef(0);

  useEffect(() => {
    const id = dx.addListener(({ value }) => {
      dxValueRef.current = value;
    });
    return () => dx.removeListener(id);
  }, [dx]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let list;
      if (presetWords?.length) list = presetWords;
      else {
        const res = await getListWords(listId);
        list = res.data ?? [];
      }
      if (!mounted) return;
      setWords(shuffle(list));
      setLoading(false);
      sessionRef.current = await startSession({
        list_id: listId ?? null,
        mode: presetMode ?? "srs",
      });
    })();
    return () => {
      mounted = false;
    };
  }, [listId, presetWords, presetMode]);

  const current = words[index];

  const handleFlip = () => {
    if (feedback) return;
    Haptics.selectionAsync();
    setFlipped((f) => !f);
  };

  const advance = () => {
    setIndex((i) => i + 1);
    setFlipped(false);
    setFeedback(null);
    dx.setValue(0);
    popScale.setValue(0);
  };

  const finishSeason = (lastWasCorrect) => {
    setDone(true);
    const duration = Math.round((Date.now() - startedAt.current) / 1000);
    setFinalDuration(duration);
    safeFinishSession(sessionRef.current?.id, {
      total_words: words.length,
      correct: lastWasCorrect ? correct + 1 : correct,
      duration_sec: duration,
    }).catch(() => {});
    maybeRequestReview();
  };

  const answer = (know) => {
    if (feedback || !current) return;
    setFeedback(know ? "know" : "dont");

    Haptics.notificationAsync(
      know
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );

    const nextStreak = know ? streak + 1 : 0;
    if (know && nextStreak >= 5) {
      confettiKey.current += 1;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
    setStreak(nextStreak);

    if (know) {
      setCorrect((cur) => cur + 1);
      setCorrectIds((arr) => [...arr, current.id]);
    } else {
      setWrongIds((arr) => [...arr, current.id]);
    }

    // Record review
    safeRecordReview(current.id, know ? GRADE.GOOD : GRADE.AGAIN).catch(() => {});

    // Visual: kart kayar / shake
    if (know) {
      RNAnimated.timing(dx, {
        toValue: COMMIT_DISTANCE,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.sequence([
        RNAnimated.timing(shakeX, { toValue: 8, duration: 50, useNativeDriver: true }),
        RNAnimated.timing(shakeX, { toValue: -8, duration: 50, useNativeDriver: true }),
        RNAnimated.timing(shakeX, { toValue: 6, duration: 50, useNativeDriver: true }),
        RNAnimated.timing(shakeX, { toValue: -6, duration: 50, useNativeDriver: true }),
        RNAnimated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      RNAnimated.timing(dx, {
        toValue: -COMMIT_DISTANCE,
        duration: 380,
        delay: 220,
        useNativeDriver: true,
      }).start();
    }

    // Center pop ✓/✗
    RNAnimated.sequence([
      RNAnimated.timing(popScale, { toValue: 1.15, duration: 220, useNativeDriver: true }),
      RNAnimated.timing(popScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    const delay = know ? 380 : 600;
    setTimeout(() => {
      if (index + 1 >= words.length) {
        finishSeason(know);
      } else {
        advance();
      }
    }, delay);
  };

  // PanResponder — tap vs swipe ayırt eder
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !feedback,
        onMoveShouldSetPanResponder: (_, g) => !feedback && Math.abs(g.dx) > 4,
        onPanResponderMove: (_, g) => {
          if (feedback) return;
          dx.setValue(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (feedback) return;
          const totalMove = Math.abs(g.dx) + Math.abs(g.dy);
          if (totalMove < TAP_THRESHOLD) {
            // tap: flip
            handleFlip();
            RNAnimated.spring(dx, { toValue: 0, useNativeDriver: true }).start();
            return;
          }
          if (g.dx > SWIPE_THRESHOLD) {
            answer(true);
          } else if (g.dx < -SWIPE_THRESHOLD) {
            answer(false);
          } else {
            RNAnimated.spring(dx, {
              toValue: 0,
              useNativeDriver: true,
              tension: 80,
              friction: 7,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          if (!feedback)
            RNAnimated.spring(dx, { toValue: 0, useNativeDriver: true }).start();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedback, index, current, streak, correct]
  );

  if (loading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  if (done) {
    const correctWords = correctIds.map((id) => words.find((w) => w.id === id)).filter(Boolean);
    const wrongWords = wrongIds.map((id) => words.find((w) => w.id === id)).filter(Boolean);
    const handleRetry = () => {
      setIndex(0);
      setCorrect(0);
      setDone(false);
      setStreak(0);
      setCorrectIds([]);
      setWrongIds([]);
      setFinalDuration(0);
      startedAt.current = Date.now();
      setWords(shuffle(words));
      startSession({ list_id: listId ?? null, mode: presetMode ?? "srs" }).then(
        (sess) => (sessionRef.current = sess)
      );
    };
    return (
      <QuizResultScreen
        correct={correct}
        total={words.length}
        durationSec={finalDuration}
        correctWords={correctWords}
        wrongWords={wrongWords}
        onRetry={handleRetry}
        onFinish={() => navigation.goBack()}
      />
    );
  }

  if (!words.length) {
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

  const progress = (index + 1) / words.length;
  const tutorial = index < 3 && !feedback;

  // Derived animated styles
  const rotate = dx.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ["-13deg", "0deg", "13deg"],
  });
  const knowAmt = dx.interpolate({
    inputRange: [30, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const dontAmt = dx.interpolate({
    inputRange: [-150, -30],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const greenGlowOpacity = dx.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const redGlowOpacity = dx.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const cardTranslateX = RNAnimated.add(dx, shakeX);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={s.headerLeft}
            accessibilityLabel="Geri"
          >
            <Svg width={10} height={16} viewBox="0 0 8 14">
              <Path
                d="M7 1L1 7l6 6"
                stroke={c.textSec}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={s.deckTitle} numberOfLines={1}>
              {title}
            </Text>
          </Pressable>
          <View style={s.streakBox}>
            <Text style={s.flame}>🔥</Text>
            <Text style={s.streakNum}>{streak}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={s.progressRow}>
          <View style={{ flex: 1 }}>
            <ProgressBar progress={progress} />
          </View>
          <Text style={s.counter}>
            {index + 1}/{words.length}
          </Text>
        </View>

        {/* Card stage */}
        <View style={s.stageWrap}>
          <View style={s.stage}>
            {/* Peek stack behind */}
            <View style={[s.peekCard, { transform: [{ scale: 0.84 }, { translateY: 22 }], opacity: 0.45 }]} />
            <View style={[s.peekCard, { transform: [{ scale: 0.92 }, { translateY: 12 }], opacity: 0.72 }]} />

            {/* Pannable card */}
            <RNAnimated.View
              {...panResponder.panHandlers}
              style={[
                s.cardPan,
                { transform: [{ translateX: cardTranslateX }, { rotate }] },
              ]}
            >
              {/* Green glow overlay (swipe right) */}
              <RNAnimated.View
                pointerEvents="none"
                style={[
                  s.glowOverlay,
                  {
                    opacity: greenGlowOpacity,
                    borderColor: c.success,
                    shadowColor: c.success,
                  },
                ]}
              />
              {/* Red glow overlay (swipe left) */}
              <RNAnimated.View
                pointerEvents="none"
                style={[
                  s.glowOverlay,
                  {
                    opacity: redGlowOpacity,
                    borderColor: c.error,
                    shadowColor: c.error,
                  },
                ]}
              />

              <FlipCard
                key={current.id}
                word={current.word}
                meaning={current.meaning}
                example={current.example}
                pron={current.pron}
                flipped={flipped}
                onPress={handleFlip}
                disabled={!!feedback}
              />

              {/* Verdict badges */}
              <RNAnimated.View
                pointerEvents="none"
                style={[
                  s.verdict,
                  { right: 18, backgroundColor: c.success, opacity: knowAmt, transform: [{ scale: knowAmt }] },
                ]}
              >
                <Text style={s.verdictIcon}>✓</Text>
              </RNAnimated.View>
              <RNAnimated.View
                pointerEvents="none"
                style={[
                  s.verdict,
                  { left: 18, backgroundColor: c.error, opacity: dontAmt, transform: [{ scale: dontAmt }] },
                ]}
              >
                <Text style={s.verdictIcon}>✕</Text>
              </RNAnimated.View>

              {/* Center feedback pop */}
              {feedback && (
                <RNAnimated.View
                  pointerEvents="none"
                  style={[
                    s.centerPop,
                    {
                      backgroundColor: feedback === "know" ? c.success : c.error,
                      transform: [{ scale: popScale }],
                    },
                  ]}
                >
                  <Text style={s.popIcon}>{feedback === "know" ? "✓" : "✕"}</Text>
                </RNAnimated.View>
              )}

              {/* Tutorial overlay */}
              {tutorial && (
                <View style={s.tutorial} pointerEvents="none">
                  <View style={[s.tutorialArrow, { left: 6 }]}>
                    <View style={[s.tutorialCircle, { backgroundColor: c.errorDim, borderColor: c.error }]}>
                      <Text style={[s.tutorialArrowTxt, { color: c.error }]}>←</Text>
                    </View>
                    <Text style={[s.tutorialLabel, { color: c.error }]}>Bilmiyorum</Text>
                  </View>
                  <View style={[s.tutorialArrow, { right: 6 }]}>
                    <View style={[s.tutorialCircle, { backgroundColor: c.successDim, borderColor: c.success }]}>
                      <Text style={[s.tutorialArrowTxt, { color: c.success }]}>→</Text>
                    </View>
                    <Text style={[s.tutorialLabel, { color: c.success }]}>Biliyorum</Text>
                  </View>
                  <View style={s.tutorialHint}>
                    <Text style={s.tutorialHintTxt}>← sürükle · çevirmek için dokun · sürükle →</Text>
                  </View>
                </View>
              )}
            </RNAnimated.View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={s.actions}>
          <Pressable
            onPress={() => answer(false)}
            disabled={!!feedback}
            style={[s.btn, s.btnDont]}
            accessibilityLabel="Bilmiyorum"
          >
            <Text style={[s.btnTxt, { color: c.error }]}>✕  Bilmiyorum</Text>
          </Pressable>
          <Pressable
            onPress={() => answer(true)}
            disabled={!!feedback}
            style={[s.btn, s.btnKnow]}
            accessibilityLabel="Biliyorum"
          >
            <Text style={[s.btnTxt, { color: c.textOnAccent }]}>✓  Biliyorum</Text>
          </Pressable>
        </View>

        {/* Confetti */}
        {showConfetti && (
          <ConfettiCannon
            key={confettiKey.current}
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

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg },
    center: { alignItems: "center", justifyContent: "center" },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingTop: 6,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
    deckTitle: {
      fontFamily: c.fontBodySemi,
      fontSize: 16,
      color: c.textPrimary,
    },
    streakBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    flame: { fontSize: 16 },
    streakNum: {
      fontFamily: c.fontNum,
      fontSize: 15,
      color: c.warning,
    },

    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 18,
      paddingTop: 16,
    },
    progressTrack: {
      flex: 1,
      height: 8,
      borderRadius: 999,
      backgroundColor: c.bgSurface,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: c.accent,
    },
    counter: {
      fontFamily: c.fontNum,
      fontSize: 13,
      color: c.textSec,
    },

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
      backgroundColor: c.bgElevated,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardPan: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
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
      elevation: 0,
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
    verdictIcon: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "700",
    },
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
    popIcon: {
      color: "#FFFFFF",
      fontSize: 40,
      fontWeight: "700",
    },
    tutorial: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 35,
    },
    tutorialArrow: {
      position: "absolute",
      top: "46%",
      transform: [{ translateY: -25 }],
      alignItems: "center",
      gap: 6,
    },
    tutorialCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    tutorialArrowTxt: {
      fontSize: 20,
      fontFamily: c.fontBodyBold,
    },
    tutorialLabel: {
      fontFamily: c.fontBodySemi,
      fontSize: 10.5,
    },
    tutorialHint: {
      position: "absolute",
      bottom: 14,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    tutorialHintTxt: {
      fontFamily: c.fontBody,
      fontSize: 11,
      color: c.textMuted,
      backgroundColor: c.bgBase,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },

    actions: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 18,
      paddingBottom: 30,
    },
    btn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 1,
    },
    btnDont: {
      backgroundColor: c.bgSurface,
      borderColor: c.border,
    },
    btnKnow: {
      backgroundColor: c.accent,
      borderColor: "transparent",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 4,
    },
    btnTxt: {
      fontFamily: c.fontBodyBold,
      fontSize: 15,
    },
  });
}
