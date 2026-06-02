/**
 * StaggerEnter — fm-rise entrance with stagger delay.
 * Spec: translateY 24→0 + opacity 0→1, 400ms cubic-bezier, 60ms stagger.
 */
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function StaggerEnter({ index = 0, delay = 60, duration = 400, children, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(v, {
        toValue: 1,
        duration,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }, index * delay);
    return () => clearTimeout(t);
  }, [v, index, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [
            {
              translateY: v.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
