/**
 * StudyDoneState — StudyScreen oturum sonu sonucu.
 * Ayrı dosya (modülarite).
 *
 * Yeni: 1. başarılı session sonrası bildirim izni iste (AHA sonrası ask).
 */
import React, { useEffect, useMemo, useRef } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudyResultScreen from "../../../components/design/StudyResultScreen";
import MistakesListModal from "../../../components/design/MistakesListModal";
import { activateRemindersWithPrompt, getPermissionStatus } from "../../../lib/notifications";

const PERMISSION_ASKED_KEY = "@fc:notif_permission_asked";

export default function StudyDoneState({ engine, navigation, listId }) {
  const askedRef = useRef(false);

  // İlk başarılı session sonrası bildirim izni iste — AHA moment sonrası
  useEffect(() => {
    if (askedRef.current) return;
    if ((engine.correct || 0) === 0) return; // başarısızsa sorma
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
        // 1.2sn bekle — celebration ses kesilmesin
        setTimeout(() => {
          Alert.alert(
            "Şeritini koruyalım mı?",
            "Sabah ve akşam nazik bir hatırlatmayla şeritini büyütmene yardım edelim.",
            [
              { text: "Daha sonra", style: "cancel" },
              {
                text: "Tamam",
                onPress: () => activateRemindersWithPrompt().catch(() => {}),
              },
            ]
          );
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
    </>
  );
}
