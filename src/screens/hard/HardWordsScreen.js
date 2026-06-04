import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { getHardWords } from "../../supabase/views";
import { SkeletonWordCard } from "../../components/design/Skeleton";
import Icon, { ICONS } from "../../components/design/Icon";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import EmptyState from "../../components/EmptyState";
import StaggerEnter from "../../components/design/StaggerEnter";

export default function HardWordsScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const goBack = () => navigation.goBack();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getHardWords();
      setWords(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Kelimeler yüklenemedi — internet bağlantını kontrol et");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  useFocusEffect(useCallback(() => {
    setLoading(true);
    load();
  }, [load]));

  if (loading) {
    return (
      <View style={s.root}>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <SkeletonWordCard key={i} />
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.root}>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <EmptyState
            kind="offline"
            title="Bağlantı sorunu"
            subtitle={error}
            actionLabel="Tekrar dene"
            onAction={() => {
              setLoading(true);
              load();
            }}
            secondaryLabel="Geri dön"
            onSecondary={goBack}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (!words.length) {
    return (
      <View style={s.root}>
        <SafeAreaView edges={["top"]} style={s.center}>
          <Icon d={ICONS.target} size={48} stroke={c.accent} sw={1.5} />
          <Text style={s.emptyTitle}>Zor kelimen yok</Text>
          <Text style={s.emptySub}>
            Çalışmaya başlayınca yanlış cevapladığın kelimeler burada birikir.
            SRS algoritması bu kelimeleri daha sık tekrar ettirir.
          </Text>
          <Pressable style={s.cta} onPress={goBack}>
            <Text style={s.ctaText}>Geri Dön</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={s.header}>
          <Pressable onPress={goBack} hitSlop={12} style={s.back}>
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Text style={s.title}>Zor Kelimeler</Text>
          <View style={{ width: 38 }} />
        </View>

        <Pressable
          style={s.cta}
          onPress={() =>
            navigation.navigate("Study", {
              presetWords: words,
              presetTitle: "Zor Kelimeler",
              presetMode: "srs",
            })
          }
        >
          <Text style={s.ctaText}>Bu {words.length} kelimeyi şimdi çalış</Text>
        </Pressable>

        <FlatList
          data={words}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          refreshControl={<FlameRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <StaggerEnter index={Math.min(index, 8)} delay={50}>
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={s.word}>{item.word}</Text>
                  <Text style={s.meaning}>{item.meaning}</Text>
                </View>
                <View style={s.badge}>
                  <Icon d={ICONS.flame} size={11} stroke={c.error} fill={c.error} sw={1.5} />
                  <Text style={s.badgeText}>{item.lapses}×</Text>
                </View>
              </View>
            </StaggerEnter>
          )}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 10,
      gap: 12,
    },
    back: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: c.bgSurface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 17,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    cta: {
      marginHorizontal: 16,
      marginTop: 4,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 18,
      elevation: 4,
    },
    ctaText: { color: c.textOnAccent, fontFamily: c.fontBodyBold, fontSize: 14 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: c.bgElevated,
      borderColor: c.border,
    },
    word: { fontSize: 16, fontFamily: c.fontBodyBold, color: c.textPrimary },
    meaning: { fontSize: 13, marginTop: 2, fontFamily: c.fontBody, color: c.textSec },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: c.errorDim,
    },
    badgeText: { color: c.error, fontSize: 11, fontFamily: c.fontBodyBold },
    emptyTitle: { fontSize: 20, fontFamily: c.fontBodyBold, color: c.textPrimary, marginBottom: 6 },
    emptySub: {
      fontSize: 14,
      fontFamily: c.fontBody,
      color: c.textSec,
      textAlign: "center",
      marginBottom: 20,
    },
  });
}
