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
import ConfettiCannon from "react-native-confetti-cannon";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import PremiumButton from "./PremiumButton";
import Icon from "./Icon";

const { width: W } = Dimensions.get("window");

export default function AchievementModal({ visible, badge, onClose }) {
  const { c } = useTheme();
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
    setTimeout(() => {
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
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0,0,0,0.78)", opacity: backdrop },
        ]}
      />

      <View style={s.center}>
        <ConfettiCannon
          count={120}
          origin={{ x: W / 2, y: -10 }}
          autoStart
          fadeOut
          explosionSpeed={350}
          fallSpeed={2400}
          colors={[c.accent, c.cobalt, c.warning, c.success]}
        />

        {/* Radial waves */}
        <Animated.View style={[s.wave, { backgroundColor: c.accentGlow }, waveStyle(wave1)]} />
        <Animated.View style={[s.wave, { backgroundColor: c.accentGlow }, waveStyle(wave2)]} />
        <Animated.View style={[s.wave, { backgroundColor: c.accentGlow }, waveStyle(wave3)]} />

        {/* Badge */}
        <Animated.View
          style={[
            s.badgeBox,
            {
              backgroundColor: c.accentGlow,
              borderColor: c.borderAccent,
              shadowColor: c.accent,
              transform: [{ scale: badgeScale }, { translateY: badgeY }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.15)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
            pointerEvents="none"
          />
          {badge?.icon ? (
            <Icon d={badge.icon} size={56} stroke={c.accent} fill={c.accentGlow} sw={1.8} />
          ) : (
            <Text style={s.badgeEmoji}>{badge?.emoji || "🏆"}</Text>
          )}
        </Animated.View>

        {/* Text */}
        <Animated.View style={{ opacity: textOp, alignItems: "center", marginTop: 28 }}>
          <Text style={[s.label, { color: c.accent, fontFamily: c.fontBodyBold }]}>
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
