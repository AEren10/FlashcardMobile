/**
 * FlashcardCardArea — progress bar + flip card + swipe gezinme.
 */
import { radius, spacing } from "../../../themes/tokens";
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
  onKnowCurrent,
  listId,
}) {
  const { c } = useTheme();
  const current = words[currentIndex];
  if (!current) return null;

  const isLast = currentIndex === words.length - 1;
  const pct = ((currentIndex + 1) / words.length) * 100;

  return (
    <>
      {/* Sticky progress bar */}
      <View style={[s.progressRow, { backgroundColor: c.bgBase, borderBottomColor: c.divider }]}>
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

      {/* Mini-SRS: kelimeyi GRADE.GRADUATE et — swipe ile gezin, chevron kaldırıldı */}
      {onKnowCurrent && (
        <View style={s.navRow}>
          <Pressable
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onKnowCurrent(current);
              if (!isLast) setCurrentIndex(currentIndex + 1);
            }}
            hitSlop={10}
            style={({ pressed }) => [
              s.knowChip,
              {
                backgroundColor: c.success + "26",
                borderColor: c.success + "AA",
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
            accessibilityLabel="Bu kelimeyi biliyorum"
          >
            <Icon d={ICONS.check} size={14} stroke={c.success} sw={2.4} />
            <Text style={{ fontSize: 12, color: c.success, fontFamily: c.fontBodyBold, letterSpacing: 0.3 }}>
              Biliyorum
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: radius.full },
  counter: { fontSize: 12, minWidth: 36, textAlign: "right" },

  cardArea: { flex: 1, justifyContent: "center", paddingHorizontal: 28, paddingVertical: 18 },

  navRow: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  knowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  completeCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: 22,
    borderRadius: radius.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 4,
  },
  completeTxt: { fontSize: 14, letterSpacing: 0.3 },
});
