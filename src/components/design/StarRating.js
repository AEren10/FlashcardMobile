/**
 * StarRating — 5 yıldız puan göstergesi / etkileşimli oy verici.
 * Props:
 *   value: 0-5 (decimal kabul eder, en yakın yarıya yuvarlanmaz; dolu eşiği >= i)
 *   onRate: (n) => void  → verilirse interactive
 *   size: yıldız ikon boyutu (px)
 *   showCount, count, avg: opsiyonel meta gösterimi
 *   color: dolu yıldız rengi (varsayılan tema warning #D4A457)
 * Tema-aware (useTheme).
 */
import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";

const STAR_PATH = "M12 3l2.6 5.6L21 9.3l-4.5 4.3 1.1 6.4L12 17l-5.6 3 1.1-6.4L3 9.3l6.4-.7L12 3Z";

function StarIcon({ size, filled, color, emptyColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={STAR_PATH}
        fill={filled ? color : "none"}
        stroke={filled ? color : emptyColor}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function StarRating({
  value = 0,
  onRate,
  size = 22,
  showMeta = false,
  count = 0,
  avg = 0,
  color,
  style,
}) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const interactive = typeof onRate === "function";
  const filledColor = color || c.warning;

  const handlePress = (n) => {
    if (!interactive) return;
    Haptics.selectionAsync();
    onRate(n);
  };

  return (
    <View style={[s.row, style]}>
      <View style={s.stars}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = value >= i;
          const StarBody = (
            <StarIcon
              size={size}
              filled={filled}
              color={filledColor}
              emptyColor={c.textMuted}
            />
          );
          if (!interactive) {
            return (
              <View key={i} style={s.starWrap}>
                {StarBody}
              </View>
            );
          }
          return (
            <Pressable
              key={i}
              onPress={() => handlePress(i)}
              hitSlop={6}
              accessibilityLabel={`${i} yıldız ver`}
              style={({ pressed }) => [s.starWrap, pressed && { opacity: 0.6 }]}
            >
              {StarBody}
            </Pressable>
          );
        })}
      </View>

      {showMeta && (
        <View style={s.meta}>
          <Text style={[s.metaTxt, { color: c.textPrimary }]}>
            {avg ? Number(avg).toFixed(1) : "—"}
          </Text>
          <Text style={[s.metaSub, { color: c.textMuted }]}>
            ({count})
          </Text>
        </View>
      )}
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    stars: { flexDirection: "row", alignItems: "center", gap: 2 },
    starWrap: { padding: 2 },
    meta: { flexDirection: "row", alignItems: "baseline", gap: 4, marginLeft: 4 },
    metaTxt: { fontSize: 13, fontFamily: c.fontBodySemi },
    metaSub: { fontSize: 12 },
  });
}
