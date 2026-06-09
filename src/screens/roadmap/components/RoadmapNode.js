/**
 * RoadmapNode — Premium milestone düğümü (v3 redesign).
 *
 * Durum görselleri:
 *   - DONE       : dolu gradient + checkmark + sade outer glow
 *   - CURRENT    : outer ring (pulsing rotation) + inner solid + animated halo + "BURADASIN" pill
 *   - UPCOMING   : outline + dimmed icon
 *   - LOCKED     : lock icon + reduced opacity
 *
 * Connector:
 *   - Done node sonrası: solid colored line
 *   - Aktif node sonrası: dashed (henüz açılmadı)
 */
import { radius } from "../../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from "react-native-svg";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";

const NODE_SIZE = 88;
const RING_SIZE = 108;
const CONNECTOR_HEIGHT = 64;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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

  const enter = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const innerPulse = useRef(new Animated.Value(1)).current;

  // Stagger entry
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 520,
      delay: index * 80,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  // Current node: rotating ring + halo pulse + inner subtle scale
  useEffect(() => {
    if (!isCurrent) return;
    const rotateLoop = Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(innerPulse, {
          toValue: 1.05,
          duration: 1300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(innerPulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    rotateLoop.start();
    haloLoop.start();
    pulseLoop.start();
    return () => {
      rotateLoop.stop();
      haloLoop.stop();
      pulseLoop.stop();
    };
  }, [isCurrent, ringRotate, halo, innerPulse]);

  const accent = milestone.color;
  const xpTarget = milestone.threshold === 0 ? 10 : milestone.threshold;
  const progressRatio = isCurrent ? Math.min(1, currentXP / xpTarget) : isDone ? 1 : 0;

  const ringRotation = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[s.row, { transform: [{ translateX: offset }] }]}>
      <Animated.View
        style={{
          opacity: enter,
          transform: [{ scale: enter }],
          alignItems: "center",
        }}
      >
        {/* Node container — node + ring + halo */}
        <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: "center", justifyContent: "center" }}>
          {/* Outer halo — current only */}
          {isCurrent && (
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                width: RING_SIZE + 28,
                height: RING_SIZE + 28,
                borderRadius: (RING_SIZE + 28) / 2,
                backgroundColor: accent,
                opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.18] }),
                transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.05] }) }],
              }}
            />
          )}

          {/* Progress ring (SVG) */}
          {(isCurrent || isDone) && (
            <Animated.View
              style={{
                position: "absolute",
                transform: isCurrent ? [{ rotate: ringRotation }] : [],
              }}
            >
              <Svg width={RING_SIZE} height={RING_SIZE}>
                <Defs>
                  <SvgGrad id={`grad-${milestone.lv}`} x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={accent} stopOpacity="1" />
                    <Stop offset="1" stopColor={accent} stopOpacity="0.4" />
                  </SvgGrad>
                </Defs>
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={(RING_SIZE - 4) / 2}
                  stroke={c.bgSurface}
                  strokeWidth={3}
                  fill="none"
                />
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={(RING_SIZE - 4) / 2}
                  stroke={`url(#grad-${milestone.lv})`}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * ((RING_SIZE - 4) / 2)}
                  strokeDashoffset={
                    2 * Math.PI * ((RING_SIZE - 4) / 2) * (1 - progressRatio)
                  }
                  transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                />
              </Svg>
            </Animated.View>
          )}

          {/* Inner node — premium gradient */}
          <Animated.View
            style={{
              transform: [{ scale: isCurrent ? innerPulse : 1 }],
            }}
          >
            <View
              style={[
                s.node,
                {
                  borderColor: isLocked ? c.border : accent,
                  shadowColor: accent,
                  shadowOpacity: isCurrent ? 0.55 : isDone ? 0.3 : 0,
                  opacity: isLocked ? 0.45 : 1,
                  overflow: "hidden",
                },
              ]}
            >
              {/* Background — done = solid gradient, current = subtle gradient, upcoming = surface */}
              {isDone ? (
                <LinearGradient
                  colors={[accent, hexShift(accent, -40)]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : isCurrent ? (
                <>
                  <LinearGradient
                    colors={[c.bgElevated, c.bgSurface]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <LinearGradient
                    colors={[accent + "22", "transparent"]}
                    start={{ x: 0.3, y: 0 }}
                    end={{ x: 0.7, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </>
              ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: c.bgSurface }]} />
              )}

              {/* Top edge highlight */}
              <LinearGradient
                colors={["rgba(255,255,255,0.12)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.4 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              {/* Icon */}
              {isDone ? (
                <Icon d={ICONS.check} size={32} stroke={"#FFFFFF"} sw={3.4} />
              ) : isLocked ? (
                <Icon d={ICONS.lock} size={26} stroke={c.textMuted} sw={1.5} />
              ) : (
                <Icon
                  d={milestone.icon || ICONS.star}
                  size={28}
                  stroke={accent}
                  fill={accent + "33"}
                  sw={1.6}
                />
              )}
            </View>
          </Animated.View>
        </View>

        {/* Label area */}
        <View style={{ alignItems: "center", marginTop: 4, maxWidth: 160 }}>
          {/* Current → "Buradasın" pill */}
          {isCurrent && (
            <View style={[s.youAreHere, { backgroundColor: accent }]}>
              <View style={s.youAreHereDot} />
              <Text style={[s.youAreHereTxt, { fontFamily: c.fontBodyBold }]}>
                BURADASIN
              </Text>
            </View>
          )}

          {/* Lv chip */}
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

          {isCurrent ? (
            <Text style={[s.subActive, { color: accent, fontFamily: c.fontBodySemi }]}>
              {currentXP} / {xpTarget} XP
            </Text>
          ) : isDone ? (
            <View style={s.doneRow}>
              <Icon d={ICONS.check} size={11} stroke={accent} sw={2.5} />
              <Text style={[s.subDone, { color: accent, fontFamily: c.fontBody, marginLeft: 4 }]}>
                tamamlandı
              </Text>
            </View>
          ) : (
            <Text style={[s.sub, { color: c.textMuted, fontFamily: c.fontBody }]}>
              {milestone.threshold} XP
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Connector */}
      {!isLast && (
        <View style={s.connectorWrap}>
          {isDone ? (
            <LinearGradient
              colors={[accent, accent + "55"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={s.connectorSolid}
            />
          ) : (
            <View style={[s.connectorDashed, { borderColor: c.border }]} />
          )}
        </View>
      )}
    </View>
  );
}

/** Hex'i ±N darken/lighten */
function hexShift(hex, amount) {
  if (!hex?.startsWith("#")) return hex;
  const n = Math.max(-255, Math.min(255, amount));
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + n;
  let g = ((num >> 8) & 0xff) + n;
  let b = (num & 0xff) + n;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const s = StyleSheet.create({
  row: {
    alignItems: "center",
    marginBottom: 4,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 22,
    elevation: 6,
  },
  youAreHere: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: 6,
    marginTop: 8,
  },
  youAreHereDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  youAreHereTxt: {
    color: "#FFFFFF",
    fontSize: 9,
    letterSpacing: 0.8,
  },
  lvPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    marginBottom: 6,
    marginTop: 8,
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
    letterSpacing: 0.3,
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  connectorWrap: {
    width: 6,
    alignItems: "center",
    marginVertical: 2,
  },
  connectorSolid: {
    width: 4,
    height: CONNECTOR_HEIGHT,
    borderRadius: 2,
  },
  connectorDashed: {
    width: 0,
    height: CONNECTOR_HEIGHT,
    borderLeftWidth: 2,
    borderStyle: "dashed",
  },
});
