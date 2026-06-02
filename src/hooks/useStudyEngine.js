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
import { startSession } from "../supabase/progress";
import { safeRecordReview, safeFinishSession } from "../lib/offlineQueue";
import { GRADE } from "../lib/srs";
import { shuffle } from "../utils/shuffle";
import { maybeRequestReview } from "../utils/rateApp";
import {
  addToMistakesList,
  bumpMistakesStreak,
  resetMistakesStreak,
} from "../supabase/mistakesList";

const MISTAKES_MODAL_THRESHOLD = 5;
const CONFETTI_STREAK = 5;

export default function useStudyEngine({ listId, presetWords, presetMode }) {
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

  // Bitirme akışı — mistakes push + modal kararı
  const finishSeason = useCallback(
    async (lastWasCorrect, lastWordWrong = null) => {
      setDone(true);
      const duration = Math.round((Date.now() - startedAt.current) / 1000);
      setFinalDuration(duration);
      safeFinishSession(sessionRef.current?.id, {
        total_words: words.length,
        correct: lastWasCorrect ? correct + 1 : correct,
        duration_sec: duration,
      }).catch(() => {});
      maybeRequestReview();

      const allWrongIds = lastWordWrong ? [...wrongIds, lastWordWrong] : wrongIds;
      if (allWrongIds.length === 0) return;

      const res = await addToMistakesList(allWrongIds);
      if (res.success && res.addedCount > 0) {
        setMistakesAdded(res.addedCount);
        setMistakesListId(res.listId);
        if (res.addedCount >= MISTAKES_MODAL_THRESHOLD) {
          setTimeout(() => setShowMistakesModal(true), 600);
        }
      }
    },
    [words.length, correct, wrongIds]
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
    advance,
    finishSeason,
    restart,
  };
}
