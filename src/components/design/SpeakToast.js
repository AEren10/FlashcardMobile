/**
 * SpeakToast — alttan kayan ses animasyonu.
 * Kelime okunurken alttan kayar, ses bitince geri gider.
 * Ses dalgası animasyonu + kelime gösterir.
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

export default function SpeakToast({ word, visible }) {
  const { c } = useTheme();
  const slideY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0,
          useNativeDriver: true,
          stiffness: 300,
          damping: 22,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.15,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 80,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideY, opacity, pulse]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        s.wrap,
        {
          backgroundColor: c.accent,
          shadowColor: c.accent,
          transform: [{ translateY: slideY }],
          opacity,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Icon d={ICONS.sound} size={20} stroke="#FFFFFF" sw={2} />
      </Animated.View>
      <Text style={[s.word, { fontFamily: c.fontBodyBold }]} numberOfLines={1}>
        {word}
      </Text>
      <View style={s.bars}>
        {[12, 18, 10, 16, 8].map((h, i) => (
          <View key={i} style={[s.bar, { height: h }]} />
        ))}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 100,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radius.md,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  word: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  bars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
