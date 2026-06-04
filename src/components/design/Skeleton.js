/**
 * Skeleton — placeholder primitives with shimmer wave.
 * Hepsi useNativeDriver translate-X — 60fps, ucuz.
 *
 * Primitives:  Skeleton (block)
 * Composites:  SkeletonListCard, SkeletonContinueCard, SkeletonStatChip,
 *              SkeletonGoalCard, SkeletonWordCard, SkeletonListItem,
 *              SkeletonFlipCard, SkeletonStatRow
 */
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export function Skeleton({ width = "100%", height = 16, radius = 8, style }) {
  const { isDark } = useTheme();
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <View
      style={[
        s.box,
        {
          width,
          height,
          borderRadius: radius,
          // Light mode'da daha vurgulu zemin — shimmer net görünsün
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(44,37,32,0.10)",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            // Shimmer bandı: dark'ta açık, light'ta parlak beyaz band geçsin
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.55)",
            transform: [
              {
                translateX: shimmer.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-200, 200],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

export function SkeletonListCard() {
  const { c } = useTheme();
  return (
    <View
      style={[
        s.card,
        { backgroundColor: c.bgElevated, borderColor: c.border },
      ]}
    >
      <Skeleton height={72} radius={0} width="100%" />
      <View style={{ padding: 16, gap: 8 }}>
        <Skeleton width="65%" height={18} radius={6} />
        <Skeleton width="40%" height={12} radius={6} />
        <View style={{ marginTop: 6 }}>
          <Skeleton width="55%" height={12} radius={6} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonContinueCard() {
  return (
    <View style={{ width: 165 }}>
      <Skeleton height={100} radius={16} />
      <View style={{ marginTop: 10, gap: 6 }}>
        <Skeleton width="80%" height={14} radius={6} />
        <Skeleton width="55%" height={11} radius={6} />
        <Skeleton width="100%" height={5} radius={6} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export function SkeletonStatChip() {
  const { c } = useTheme();
  return (
    <View
      style={[
        s.statChip,
        { backgroundColor: c.bgElevated, borderColor: c.border },
      ]}
    >
      <Skeleton width={50} height={26} radius={8} />
      <Skeleton width="70%" height={11} radius={6} style={{ marginTop: 12 }} />
    </View>
  );
}

export function SkeletonGoalCard() {
  const { c } = useTheme();
  return (
    <View
      style={[
        s.goalCard,
        { backgroundColor: c.bgElevated, borderColor: c.border },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Skeleton width="55%" height={14} radius={6} />
        <Skeleton width={36} height={14} radius={6} />
      </View>
      <Skeleton width="100%" height={9} radius={6} style={{ marginTop: 12 }} />
      <Skeleton width="50%" height={11} radius={6} style={{ marginTop: 14 }} />
    </View>
  );
}

export function SkeletonStatRow() {
  return (
    <View style={s.statRow}>
      <SkeletonStatChip />
      <View style={{ flex: 1 }}>
        <SkeletonGoalCard />
      </View>
    </View>
  );
}

export function SkeletonWordCard() {
  const { c } = useTheme();
  return (
    <View
      style={[
        s.wordCard,
        { backgroundColor: c.bgElevated, borderColor: c.border },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width="55%" height={22} radius={6} />
          <Skeleton width="80%" height={13} radius={6} />
        </View>
        <Skeleton width={36} height={36} radius={10} />
      </View>
      <Skeleton width="90%" height={12} radius={6} style={{ marginTop: 8 }} />
      <Skeleton width={110} height={22} radius={999} style={{ marginTop: 6 }} />
    </View>
  );
}

export function SkeletonListItem() {
  const { c } = useTheme();
  return (
    <View
      style={[
        s.listItem,
        { backgroundColor: c.bgElevated, borderColor: c.border },
      ]}
    >
      <Skeleton width={90} height={90} radius={12} />
      <View style={{ flex: 1, gap: 7 }}>
        <Skeleton width="70%" height={15} radius={6} />
        <Skeleton width="90%" height={11} radius={6} />
        <Skeleton width="40%" height={11} radius={6} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function SkeletonFlipCard() {
  const { c } = useTheme();
  return (
    <View
      style={[
        s.flipCard,
        { backgroundColor: c.bgElevated, borderColor: c.borderAccent },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Skeleton width={70} height={26} radius={999} />
        <Skeleton width={38} height={38} radius={12} />
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14 }}>
        <Skeleton width="60%" height={52} radius={10} />
        <Skeleton width="35%" height={16} radius={6} />
      </View>
      <Skeleton width="55%" height={12} radius={6} style={{ alignSelf: "center" }} />
    </View>
  );
}

const s = StyleSheet.create({
  box: { overflow: "hidden" },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 14,
  },
  statChip: {
    width: 110,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    minHeight: 96,
    justifyContent: "space-between",
  },
  goalCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    minHeight: 96,
    justifyContent: "space-between",
  },
  statRow: { flexDirection: "row", gap: 12 },
  wordCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  flipCard: {
    width: "100%",
    aspectRatio: 0.72,
    maxHeight: 430,
    alignSelf: "center",
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    overflow: "hidden",
  },
});
