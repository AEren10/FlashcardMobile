/**
 * HomeSearchBar — Ana sayfada challenge altında "Listede ara…" bar.
 * Tap → ListExplorer'a search modunda gider.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";

export default function HomeSearchBar({ onPress }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        s.wrap,
        {
          backgroundColor: c.bgElevated,
          borderColor: c.border,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
      accessibilityLabel="Listelerde ara"
    >
      <Text style={s.icon}>🔍</Text>
      <Text style={[s.txt, { color: c.textMuted, fontFamily: c.fontBody }]}>
        Liste veya kelime ara…
      </Text>
      <View style={[s.kbHint, { backgroundColor: c.bgSurface }]}>
        <Text style={[s.kbTxt, { color: c.textMuted, fontFamily: c.fontBodyBold }]}>
          ⌘ K
        </Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
  },
  icon: { fontSize: 14, opacity: 0.7 },
  txt: { flex: 1, fontSize: 14 },
  kbHint: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  kbTxt: { fontSize: 10, letterSpacing: 0.3 },
});
