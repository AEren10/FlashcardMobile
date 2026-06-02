/**
 * DonutChart — SVG ile animasyonlu donut.
 * Center: yüzde + label.
 */
import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DonutChart({
  percent = 0,
  size = 140,
  strokeWidth = 14,
  color,
  trackColor,
  label = "doğru",
}) {
  const { c } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const fillColor = color || c.accent;
  const trk = trackColor || c.bgSurface;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percent / 100,
      duration: 1400,
      useNativeDriver: false,
    }).start();
  }, [percent, progress]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const displayPct = useAnimatedValue(progress, percent);

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
            strokeDashoffset={strokeDashoffset}
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

// Animated value'yu Text'e çevirmek için hook
function useAnimatedValue(animated, target) {
  const [val, setVal] = React.useState(0);
  useEffect(() => {
    const id = animated.addListener(({ value }) => {
      setVal(Math.round(value * target));
    });
    return () => animated.removeListener(id);
  }, [animated, target]);
  return val;
}

const s = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  center: { position: "absolute", alignItems: "center", justifyContent: "center" },
  pct: { fontSize: 32, lineHeight: 36 },
  label: { fontSize: 11, marginTop: 2, letterSpacing: 0.3 },
});
