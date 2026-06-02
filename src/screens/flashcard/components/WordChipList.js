/**
 * WordChipList — horizontal scroll, aktif kelimeyi vurgular.
 */
import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import T from "../../../themes/tokens";

export default function WordChipList({ words, currentIndex, onSelect }) {
  return (
    <View style={s.section}>
      <Text style={s.title}>Kelimeler</Text>
      <FlatList
        data={words}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 22 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => onSelect(index)}
            style={[s.chip, index === currentIndex && s.chipActive]}
          >
            <Text
              style={[s.chipText, index === currentIndex && s.chipTextActive]}
              numberOfLines={1}
            >
              {item.word}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginTop: 14, paddingBottom: 110 },
  title: {
    fontSize: 12,
    fontFamily: T.fontBodyBold,
    color: T.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 22,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: T.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  chipActive: { backgroundColor: T.limeDim, borderColor: T.borderAccent },
  chipText: { fontSize: 13, color: T.textSec, fontFamily: T.fontBody },
  chipTextActive: { color: T.lime, fontFamily: T.fontBodySemi },
});
