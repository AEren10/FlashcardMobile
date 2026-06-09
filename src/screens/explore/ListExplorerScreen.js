/**
 * ListExplorerScreen — "Tümü" basınca açılan generic listing.
 * route.params: { title, filter ('popular'|'newest'|'category'|'continue'), category?, accent? }
 * FlatList ile alt alta detaylı liste kartları (perf).
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { useTheme } from "../../contexts/ThemeContext";
import usePublicLists from "../../hooks/usePublicLists";
import { selectFavoriteListIds } from "../../store/favoritesSlice";
import CategoryCover from "../../components/design/CategoryCover";
import PressableScale from "../../components/design/PressableScale";
import RatingChip from "../../components/design/RatingChip";
import { getCategoryAccent } from "../../lib/categoryMeta";
import Icon, { ICONS } from "../../components/design/Icon";
import EmptyState from "../../components/EmptyState";
import StaggerEnter from "../../components/design/StaggerEnter";
import { SkeletonListItem } from "../../components/design/Skeleton";

export default function ListExplorerScreen({ route, navigation }) {
  const {
    title = "Listeler",
    filter = "popular",
    category,
    accent,
    searchMode = false,
  } = route.params ?? {};
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { lists: allLists, loading, error, reload } = usePublicLists();
  const [query, setQuery] = useState("");
  const favIds = useSelector(selectFavoriteListIds);
  const favSet = useMemo(() => new Set(favIds.map(String)), [favIds]);
  const tint = accent || c.accent;

  // Filter + sort allLists once (artık fetch yok)
  const lists = useMemo(() => {
    let data = allLists;
    if (filter === "popular") {
      data = [...data].sort((a, b) => (b.study_count ?? 0) - (a.study_count ?? 0));
    } else if (filter === "newest") {
      data = [...data].sort((a, b) => (b.inserted_at || "").localeCompare(a.inserted_at || ""));
    } else if (filter === "category" && category) {
      data = data.filter(
        (l) => (l.category || "").toLowerCase() === category.toLowerCase()
      );
    }
    return data;
  }, [allLists, filter, category]);

  // Search modunda local filtre uygulanır
  const visibleLists = useMemo(() => {
    if (!searchMode || !query.trim()) return lists;
    const q = query.trim().toLowerCase();
    return lists.filter(
      (l) =>
        (l.title || "").toLowerCase().includes(q) ||
        (l.description || "").toLowerCase().includes(q) ||
        (l.category || "").toLowerCase().includes(q)
    );
  }, [lists, searchMode, query]);


  const renderItem = useCallback(
    ({ item, index }) => (
      <StaggerEnter index={Math.min(index, 8)} delay={60}>
        <ListItem
          item={item}
          fav={favSet.has(String(item.id))}
          tint={tint}
          c={c}
          s={s}
          onPress={() =>
            navigation.navigate("FlashcardDetail", {
              listId: item.id,
              listTitle: item.title,
              listLevel: item.level,
              listIsPublic: item.is_public,
            })
          }
        />
      </StaggerEnter>
    ),
    [favSet, tint, c, s, navigation]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={[s.back, { borderColor: c.border }]}
            accessibilityLabel="Geri dön"
          >
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{title}</Text>
            {!loading && (
              <Text style={s.count}>{visibleLists.length} liste</Text>
            )}
          </View>
          <View style={[s.accentDot, { backgroundColor: tint, shadowColor: tint }]} />
        </View>

        {/* Search input — sadece searchMode'da */}
        {searchMode && (
          <View style={s.searchWrap}>
            <View style={[s.searchBox, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
              <Icon d={ICONS.search} size={16} stroke={c.textMuted} sw={1.8} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Liste veya kategori ara…"
                placeholderTextColor={c.textMuted}
                selectionColor={c.accent}
                style={[s.searchInput, { color: c.textPrimary, fontFamily: c.fontBody }]}
                autoFocus
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {!!query && (
                <Pressable onPress={() => setQuery("")} hitSlop={8}>
                  <Icon d={ICONS.x} size={14} stroke={c.textMuted} sw={2} />
                </Pressable>
              )}
            </View>
          </View>
        )}

        {loading ? (
          <ScrollView
            contentContainerStyle={{ padding: spacing.xl, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonListItem key={i} />
            ))}
          </ScrollView>
        ) : error && allLists.length === 0 ? (
          <EmptyState
            kind="offline"
            title="Listeler yüklenemedi"
            subtitle="İnternet bağlantını kontrol et ve tekrar dene."
            actionLabel="Tekrar dene"
            onAction={() => reload?.()}
            secondaryLabel="Geri dön"
            onSecondary={() => navigation.goBack?.()}
          />
        ) : visibleLists.length === 0 ? (
          <EmptyState
            kind="search"
            title={
              searchMode && query
                ? `"${query}" için sonuç yok`
                : "Bu kategoride henüz liste yok"
            }
            subtitle={
              searchMode && query
                ? "Başka bir kelime dene veya kategori sayfasından gez."
                : "Yakında daha fazla içerik eklenecek."
            }
          />
        ) : (
          <FlatList
            data={visibleLists}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ padding: spacing.xl, paddingBottom: 40, gap: spacing.md }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            maxToRenderPerBatch={8}
            windowSize={5}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const ListItem = React.memo(function ListItem({ item, fav, tint, c, s, onPress }) {
  const catAccent = getCategoryAccent(item.category) || tint;
  return (
    <PressableScale
      onPress={onPress}
      style={[
        s.card,
        {
          borderColor: catAccent + "44",
          shadowColor: catAccent,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.16,
          shadowRadius: 8,
          elevation: 2,
        },
      ]}
    >
      <View style={s.coverWrap}>
        <CategoryCover difficulty={item.level} cat={item.category} imageUrl={item.image_url} height={90}>
          {fav && (
            <View style={[s.starBadge, { backgroundColor: "rgba(0,0,0,0.32)" }]}>
              <Icon d={ICONS.star} size={14} stroke="#fff" fill="#fff" sw={1.5} />
            </View>
          )}
        </CategoryCover>
      </View>
      <View style={{ flex: 1, paddingVertical: spacing.xs }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={[s.cardTitle, { flex: 1 }]} numberOfLines={1}>{item.title}</Text>
          <RatingChip avg={item.avg_rating} count={item.rating_count} c={c} />
        </View>
        {!!item.description && (
          <Text style={s.cardDesc} numberOfLines={1}>{item.description}</Text>
        )}
        <View style={s.row}>
          <Text style={s.metaTxt}>{item.word_count ?? "?"} kelime</Text>
          {(item.study_count ?? 0) > 0 && (
            <>
              <View style={[s.metaDot, { backgroundColor: c.textMuted }]} />
              <Icon d={ICONS.flame} size={11} stroke={catAccent} fill={catAccent} sw={1.5} />
              <Text style={[s.metaTxt, { color: catAccent }]}>{item.study_count}</Text>
            </>
          )}
        </View>
      </View>
      <Icon d={ICONS.arrow} size={18} stroke={c.textMuted} sw={1.8} />
    </PressableScale>
  );
});

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    back: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
      borderWidth: 1,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontFamily: c.fontDisplay,
      fontSize: 28,
      lineHeight: 32,
      color: c.textPrimary,
    },
    count: {
      fontFamily: c.fontBody,
      fontSize: 11,
      color: c.textMuted,
      marginTop: 2,
    },
    accentDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
    },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    searchWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.xs, paddingBottom: spacing.sm },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: spacing.md,
      borderRadius: radius.sm,
      borderWidth: 1,
    },
    searchInput: { flex: 1, fontSize: 14, padding: 0 },

    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      padding: spacing.md,
    },
    coverWrap: {
      width: 90,
      borderRadius: radius.sm,
      overflow: "hidden",
    },
    starBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 22,
      height: 22,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    cardTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    cardDesc: {
      fontFamily: c.fontBody,
      fontSize: 12,
      color: c.textSec,
      marginTop: 2,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: spacing.sm,
    },
    metaTxt: {
      fontFamily: c.fontBodyMed,
      fontSize: 11,
      color: c.textSec,
    },
    metaDot: { width: 3, height: 3, borderRadius: 2 },
  });
}
