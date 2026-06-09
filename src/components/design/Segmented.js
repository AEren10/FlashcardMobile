/**
 * Segmented control — Claude Design v2.
 * Animated indicator slide between segments.
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function Segmented({ items, value, onChange }) {
  const { c } = useTheme();
  const idx = Math.max(0, items.indexOf(value));
  const [segW, setSegW] = React.useState(0);
  // translateX ile native driver, jank yok
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!segW) return;
    const itemW = segW / items.length;
    Animated.timing(translateX, {
      toValue: idx * itemW,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [idx, items.length, segW, translateX]);

  const itemW = segW > 0 ? segW / items.length : 0;

  return (
    <View
      style={[s.wrap, { backgroundColor: c.bgSurface, borderColor: c.border }]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width - 8; // padding 4*2
        setSegW(w);
        translateX.setValue(idx * (w / items.length));
      }}
    >
      <Animated.View
        style={[
          s.indicator,
          {
            backgroundColor: c.bgElevated,
            width: itemW,
            transform: [{ translateX }],
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
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 4,
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
