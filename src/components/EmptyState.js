/**
 * EmptyState — Claude Design v2.
 * Abstract geometric illustration (no mascot) + display title + body + CTA.
 * Variants: list (floating cards), offline (broken cloud), search (magnifier + ?).
 */
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Easing } from "react-native";
import Svg, { G, Rect, Line, Circle, Path, Text as SvgText } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";

export default function EmptyState({
  emoji,
  kind, // 'list' | 'offline' | 'search' — yeni varyantlar
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) {
  const { c } = useTheme();

  return (
    <View style={s.wrap}>
      {kind ? (
        <EmptyIllu kind={kind} />
      ) : emoji ? (
        <Text style={s.emoji}>{emoji}</Text>
      ) : null}

      {title ? (
        <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>{title}</Text>
      ) : null}
      {subtitle ? (
        <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>{subtitle}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            s.btn,
            { backgroundColor: c.accent, shadowColor: c.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[s.btnTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Pressable onPress={onSecondary} style={s.secBtn}>
          <Text style={[s.secTxt, { color: c.textSec, fontFamily: c.fontBody }]}>
            {secondaryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function EmptyIllu({ kind }) {
  const { isDark } = useTheme();
  const lime = isDark ? "#B4FF4F" : "#4A8E1F";
  const blue = isDark ? "#5B7FFF" : "#3B5BDB";
  const warn = isDark ? "#FFB84D" : "#B45309";
  const line = isDark ? "rgba(255,255,255,0.14)" : "rgba(15,25,37,0.12)";

  const float = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, to, dur) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: to,
            duration: dur,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: -to,
            duration: dur,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    if (kind === "list") loop(float, 1, 1200).start();
    if (kind === "offline") loop(drift, 1, 1500).start();
    if (kind === "search") loop(sway, 1, 1300).start();
  }, [kind, float, drift, sway]);

  if (kind === "list") {
    const ty = float.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });
    return (
      <View style={s.illuWrap}>
        <Svg width="188" height="188" viewBox="0 0 188 188">
          <Rect x="44" y="118" width="100" height="34" rx="12" fill="none" stroke={line} strokeWidth="2" />
          <Rect x="50" y="96" width="88" height="32" rx="12" fill="none" stroke={line} strokeWidth="2" />
        </Svg>
        <Animated.View style={[s.illuFloating, { transform: [{ translateY: ty }] }]}>
          <Svg width="188" height="100" viewBox="0 0 188 100">
            <Rect x="54" y="38" width="80" height="40" rx="13" fill="none" stroke={lime} strokeWidth="2.4" />
            <Line x1="68" y1="54" x2="104" y2="54" stroke={lime} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.55" />
            <Line x1="68" y1="64" x2="92" y2="64" stroke={lime} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.3" />
            <Circle cx="120" cy="30" r="11" fill={lime} fillOpacity="0.18" stroke={lime} strokeWidth="2" />
            <Path d="M116 30h8M120 26v8" stroke={lime} strokeWidth="2.2" strokeLinecap="round" />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  if (kind === "offline") {
    const tx1 = drift.interpolate({ inputRange: [-1, 1], outputRange: [-4, 0] });
    const tx2 = drift.interpolate({ inputRange: [-1, 1], outputRange: [0, 4] });
    return (
      <View style={s.illuWrap}>
        <Animated.View style={{ position: "absolute", transform: [{ translateX: tx1 }] }}>
          <Svg width="188" height="188" viewBox="0 0 188 188">
            <Path d="M58 110a20 20 0 0 1 4-39 26 26 0 0 1 24-14" fill="none" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
            <Path d="M58 110h26" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
          </Svg>
        </Animated.View>
        <Animated.View style={{ position: "absolute", transform: [{ translateX: tx2 }] }}>
          <Svg width="188" height="188" viewBox="0 0 188 188">
            <Path d="M132 110a18 18 0 0 0-2-37 26 26 0 0 0-22-16" fill="none" stroke={blue} strokeWidth="2.6" strokeLinecap="round" strokeOpacity="0.9" />
            <Path d="M132 110h-30" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
          </Svg>
        </Animated.View>
        <Svg width="188" height="188" viewBox="0 0 188 188">
          <Path d="M78 132q16-14 32 0" fill="none" stroke={warn} strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.6" />
          <Path d="M70 146q24-20 48 0" fill="none" stroke={warn} strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.3" />
          <Circle cx="94" cy="156" r="3.2" fill={warn} />
        </Svg>
      </View>
    );
  }

  // search
  const rot = sway.interpolate({ inputRange: [-1, 1], outputRange: ["-5deg", "5deg"] });
  return (
    <View style={s.illuWrap}>
      <Animated.View style={{ transform: [{ rotate: rot }] }}>
        <Svg width="188" height="188" viewBox="0 0 188 188">
          <Circle cx="86" cy="84" r="34" fill="none" stroke={lime} strokeWidth="3" />
          <Line x1="110" y1="108" x2="134" y2="132" stroke={lime} strokeWidth="5" strokeLinecap="round" />
          <SvgText x="86" y="96" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="34" fill={blue}>
            ?
          </SvgText>
        </Svg>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", padding: 32, paddingVertical: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  illuWrap: {
    width: 188,
    height: 188,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  illuFloating: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: { fontSize: 30, marginBottom: 6, textAlign: "center", marginTop: 16 },
  sub: { fontSize: 14, textAlign: "center", marginBottom: 20, lineHeight: 20, maxWidth: 280 },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 200,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  btnTxt: { fontSize: 15 },
  secBtn: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 10 },
  secTxt: { fontSize: 14 },
});
