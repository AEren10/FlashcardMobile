/**
 * MilestoneModal — tam ekran "ilk-X" kutlama modalı.
 *
 * Tasarım: warm gradient bg + spring rozet + halo glow + konfeti + 2 satır metin + CTA.
 * Stüdyo ton: sade, sıcak, abartısız ama tatmin edici.
 *
 * props:
 *   milestone: { key, headline, sub, icon, color, nextHint }
 *   visible: bool
 *   onDismiss(): kapatma + storage yazma
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon from "../design/Icon";
import WarmConfetti from "./WarmConfetti";

const { width: W, height: H } = Dimensions.get("window");

export default function MilestoneModal({ milestone, visible, onDismiss }) {
  const { c } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeRotate = useRef(new Animated.Value(0)).current;
  const haloOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(0.85)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || !milestone) {
      fade.setValue(0);
      badgeScale.setValue(0);
      badgeRotate.setValue(0);
      haloOpacity.setValue(0);
      textSlide.setValue(20);
      textOpacity.setValue(0);
      ctaScale.setValue(0.85);
      ctaOpacity.setValue(0);
      return;
    }

    // İlk haptic — anlamlı bir Success
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Sahne: fade in arka plan → rozet spring + rotate → halo glow → metin slide-up → cta
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(badgeScale, {
          toValue: 1,
          useNativeDriver: true,
          stiffness: 130,
          damping: 11,
        }),
        Animated.timing(badgeRotate, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(haloOpacity, {
          toValue: 1,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(ctaScale, {
          toValue: 1,
          useNativeDriver: true,
          stiffness: 200,
          damping: 14,
        }),
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Sürekli yumuşak shimmer (halo nefes alıyor)
    const sh = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    sh.start();

    return () => sh.stop();
  }, [visible, milestone, fade, badgeScale, badgeRotate, haloOpacity, textSlide, textOpacity, ctaScale, ctaOpacity, shimmer]);

  if (!visible || !milestone) return null;

  const color = milestone.color || c.accent;
  // İkon her temada net görünsün diye sabit kontrast renk — beyaza yakın krem
  const iconStroke = "#FFFDF7";
  const rotate = badgeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-12deg", "0deg"],
  });
  const haloScale = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  // Halo opacity'yi düşür — ikon gözükebilsin diye
  const haloOpacityCombined = Animated.multiply(
    haloOpacity,
    shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.45] })
  );

  return (
    <Modal transparent animationType="none" onRequestClose={onDismiss}>
      <Animated.View style={[s.overlay, { opacity: fade }]}>
        {/* Backdrop gradient — koyu üstten alta */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.85)",
            color + "33",
            "rgba(0,0,0,0.92)",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Konfeti — top burst, warm palette */}
        <WarmConfetti count={70} origin="top" />

        {/* Halo glow — rozetin arkası */}
        <Animated.View
          style={[
            s.halo,
            {
              backgroundColor: color,
              opacity: haloOpacityCombined,
              transform: [{ scale: haloScale }],
            },
          ]}
        />

        {/* Rozet — solid renk dolgu + beyaz ikon (kontrast garanti) */}
        <Animated.View
          style={[
            s.badgeWrap,
            {
              transform: [{ scale: badgeScale }, { rotate }],
            },
          ]}
        >
          <View
            style={[
              s.badgeOuter,
              {
                backgroundColor: color + "22",
                borderColor: color + "88",
                shadowColor: color,
              },
            ]}
          >
            {/* İç daire: solid renk → beyaz ikon net görünür */}
            <View
              style={[
                s.badgeInner,
                {
                  backgroundColor: color,
                  borderColor: "rgba(255,253,247,0.25)",
                },
              ]}
            >
              {/* Üst parlak highlight (premium derinlik) */}
              <LinearGradient
                colors={["rgba(255,255,255,0.28)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.55 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 54 }]}
                pointerEvents="none"
              />
              <Icon
                d={milestone.icon}
                size={52}
                stroke={iconStroke}
                fill="none"
                sw={2}
              />
            </View>
          </View>
        </Animated.View>

        {/* Etiket — "İlk-X" küçük chip */}
        <Animated.View
          style={[
            s.tagChip,
            {
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
              borderColor: color + "55",
              backgroundColor: color + "1A",
            },
          ]}
        >
          <Text style={[s.tagTxt, { color, fontFamily: c.fontBodyBold }]}>
            {milestone.title.toUpperCase()}
          </Text>
        </Animated.View>

        {/* Headline */}
        <Animated.Text
          style={[
            s.headline,
            {
              color: c.textPrimary === "#2C2520" ? "#FFFDF7" : c.textPrimary,
              fontFamily: c.fontDisplay,
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
            },
          ]}
        >
          {milestone.headline}
        </Animated.Text>

        {/* Sub */}
        <Animated.Text
          style={[
            s.sub,
            {
              color: "#D5C7B2",
              fontFamily: c.fontBody,
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
            },
          ]}
        >
          {milestone.sub}
        </Animated.Text>

        {/* Next hint chip */}
        {!!milestone.nextHint && (
          <Animated.View
            style={[
              s.nextHint,
              {
                opacity: textOpacity,
                transform: [{ translateY: textSlide }],
                borderColor: "rgba(255,255,255,0.15)",
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            ]}
          >
            <Text style={[s.nextHintTxt, { color: "#A99B85", fontFamily: c.fontBodySemi }]}>
              {milestone.nextHint}
            </Text>
          </Animated.View>
        )}

        {/* CTA */}
        <Animated.View
          style={{
            opacity: ctaOpacity,
            transform: [{ scale: ctaScale }],
            marginTop: 28,
          }}
        >
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onDismiss?.();
            }}
            style={({ pressed }) => [
              s.cta,
              {
                backgroundColor: color,
                shadowColor: color,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text style={[s.ctaTxt, { color: "#1A1814", fontFamily: c.fontBodyBold }]}>
              Devam et
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
  },
  halo: {
    position: "absolute",
    top: H / 2 - 220,
    width: 240,
    height: 240,
    borderRadius: radius.sm0,
  },
  badgeWrap: {
    marginBottom: 36,
  },
  badgeOuter: {
    width: 156,
    height: 156,
    borderRadius: 78,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 36,
    elevation: 12,
  },
  badgeInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  tagChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    marginBottom: 14,
  },
  tagTxt: {
    fontSize: 10,
    letterSpacing: 1.6,
  },
  headline: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: spacing.sm,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
    marginBottom: spacing.lg,
  },
  nextHint: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  nextHintTxt: {
    fontSize: 11.5,
    letterSpacing: 0.4,
  },
  cta: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: radius.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 22,
    elevation: 6,
  },
  ctaTxt: {
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
