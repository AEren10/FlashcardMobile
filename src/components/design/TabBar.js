/**
 * TabBar — Floating glass effect, 4 sekme.
 * Indicator: 280ms spring slide between tabs.
 * Active: lime indicator + filled glow icon + label color shift.
 */
import React, { useEffect, useRef } from "react";
import { View, Pressable, Text, StyleSheet, Platform, Animated, Easing } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

const TAB_ICONS = {
  Home: ICONS.home,
  Favorites: ICONS.bolt,
  Study: ICONS.bolt,
  MyLists: ICONS.books,
  Library: ICONS.books,
  Profile: ICONS.user,
};

const LABELS = {
  Home: "Ana Sayfa",
  Favorites: "Çalış",
  Study: "Çalış",
  MyLists: "Kütüphane",
  Library: "Kütüphane",
  Profile: "Profil",
};

export default function TabBar({ state, navigation }) {
  const { c, isDark } = useTheme();
  const barWidth = useRef(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!barWidth.current) return;
    const tabW = barWidth.current / state.routes.length;
    Animated.spring(indicatorX, {
      toValue: state.index * tabW + tabW / 2 - 12,
      stiffness: 280,
      damping: 22,
      useNativeDriver: true,
    }).start();
  }, [state.index, state.routes.length, indicatorX]);

  return (
    <View pointerEvents="box-none" style={s.absoluteWrap}>
      <View
        style={[
          s.bar,
          {
            backgroundColor: isDark ? "rgba(14,23,38,0.72)" : "rgba(255,255,255,0.72)",
            borderColor: c.border,
            shadowColor: isDark ? "#000" : "rgba(15,25,37,0.18)",
          },
        ]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          barWidth.current = w;
          const tabW = w / state.routes.length;
          indicatorX.setValue(state.index * tabW + tabW / 2 - 12);
        }}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 60 : 30}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />

        {/* Sliding indicator */}
        <Animated.View
          style={[
            s.indicator,
            {
              backgroundColor: c.accent,
              shadowColor: c.accent,
              transform: [{ translateX: indicatorX }],
            },
          ]}
          pointerEvents="none"
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const label = LABELS[route.name] || route.name;
          const d = TAB_ICONS[route.name] || ICONS.home;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={s.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={`${label} sekmesi`}
            >
              <Icon
                d={d}
                size={23}
                stroke={isFocused ? c.accent : c.textMuted}
                fill={isFocused ? c.accentGlow : "none"}
                sw={isFocused ? 1.6 : 1.7}
              />
              <Text
                style={[
                  s.label,
                  { color: isFocused ? c.accent : c.textMuted, fontFamily: c.fontBodySemi },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  absoluteWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 26,
  },
  bar: {
    flexDirection: "row",
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: "100%",
  },
  indicator: {
    position: "absolute",
    top: 6,
    left: 0,
    width: 24,
    height: 4,
    borderRadius: 99,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  label: {
    fontSize: 10.5,
    letterSpacing: 0.3,
  },
});
