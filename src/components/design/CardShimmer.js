/**
 * CardShimmer — reusable shimmer sweep + subtle heartbeat pulse.
 * Wrap any card: <CardShimmer color={accent}><YourCard /></CardShimmer>
 * pulse: kalp gibi atar (scale 1.0 → 1.008)
 * shimmer: light band soldan sağa kayar
 */
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

const SHARED_SHIMMER = new Animated.Value(0);
let SHARED_STARTED = false;

function startSharedLoop() {
  if (SHARED_STARTED) return;
  SHARED_STARTED = true;
  Animated.loop(
    Animated.sequence([
      Animated.timing(SHARED_SHIMMER, {
        toValue: 1,
        duration: 2800,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(SHARED_SHIMMER, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ])
  ).start();
}

export default function CardShimmer({
  children,
  color = "#FFFFFF",
  pulse = true,
  shimmer = true,
  style,
}) {
  const pulseVal = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (shimmer) startSharedLoop();
  }, [shimmer]);

  useEffect(() => {
    let loop;
    if (pulse) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseVal, {
            toValue: 1.006,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseVal, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    }
    return () => loop?.stop();
  }, [pulse, pulseVal]);

  const translateX = SHARED_SHIMMER.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 400],
  });

  return (
    <Animated.View style={[{ transform: [{ scale: pulseVal }] }, style]}>
      {children}
      {shimmer && (
        <Animated.View
          pointerEvents="none"
          style={[
            s.shimmer,
            {
              backgroundColor: color + "12",
              transform: [{ translateX }, { rotate: "18deg" }],
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  shimmer: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 60,
    borderRadius: 30,
  },
});
