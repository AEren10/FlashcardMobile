/**
 * ModeSegment — Ana sayfa modu toggle'ı.
 * Normal mod (genel kategoriler) ↔ Sınav modu (YDS/YÖKDİL/IELTS/TOEFL/YKS-DİL).
 *
 * mode: "normal" | "exam"
 * onChange(nextMode): yeni mod seçilince çağrılır.
 *
 * Tasarım: greeting'in altında geniş bir segment; aktif olan accent, diğeri muted.
 * Animasyonlu indicator + scale press feedback.
 */
import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

// Theme-aware translucent overlay — light'ta dark alpha, dark'ta white alpha
const overlayBg = (isDark, alpha) =>
  isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.85})`;

const OPTIONS = [
  { key: "normal", label: "Keşfet", icon: ICONS.sparkle },
  { key: "exam", label: "Sınava Hazırlık", icon: ICONS.target },
];

export default function ModeSegment({ mode = "normal", onChange, examCount }) {
  const { c, isDark } = useTheme();
  const indicator = useRef(new Animated.Value(mode === "exam" ? 1 : 0)).current;
  const [wrapW, setWrapW] = React.useState(0);

  useEffect(() => {
    Animated.spring(indicator, {
      toValue: mode === "exam" ? 1 : 0,
      useNativeDriver: true,
      tension: 70,
      friction: 9,
    }).start();
  }, [mode, indicator]);

  const handlePress = (key) => {
    if (key === mode) return;
    Haptics.selectionAsync();
    onChange?.(key);
  };

  // Native driver için translateX kullan (eski "1%" → "50%" left animasyonu yerine)
  const halfW = wrapW > 0 ? wrapW / 2 : 0;
  const translateX = indicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, halfW],
  });

  return (
    <View
      style={[
        s.wrap,
        { backgroundColor: c.bgSurface, borderColor: c.border },
      ]}
      onLayout={(e) => setWrapW(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          s.indicator,
          {
            backgroundColor: c.accent,
            shadowColor: c.accent,
            transform: [{ translateX }],
          },
        ]}
      />
      {OPTIONS.map((opt) => {
        const active = mode === opt.key;
        const showCount = opt.key === "exam" && typeof examCount === "number" && examCount > 0;
        return (
          <Pressable
            key={opt.key}
            onPress={() => handlePress(opt.key)}
            style={s.btn}
            accessibilityLabel={opt.label}
          >
            <Icon
              d={opt.icon}
              size={16}
              stroke={active ? c.textOnAccent : c.textSec}
              sw={1.8}
            />
            <Text
              style={[
                s.label,
                {
                  color: active ? c.textOnAccent : c.textSec,
                  fontFamily: c.fontBodyBold,
                },
              ]}
            >
              {opt.label}
            </Text>
            {showCount && (
              <View
                style={[
                  s.badge,
                  {
                    backgroundColor: active
                      ? overlayBg(isDark, 0.22)
                      : c.accentGlow,
                    borderColor: active
                      ? overlayBg(isDark, 0.3)
                      : c.borderAccent,
                  },
                ]}
              >
                <Text
                  style={[
                    s.badgeTxt,
                    {
                      color: active ? c.textOnAccent : c.accent,
                      fontFamily: c.fontBodyBold,
                    },
                  ]}
                >
                  {examCount}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 18,
    overflow: "hidden",
    position: "relative",
    alignSelf: "stretch",
  },
  indicator: {
    position: "absolute",
    top: 3,
    bottom: 3,
    width: "49%",
    borderRadius: 11,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    zIndex: 2,
  },
  label: {
    fontSize: 12.5,
    letterSpacing: 0.2,
  },
  badge: {
    minWidth: 22,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  badgeTxt: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
