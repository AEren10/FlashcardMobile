/**
 * FlashcardCTAs — Study (SRS) + Quiz, premium 2 büyük gradient CTA.
 * Liste zorluk seviyesi tint ile renklenir.
 */
import React, { useRef } from "react";
import { fontSize, radius, spacing } from "../../../themes/tokens";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
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
            fontSize: fontSize.md,
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


const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, paddingHorizontal: 22, marginTop: 14 },
  miniCta: {
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
});
