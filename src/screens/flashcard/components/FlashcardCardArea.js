/**
 * FlashcardCardArea — progress bar + flip card + sade chevron gezinme.
 * Son karta gelince sağ chevron yeşil "Çalışmaya Geç" CTA'ya dönüşür.
 */
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import FlipCard from "../../../components/design/FlipCard";
import Icon, { ICONS } from "../../../components/design/Icon";

export default function FlashcardCardArea({
  words,
  currentIndex,
  setCurrentIndex,
  onComplete,
  listId,
}) {
  const { c } = useTheme();
  const current = words[currentIndex];
  if (!current) return null;

  const isLast = currentIndex === words.length - 1;
  const isFirst = currentIndex === 0;
  const pct = ((currentIndex + 1) / words.length) * 100;

  const goPrev = () => {
    if (isFirst) return;
    Haptics.selectionAsync();
    setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (isLast) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete?.();
    } else {
      Haptics.selectionAsync();
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {/* Progress bar + sayaç */}
      <View style={s.progressRow}>
        <View style={[s.track, { backgroundColor: c.bgSurface }]}>
          <View style={[s.fill, { width: `${pct}%`, backgroundColor: c.accent }]} />
        </View>
        <Text style={[s.counter, { color: c.textSec, fontFamily: c.fontNum }]}>
          {currentIndex + 1}/{words.length}
        </Text>
      </View>

      {/* Card */}
      <View style={s.cardArea}>
        <FlipCard
          key={current.id}
          wordId={current.id}
          listId={listId}
          word={current.word}
          meaning={current.meaning}
          example={current.example}
          exampleTr={current.example_tr || current.exampleTr}
          onReport={() => console.log("[Report]", current.id)}
        />
      </View>

      {/* Chevron gezinme — belirgin accent tonu */}
      <View style={s.navRow}>
        <Pressable
          onPress={goPrev}
          disabled={isFirst}
          hitSlop={14}
          style={({ pressed }) => [
            s.chev,
            {
              backgroundColor: c.accent + "38",
              borderColor: c.accent + "CC",
              shadowColor: c.accent,
              opacity: isFirst ? 0.3 : 1,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
          accessibilityLabel="Önceki kelime"
        >
          <Icon d="M15 6l-6 6 6 6" size={24} stroke={c.accent} sw={3} />
        </Pressable>

        <Pressable
          onPress={goNext}
          disabled={isLast}
          hitSlop={14}
          style={({ pressed }) => [
            s.chev,
            {
              backgroundColor: c.accent + "38",
              borderColor: c.accent + "CC",
              shadowColor: c.accent,
              opacity: isLast ? 0.3 : 1,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
          accessibilityLabel="Sonraki kelime"
        >
          <Icon d="M9 6l6 6-6 6" size={24} stroke={c.accent} sw={3} />
        </Pressable>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 22,
    marginTop: 14,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99 },
  counter: { fontSize: 12, minWidth: 36, textAlign: "right" },

  cardArea: { flex: 1, justifyContent: "center", paddingHorizontal: 28, paddingVertical: 18 },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 22,
    marginTop: 12,
  },
  chev: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 5,
  },
  completeCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 4,
  },
  completeTxt: { fontSize: 14, letterSpacing: 0.3 },
});
