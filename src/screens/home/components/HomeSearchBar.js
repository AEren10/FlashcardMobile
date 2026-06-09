/**
 * HomeSearchBar — Ana sayfada challenge altında "Listede ara…" bar.
 * Tap → ListExplorer'a search modunda gider.
 */
import { radius } from "../../../themes/tokens";
import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";

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
      <Icon d={ICONS.search} size={16} stroke={c.textMuted} sw={1.8} />
      <Text style={[s.txt, { color: c.textMuted, fontFamily: c.fontBody }]}>
        Liste veya kelime ara…
      </Text>
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
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: 18,
  },
  txt: { flex: 1, fontSize: 14 },
});
