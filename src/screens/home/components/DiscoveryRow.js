/**
 * DiscoveryRow — HomeScreen'da kullanılan alt alta horizontal slider'lar.
 * Title + horizontal scroll + mini liste kartları.
 */
import React, { memo } from "react";
import { fontSize, radius } from "../../../themes/tokens";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import CategoryCover from "../../../components/design/CategoryCover";
import StaggerEnter from "../../../components/design/StaggerEnter";
import PressableScale from "../../../components/design/PressableScale";
import RatingChip from "../../../components/design/RatingChip";
import { Skeleton } from "../../../components/design/Skeleton";

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
              {
                borderColor: tint + "88",
                backgroundColor: tint + "1F",
                shadowColor: tint,
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
              },
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
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToAlignment="start"
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
      <Skeleton width="100%" height={100} radius={0} />
      <View style={{ padding: 12, gap: 8 }}>
        <Skeleton width="75%" height={12} radius={6} />
        <Skeleton width="50%" height={9} radius={4} />
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
      // Bg ve border kaldırıldı — Devam Et card'larıyla tutarlı, beyaz container göze batmasın
      // CategoryCover + text yeterli (image kart hissi zaten verir)
      style={s.card}
      scaleDown={0.96}
    >
      <View style={{ borderRadius: 13, overflow: "hidden" }}>
        <CategoryCover difficulty={item.level} cat={item.category} imageUrl={item.image_url} height={100} />
      </View>
      <View style={{ paddingTop: 10, paddingHorizontal: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            numberOfLines={1}
            style={{ fontFamily: c.fontBodySemi, fontSize: fontSize.md, color: c.textPrimary, flex: 1 }}
          >
            {item.title}
          </Text>
          <RatingChip avg={item.avg_rating} count={item.rating_count} c={c} />
        </View>
        <Text
          style={{ fontFamily: c.fontBody, fontSize: fontSize.sm, color: c.textSec, marginTop: 4 }}
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
    marginBottom: 14,
  },
  title: { fontSize: fontSize.xl, lineHeight: 24, letterSpacing: 0.1 },
  sub: { fontSize: fontSize.sm, marginTop: 3, lineHeight: 16 },
  seeAll: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  seeAllTxt: {
    fontSize: fontSize.sm,
    letterSpacing: 0.3,
  },
  card: {
    width: 192,
    // borderRadius/borderWidth kaldırıldı — Devam Et tarzı sade, beyaz container yok
  },
});
