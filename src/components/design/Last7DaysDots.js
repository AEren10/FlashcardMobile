/**
 * Last7DaysDots — Son 7 gün, büyük yuvarlak ikonlar.
 * Bugün vurgulu, dolu günler accent, boş günler dim.
 * StreakScreen'in en üstünde "bu hafta nasıl gitti" özet görselidir.
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

const DAY_LABELS = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];

export default function Last7DaysDots({ days = [] }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);

  // days array oldest→newest. Son 7 gün.
  const last7 = useMemo(() => {
    const arr = [...(days || [])];
    while (arr.length < 7) arr.unshift({ sessions: 0 });
    return arr.slice(-7);
  }, [days]);

  const todayIdx = 6;
  const todayDow = new Date().getDay(); // 0=Sun

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Bu Hafta</Text>
      <View style={s.row}>
        {last7.map((d, i) => {
          const sessions = d?.sessions || 0;
          const isToday = i === todayIdx;
          const isFilled = sessions > 0;
          const offset = todayIdx - i;
          const dow = (todayDow - offset + 7) % 7;
          return (
            <DayDot
              key={i}
              filled={isFilled}
              isToday={isToday}
              sessions={sessions}
              label={DAY_LABELS[dow]}
              delay={i * 60}
              c={c}
              s={s}
            />
          );
        })}
      </View>
    </View>
  );
}

function DayDot({ filled, isToday, sessions, label, delay, c, s }) {
  const enter = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 480,
      delay,
      easing: Easing.out(Easing.back(1.6)),
      useNativeDriver: true,
    }).start();
  }, [enter, delay]);

  useEffect(() => {
    if (!isToday) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isToday, pulse]);

  return (
    <Animated.View
      style={{
        alignItems: "center",
        flex: 1,
        opacity: enter,
        transform: [{ scale: Animated.multiply(enter, pulse) }],
      }}
    >
      <View
        style={[
          s.dot,
          filled
            ? { backgroundColor: c.accentGlow, borderColor: c.borderAccent, shadowColor: c.accent, shadowOpacity: isToday ? 0.5 : 0.2 }
            : { backgroundColor: c.bgSurface, borderColor: c.border },
          isToday && { borderWidth: 2 },
        ]}
      >
        {filled ? (
          <Icon
            d={ICONS.flame}
            size={20}
            stroke={isToday ? c.warning : c.accent}
            fill={isToday ? c.warning : c.accent}
            sw={1.3}
          />
        ) : (
          <View style={[s.emptyInner, { backgroundColor: c.bgBase }]} />
        )}
      </View>
      <Text
        style={[
          s.label,
          {
            color: isToday ? c.accent : filled ? c.textSec : c.textMuted,
            fontFamily: isToday ? c.fontBodyBold : c.fontBody,
          },
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 18,
      paddingHorizontal: 16,
      marginBottom: 14,
    },
    title: {
      fontFamily: c.fontBodyBold,
      fontSize: 13,
      color: c.textSec,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 14,
    },
    row: { flexDirection: "row", gap: 4 },
    dot: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 10,
      elevation: 2,
    },
    emptyInner: {
      width: 6,
      height: 6,
      borderRadius: 3,
      opacity: 0.5,
    },
    label: {
      fontSize: 10,
      marginTop: 6,
      letterSpacing: 0.3,
    },
  });
}
