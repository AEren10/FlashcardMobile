/**
 * RoadmapNode — tek bir milestone düğümü.
 * isDone → dolu + checkmark; isCurrent → glow pulse "BURADASINIZ" rozet; isLocked → kilit + outline.
 */
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";

const NODE_SIZE = 78;
const CONNECTOR_HEIGHT = 60;

export default function RoadmapNode({
  milestone,
  isCurrent,
  isDone,
  isLocked,
  offset,
  isLast,
  index,
  currentXP,
}) {
  const { c } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 500,
      delay: index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  useEffect(() => {
    if (!isCurrent) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isCurrent, pulse]);

  const accent = milestone.color;
  const bg = isDone ? accent : isCurrent ? c.bgElevated : c.bgSurface;
  const borderColor = isDone || isCurrent ? accent : c.border;

  return (
    <View style={[s.row, { transform: [{ translateX: offset }] }]}>
      <Animated.View
        style={{
          opacity: enter,
          transform: [
            { scale: Animated.multiply(enter, pulse) },
          ],
          alignItems: "center",
        }}
      >
        <View
          style={[
            s.node,
            {
              backgroundColor: bg,
              borderColor,
              shadowColor: accent,
              shadowOpacity: isCurrent ? 0.6 : isDone ? 0.25 : 0,
              opacity: isLocked ? 0.4 : 1,
            },
          ]}
        >
          {isDone ? (
            <Icon d={ICONS.check} size={28} stroke={c.bgBase} sw={3.2} />
          ) : isLocked ? (
            <Text style={{ fontSize: 22, opacity: 0.6 }}>🔒</Text>
          ) : (
            <Text style={s.emoji}>{milestone.emoji}</Text>
          )}
        </View>

        {/* Label — minimal, etkili */}
        <View style={{ alignItems: "center", marginTop: 10, maxWidth: 140 }}>
          {/* Lv pill — sade chip */}
          <View
            style={[
              s.lvPill,
              {
                backgroundColor: isLocked ? c.bgSurface : accent + "1A",
                borderColor: isLocked ? c.border : accent + "44",
              },
            ]}
          >
            <Text
              style={[
                s.lvPillTxt,
                {
                  color: isLocked ? c.textMuted : accent,
                  fontFamily: c.fontBodyBold,
                },
              ]}
            >
              LV {milestone.lv}
            </Text>
          </View>

          {/* Title — büyük tek satır */}
          <Text
            style={[
              s.label,
              {
                color: isLocked ? c.textMuted : c.textPrimary,
                fontFamily: c.fontBodyBold,
              },
            ]}
            numberOfLines={1}
          >
            {milestone.title}
          </Text>

          {/* Active için XP progress, diğerleri için XP target */}
          {isCurrent ? (
            <Text style={[s.subActive, { color: accent, fontFamily: c.fontBodySemi }]}>
              {currentXP} / {milestone.threshold === 0 ? 10 : milestone.threshold} XP
            </Text>
          ) : isDone ? (
            <Text style={[s.subDone, { color: accent, fontFamily: c.fontBody }]}>
              ✓ tamamlandı
            </Text>
          ) : (
            <Text style={[s.sub, { color: c.textMuted, fontFamily: c.fontBody }]}>
              {milestone.threshold} XP
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Dashed connector — son node hariç */}
      {!isLast && (
        <View style={[s.connector, { borderColor: isDone ? accent : c.border }]} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    alignItems: "center",
    marginBottom: 8,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 4,
  },
  emoji: { fontSize: 32 },
  lvPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 6,
  },
  lvPillTxt: { fontSize: 10, letterSpacing: 0.8 },
  label: {
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  sub: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  subActive: {
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  subDone: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  connector: {
    width: 0,
    height: CONNECTOR_HEIGHT,
    borderLeftWidth: 2,
    borderStyle: "dashed",
    marginTop: 4,
  },
});
