import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "../../contexts/ThemeContext";

import flameAnim from "../../assets/lottie/flame.json";

export default function AnimatedFlame({ size = 64, streak = 0 }) {
  const { c } = useTheme();
  const isHot = streak >= 30;
  const ringColor = isHot ? c.error : c.warning;

  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeRing = (val) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );

    const r1 = makeRing(ring1);
    const r2 = makeRing(ring2);
    const r3 = makeRing(ring3);
    r1.start();
    const t2 = setTimeout(() => r2.start(), 730);
    const t3 = setTimeout(() => r3.start(), 1460);

    return () => {
      r1.stop();
      r2.stop();
      r3.stop();
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [ring1, ring2, ring3]);

  const ringStyle = (val) => ({
    width: size * 0.85,
    height: size * 0.85,
    borderRadius: size,
    borderWidth: 1.5,
    borderColor: ringColor,
    position: "absolute",
    opacity: val.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.55, 0] }),
    transform: [{ scale: val.interpolate({ inputRange: [0, 1], outputRange: [0.7, 2.4] }) }],
  });

  return (
    <View style={[s.wrap, { width: size + 40, height: size + 40 }]}>
      <Animated.View pointerEvents="none" style={ringStyle(ring1)} />
      <Animated.View pointerEvents="none" style={ringStyle(ring2)} />
      <Animated.View pointerEvents="none" style={ringStyle(ring3)} />
      <LottieView
        source={flameAnim}
        autoPlay
        loop
        speed={isHot ? 1.3 : 1}
        style={{ width: size * 1.3, height: size * 1.3 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
