import React, { useCallback, useRef } from "react";
import { Animated, Pressable, Easing } from "react-native";

const SPRING_CONFIG = { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true };

export default function PressableScale({
  children,
  style,
  scaleDown = 0.965,
  disabled,
  onPress,
  onLongPress,
  hitSlop,
  accessibilityLabel,
  accessibilityRole,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onIn = useCallback(() => {
    Animated.timing(scale, { toValue: scaleDown, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [scale, scaleDown]);

  const onOut = useCallback(() => {
    Animated.timing(scale, SPRING_CONFIG).start();
  }, [scale]);

  return (
    <Pressable
      onPressIn={onIn}
      onPressOut={onOut}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole || "button"}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
