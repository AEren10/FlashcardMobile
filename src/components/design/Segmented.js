/**
 * Segmented control — Claude Design v2.
 * Animated indicator slide between segments.
 */
import React, { useEffect, useRef } from "react";
import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function Segmented({ items, value, onChange }) {
  const { c } = useTheme();
  const idx = Math.max(0, items.indexOf(value));
  const segWidth = useRef(0);
  const indLeft = useRef(new Animated.Value(0)).current;
  const indWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!segWidth.current) return;
    const w = segWidth.current / items.length;
    Animated.parallel([
      Animated.timing(indLeft, {
        toValue: idx * w + 4,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(indWidth, {
        toValue: w - 8,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [idx, items.length, indLeft, indWidth]);

  return (
    <View
      style={[s.wrap, { backgroundColor: c.bgSurface, borderColor: c.border }]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        segWidth.current = w;
        const segW = w / items.length;
        indLeft.setValue(idx * segW + 4);
        indWidth.setValue(segW - 8);
      }}
    >
      <Animated.View
        style={[
          s.indicator,
          {
            backgroundColor: c.bgElevated,
            left: indLeft,
            width: indWidth,
            borderColor: c.borderAccent,
          },
        ]}
      />
      {items.map((it) => {
        const on = it === value;
        return (
          <Pressable key={it} onPress={() => onChange(it)} style={s.btn}>
            <Text
              style={[
                s.txt,
                {
                  color: on ? c.textPrimary : c.textSec,
                  fontFamily: c.fontBodySemi,
                },
              ]}
            >
              {it}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "relative",
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 9,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    zIndex: 1,
  },
  txt: {
    fontSize: 13,
  },
});
