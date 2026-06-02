/* global setTimeout */
/**
 * QuizScreen — Claude Design v2.
 * Header: X close + shimmer progress + counter
 * Prompt: chip + 52pt display word
 * Options: 2×2 grid, correct → green spring pop + auto-next 650ms,
 *          wrong → red shake + correct reveal in green + 1200ms hold
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

import { useTheme } from "../../contexts/ThemeContext";
import { getListWords } from "../../supabase/database";
import { startSession } from "../../supabase/progress";
import { safeRecordReview, safeFinishSession } from "../../lib/offlineQueue";
import { GRADE } from "../../lib/srs";
import { shuffle } from "../../utils/shuffle";
import { maybeRequestReview } from "../../utils/rateApp";
import Icon, { ICONS } from "../../components/design/Icon";
import ProgressBar from "../../components/design/ProgressBar";
import EmptyState from "../../components/EmptyState";
import QuizResultScreen from "../../components/design/QuizResultScreen";

export default function QuizScreen({ route, navigation }) {
  const { listId, listTitle, presetWords, presetTitle } = route.params ?? {};
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [correctIds, setCorrectIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [finalDuration, setFinalDuration] = useState(0);
  const sessionRef = useRef(null);
  const startedAt = useRef(Date.now());
  const title = presetTitle ?? listTitle ?? "Quiz";

  useEffect(() => {
    let mounted = true;
    (async () => {
      let list;
      if (presetWords?.length) {
        list = presetWords;
      } else {
        try {
          const res = await getListWords(listId);
          list = res.data ?? [];
        } catch {
          list = [];
        }
      }
      if (!mounted) return;
      setWords(shuffle(list));
      setLoading(false);
      sessionRef.current = await startSession({ list_id: listId ?? null, mode: "quiz" });
    })();
    return () => {
      mounted = false;
    };
  }, [listId, presetWords]);

  const current = words[index];
  const options = useMemo(() => {
    if (!current || words.length < 4) return [];
    const distractors = words
      .filter((w) => w.id !== current.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.meaning);
    return shuffle([current.meaning, ...distractors]);
  }, [current, words]);

  const pick = async (opt, i) => {
    if (picked) return;
    const isCorrect = opt === current.meaning;
    setPicked({ opt, i, isCorrect });
    Haptics.notificationAsync(
      isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    );
    if (isCorrect) {
      setCorrect((cc) => cc + 1);
      setCorrectIds((arr) => [...arr, current.id]);
    } else {
      setWrongIds((arr) => [...arr, current.id]);
    }
    safeRecordReview(current.id, isCorrect ? GRADE.GOOD : GRADE.AGAIN).catch(() => {});

    const wait = isCorrect ? 650 : 1250;
    setTimeout(async () => {
      if (index + 1 >= words.length) {
        const finalCorrect = isCorrect ? correct + 1 : correct;
        const duration = Math.round((Date.now() - startedAt.current) / 1000);
        setFinalDuration(duration);
        await safeFinishSession(sessionRef.current?.id, {
          total_words: words.length,
          correct: finalCorrect,
          duration_sec: duration,
        });
        setDone(true);
        maybeRequestReview();
      } else {
        setPicked(null);
        setIndex((ix) => ix + 1);
      }
    }, wait);
  };

  const restart = async () => {
    setIndex(0);
    setCorrect(0);
    setPicked(null);
    setDone(false);
    setCorrectIds([]);
    setWrongIds([]);
    setFinalDuration(0);
    startedAt.current = Date.now();
    setWords(shuffle(words));
    sessionRef.current = await startSession({ list_id: listId ?? null, mode: "quiz" });
  };

  if (loading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  if (words.length < 4) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <EmptyState
            emoji="🧩"
            title="Quiz için yeterli kelime yok"
            subtitle="Quiz en az 4 kelime gerektirir. Listeye daha fazla kelime ekle."
            actionLabel="Geri dön"
            onAction={() => navigation.goBack()}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (done) {
    const correctWords = correctIds
      .map((id) => words.find((w) => w.id === id))
      .filter(Boolean);
    const wrongWords = wrongIds
      .map((id) => words.find((w) => w.id === id))
      .filter(Boolean);
    return (
      <QuizResultScreen
        correct={correct}
        total={words.length}
        durationSec={finalDuration}
        correctWords={correctWords}
        wrongWords={wrongWords}
        onRetry={restart}
        onFinish={() => navigation.goBack()}
      />
    );
  }

  const progress = (index + 1) / words.length;

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header: close + progress + counter */}
        <View style={s.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={s.closeBtn}
            hitSlop={12}
            accessibilityLabel="Quiz'i kapat"
          >
            <Icon d={ICONS.x} size={22} stroke={c.textSec} sw={2} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <ProgressBar progress={progress} height={6} />
          </View>
          <Text style={s.counter}>
            {index + 1}/{words.length}
          </Text>
        </View>

        {/* Prompt */}
        <View style={s.prompt}>
          <View style={s.chipAccent}>
            <Text style={s.chipAccentTxt}>Quiz · Çoktan seçmeli</Text>
          </View>
          <Pressable
            style={s.wordRow}
            onPress={() => Speech.speak(current.word, { language: "en-US" })}
            accessibilityLabel="Telaffuzu dinle"
          >
            <Text style={s.word}>{current.word}</Text>
          </Pressable>
          <Text style={s.sub}>Bu kelimenin anlamı?</Text>
        </View>

        {/* 2×2 grid */}
        <View style={s.grid}>
          {options.map((opt, i) => (
            <OptionButton
              key={opt + i}
              opt={opt}
              i={i}
              picked={picked}
              correctAnswer={current.meaning}
              onPress={() => pick(opt, i)}
              c={c}
              s={s}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

function OptionButton({ opt, i, picked, correctAnswer, onPress, c, s }) {
  const scale = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  const isCorrectOpt = opt === correctAnswer;
  const lockedState = picked ? (isCorrectOpt ? "right" : picked.i === i ? "wrong" : "dim") : "idle";

  useEffect(() => {
    if (lockedState === "right") {
      // qz-pop: scale 1→0.97→1.06→1, 420ms cubic-bezier(.2,.8,.2,1)
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.97, duration: 110, useNativeDriver: true }),
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 180,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 180,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (lockedState === "wrong") {
      // fm-shake
      Animated.sequence([
        Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [lockedState, scale, shakeX]);

  const bg =
    lockedState === "right"
      ? c.success
      : lockedState === "wrong"
        ? c.error
        : c.bgElevated;
  const fg =
    lockedState === "right" || lockedState === "wrong" ? "#FFFFFF" : c.textPrimary;
  const border =
    lockedState === "right"
      ? c.success
      : lockedState === "wrong"
        ? c.error
        : c.border;
  const opacity = lockedState === "dim" ? 0.45 : 1;
  const shadowOpacity = lockedState === "right" ? 0.5 : 0;

  return (
    <Animated.View
      style={[
        s.optWrap,
        {
          transform: [{ scale }, { translateX: shakeX }],
          opacity,
        },
      ]}
    >
      <Pressable
        disabled={!!picked}
        onPress={onPress}
        style={[
          s.opt,
          {
            backgroundColor: bg,
            borderColor: border,
            shadowColor: c.success,
            shadowOpacity,
          },
        ]}
        accessibilityLabel={`Seçeneği seç: ${opt}`}
      >
        <Text style={[s.optText, { color: fg }]}>{opt}</Text>
        {lockedState === "right" && (
          <View style={s.optIcon}>
            <Icon d={ICONS.check} size={18} stroke="#fff" sw={2.8} />
          </View>
        )}
        {lockedState === "wrong" && (
          <View style={s.optIcon}>
            <Icon d={ICONS.x} size={18} stroke="#fff" sw={2.8} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    center: { alignItems: "center", justifyContent: "center" },

    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    counter: {
      fontFamily: c.fontNum,
      fontSize: 13,
      color: c.textSec,
      minWidth: 38,
      textAlign: "right",
    },

    prompt: {
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 50,
      paddingBottom: 30,
    },
    chipAccent: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: c.accentGlow,
      borderWidth: 1,
      borderColor: c.borderAccent,
    },
    chipAccentTxt: {
      fontFamily: c.fontBodySemi,
      fontSize: 12,
      color: c.accent,
      letterSpacing: 0.3,
    },
    wordRow: { marginTop: 22 },
    word: {
      fontFamily: c.fontDisplay,
      fontSize: 52,
      lineHeight: 56,
      color: c.textPrimary,
      textAlign: "center",
    },
    sub: {
      fontFamily: c.fontBody,
      fontSize: 13,
      color: c.textSec,
      marginTop: 8,
    },

    grid: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      paddingHorizontal: 18,
      paddingBottom: 30,
      alignContent: "flex-end",
    },
    optWrap: {
      width: "48%",
    },
    opt: {
      borderWidth: 1.5,
      borderRadius: 16,
      paddingVertical: 22,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 70,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 24,
      elevation: 0,
    },
    optText: {
      fontFamily: c.fontBodyBold,
      fontSize: 17,
      textAlign: "center",
    },
    optIcon: {
      position: "absolute",
      top: 8,
      right: 10,
    },
  });
}
