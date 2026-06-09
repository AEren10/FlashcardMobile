/**
 * TabBar — Floating glass effect, 4 sekme.
 * Indicator: 280ms spring slide between tabs.
 * Active: lime indicator + filled glow icon + label color shift.
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useRef } from "react";
import { View, Pressable, Text, StyleSheet, Platform, Animated, Easing } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
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

export default function TabBar({ state, navigation, descriptors }) {
  const { c, isDark } = useTheme();
  const barWidth = useRef(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  // Focused tab'da tabBarStyle.display === "none" ise tüm bar'ı render etme.
  // Programmatic setOptions ile (FlashcardDetail/Study/Quiz) tab bar'ı saklamak için.
  const focusedKey = state.routes[state.index]?.key;
  const focusedOptions = descriptors?.[focusedKey]?.options;
  const tabBarStyleOpt = focusedOptions?.tabBarStyle;
  // Array veya object olabilir — display: "none" varsa render etme
  const hidden = Array.isArray(tabBarStyleOpt)
    ? tabBarStyleOpt.some((s) => s?.display === "none")
    : tabBarStyleOpt?.display === "none";

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

  if (hidden) return null;

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
            <TabButton
              key={route.key}
              isFocused={isFocused}
              label={label}
              iconPath={d}
              onPress={onPress}
              c={c}
            />
          );
        })}
      </View>
    </View>
  );
}

/**
 * TabButton — kendi animasyonlarını yönetir.
 * Press: light haptic + scale 0.92 + ripple ring burst
 * Active oluyor: icon kısa pulse + glow expand
 */
function TabButton({ isFocused, label, iconPath, onPress, c }) {
  const scale = useRef(new Animated.Value(1)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const activePulse = useRef(new Animated.Value(0)).current;
  const wasFocused = useRef(isFocused);

  // Aktif olunca: kısa icon pulse + ripple burst
  useEffect(() => {
    if (isFocused && !wasFocused.current) {
      // Yeni aktif oldu — celebration micro-pulse
      Animated.sequence([
        Animated.timing(activePulse, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(activePulse, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      // Aynı anda ripple ring
      ripple.setValue(0);
      Animated.timing(ripple, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
    wasFocused.current = isFocused;
  }, [isFocused, activePulse, ripple]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      stiffness: 380,
      damping: 18,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 280,
      damping: 16,
    }).start();
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    if (!isFocused) {
      // Press anında ripple başlat (zaten focus useEffect'te de var, ama hemen feedback)
      ripple.setValue(0);
      Animated.timing(ripple, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
    onPress?.();
  };

  const iconScale = Animated.add(
    scale,
    activePulse.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] })
  );
  const rippleScale = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2.2],
  });
  const rippleOpacity = ripple.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.6, 0],
  });

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={s.tab}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={`${label} sekmesi`}
    >
      {/* Ripple ring — press ya da activate olunca dışa açılır */}
      <Animated.View
        pointerEvents="none"
        style={[
          s.ripple,
          {
            borderColor: c.accent,
            opacity: rippleOpacity,
            transform: [{ scale: rippleScale }],
          },
        ]}
      />

      <Animated.View style={{ transform: [{ scale: iconScale }], alignItems: "center" }}>
        <Icon
          d={iconPath}
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
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  absoluteWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: 26,
  },
  bar: {
    flexDirection: "row",
    height: 64,
    borderRadius: radius.lg,
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
    gap: spacing.xs,
    height: "100%",
    position: "relative",
  },
  ripple: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 2,
    top: "50%",
    marginTop: -22,
  },
  indicator: {
    position: "absolute",
    top: 6,
    left: 0,
    width: 24,
    height: 4,
    borderRadius: radius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  label: {
    fontSize: 10.5,
    letterSpacing: 0.3,
  },
});
