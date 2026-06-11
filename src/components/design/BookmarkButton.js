/**
 * BookmarkButton — kelime favorileme butonu.
 * Tap → scale bounce + haptic + Redux dispatch + uçan ghost animasyonu (sadece add).
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View, Easing } from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import {
  toggleFavoriteWord,
  selectIsWordFavorite,
} from "../../store/favoriteWordsSlice";
import Icon from "./Icon";

// Bookmark icon path (Material-style)
const BOOKMARK = "M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3.5L6 22V4Z";

export default function BookmarkButton({ wordId, listId, size = 38 }) {
  const { c } = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, isGuestUser } = useAuth();
  const toast = useToast();
  const isFavorite = useSelector((s) =>
    wordId ? selectIsWordFavorite(s, wordId) : false
  );
  const scale = useRef(new Animated.Value(1)).current;

  // Uçan ghost — favorile eklenince hareket eder
  const ghostAnim = useRef(new Animated.Value(0)).current;
  const [ghostKey, setGhostKey] = useState(0);

  if (!wordId) return null;

  const flyGhost = () => {
    ghostAnim.setValue(0);
    setGhostKey((k) => k + 1);
    Animated.timing(ghostAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (e) => {
    e.stopPropagation?.();
    // Audit #4 — Guest mode: sessiz fail yerine açık feedback
    if (!isAuthenticated() || isGuestUser()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      toast?.show?.("Favori için üye olman gerek", { type: "warning" });
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 30, bounciness: 14 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start();
    // Sadece eklerken uçur, çıkarırken değil
    if (!isFavorite) flyGhost();
    dispatch(toggleFavoriteWord({ wordId, listId, isFavorite }));
  };

  return (
    <View style={{ width: size, height: size }}>
      <Pressable
        onPress={handlePress}
        hitSlop={10}
        style={[
          s.btn,
          {
            width: size,
            height: size,
            borderRadius: radius.sm,
            borderColor: isFavorite ? c.borderAccent : c.border,
            backgroundColor: isFavorite ? c.accentGlow : c.bgSurface,
          },
        ]}
        accessibilityLabel={isFavorite ? "Favori kelimeden çıkar" : "Favori kelimeye ekle"}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon
            d={BOOKMARK}
            size={18}
            stroke={isFavorite ? c.accent : c.textMuted}
            fill={isFavorite ? c.accent : "none"}
            sw={1.8}
          />
        </Animated.View>
      </Pressable>

      {/* Uçan ghost — sadece eklerken görünür, sonra fade-out */}
      <Animated.View
        key={ghostKey}
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          opacity: ghostAnim.interpolate({
            inputRange: [0, 0.15, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateX: ghostAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 60],
              }),
            },
            {
              translateY: ghostAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -180],
              }),
            },
            {
              scale: ghostAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2.2],
              }),
            },
            {
              rotate: ghostAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "25deg"],
              }),
            },
          ],
        }}
      >
        <Icon d={BOOKMARK} size={18} stroke={c.accent} fill={c.accent} sw={1.8} />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
