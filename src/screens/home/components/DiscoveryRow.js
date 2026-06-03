/**
 * DiscoveryRow — HomeScreen'da kullanılan alt alta horizontal slider'lar.
 * Title + horizontal scroll + mini liste kartları.
 */
import React, { memo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import CategoryCover from "../../../components/design/CategoryCover";
import StaggerEnter from "../../../components/design/StaggerEnter";
import PressableScale from "../../../components/design/PressableScale";

export default function DiscoveryRow({
  title,
  subtitle,
  items = [],
  onItemPress,
  onSeeAll,
  accent,
  loading = false,
  skeletonCount = 4,
}) {
  const { c } = useTheme();
  if (!loading && !items.length) return null;
  const tint = accent || c.cobalt;

  return (
    <View style={{ marginTop: 22 }}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {!!onSeeAll && !loading && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onSeeAll();
            }}
            hitSlop={10}
            style={({ pressed }) => [
              s.seeAll,
              { borderColor: tint + "55", backgroundColor: tint + "11" },
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={[s.seeAllTxt, { color: tint, fontFamily: c.fontBodySemi }]}>
              Tümü →
            </Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingTop: 4, paddingBottom: 6, paddingRight: 8 }}
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <SkelCard key={`sk-${i}`} c={c} />
            ))
          : items.map((item, i) => (
              <StaggerEnter key={String(item.id)} index={i} delay={70}>
                <MiniCard item={item} c={c} onPress={() => onItemPress(item)} />
              </StaggerEnter>
            ))}
      </ScrollView>
    </View>
  );
}

const SkelCard = memo(function SkelCard({ c }) {
  return (
    <View style={[s.card, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
      <View style={{ height: 100, backgroundColor: c.bgSurface }} />
      <View style={{ padding: 12, gap: 8 }}>
        <View style={{ height: 12, width: "75%", borderRadius: 6, backgroundColor: c.bgSurface }} />
        <View style={{ height: 9, width: "50%", borderRadius: 4, backgroundColor: c.bgSurface }} />
      </View>
    </View>
  );
});

const MiniCard = memo(function MiniCard({ item, c, onPress }) {
  return (
    <PressableScale
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[s.card, { backgroundColor: c.bgElevated, borderColor: c.border }]}
      scaleDown={0.96}
    >
      <View style={{ borderRadius: 13, overflow: "hidden" }}>
        <CategoryCover difficulty={item.level} height={100} />
      </View>
      <View style={{ padding: 12 }}>
        <Text
          numberOfLines={1}
          style={{ fontFamily: c.fontBodySemi, fontSize: 14, color: c.textPrimary }}
        >
          {item.title}
        </Text>
        <Text
          style={{ fontFamily: c.fontBody, fontSize: 11.5, color: c.textSec, marginTop: 4 }}
        >
          {item.word_count ?? "?"} kelime
          {item.study_count > 0 ? ` · ${item.study_count}` : ""}
        </Text>
      </View>
    </PressableScale>
  );
});

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  title: { fontSize: 17 },
  sub: { fontSize: 11, marginTop: 2 },
  seeAll: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  seeAllTxt: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  card: {
    width: 175,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
});
