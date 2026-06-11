/**
 * StudyDoneState — StudyScreen oturum sonu sonucu.
 * Ayrı dosya (modülarite).
 *
 * Yeni: 1. başarılı session sonrası bildirim izni iste (AHA sonrası ask).
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudyResultScreen from "../../../components/design/StudyResultScreen";
import MistakesListModal from "../../../components/design/MistakesListModal";
import { activateRemindersWithPrompt, getPermissionStatus } from "../../../lib/notifications";
import { track, EVENTS } from "../../../lib/track";
import ConfirmDialog from "../../../components/design/ConfirmDialog";

const PERMISSION_ASKED_KEY = "@fc:notif_permission_asked";

export default function StudyDoneState({ engine, navigation, listId }) {
  const askedRef = useRef(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  useEffect(() => {
    if (askedRef.current) return;
    if ((engine.correct || 0) === 0) return;
    askedRef.current = true;
    (async () => {
      try {
        const asked = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
        if (asked) return;
        const status = await getPermissionStatus();
        if (status === "granted") {
          await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "1");
          return;
        }
        await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "1");
        setTimeout(() => {
          track(EVENTS.PUSH_PROMPT_SHOWN, { trigger: "first_study_done" });
          setShowNotifPrompt(true);
        }, 1200);
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // O(1) lookup — n^2 yerine
  const wordsById = useMemo(
    () => new Map(engine.words.map((w) => [w.id, w])),
    [engine.words]
  );
  const correctWords = useMemo(
    () => engine.correctIds.map((id) => wordsById.get(id)).filter(Boolean),
    [engine.correctIds, wordsById]
  );
  const wrongWordsList = useMemo(
    () =>
      engine.wrongIds
        .map((id) => wordsById.get(id))
        .filter(Boolean)
        .map((w) => ({ ...w, list_id: listId })),
    [engine.wrongIds, wordsById, listId]
  );

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
      <ConfirmDialog
        visible={showNotifPrompt}
        title="Şeritini koruyalım mı?"
        message="Sabah ve akşam nazik bir hatırlatmayla şeritini büyütmene yardım edelim."
        confirmText="Tamam"
        cancelText="Daha sonra"
        onConfirm={async () => {
          setShowNotifPrompt(false);
          const r = await activateRemindersWithPrompt().catch(() => ({ success: false }));
          track(EVENTS.PUSH_PROMPT_RESULT, { result: r?.success ? "granted" : "denied" });
        }}
        onCancel={() => {
          setShowNotifPrompt(false);
          track(EVENTS.PUSH_PROMPT_RESULT, { result: "later" });
        }}
      />
    </>
  );
}
