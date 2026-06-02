import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import T from "../../themes/tokens";
import { getHardWords } from "../../supabase/views";

export default function HardWordsScreen({ navigation }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const goBack = () => navigation.goBack();

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHardWords();
    setWords(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={s.root}>
        <SafeAreaView edges={["top"]} style={s.center}>
          <ActivityIndicator color={T.lime} />
        </SafeAreaView>
      </View>
    );
  }

  if (!words.length) {
    return (
      <View style={s.root}>
        <SafeAreaView edges={["top"]} style={s.center}>
          <Text style={s.emptyEmoji}>🎯</Text>
          <Text style={s.emptyTitle}>Zor kelimen yok</Text>
          <Text style={s.emptySub}>
            Çalışmaya devam et; sık yanlış yaptığın kelimeler burada toplanacak.
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
          <Pressable onPress={goBack} hitSlop={12}>
            <Svg width={10} height={16} viewBox="0 0 8 14">
              <Path
                d="M7 1L1 7l6 6"
                stroke={T.text}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <Text style={s.title}>Zor Kelimeler</Text>
          <View style={{ width: 10 }} />
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
          <Text style={s.ctaText}>🧠 Bu {words.length} kelimeyi şimdi çalış</Text>
        </Pressable>

        <FlatList
          data={words}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => (
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.word}>{item.word}</Text>
                <Text style={s.meaning}>{item.meaning}</Text>
              </View>
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.lapses}× yanlış</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontFamily: T.fontBodyBold, color: T.text },
  cta: {
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: T.radius,
    alignItems: "center",
    backgroundColor: T.lime,
  },
  ctaText: { color: T.bg, fontFamily: T.fontBodyBold, fontSize: 15 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: T.radius,
    borderWidth: 1,
    backgroundColor: T.bgCard,
    borderColor: T.border,
  },
  word: { fontSize: 16, fontFamily: T.fontBodyBold, color: T.text },
  meaning: { fontSize: 13, marginTop: 2, fontFamily: T.fontBody, color: T.textSec },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: T.coralDim,
  },
  badgeText: { color: T.coral, fontSize: 11, fontFamily: T.fontBodyBold },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontFamily: T.fontBodyBold, color: T.text, marginBottom: 6 },
  emptySub: {
    fontSize: 14,
    fontFamily: T.fontBody,
    color: T.textSec,
    textAlign: "center",
    marginBottom: 20,
  },
});
