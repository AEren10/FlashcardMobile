/**
 * AbstractIllustration — Onboarding için maskotsuz geometric illüstrasyonlar.
 * 3 tür: network (sinaptik ağ), stack (kart yığını), graph (yükselen bar).
 */
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Svg, { G, Line, Circle, Rect, Path, Defs, RadialGradient, Stop } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";

const SIZE = 200;

export default function AbstractIllustration({ kind = "network", size = 200 }) {
  const { isDark } = useTheme();
  const lime = isDark ? "#B4FF4F" : "#4A8E1F";
  const blue = isDark ? "#5B7FFF" : "#3B5BDB";
  const dim = isDark ? "rgba(180,255,79,0.10)" : "rgba(74,142,31,0.08)";

  // fm-blob 6s ease-in-out infinite — breathe loop
  const breathe = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [breathe]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const ty = breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <Animated.View
      style={[
        s.wrap,
        { width: size, height: size, transform: [{ scale }, { translateY: ty }] },
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <RadialGradient id="halo" cx="35%" cy="30%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor={dim} stopOpacity="1" />
            <Stop offset="70%" stopColor={dim} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE * 0.46} fill="url(#halo)" />
        {kind === "network" && <NetworkArt lime={lime} blue={blue} />}
        {kind === "stack" && <StackArt lime={lime} blue={blue} />}
        {kind === "graph" && <GraphArt lime={lime} blue={blue} dim={dim} />}
      </Svg>
    </Animated.View>
  );
}

function NetworkArt({ lime, blue }) {
  const nodes = [
    [100, 40],
    [50, 90],
    [150, 85],
    [70, 150],
    [140, 150],
    [100, 105],
  ];
  const edges = [
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [0, 1],
    [0, 2],
    [3, 4],
  ];
  return (
    <G>
      {edges.map(([a, b], i) => (
        <Line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={lime}
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <Circle
          key={i}
          cx={x}
          cy={y}
          r={i === 5 ? 11 : 7}
          fill={i === 5 ? lime : i % 2 ? blue : lime}
          opacity={i === 5 ? 1 : 0.85}
        />
      ))}
    </G>
  );
}

function StackArt({ lime, blue }) {
  return (
    <G>
      {[0, 1, 2, 3].map((i) => (
        <Rect
          key={i}
          x={45 + i * 3}
          y={120 - i * 26}
          width={110 - i * 6}
          height={50}
          rx={14}
          fill={i === 3 ? lime : "none"}
          stroke={i === 3 ? "none" : i % 2 ? blue : lime}
          strokeWidth="2"
          opacity={0.4 + i * 0.2}
        />
      ))}
    </G>
  );
}

function GraphArt({ lime, blue, dim }) {
  return (
    <G>
      {[0, 1, 2, 3, 4].map((i) => (
        <Rect
          key={i}
          x={36 + i * 28}
          y={150 - i * 22}
          width={18}
          height={20 + i * 22}
          rx={8}
          fill={i === 4 ? lime : dim}
          stroke={i === 4 ? "none" : i % 2 ? blue : lime}
          strokeWidth="1.5"
          opacity={i === 4 ? 1 : 0.6}
        />
      ))}
      <Path
        d="M40 150 L68 128 L96 106 L124 84 L152 62"
        stroke={lime}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeOpacity={0.9}
      />
    </G>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignSelf: "center",
  },
});
