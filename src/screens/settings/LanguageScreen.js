/**
 * LanguageScreen — TR/EN seçimi.
 * AsyncStorage'a kaydedilir; tam i18n setup sonra (placeholder).
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "../../components/design/Icon";

const STORAGE_KEY = "@fc:lang";

const LANGS = [
  { code: "tr", label: "Türkçe", emoji: "🇹🇷", note: "Varsayılan" },
  { code: "en", label: "English", emoji: "🇬🇧", note: "Coming soon" },
];

export default function LanguageScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [selected, setSelected] = useState("tr");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v) setSelected(v);
    });
  }, []);

  const choose = async (code) => {
    Haptics.selectionAsync();
    setSelected(code);
    await AsyncStorage.setItem(STORAGE_KEY, code);
    if (code === "en") {
      Alert.alert(
        "Yakında",
        "İngilizce desteği yakında gelecek. Tercihin kaydedildi."
      );
    }
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={s.back}
          >
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Text style={s.title}>Dil</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 22 }}>
          {LANGS.map((lang) => {
            const active = selected === lang.code;
            return (
              <Pressable
                key={lang.code}
                onPress={() => choose(lang.code)}
                style={[
                  s.row,
                  {
                    backgroundColor: active ? c.accentGlow : c.bgElevated,
                    borderColor: active ? c.borderAccent : c.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 26 }}>{lang.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.lbl, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                    {lang.label}
                  </Text>
                  <Text style={[s.note, { color: c.textSec, fontFamily: c.fontBody }]}>
                    {lang.note}
                  </Text>
                </View>
                {active && (
                  <Icon d={ICONS.check} size={20} stroke={c.accent} sw={2.4} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
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
      paddingVertical: 12,
      gap: 12,
    },
    back: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
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
      color: c.textPrimary,
      fontFamily: c.fontBodyBold,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: radius.md,
      borderWidth: 1,
      marginBottom: 10,
    },
    lbl: { fontSize: 16 },
    note: { fontSize: 12, marginTop: 2 },
  });
}
