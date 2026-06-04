/**
 * AchievementModal — rozet kazandığında full-screen celebration.
 * Sequence: backdrop fade → rozet fly-in spring → 3 katman radial wave → text fade → confetti → haptic
 *
 * Kullanım:
 *   <AchievementModal
 *      visible={!!earned}
 *      badge={{ emoji: "🔥", label: "7 Gün Streak", description: "..." }}
 *      onClose={() => setEarned(null)}
 *   />
 */
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import PremiumButton from "./PremiumButton";
import Icon from "./Icon";
import WarmConfetti from "../celebration/WarmConfetti";

const { width: W } = Dimensions.get("window");

export default function AchievementModal({ visible, badge, onClose }) {
  const { c } = useTheme();
  // Badge'in kendi rengi varsa onu kullan, yoksa accent fallback
  const tint = badge?.color || c.accent;
  const backdrop = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeY = useRef(new Animated.Value(60)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const textOp = useRef(new Animated.Value(0)).current;
  const buttonOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      backdrop.setValue(0);
      badgeScale.setValue(0);
      badgeY.setValue(60);
      wave1.setValue(0);
      wave2.setValue(0);
      wave3.setValue(0);
      textOp.setValue(0);
      buttonOp.setValue(0);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      // 0ms: backdrop fade in
      Animated.timing(backdrop, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // 200ms: badge fly-in
      Animated.parallel([
        Animated.spring(badgeScale, {
          toValue: 1,
          stiffness: 240,
          damping: 12,
          useNativeDriver: true,
        }),
        Animated.spring(badgeY, {
          toValue: 0,
          stiffness: 220,
          damping: 14,
          useNativeDriver: true,
        }),
      ]),
      // 600ms: 3 radial waves staggered
      Animated.stagger(200, [
        Animated.timing(wave1, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wave2, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wave3, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Text + button fade in (parallel start at 800ms)
    const textTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOp, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOp, {
          toValue: 1,
          duration: 400,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);
    return () => clearTimeout(textTimer);
  }, [visible, backdrop, badgeScale, badgeY, wave1, wave2, wave3, textOp, buttonOp]);

  if (!visible) return null;

  const waveStyle = (val) => ({
    opacity: val.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.8, 0.3, 0] }),
    transform: [
      {
        scale: val.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.5] }),
      },
    ],
  });

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop gradient — koyu + tint glow */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdrop }]}>
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.88)",
            tint + "33",
            "rgba(0,0,0,0.92)",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={s.center}>
        <WarmConfetti count={80} origin="top" />

        {/* Radial waves — badge'in kendi renginde */}
        <Animated.View style={[s.wave, { backgroundColor: tint + "55" }, waveStyle(wave1)]} />
        <Animated.View style={[s.wave, { backgroundColor: tint + "55" }, waveStyle(wave2)]} />
        <Animated.View style={[s.wave, { backgroundColor: tint + "55" }, waveStyle(wave3)]} />

        {/* Badge — solid tint dolu + beyaz ikon (kontrast garanti) */}
        <Animated.View
          style={[
            s.badgeBox,
            {
              backgroundColor: tint,
              borderColor: "rgba(255,253,247,0.25)",
              shadowColor: tint,
              transform: [{ scale: badgeScale }, { translateY: badgeY }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.28)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.55 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
            pointerEvents="none"
          />
          {badge?.icon ? (
            <Icon d={badge.icon} size={62} stroke="#FFFDF7" fill="none" sw={2} />
          ) : (
            <Text style={s.badgeEmoji}>{badge?.emoji || "🏆"}</Text>
          )}
        </Animated.View>

        {/* Text */}
        <Animated.View style={{ opacity: textOp, alignItems: "center", marginTop: 28 }}>
          <Text style={[s.label, { color: tint, fontFamily: c.fontBodyBold }]}>
            YENİ ROZET
          </Text>
          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
            {badge?.label}
          </Text>
          {badge?.description && (
            <Text style={[s.desc, { color: c.textSec, fontFamily: c.fontBody }]}>
              {badge.description}
            </Text>
          )}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={{ opacity: buttonOp, marginTop: 32 }}>
          <PremiumButton
            label="Harika!"
            variant="primary"
            size="lg"
            block
            hapticStyle="success"
            onPress={onClose}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  wave: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  badgeBox: {
    width: 140,
    height: 140,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 16,
  },
  badgeEmoji: { fontSize: 76 },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },
});
