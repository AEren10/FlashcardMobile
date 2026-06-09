/**
 * RatingChip — küçük rating chip (yıldız + ortalama).
 * Liste kartlarında kullanılır — sosyal proof görünür hale gelir.
 *
 * `avg` 0 ise hiç render etmez (boş kart spam yok).
 * `count` 0 ise sadece "Yeni" göster (opsiyonel — şimdilik null döner).
 */
import { radius, spacing } from "../../themes/tokens";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function RatingChip({ avg = 0, count = 0, size = "sm", c }) {
  if (!avg || avg <= 0) return null;
  const rounded = Math.round(avg * 10) / 10;
  const compact = size === "sm";

  return (
    <View
      style={[
        s.wrap,
        {
          paddingHorizontal: compact ? 7 : 9,
          paddingVertical: compact ? 3 : 4,
          backgroundColor: c?.warningDim || "rgba(212,164,87,0.16)",
          borderColor: c?.warning ? c.warning + "55" : "rgba(212,164,87,0.4)",
        },
      ]}
    >
      <Svg width={compact ? 10 : 12} height={compact ? 10 : 12} viewBox="0 0 24 24">
        <Path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={c?.warning || "#D4A457"}
        />
      </Svg>
      <Text
        style={{
          fontSize: compact ? 10 : 11,
          color: c?.warning || "#D4A457",
          fontFamily: c?.fontBodyBold || undefined,
          fontWeight: "700",
          letterSpacing: 0.2,
        }}
      >
        {rounded}
        {count > 0 && (
          <Text style={{ color: c?.textMuted || "#8a8480", fontWeight: "400" }}>
            {" "}· {count}
          </Text>
        )}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
});
