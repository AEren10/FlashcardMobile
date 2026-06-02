/**
 * FlashcardCardArea — progress bar + flip card + prev/next buttons.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import T from "../../../themes/tokens";
import FlipCard from "../../../components/design/FlipCard";

export default function FlashcardCardArea({ words, currentIndex, setCurrentIndex, onComplete }) {
  const current = words[currentIndex];
  if (!current) return null;

  return (
    <>
      <View style={s.progressRow}>
        <Text style={s.progressLabel}>
          {currentIndex + 1} / {words.length}
        </Text>
        <View style={s.progressTrack}>
          <View
            style={[s.progressFill, { width: `${((currentIndex + 1) / words.length) * 100}%` }]}
          />
        </View>
      </View>

      <View style={s.cardArea}>
        <FlipCard
          key={current.id}
          word={current.word}
          meaning={current.meaning}
          example={current.example}
        />
      </View>

      <View style={s.navRow}>
        <Pressable
          onPress={() => {
            if (currentIndex > 0) {
              Haptics.selectionAsync();
              setCurrentIndex(currentIndex - 1);
            }
          }}
          disabled={currentIndex === 0}
          style={[s.navBtn, currentIndex === 0 && s.navBtnDisabled]}
          accessibilityLabel="Önceki kelime"
        >
          <Text style={[s.navText, currentIndex === 0 && s.navTextDisabled]}>← Önceki</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (currentIndex < words.length - 1) {
              Haptics.selectionAsync();
              setCurrentIndex(currentIndex + 1);
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onComplete?.();
            }
          }}
          style={[s.navBtn, currentIndex === words.length - 1 && s.navBtnLast]}
          accessibilityLabel={currentIndex === words.length - 1 ? "Tüm kelimeleri gördün" : "Sonraki kelime"}
        >
          <Text style={[s.navText, currentIndex === words.length - 1 && s.navTextLast]}>
            {currentIndex === words.length - 1 ? "✓ Tamam" : "Sonraki →"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  progressRow: { paddingHorizontal: 22, marginTop: 14, gap: 6 },
  progressLabel: { fontSize: 12, color: T.textSec, fontFamily: T.fontBody, textAlign: "center" },
  progressTrack: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: T.lime, borderRadius: 99 },

  cardArea: { flex: 1, justifyContent: "center", paddingHorizontal: 28, minHeight: 200 },

  navRow: { flexDirection: "row", gap: 10, paddingHorizontal: 22, marginTop: 8 },
  navBtn: {
    flex: 1,
    backgroundColor: T.bgCard,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: T.border,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnLast: { backgroundColor: T.limeDim, borderColor: T.borderAccent },
  navText: { fontSize: 14, color: T.text, fontFamily: T.fontBodySemi },
  navTextDisabled: { color: T.textMuted },
  navTextLast: { color: T.lime },
});
