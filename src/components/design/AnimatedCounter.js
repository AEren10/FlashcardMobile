/**
 * AnimatedCounter — sayı artarken tick animasyonu.
 * Eski sayı translateY 0→-100% + opacity 1→0 (200ms ease-in).
 * Yeni sayı translateY 100%→0 + opacity 0→1 (250ms cubic-bezier) + scale punch 1→1.15→1.
 */
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text, StyleSheet } from "react-native";

export default function AnimatedCounter({ value, style, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const v = useRef(new Animated.Value(0)).current;
  const punch = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (prevRef.current === value) return;
    // tick animation
    Animated.sequence([
      Animated.timing(v, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisplay(value);
      v.setValue(0);
      // punch
      Animated.sequence([
        Animated.timing(punch, {
          toValue: 1.15,
          duration: 120,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(punch, {
          toValue: 1,
          duration: 200,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    });
    prevRef.current = value;
  }, [value, v, punch]);

  const ty = v.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const op = v.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View style={s.wrap}>
      <Animated.Text
        style={[
          style,
          {
            transform: [{ translateY: ty }, { scale: punch }],
            opacity: op,
          },
        ]}
      >
        {prefix}
        {display}
        {suffix}
      </Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { overflow: "hidden" },
});
