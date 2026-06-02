/* global setTimeout, clearTimeout */
/**
 * ToastContext — Alert.alert yerine zarif top-toast
 * useToast().show({ message, type: 'success' | 'error' | 'info', duration })
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import T from "../themes/tokens";

const ToastContext = createContext({ show: () => {} });

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const timer = useRef(null);

  const hide = useCallback(() => {
    translateY.value = withTiming(-120, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) runOnJS(setToast)(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    ({ message, type = "info", duration = 2500 }) => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, type });
      translateY.value = withSequence(
        withTiming(-120, { duration: 0 }),
        withTiming(0, { duration: 260 })
      );
      opacity.value = withTiming(1, { duration: 200 });
      timer.current = setTimeout(hide, duration);
    },
    [hide, opacity, translateY]
  );

  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bg = toast?.type === "success" ? "#22C55E" : toast?.type === "error" ? T.coral : T.sky;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.wrap, { top: insets.top + 8 }, animStyle]}
        >
          <Pressable onPress={hide} style={[styles.toast, { backgroundColor: bg }]}>
            <Text style={styles.text} numberOfLines={3}>
              {toast.message}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 20,
  },
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  text: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default ToastContext;
