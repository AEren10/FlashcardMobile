/**
 * FlashcardCTAs — Study (SRS) + Quiz, premium 2 büyük gradient CTA.
 * Liste zorluk seviyesi tint ile renklenir.
 */
import React, { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import { useToast } from "../../../contexts/ToastContext";
import Icon, { ICONS } from "../../../components/design/Icon";

const MIN_QUIZ_WORDS = 4;
const MIN_BLANK_WORDS = 4;

/**
 * 3 CTA — kompakt icon-top tek satır title.
 * Çalış (primary, bold accent) / Quiz (outline cobalt) / Boşluk (outline lavender).
 *
 * NOT: Lectio (Oku) askıya alındı — kullanıcı isteği ile UI'dan çıkarıldı, kod kalıyor.
 * Yerine Boşluk Doldurma direkt CTA — Quiz mode="blank" ile başlatır.
 * blankReadyCount: cümlesi olan kelime sayısı (>=4 ise enable)
 */
export default function FlashcardCTAs({ wordCount, onStudy, onQuiz, onBlank, tint, blankReadyCount = 0 }) {
  const { c } = useTheme();
  const toast = useToast();
  const quizDisabled = wordCount < MIN_QUIZ_WORDS;
  const blankDisabled = blankReadyCount < MIN_BLANK_WORDS;

  return (
    <View style={s.row}>
      <MiniCta
        iconPath={ICONS.lightbulb}
        label="Çalış"
        accent={tint?.color || c.accent}
        onAccent={c.textOnAccent}
        onPress={onStudy}
        c={c}
        primary
      />
      <MiniCta
        iconPath={ICONS.grid}
        label="Quiz"
        accent={c.cobalt}
        onPress={() => {
          if (quizDisabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            toast?.show?.({
              message: `Quiz için en az ${MIN_QUIZ_WORDS} kelime gerek (${wordCount} var)`,
              type: "info",
            });
          } else {
            onQuiz?.();
          }
        }}
        c={c}
        disabled={quizDisabled}
      />
      <MiniCta
        iconPath={ICONS.brain}
        label="Boşluk"
        accent={c.lavender || c.cobalt}
        onPress={() => {
          if (blankDisabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            toast?.show?.({
              message: `Boşluk doldurma için en az ${MIN_BLANK_WORDS} cümleli kelime gerek (${blankReadyCount} var)`,
              type: "info",
            });
          } else {
            onBlank?.();
          }
        }}
        c={c}
        disabled={blankDisabled}
      />
    </View>
  );
}

function MiniCta({ iconPath, label, accent, onAccent, onPress, c, primary = false, disabled = false }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (v) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 50, bounciness: 8 }).start();

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.();
        }}
        onPressIn={() => !disabled && press(0.96)}
        onPressOut={() => press(1)}
        accessibilityLabel={label}
        style={[
          s.miniCta,
          {
            borderColor: disabled ? c.border : accent + "AA",
            backgroundColor: primary ? accent : "transparent",
            opacity: disabled ? 0.55 : 1,
            shadowColor: accent,
            shadowOpacity: primary ? 0.4 : 0.18,
            shadowOffset: { width: 0, height: primary ? 6 : 3 },
            shadowRadius: primary ? 14 : 8,
            elevation: primary ? 5 : 2,
          },
        ]}
      >
        {!primary && (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: accent + "1A" }]}
          />
        )}
        <Icon
          d={iconPath}
          size={20}
          stroke={primary ? onAccent : accent}
          fill={primary ? onAccent + "33" : "none"}
          sw={1.8}
        />
        <Text
          style={{
            fontSize: 13,
            fontFamily: c.fontBodyBold,
            color: primary ? onAccent : c.textPrimary,
            letterSpacing: 0.2,
            marginTop: 6,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
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
            borderColor: disabled ? c.border : accent + (bold ? "FF" : "AA"),
            backgroundColor: outline ? "transparent" : "transparent",
            opacity: disabled ? 0.55 : 1,
            shadowColor: bold ? accent : accent + "88",
            // Outline butonun da hafif glow olsun
            shadowOpacity: bold ? 0.5 : 0.25,
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
          // Outline buton: accent renkli daha vurgulu soft tint dolgu
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: accent + "26" },
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
  miniCta: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  // Legacy (eski 2-satır layout, fallback için)
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
