/**
 * FlashcardCTAs — Study (SRS) + Quiz butonları.
 * Liste zorluk seviyesine göre tint'lenir (props.tint).
 * tint yoksa default brand renkleri.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import T from "../../../themes/tokens";

const MIN_QUIZ_WORDS = 4;

export default function FlashcardCTAs({ wordCount, onStudy, onQuiz, tint }) {
  const quizDisabled = wordCount < MIN_QUIZ_WORDS;
  // tint varsa onun rengini kullan, yoksa brand accent
  const studyBg = tint ? hexAlpha(tint.color, 0.16) : T.limeDim;
  const studyBorder = tint ? hexAlpha(tint.color, 0.32) : T.borderAccent;
  const studyText = tint ? tint.color : T.lime;

  return (
    <View style={s.row}>
      <Pressable
        onPress={onStudy}
        style={[s.btn, { backgroundColor: studyBg, borderColor: studyBorder }]}
        accessibilityLabel="SRS modu ile çalış"
      >
        <Text style={[s.txt, { color: studyText }]}>🧠 Çalış (SRS)</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (quizDisabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } else {
            onQuiz?.();
          }
        }}
        style={[
          s.btn,
          {
            backgroundColor: quizDisabled
              ? T.surface
              : tint
                ? hexAlpha(tint.color, 0.16)
                : T.skyDim,
            borderColor: quizDisabled
              ? T.border
              : tint
                ? hexAlpha(tint.color, 0.32)
                : "rgba(77,201,255,0.2)",
          },
        ]}
        accessibilityLabel="Quiz modu"
      >
        <Text
          style={[
            s.txt,
            {
              color: quizDisabled
                ? T.textMuted
                : tint
                  ? tint.color
                  : T.sky,
            },
          ]}
        >
          🧩 Quiz {quizDisabled ? `(${MIN_QUIZ_WORDS}+ kelime)` : ""}
        </Text>
      </Pressable>
    </View>
  );
}

/** Hex rengin alpha versiyonunu rgba olarak döner. */
function hexAlpha(hex, alpha = 1) {
  if (!hex || !hex.startsWith("#")) return hex;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, paddingHorizontal: 22, marginTop: 10 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  txt: { fontSize: 14, fontFamily: T.fontBodyBold },
});
