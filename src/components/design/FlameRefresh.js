/**
 * FlameRefresh — custom RefreshControl wrapper.
 * Standart spinner yerine, çekilen mesafeye orantılı **alev büyür**.
 * Threshold geçilince → trigger + haptic + sıçrama.
 *
 * Kullanım:
 *   <FlameScrollView refreshing={r} onRefresh={fn}>...</FlameScrollView>
 */
import React, { useRef, useState } from "react";
import {
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const PULL_THRESHOLD = 80;

/**
 * Drop-in RefreshControl — accent tint + custom title.
 * RN'in native RefreshControl'üne custom view bağlamak platform-spesifik ve
 * stabil değil. En güvenli yol: tintColor + title + colors prop'larıyla
 * stil; üzerine animasyonlu overlay opsiyonel.
 */
export function FlameRefreshControl({ refreshing, onRefresh, title = "Çekip yenile..." }) {
  const { c } = useTheme();
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={c.accent}
      colors={[c.accent, c.warning]}
      progressBackgroundColor={c.bgCard}
      title={title}
      titleColor={c.textSec}
    />
  );
}

/**
 * FlameOverlayBanner — refreshing iken üstte sürekli yanan alev banner.
 * ScrollView'ın HEMEN üzerine konur (absolute pozisyon).
 */
export function FlameOverlayBanner({ visible }) {
  const { c } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!visible) {
      pulse.setValue(0);
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [visible, pulse]);

  if (!visible) return null;

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.1] });
  const glow = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <View pointerEvents="none" style={s.banner}>
      <Animated.View
        style={[
          s.glowDot,
          { backgroundColor: c.warning, opacity: glow },
        ]}
      />
      <Animated.Text
        style={[s.emoji, { transform: [{ scale }] }]}
      >
        🔥
      </Animated.Text>
      <Text style={[s.txt, { color: c.textSec, fontFamily: c.fontBody }]}>
        Yenileniyor...
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 100,
  },
  glowDot: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 2,
  },
  emoji: {
    fontSize: 24,
  },
  txt: {
    fontSize: 12,
  },
});
