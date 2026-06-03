/**
 * SettingsScreen — tüm ayarları tek yerde topla.
 * Görünüm, Dil, Hatırlatıcı, Gizlilik, Hesap.
 */
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Icon, { ICONS } from "../../components/design/Icon";
import {
  getReminderPref,
  scheduleDailyReminder,
  cancelDailyReminder,
} from "../../lib/notifications";

export default function SettingsScreen({ navigation }) {
  const { c, preference } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { signOut, deleteAccount, isGuestUser } = useAuth();
  const [reminder, setReminder] = useState({ enabled: false, hour: 20, minute: 0 });

  useEffect(() => {
    getReminderPref().then(setReminder);
  }, []);

  const appearanceLabel = () => {
    if (preference === "system") return "Otomatik";
    if (preference === "light") return "Açık";
    return "Koyu";
  };

  const toggleReminder = async () => {
    Haptics.selectionAsync();
    if (reminder.enabled) {
      await cancelDailyReminder();
      setReminder({ ...reminder, enabled: false });
    } else {
      const r = await scheduleDailyReminder(20, 0);
      if (r.success) setReminder({ enabled: true, hour: 20, minute: 0 });
      else Alert.alert("İzin gerekli", "Bildirim izni verilmedi.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Hesabını sil",
      "Tüm verilerin kalıcı olarak silinecek. Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            const r = await deleteAccount();
            if (!r.success) Alert.alert("Hata", r.error);
          },
        },
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert("Çıkış yap", "Oturumdan çıkmak istediğine emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Çıkış", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={s.back}
            hitSlop={12}
            accessibilityLabel="Geri dön"
          >
            <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Text style={s.title}>Ayarlar</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          <Section title="Görünüm" c={c} s={s}>
            <Row
              iconPath={ICONS.sun}
              label="Tema"
              detail={appearanceLabel()}
              onPress={() => navigation.navigate("Appearance")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.globe}
              label="Dil"
              detail="Türkçe"
              onPress={() => navigation.navigate("Language")}
              c={c}
              s={s}
            />
          </Section>

          <Section title="Bildirimler" c={c} s={s}>
            <Row
              iconPath={ICONS.sound}
              label="Günlük Hatırlatıcı"
              detail={reminder.enabled ? "20:00 ✓" : "Kapalı"}
              onPress={toggleReminder}
              c={c}
              s={s}
            />
          </Section>

          <Section title="Gizlilik" c={c} s={s}>
            <Row
              iconPath={ICONS.lock}
              label="Gizlilik Ayarları"
              onPress={() => navigation.navigate("PrivacySettings")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.shield}
              label="Gizlilik Politikası"
              onPress={() => navigation.navigate("PrivacyPolicy")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.books}
              label="Kullanım Koşulları"
              onPress={() => navigation.navigate("TermsOfService")}
              c={c}
              s={s}
            />
          </Section>

          {!isGuestUser() && (
            <Section title="Hesap" c={c} s={s}>
              <Row
                iconPath={ICONS.arrow}
                label="Çıkış Yap"
                onPress={confirmLogout}
                c={c}
                s={s}
              />
              <Row
                iconPath={ICONS.x}
                label="Hesabımı Sil"
                detail="Kalıcı"
                danger
                onPress={confirmDelete}
                c={c}
                s={s}
              />
            </Section>
          )}

          <Text style={s.versionTxt}>FlashcardMobile v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children, c, s }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={s.sectionCard}>{children}</View>
    </View>
  );
}

function Row({ icon, iconPath, label, detail, danger, onPress, c, s }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.row,
        { backgroundColor: pressed ? c.bgSurface : "transparent" },
      ]}
    >
      {iconPath ? (
        <View style={s.rowIcon}><Icon d={iconPath} size={18} stroke={danger ? c.error : c.textSec} sw={1.6} /></View>
      ) : (
        <Text style={s.rowIcon}>{icon}</Text>
      )}
      <Text
        style={[
          s.rowLabel,
          { color: danger ? c.error : c.textPrimary, fontFamily: c.fontBodyMed },
        ]}
      >
        {label}
      </Text>
      <View style={{ flex: 1 }} />
      {!!detail && (
        <Text style={[s.rowDetail, { color: c.textMuted, fontFamily: c.fontBody }]}>
          {detail}
        </Text>
      )}
      <Text style={[s.rowChev, { color: c.textMuted }]}>›</Text>
    </Pressable>
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
      fontFamily: c.fontDisplay,
      fontSize: 24,
      color: c.textPrimary,
    },
    sectionTitle: {
      fontFamily: c.fontBodyBold,
      fontSize: 11,
      color: c.textMuted,
      letterSpacing: 1.4,
      marginBottom: 10,
      marginLeft: 4,
    },
    sectionCard: {
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    rowIcon: { fontSize: 18 },
    rowLabel: { fontSize: 15 },
    rowDetail: { fontSize: 13 },
    rowChev: { fontSize: 20, marginLeft: 6 },
    versionTxt: {
      textAlign: "center",
      fontSize: 11,
      color: c.textMuted,
      marginTop: 12,
    },
  });
}
