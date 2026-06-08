/**
 * useStudyEngine — Study session lifecycle + mistakes integration.
 * StudyScreen'ın business logic'i.
 *
 * Returns:
 *   words, current, index, loading, done
 *   correct, wrongIds, correctIds, streak, finalDuration
 *   mistakesAdded, mistakesListId, showMistakesModal
 *   answer(know), restart(), dismissMistakesModal()
 *   shouldShowConfetti
 */
import { useCallback, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";

import { getListWords } from "../supabase/database";
import { getStudyWords } from "../supabase/studyWords";
import { startSession } from "../supabase/progress";
import { track, EVENTS } from "../lib/track";
import { safeRecordReview, safeFinishSession } from "../lib/offlineQueue";
import { GRADE } from "../lib/srs";
import { shuffle } from "../utils/shuffle";
import { maybeRequestReview } from "../utils/rateApp";
import {
  addToMistakesList,
  bumpMistakesStreak,
  resetMistakesStreak,
} from "../supabase/mistakesList";
import { useAchievements } from "../contexts/AchievementsContext";
import { useToast } from "../contexts/ToastContext";

const MISTAKES_MODAL_THRESHOLD = 5;
const CONFETTI_STREAK = 5;

export default function useStudyEngine({ listId, presetWords, presetMode }) {
  const { trigger: triggerAchievement } = useAchievements();
  const toast = useToast();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctIds, setCorrectIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [finalDuration, setFinalDuration] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [mistakesAdded, setMistakesAdded] = useState(0);
  const [mistakesListId, setMistakesListId] = useState(null);
  const [showMistakesModal, setShowMistakesModal] = useState(false);

  const sessionRef = useRef(null);
  const startedAt = useRef(Date.now());

  // Words yükle + session başlat
  useEffect(() => {
    let mounted = true;
    (async () => {
      let list;
      if (presetWords?.length) {
        list = presetWords;
      } else if (listId) {
        // StudyModeModal'dan gelen mode'a göre filtreli kelimeler
        // presetMode: "smart" | "all" | "new" | "mistakes" — yoksa "all"
        const studyMode = ["smart", "new", "mistakes"].includes(presetMode)
          ? presetMode
          : "all";
        const res = await getStudyWords(listId, studyMode);
        list = res.data ?? [];
      } else {
        list = [];
      }
      if (!mounted) return;
      setWords(shuffle(list));
      setLoading(false);
      sessionRef.current = await startSession({
        list_id: listId ?? null,
        mode: presetMode ?? "srs",
      });
      track(EVENTS.STUDY_START, {
        mode: presetMode ?? "srs",
        listId: listId ?? null,
        count: list.length,
      });
    })();
    return () => {
      mounted = false;
    };
  }, [listId, presetWords, presetMode]);

  const current = words[index];

  // Bitirme akışı — mistakes push + modal kararı
  const finishSeason = useCallback(
    async (lastWasCorrect, lastWordWrong = null) => {
      setDone(true);
      const duration = Math.round((Date.now() - startedAt.current) / 1000);
      setFinalDuration(duration);
      const finalCorrect = lastWasCorrect ? correct + 1 : correct;
      safeFinishSession(sessionRef.current?.id, {
        total_words: words.length,
        correct: finalCorrect,
        duration_sec: duration,
      }).catch(() => {});
      track(EVENTS.QUIZ_FINISH, {
        mode: presetMode ?? "srs",
        listId: listId ?? null,
        total: words.length,
        correct: finalCorrect,
        duration_sec: duration,
        accuracy: words.length ? Math.round((finalCorrect / words.length) * 100) : 0,
      });
      maybeRequestReview();

      const allWrongIds = lastWordWrong ? [...wrongIds, lastWordWrong] : wrongIds;
      if (allWrongIds.length === 0) return;

      const res = await addToMistakesList(allWrongIds);
      if (res.success && res.addedCount > 0) {
        setMistakesAdded(res.addedCount);
        setMistakesListId(res.listId);
        toast?.show?.({
          message: `${res.addedCount} kelime Hatalar listene eklendi`,
          type: "info",
          duration: 3500,
        });
        if (res.addedCount >= MISTAKES_MODAL_THRESHOLD) {
          setTimeout(() => setShowMistakesModal(true), 600);
        }
      }
    },
    [words.length, correct, wrongIds, toast]
  );

  // Cevap işle (know/dont)
  const answer = useCallback(
    (know) => {
      if (!current) return null;

      Haptics.notificationAsync(
        know
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );

      const nextStreak = know ? streak + 1 : 0;
      setStreak(nextStreak);

      if (know && nextStreak >= CONFETTI_STREAK) {
        setConfettiKey((k) => k + 1);
      }

      if (know) {
        setCorrect((c) => c + 1);
        setCorrectIds((arr) => [...arr, current.id]);
      } else {
        setWrongIds((arr) => [...arr, current.id]);
      }

      // SRS review + mistakes streak
      safeRecordReview(current.id, know ? GRADE.GOOD : GRADE.AGAIN).catch(() => {});
      if (know) {
        bumpMistakesStreak(current.id, current.word, current.meaning).catch(() => {});
      } else {
        resetMistakesStreak(current.id).catch(() => {});
      }

      return { isLast: index + 1 >= words.length, know, wordId: current.id };
    },
    [current, streak, index, words.length]
  );

  const advance = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  /**
   * Detaylı puanlama — SRS GRADE.AGAIN/HARD/GOOD/EASY (4 buton UI).
   * AGAIN = bilemedi (wrong), HARD/GOOD/EASY = bildi (correct).
   */
  const answerGrade = useCallback(
    (grade) => {
      if (!current) return null;
      const isCorrect = grade !== GRADE.AGAIN;

      Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );

      const nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      if (isCorrect && nextStreak >= CONFETTI_STREAK) {
        setConfettiKey((k) => k + 1);
      }

      if (isCorrect) {
        setCorrect((c) => c + 1);
        setCorrectIds((arr) => [...arr, current.id]);
      } else {
        setWrongIds((arr) => [...arr, current.id]);
      }

      safeRecordReview(current.id, grade).catch(() => {});
      if (isCorrect) {
        bumpMistakesStreak(current.id, current.word, current.meaning).catch(() => {});
      } else {
        resetMistakesStreak(current.id).catch(() => {});
      }

      return { isLast: index + 1 >= words.length, know: isCorrect, wordId: current.id };
    },
    [current, streak, index, words.length]
  );

  // "Bu kelimeyi biliyorum" — SRS graduate, 21 gün sonra döner
  const graduateCurrent = useCallback(() => {
    if (!current) return;
    safeRecordReview(current.id, GRADE.GRADUATE).catch(() => {});
    bumpMistakesStreak(current.id, current.word, current.meaning).catch(() => {});
    setCorrect((c) => c + 1);
    setCorrectIds((arr) => [...arr, current.id]);
    // Achievement: ilk graduate
    triggerAchievement?.("word_graduated");
    // Sonraki karta geç
    setIndex((i) => i + 1);
  }, [current, triggerAchievement]);

  // "Yanlış çeviri bildir" — Supabase word_reports tablosuna yaz
  const reportCurrent = useCallback(async (reason = "wrong_translation", note = null) => {
    if (!current) return;
    try {
      const supabase = (await import("../supabase/client")).default;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("word_reports").insert({
        user_id: user.id,
        word_id: current.id,
        reason,
        note,
      });
    } catch (err) {
      console.warn("[reportCurrent] failed", err?.message);
    }
  }, [current]);

  const restart = useCallback(() => {
    setIndex(0);
    setCorrect(0);
    setDone(false);
    setStreak(0);
    setCorrectIds([]);
    setWrongIds([]);
    setFinalDuration(0);
    setMistakesAdded(0);
    setMistakesListId(null);
    setShowMistakesModal(false);
    startedAt.current = Date.now();
    setWords((w) => shuffle(w));
    startSession({ list_id: listId ?? null, mode: presetMode ?? "srs" }).then(
      (sess) => (sessionRef.current = sess)
    );
  }, [listId, presetMode]);

  return {
    words,
    current,
    index,
    loading,
    done,
    correct,
    correctIds,
    wrongIds,
    streak,
    finalDuration,
    confettiKey,
    mistakesAdded,
    mistakesListId,
    showMistakesModal,
    setShowMistakesModal,
    answer,
    answerGrade,
    advance,
    finishSeason,
    restart,
    graduateCurrent,
    reportCurrent,
  };
}
