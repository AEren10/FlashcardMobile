/**
 * WordChipList — horizontal scroll, aktif kelimeyi vurgular.
 */
import { radius } from "../../../themes/tokens";
import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";

export default function WordChipList({ words, currentIndex, onSelect }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
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

function makeStyles(c) {
  return StyleSheet.create({
    section: { marginTop: 14, paddingBottom: 110 },
    title: {
      fontSize: 12,
      fontFamily: c.fontBodyBold,
      color: c.textMuted,
      letterSpacing: 1,
      textTransform: "uppercase",
      paddingHorizontal: 22,
      marginBottom: 8,
    },
    chip: {
      backgroundColor: c.bgElevated,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.full,
      marginRight: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipActive: { backgroundColor: c.accentGlow, borderColor: c.borderAccent },
    chipText: { fontSize: 13, color: c.textSec, fontFamily: c.fontBody },
    chipTextActive: { color: c.accent, fontFamily: c.fontBodySemi },
  });
}
