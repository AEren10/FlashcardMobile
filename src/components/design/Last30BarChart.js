/**
 * Last30BarChart — son 30 günü dikey bar şeklinde animasyonlu gösterir.
 * GitHub grid yerine daha canlı, mobil-friendly bar görünüm.
 * Tap bar → o gün için detay alt yazı (sessions).
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RAnimated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing as REasing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";

const BAR_WIDTH = 16;
const BAR_GAP = 5;
const CHART_HEIGHT = 150;

export default function Last30BarChart({ days = [] }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [selected, setSelected] = useState(null);

  const padded = useMemo(() => {
    // 35 gün — eksikse 0 ile doldur
    const arr = [...(days || [])];
    while (arr.length < 35) arr.unshift({ sessions: 0 });
    return arr.slice(-35);
  }, [days]);

  const maxSessions = Math.max(1, ...padded.map((d) => d?.sessions || 0));
  const todayIdx = padded.length - 1;

  return (
    <View style={s.wrap}>
      <View style={s.headRow}>
        <Text style={s.title}>Son 35 Gün</Text>
        {selected != null && (
          <Text style={s.selectedTxt}>
            {selected === todayIdx
              ? "Bugün"
              : selected === todayIdx - 1
                ? "Dün"
                : `${todayIdx - selected} gün önce`}
            {" · "}
            <Text style={{ color: c.accent }}>
              {padded[selected]?.sessions || 0} seans
            </Text>
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.xs, alignItems: "flex-end", paddingVertical: spacing.sm }}
      >
        {padded.map((d, i) => (
          <Bar
            key={i}
            sessions={d?.sessions || 0}
            maxSessions={maxSessions}
            index={i}
            isToday={i === todayIdx}
            isSelected={i === selected}
            onPress={() => {
              Haptics.selectionAsync();
              setSelected(i);
            }}
            c={c}
          />
        ))}
      </ScrollView>

      <View style={s.axisRow}>
        <Text style={s.axisTxt}>35 gün önce</Text>
        <Text style={s.axisTxt}>Bugün</Text>
      </View>
    </View>
  );
}

function Bar({ sessions, maxSessions, index, isToday, isSelected, onPress, c }) {
  const heightVal = useSharedValue(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const ratio = Math.min(1, sessions / maxSessions);
  const targetHeight = Math.max(4, ratio * (CHART_HEIGHT - 16));

  useEffect(() => {
    heightVal.value = withDelay(
      index * 20,
      withTiming(targetHeight, { duration: 800, easing: REasing.out(REasing.cubic) })
    );
  }, [targetHeight, index]);

  const barHeightStyle = useAnimatedStyle(() => ({
    height: heightVal.value,
  }));

  useEffect(() => {
    if (!isToday) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isToday, pulse]);

  const colors =
    sessions === 0
      ? [c.bgSurface, c.bgSurface]
      : isToday
        ? [c.coral || c.warning, c.accent]
        : ratio > 0.7
          ? [c.accent, c.cobalt]
          : ratio > 0.3
            ? [c.cobalt, c.lavender || c.cobalt]
            : [c.textMuted + "44", c.textMuted + "22"];

  const hasData = sessions > 0;

  return (
    <Animated.View
      style={{
        marginRight: BAR_GAP,
        alignItems: "center",
        transform: [{ scale: pulse }],
      }}
    >
      <Pressable
        onPress={onPress}
        hitSlop={4}
        style={{
          width: BAR_WIDTH,
          height: CHART_HEIGHT,
          justifyContent: "flex-end",
        }}
      >
        <RAnimated.View
          style={[barHeightStyle, {
            width: BAR_WIDTH,
            borderRadius: 5,
            overflow: "hidden",
            borderWidth: isSelected ? 1.5 : 0,
            borderColor: c.accent,
            shadowColor: hasData && !isToday ? colors[0] : "transparent",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          }]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </RAnimated.View>
      </Pressable>
      {isToday && <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent, marginTop: spacing.xs }} />}
    </Animated.View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.lg,
    },
    headRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: spacing.sm,
    },
    title: {
      fontFamily: c.fontBodyBold,
      fontSize: 16,
      color: c.textPrimary,
      letterSpacing: 0.2,
    },
    selectedTxt: {
      fontFamily: c.fontBody,
      fontSize: 12,
      color: c.textSec,
    },
    axisRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.sm,
    },
    axisTxt: {
      fontFamily: c.fontBody,
      fontSize: 10,
      color: c.textMuted,
    },
  });
}
