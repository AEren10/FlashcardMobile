/**
 * FlashcardCTAs — Study (SRS) + Quiz, premium 2 büyük gradient CTA.
 * Liste zorluk seviyesi tint ile renklenir.
 */
import React, { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";

const MIN_QUIZ_WORDS = 4;

export default function FlashcardCTAs({ wordCount, onStudy, onQuiz, tint }) {
  const { c } = useTheme();
  const quizDisabled = wordCount < MIN_QUIZ_WORDS;

  return (
    <View style={s.row}>
      <CtaButton
        iconPath={ICONS.lightbulb}
        title="Çalış"
        subtitle="SRS · 5 sn"
        accent={tint?.color || c.accent}
        onAccent={c.textOnAccent}
        onPress={onStudy}
        c={c}
        bold
      />
      <CtaButton
        iconPath={ICONS.grid}
        title="Quiz"
        subtitle={quizDisabled ? `${MIN_QUIZ_WORDS}+ kelime` : "Çoktan seçmeli"}
        accent={c.cobalt}
        onAccent={c.text}
        outline
        onPress={() => {
          if (quizDisabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } else {
            onQuiz?.();
          }
        }}
        c={c}
        disabled={quizDisabled}
      />
    </View>
  );
}

function CtaButton({
  iconPath,
  title,
  subtitle,
  accent,
  onAccent,
  onPress,
  c,
  bold = false,
  outline = false,
  disabled = false,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const press = (v) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.();
        }}
        onPressIn={() => !disabled && press(0.97)}
        onPressOut={() => press(1)}
        accessibilityLabel={title}
        style={[
          s.cta,
          {
            borderColor: disabled ? c.border : accent + (bold ? "FF" : "55"),
            backgroundColor: outline ? "transparent" : "transparent",
            opacity: disabled ? 0.55 : 1,
            shadowColor: bold ? accent : "transparent",
          },
        ]}
      >
        {bold ? (
          <LinearGradient
            colors={[accent, hexShift(accent, -20)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: c.bgSurface },
            ]}
          />
        )}

        <View style={s.iconBox}>
          <Icon d={iconPath} size={20} stroke={bold ? onAccent : accent} sw={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              s.title,
              {
                color: bold ? onAccent : c.textPrimary,
                fontFamily: c.fontBodyBold,
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              s.sub,
              {
                color: bold ? hexAlpha(onAccent, 0.7) : c.textSec,
                fontFamily: c.fontBody,
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
        <Icon
          d={ICONS.arrow}
          size={16}
          stroke={bold ? onAccent : c.textMuted}
          sw={2.2}
        />
      </Pressable>
    </Animated.View>
  );
}

/** Hex'i ±N darken/lighten — basit. */
function hexShift(hex, amount) {
  if (!hex?.startsWith("#")) return hex;
  const n = Math.max(-255, Math.min(255, amount));
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + n;
  let g = ((num >> 8) & 0xff) + n;
  let b = (num & 0xff) + n;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function hexAlpha(hex, alpha) {
  if (!hex?.startsWith("#")) return hex;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, paddingHorizontal: 22, marginTop: 14 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  iconBox: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, letterSpacing: 0.2 },
  sub: { fontSize: 11, marginTop: 2 },
});
