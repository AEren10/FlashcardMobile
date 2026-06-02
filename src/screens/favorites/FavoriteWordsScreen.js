/**
 * FavoriteWordsScreen — kelime bazında favoriler.
 * Liste favorilerinden ayrı: tek tek kelimeler.
 * Kart: kelime + meaning + sağ üstte liste badge'i + bookmark.
 */
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";

import { useTheme } from "../../contexts/ThemeContext";
import { getFavoriteWords } from "../../supabase/wordFavorites";
import Icon, { ICONS } from "../../components/design/Icon";
import BookmarkButton from "../../components/design/BookmarkButton";
import StaggerEnter from "../../components/design/StaggerEnter";
import EmptyState from "../../components/EmptyState";
import { SkeletonWordCard } from "../../components/design/Skeleton";

export default function FavoriteWordsScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getFavoriteWords();
    if (res.success) setItems(res.data);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={s.back}>
            <Icon d={ICONS.x} size={20} stroke={c.textPrimary} sw={2} />
          </Pressable>
          <Text style={s.headerTitle}>Favori Kelimelerim</Text>
          <View style={{ width: 36 }} />
        </View>

        {loading ? (
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <SkeletonWordCard key={i} />
            ))}
          </ScrollView>
        ) : items.length === 0 ? (
          <EmptyState
            kind="search"
            title="Favori kelimen yok 🔖"
            subtitle="Çalışırken kartın sağ üstündeki yer imine (bookmark) bas — gözden kaçırmak istemediklerin buraya gelir."
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.word_id)}
            ListHeaderComponent={
              <Text style={s.count}>{items.length} kelime</Text>
            }
            renderItem={({ item, index }) => (
              <StaggerEnter index={Math.min(index, 8)} delay={60}>
                <WordCard item={item} c={c} s={s} />
              </StaggerEnter>
            )}
            contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 10 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function WordCard({ item, c, s }) {
  const w = item.words || {};
  const list = item.lists || {};
  const wordText = w.word ?? "—";
  const meaningText = w.meaning ?? "";
  const exampleText = w.example;
  const listTitle = list.title || "Liste yok";

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => Speech.speak(wordText, { language: "en-US" })}
            hitSlop={6}
          >
            <Text style={s.word}>{wordText}</Text>
          </Pressable>
          <Text style={s.meaning}>{meaningText}</Text>
        </View>
        <BookmarkButton wordId={item.word_id} listId={item.list_id} size={36} />
      </View>
      {!!exampleText && (
        <Text style={s.example}>"{exampleText}"</Text>
      )}
      <View style={s.listBadge}>
        <Icon d={ICONS.books} size={11} stroke={c.cobalt} sw={1.8} />
        <Text style={s.listBadgeTxt}>{listTitle}</Text>
      </View>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingTop: 6,
      paddingBottom: 10,
    },
    back: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 17,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    count: {
      fontFamily: c.fontBody,
      fontSize: 12,
      color: c.textSec,
      marginBottom: 4,
    },
    card: {
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      gap: 8,
    },
    cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    word: { fontFamily: c.fontDisplay, fontSize: 26, lineHeight: 30, color: c.textPrimary },
    meaning: { fontFamily: c.fontBody, fontSize: 14, color: c.textSec, marginTop: 2 },
    example: {
      fontFamily: c.fontDisplay,
      fontStyle: "italic",
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 18,
    },
    listBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: c.cobaltDim,
      borderWidth: 1,
      borderColor: c.cobalt + "33",
    },
    listBadgeTxt: {
      fontFamily: c.fontBodySemi,
      fontSize: 10,
      color: c.cobalt,
      letterSpacing: 0.3,
    },
  });
}
