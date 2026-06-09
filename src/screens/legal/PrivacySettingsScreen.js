/**
 * PrivacySettingsScreen — Kullanıcı consent tercihini değiştirebilir.
 * App.js'teki initSentry sadece consent === true ise çalıştığı için
 * burada yapılan değişiklik bir sonraki açılışta etkili olur.
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { getConsent, setConsent } from "../../lib/analyticsConsent";

export default function PrivacySettingsScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
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
                stroke={c.textPrimary}
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
              trackColor={{ false: c.bgSurface, true: c.accentGlow }}
              thumbColor={allowed ? c.accent : c.textMuted}
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

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    back: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.bgElevated,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.lg,
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    label: { fontSize: 15, fontFamily: c.fontBodyBold, color: c.textPrimary, marginBottom: spacing.xs },
    sub: { fontSize: 13, fontFamily: c.fontBody, color: c.textSec, lineHeight: 18 },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    linkLabel: { flex: 1, fontSize: 15, fontFamily: c.fontBodySemi, color: c.textPrimary },
    arrow: { fontSize: 20, color: c.textMuted },
  });
}
