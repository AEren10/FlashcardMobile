import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import RAnimated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeContext";

const AnimatedCircle = RAnimated.createAnimatedComponent(Circle);

export default function DonutChart({
  percent = 0,
  size = 140,
  strokeWidth = 14,
  color,
  trackColor,
  label = "doğru",
}) {
  const { c } = useTheme();
  const progress = useSharedValue(0);
  const fillColor = color || c.accent;
  const trk = trackColor || c.bgSurface;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 1400 });
  }, [percent]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const [displayPct, setDisplayPct] = useState(0);
  useAnimatedReaction(
    () => Math.round(progress.value * percent),
    (val) => runOnJS(setDisplayPct)(val),
    [percent]
  );

  return (
    <View style={[s.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trk}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={fillColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={circleProps}
          />
        </G>
      </Svg>
      <View style={s.center} pointerEvents="none">
        <Text style={[s.pct, { color: c.textPrimary, fontFamily: c.fontNum }]}>
          %{displayPct}
        </Text>
        <Text style={[s.label, { color: c.textSec, fontFamily: c.fontBody }]}>{label}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  center: { position: "absolute", alignItems: "center", justifyContent: "center" },
  pct: { fontSize: 32, lineHeight: 36 },
  label: { fontSize: 11, marginTop: 2, letterSpacing: 0.3 },
});
