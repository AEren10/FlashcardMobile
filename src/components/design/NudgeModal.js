/**
 * NudgeModal — kullanıcı ekrandayken arada bir çıkan tatlı öneri pop-up'ı.
 *
 * Stüdyo tonu: küçük ortada kart, fade + spring scale, icon + 2 satır metin
 * + iki buton (Hemen Başla / Daha Sonra).
 *
 * Tipler:
 *   - "unknown_pack": "Bilmediklerinden 8 kelimelik bir paket hazırladık"
 *   - "known_review": "Bildiklerinden tekrar etmek ister misin?"
 *   - "mistake_focus": "Sık yanlış yaptığın N kelime var, hızlıca pekiştirelim"
 *
 * props:
 *   visible, nudge: { type, title, headline, sub, ctaLabel, secondaryLabel, icon, color }
 *   onAccept, onDismiss
 */
import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon from "./Icon";

export default function NudgeModal({ visible, nudge, onAccept, onDismiss }) {
  const { c } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!visible || !nudge) {
      fade.setValue(0);
      scale.setValue(0.88);
      slide.setValue(20);
      return;
    }
    Haptics.selectionAsync();
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 200,
        damping: 16,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, nudge, fade, scale, slide]);

  if (!visible || !nudge) return null;

  const tint = nudge.color || c.accent;

  return (
    <Modal transparent animationType="none" onRequestClose={onDismiss}>
      <Animated.View style={[s.overlay, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <Animated.View
          style={[
            s.card,
            {
              backgroundColor: c.bgElevated,
              borderColor: tint + "55",
              shadowColor: tint,
              transform: [{ scale }, { translateY: slide }],
            },
          ]}
        >
          {/* Top tint band */}
          <LinearGradient
            colors={[tint + "1F", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
            pointerEvents="none"
          />

          {/* Icon */}
          <View
            style={[
              s.iconWrap,
              { backgroundColor: tint, shadowColor: tint },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.28)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.6 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
              pointerEvents="none"
            />
            <Icon d={nudge.icon} size={26} stroke="#FFFDF7" fill="none" sw={2} />
          </View>

          {/* Tag */}
          {!!nudge.title && (
            <View style={[s.tag, { borderColor: tint + "55", backgroundColor: tint + "14" }]}>
              <Text style={[s.tagTxt, { color: tint, fontFamily: c.fontBodyBold }]}>
                {nudge.title.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Headline */}
          <Text style={[s.headline, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
            {nudge.headline}
          </Text>

          {/* Sub */}
          {!!nudge.sub && (
            <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
              {nudge.sub}
            </Text>
          )}

          {/* Buttons */}
          <View style={s.actions}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onDismiss?.();
              }}
              style={({ pressed }) => [
                s.secondary,
                {
                  borderColor: c.border,
                  backgroundColor: c.bgSurface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[s.secondaryTxt, { color: c.textSec, fontFamily: c.fontBodyMed }]}>
                {nudge.secondaryLabel || "Daha sonra"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onAccept?.();
              }}
              style={({ pressed }) => [
                s.primary,
                {
                  backgroundColor: tint,
                  shadowColor: tint,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={[s.primaryTxt, { color: "#1A1814", fontFamily: c.fontBodyBold }]}>
                {nudge.ctaLabel || "Hemen başla"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 6,
    marginBottom: 14,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 10,
  },
  tagTxt: {
    fontSize: 10,
    letterSpacing: 1.4,
  },
  headline: {
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
    width: "100%",
  },
  secondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryTxt: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  primary: {
    flex: 1.3,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 4,
  },
  primaryTxt: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
