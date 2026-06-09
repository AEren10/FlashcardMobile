/* global setTimeout */
/**
 * QuizScreen — Claude Design v2.
 * Header: X close + shimmer progress + counter
 * Prompt: chip + 52pt display word
 * Options: 2×2 grid, correct → green spring pop + auto-next 650ms,
 *          wrong → red shake + correct reveal in green + 1200ms hold
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fontSize, radius, spacing } from "../../themes/tokens";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { speak as ttsSpeak } from "../../lib/tts";

import { useTheme } from "../../contexts/ThemeContext";
import { getListWords } from "../../supabase/database";
import { startSession } from "../../supabase/progress";
import { track, EVENTS } from "../../lib/track";
import { safeRecordReview, safeFinishSession } from "../../lib/offlineQueue";
import { GRADE } from "../../lib/srs";
import { shuffle } from "../../utils/shuffle";
import { maybeRequestReview } from "../../utils/rateApp";
import Icon, { ICONS } from "../../components/design/Icon";
import ProgressBar from "../../components/design/ProgressBar";
import EmptyState from "../../components/EmptyState";
import QuizResultScreen from "../../components/design/QuizResultScreen";
import MistakesListModal from "../../components/design/MistakesListModal";
import QuizModeModal from "../../components/design/QuizModeModal";
import QuizLoadingState from "./components/QuizLoadingState";
import {
  addToMistakesList,
  bumpMistakesStreak,
  resetMistakesStreak,
} from "../../supabase/mistakesList";
import { useToast } from "../../contexts/ToastContext";

const MISTAKES_MODAL_THRESHOLD = 5;
const TIME_LIMIT = 10; // saniye

export default function QuizScreen({ route, navigation }) {
  const {
    listId,
    listTitle,
    presetWords,
    presetTitle,
    timed: timedParam,
    mode: modeParam, // "classic" (default) | "blank" (boşluk doldurma)
  } = route.params ?? {};
  // Mode state — route'tan gelir veya modal'dan seçilir
  const [mode, setMode] = useState(modeParam === "blank" ? "blank" : "classic");
  const isBlank = mode === "blank";
  // Eğer route'tan gelmediyse modal ile sor
  const [modeChosen, setModeChosen] = useState(timedParam !== undefined || modeParam === "blank");
  const [timed, setTimed] = useState(timedParam === true);
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const toast = useToast();

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [correctIds, setCorrectIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [finalDuration, setFinalDuration] = useState(0);
  const [mistakesAdded, setMistakesAdded] = useState(0);
  const [mistakesListId, setMistakesListId] = useState(null);
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const timerAnim = useRef(new Animated.Value(1)).current;
  const sessionRef = useRef(null);
  const startedAt = useRef(Date.now());
  const title = presetTitle ?? listTitle ?? "Quiz";

  // Tab bar'ı sakla — Quiz full-screen
  useLayoutEffect(() => {
    const stack = navigation.getParent();
    const tab = stack?.getParent();
    tab?.setOptions({ tabBarStyle: { display: "none" } });
    return () => tab?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const loadWords = React.useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    let list = null;
    if (presetWords?.length) {
      list = presetWords;
    } else {
      try {
        const res = await getListWords(listId);
        if (res?.success === false) {
          setFetchError(true);
          setLoading(false);
          return;
        }
        list = res?.data ?? [];
      } catch {
        setFetchError(true);
        setLoading(false);
        return;
      }
    }
    // Blank mode'da SADECE örnek cümlesi olan kelimeleri al
    // Yetersizse (4'ten az) → otomatik classic moda düş + UX uyarısı
    let finalList = list || [];
    if (mode === "blank") {
      const withExample = finalList.filter((w) => w.example && w.example.trim());
      if (withExample.length < 4) {
        // Fallback: tüm liste ile classic
        setMode("classic");
        Alert.alert(
          "Boşluk Doldurma kullanılamaz",
          "Bu listedeki kelimelerin yeterli örnek cümlesi yok. Klasik moda geçildi.",
          [{ text: "Tamam" }]
        );
      } else {
        finalList = withExample;
      }
    }
    setWords(shuffle(finalList));
    setLoading(false);
    sessionRef.current = await startSession({ list_id: listId ?? null, mode: "quiz" });
    track(EVENTS.STUDY_START, { mode: "quiz", quizMode: mode, listId: listId ?? null, count: finalList.length });
  }, [listId, presetWords, mode]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadWords();
    })();
    return () => {
      mounted = false;
    };
  }, [loadWords]);

  const current = words[index];

  // Timed mode — her yeni soru için 10sn countdown
  useEffect(() => {
    if (!timed || !current || picked) return;
    timerAnim.setValue(1);
    const anim = Animated.timing(timerAnim, {
      toValue: 0,
      duration: TIME_LIMIT * 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => {
      if (finished && !picked) {
        // Zaman doldu → otomatik yanlış (current.meaning değil bir şey pick et)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        pick("__TIMEOUT__", -1);
      }
    });
    return () => anim.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current?.id, timed]);

  // mode "blank" → boşluk doldurma: doğru cevap = word (kelime)
  // mode "classic" → doğru cevap = meaning (anlam)
  const correctAnswer = isBlank ? current?.word : current?.meaning;

  const options = useMemo(() => {
    if (!current || words.length < 4) return [];
    const distractors = words
      .filter((w) => w.id !== current.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => (isBlank ? w.word : w.meaning));
    return shuffle([isBlank ? current.word : current.meaning, ...distractors]);
  }, [current, words, isBlank]);

  // Boşluk doldurma için cümle üret: kelimeyi "_____" ile değiştir.
  // Safety: DB'de "theory2" gibi suffix kalmış olabilir → suffix strip + base word fallback
  // Ayrıca word stemleri (theory/theories, run/running) için kök eşleştirme dene
  const blankedSentence = useMemo(() => {
    if (!isBlank || !current?.example) return null;
    const raw = current.word || "";
    const baseWord = raw.replace(/\d+$/, "").trim(); // suffix kaldır
    if (!baseWord) return current.example;
    try {
      // Önce tam kelime, sonra base (suffix'siz). En son stem (ilk 5 harf + \w*) — son çare
      const escaped = baseWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let regex = new RegExp(`\\b${escaped}\\b`, "gi");
      let result = current.example.replace(regex, "_____");
      if (result === current.example && baseWord.length >= 4) {
        // Eşleşme yok → stem fallback (kelime ilk 4 harf + olası ekler: theory → theor + ies/y)
        const stem = baseWord.slice(0, Math.max(4, Math.floor(baseWord.length * 0.7)));
        const stemEscaped = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        regex = new RegExp(`\\b${stemEscaped}\\w*\\b`, "gi");
        result = current.example.replace(regex, "_____");
      }
      return result;
    } catch {
      return current.example.replace(baseWord, "_____");
    }
  }, [current, isBlank]);

  // Unmount + race guard'lar
  const unmountedRef = useRef(false);
  const pickingRef = useRef(false);
  const advanceTimerRef = useRef(null);
  const mistakesTimerRef = useRef(null);
  useEffect(() => () => {
    unmountedRef.current = true;
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (mistakesTimerRef.current) clearTimeout(mistakesTimerRef.current);
  }, []);

  const pick = async (opt, i) => {
    // Double-tap race fix: setState async, ref senkron — ref ile lock
    if (pickingRef.current || picked) return;
    pickingRef.current = true;
    const isCorrect = opt === correctAnswer;
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

    // Mistakes streak: doğru ise artır (3 = listeden çık), yanlışsa sıfırla
    if (isCorrect) {
      bumpMistakesStreak(current.id, current.word, current.meaning).catch(() => {});
    } else {
      resetMistakesStreak(current.id).catch(() => {});
    }

    const wait = isCorrect ? 650 : 1250;
    advanceTimerRef.current = setTimeout(async () => {
      advanceTimerRef.current = null;
      if (unmountedRef.current) return; // unmount → state update yapma
      if (index + 1 >= words.length) {
        const finalCorrect = isCorrect ? correct + 1 : correct;
        const duration = Math.round((Date.now() - startedAt.current) / 1000);
        if (unmountedRef.current) return;
        setFinalDuration(duration);
        await safeFinishSession(sessionRef.current?.id, {
          total_words: words.length,
          correct: finalCorrect,
          duration_sec: duration,
        });
        if (unmountedRef.current) return;
        setDone(true);
        track(EVENTS.QUIZ_FINISH, {
          mode: "quiz",
          quizMode: mode,
          listId: listId ?? null,
          total: words.length,
          correct: finalCorrect,
          duration_sec: duration,
          accuracy: words.length ? Math.round((finalCorrect / words.length) * 100) : 0,
        });
        maybeRequestReview();

        // Yanlışları mistakes listesine push et
        const allWrongIds = isCorrect ? wrongIds : [...wrongIds, current.id];
        if (allWrongIds.length > 0) {
          const res = await addToMistakesList(allWrongIds);
          if (unmountedRef.current) return;
          if (res.success && res.addedCount > 0) {
            setMistakesAdded(res.addedCount);
            setMistakesListId(res.listId);
            // Her zaman toast — kullanıcı sessizce eklendiğini bilmesin
            toast?.show?.({
              message: `${res.addedCount} kelime Hatalar listene eklendi`,
              type: "info",
              duration: 3500,
            });
            if (res.addedCount >= MISTAKES_MODAL_THRESHOLD) {
              mistakesTimerRef.current = setTimeout(() => {
                mistakesTimerRef.current = null;
                if (!unmountedRef.current) setShowMistakesModal(true);
              }, 600);
            }
          }
        }
      } else {
        setPicked(null);
        setIndex((ix) => ix + 1);
      }
      pickingRef.current = false; // Lock'u serbest bırak, sonraki tap kabul edilir
    }, wait);
  };

  const restart = async () => {
    setIndex(0);
    setCorrect(0);
    setPicked(null);
    setDone(false);
    setMistakesAdded(0);
    setMistakesListId(null);
    setShowMistakesModal(false);
    setCorrectIds([]);
    setWrongIds([]);
    setFinalDuration(0);
    startedAt.current = Date.now();
    setWords(shuffle(words));
    sessionRef.current = await startSession({ list_id: listId ?? null, mode: "quiz" });
  };

  // Mode seçilmemişse → modal
  if (!modeChosen) {
    return (
      <View style={s.root}>
        <QuizModeModal
          visible={!modeChosen}
          onPick={({ timed: isTimed, mode: pickedMode }) => {
            setTimed(!!isTimed);
            if (pickedMode === "blank") setMode("blank");
            setModeChosen(true);
          }}
          onClose={() => navigation.goBack()}
        />
      </View>
    );
  }

  if (loading) {
    return <QuizLoadingState s={s} />;
  }

  if (fetchError) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <EmptyState
            kind="offline"
            title="Kelimeler yüklenemedi"
            subtitle="İnternet bağlantını kontrol et ve tekrar dene."
            actionLabel="Tekrar dene"
            onAction={loadWords}
            secondaryLabel="Geri dön"
            onSecondary={() => navigation.goBack()}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (words.length < 4) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <EmptyState
            kind="search"
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
      .filter(Boolean)
      .map((w) => ({ ...w, list_id: listId }));

    const goToMistakesList = () => {
      setShowMistakesModal(false);
      if (mistakesListId) {
        navigation.replace("Study", {
          listId: mistakesListId,
          listTitle: "Bilemediğin Kelimeler",
        });
      } else {
        navigation.goBack();
      }
    };

    return (
      <>
        <QuizResultScreen
          correct={correct}
          total={words.length}
          durationSec={finalDuration}
          correctWords={correctWords}
          wrongWords={wrongWords}
          mistakesAdded={mistakesAdded}
          listId={listId}
          onRetry={restart}
          onFinish={() => navigation.goBack()}
        />
        <MistakesListModal
          visible={showMistakesModal}
          addedCount={mistakesAdded}
          onStudy={goToMistakesList}
          onLater={() => setShowMistakesModal(false)}
        />
      </>
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
          <View style={{ flex: 1, gap: spacing.xs }}>
            <ProgressBar progress={progress} height={6} />
            {timed && (
              <View style={{ height: 3, backgroundColor: c.bgSurface, borderRadius: radius.full, overflow: "hidden" }}>
                <Animated.View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: c.cobalt,
                    borderRadius: radius.full,
                    // ScaleX native driver — smooth 60fps, soldan kısalır
                    transform: [{ translateX: 0 }, { scaleX: timerAnim }],
                    transformOrigin: "left",
                  }}
                />
              </View>
            )}
          </View>
          <Text style={s.counter}>
            {index + 1}/{words.length}
          </Text>
        </View>

        {/* Prompt */}
        <View style={s.prompt}>
          <View style={s.chipAccent}>
            <Text style={s.chipAccentTxt}>
              {isBlank ? "Boşluk Doldurma" : "Quiz · Çoktan seçmeli"}
            </Text>
          </View>
          {isBlank ? (
            <>
              <View style={s.blankSentenceBox}>
                <Text style={s.blankSentence}>"{blankedSentence}"</Text>
              </View>
              <Text style={s.sub}>
                Boşluğa hangi kelime gelir? · Anlam: <Text style={{ color: c.accent, fontFamily: c.fontBodyBold }}>{current.meaning}</Text>
              </Text>
            </>
          ) : (
            <>
              <Pressable
                style={s.wordRow}
                onPress={() => ttsSpeak(current.word)}
                accessibilityLabel="Telaffuzu dinle"
              >
                <Text style={s.word}>{current.word}</Text>
              </Pressable>
              <Text style={s.sub}>Bu kelimenin anlamı?</Text>
            </>
          )}
        </View>

        {/* 2×2 grid */}
        <View style={s.grid}>
          {options.map((opt, i) => (
            <OptionButton
              key={opt + i}
              opt={opt}
              i={i}
              picked={picked}
              correctAnswer={correctAnswer}
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
  const opacity = lockedState === "dim" ? 0.25 : 1;
  const shadowOpacity = lockedState === "right" ? 0.5 : 0;

  // dim olduğunda hafif aşağı kay (fade-down)
  const dimY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (lockedState === "dim") {
      Animated.timing(dimY, {
        toValue: 6,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      dimY.setValue(0);
    }
  }, [lockedState, dimY]);

  return (
    <Animated.View
      style={[
        s.optWrap,
        {
          transform: [{ scale }, { translateX: shakeX }, { translateY: dimY }],
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
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    counter: {
      fontFamily: c.fontNum,
      fontSize: fontSize.md,
      color: c.textSec,
      minWidth: 38,
      textAlign: "right",
    },

    blankSentenceBox: {
      paddingHorizontal: 26,
      paddingVertical: 22,
      marginTop: spacing.md,
      borderRadius: radius.md,
      backgroundColor: c.bgElevated,
      borderWidth: 1.5,
      borderColor: c.accent + "55",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 4,
    },
    blankSentence: {
      fontFamily: c.fontDisplay,
      fontSize: 24,
      lineHeight: 32,
      color: c.textPrimary,
      textAlign: "center",
      fontStyle: "italic",
    },
    prompt: {
      alignItems: "center",
      paddingHorizontal: spacing.xxl,
      paddingTop: 50,
      paddingBottom: 30,
    },
    chipAccent: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radius.full,
      backgroundColor: c.accentGlow,
      borderWidth: 1,
      borderColor: c.borderAccent,
    },
    chipAccentTxt: {
      fontFamily: c.fontBodySemi,
      fontSize: fontSize.sm,
      color: c.accent,
      letterSpacing: 0.3,
    },
    wordRow: { marginTop: 22 },
    word: {
      fontFamily: c.fontDisplay,
      fontSize: fontSize["4xl"],
      lineHeight: 56,
      color: c.textPrimary,
      textAlign: "center",
    },
    sub: {
      fontFamily: c.fontBody,
      fontSize: fontSize.md,
      color: c.textSec,
      marginTop: spacing.sm,
    },

    grid: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
      paddingHorizontal: 18,
      paddingBottom: 30,
      alignContent: "center",
      justifyContent: "center",
    },
    optWrap: {
      width: "48%",
    },
    opt: {
      borderWidth: 1.5,
      borderRadius: radius.md,
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
      fontSize: fontSize.lg,
      textAlign: "center",
    },
    optIcon: {
      position: "absolute",
      top: 8,
      right: 10,
    },
  });
}
