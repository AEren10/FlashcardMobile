/**
 * HomeSearchBar — Ana sayfada challenge altında "Listede ara…" bar.
 * Tap → ListExplorer'a search modunda gider.
 */
import { radius } from "../../../themes/tokens";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
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
          borderColor: c.cobalt + "55",
          shadowColor: c.cobalt,
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      accessibilityLabel="Listelerde ara"
    >
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.cobalt + "18", alignItems: "center", justifyContent: "center" }}>
        <Icon d={ICONS.search} size={16} stroke={c.cobalt} sw={2} />
      </View>
      <Text style={[s.txt, { color: c.textSec, fontFamily: c.fontBody }]}>
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
