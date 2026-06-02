/**
 * Last30BarChart — son 30 günü dikey bar şeklinde animasyonlu gösterir.
 * GitHub grid yerine daha canlı, mobil-friendly bar görünüm.
 * Tap bar → o gün için detay alt yazı (sessions).
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";

const BAR_WIDTH = 14;
const BAR_GAP = 6;
const CHART_HEIGHT = 130;

export default function Last30BarChart({ days = [] }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [selected, setSelected] = useState(null);

  const padded = useMemo(() => {
    // 30 gün — eksikse 0 ile doldur
    const arr = [...(days || [])];
    while (arr.length < 30) arr.unshift({ sessions: 0 });
    return arr.slice(-30);
  }, [days]);

  const maxSessions = Math.max(1, ...padded.map((d) => d?.sessions || 0));
  const todayIdx = padded.length - 1;

  return (
    <View style={s.wrap}>
      <View style={s.headRow}>
        <Text style={s.title}>Son 30 Gün</Text>
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
        contentContainerStyle={{ paddingHorizontal: 4, alignItems: "flex-end", paddingVertical: 8 }}
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
        <Text style={s.axisTxt}>30 gün önce</Text>
        <Text style={s.axisTxt}>Bugün</Text>
      </View>
    </View>
  );
}

function Bar({ sessions, maxSessions, index, isToday, isSelected, onPress, c }) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const ratio = Math.min(1, sessions / maxSessions);
  const targetHeight = Math.max(4, ratio * (CHART_HEIGHT - 16));

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 800,
      delay: index * 20,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [targetHeight, index, heightAnim]);

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
        ? [c.warning, c.accent]
        : ratio > 0.7
          ? [c.accent, "#8FE03A"]
          : ratio > 0.3
            ? [c.cobalt, "#4F70E0"]
            : [c.bgSurface, c.bgCardHover];

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
        <Animated.View
          style={{
            width: BAR_WIDTH,
            height: heightAnim,
            borderRadius: 4,
            overflow: "hidden",
            borderWidth: isSelected ? 1.5 : 0,
            borderColor: c.accent,
          }}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Pressable>
      {isToday && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c.accent, marginTop: 4 }} />}
    </Animated.View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: c.bgElevated,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
    },
    headRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8,
    },
    title: {
      fontFamily: c.fontBodyBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    selectedTxt: {
      fontFamily: c.fontBody,
      fontSize: 12,
      color: c.textSec,
    },
    axisRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    axisTxt: {
      fontFamily: c.fontBody,
      fontSize: 10,
      color: c.textMuted,
    },
  });
}
