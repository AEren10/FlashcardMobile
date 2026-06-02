/**
 * PrivacySettingsScreen — Kullanıcı consent tercihini değiştirebilir.
 * App.js'teki initSentry sadece consent === true ise çalıştığı için
 * burada yapılan değişiklik bir sonraki açılışta etkili olur.
 */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import T from "../../themes/tokens";
import { getConsent, setConsent } from "../../lib/analyticsConsent";

export default function PrivacySettingsScreen({ navigation }) {
  const [allowed, setAllowed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getConsent().then((v) => {
      setAllowed(v);
      setLoaded(true);
    });
  }, []);

  const handleToggle = async (next) => {
    setAllowed(next);
    await setConsent(next);
    Alert.alert(
      "Kaydedildi",
      "Tercihin bir sonraki açılışta etkili olacak. Şimdi yeniden başlatmak ister misin?"
    );
  };

  if (!loaded) return null;

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.back} hitSlop={12}>
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
          <Text style={s.title}>Gizlilik Ayarları</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView contentContainerStyle={s.body}>
          <View style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Anonim çökme raporları</Text>
              <Text style={s.sub}>
                Hataları gidermek için anonim teknik veri toplanır. Kişisel bilgi içermez.
              </Text>
            </View>
            <Switch
              value={allowed}
              onValueChange={handleToggle}
              trackColor={{ false: T.surface, true: T.limeDim }}
              thumbColor={allowed ? T.lime : "#666"}
            />
          </View>

          <Pressable style={s.linkRow} onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Text style={s.linkLabel}>Gizlilik Politikası</Text>
            <Text style={s.arrow}>›</Text>
          </Pressable>
          <Pressable style={s.linkRow} onPress={() => navigation.navigate("TermsOfService")}>
            <Text style={s.linkLabel}>Kullanım Koşulları</Text>
            <Text style={s.arrow}>›</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: T.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: T.fontBodyBold,
    color: T.text,
  },
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  label: { fontSize: 15, fontFamily: T.fontBodyBold, color: T.text, marginBottom: 4 },
  sub: { fontSize: 13, fontFamily: T.fontBody, color: T.textSec, lineHeight: 18 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  linkLabel: { flex: 1, fontSize: 15, fontFamily: T.fontBodySemi, color: T.text },
  arrow: { fontSize: 20, color: T.textMuted },
});
