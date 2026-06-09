/**
 * SettingsScreen — tüm ayarları tek yerde topla.
 * Görünüm, Dil, Hatırlatıcı, Gizlilik, Hesap.
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { usePremium } from "../../contexts/PremiumContext";
import Icon, { ICONS } from "../../components/design/Icon";
import {
  getExtraReminders,
  addExtraReminder,
  removeExtraReminder,
  activateRemindersWithPrompt,
  getPermissionStatus,
} from "../../lib/notifications";
import TimePickerModal from "../../components/design/TimePickerModal";

export default function SettingsScreen({ navigation }) {
  const { c, preference } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { signOut, deleteAccount, isGuestUser } = useAuth();
  const { isPro } = usePremium();
  const [permStatus, setPermStatus] = useState(null);
  const [extras, setExtras] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const refresh = async () => {
    setPermStatus(await getPermissionStatus());
    setExtras(await getExtraReminders());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleActivate = async () => {
    Haptics.selectionAsync();
    const r = await activateRemindersWithPrompt();
    if (!r.success) {
      Alert.alert(
        "İzin gerekli",
        "Bildirimleri açabilmek için cihaz ayarlarından FlashcardMobile'a izin vermen gerek."
      );
    } else {
      Alert.alert("Aktif", "Sabah 09:00 ve akşam 20:00'da hatırlatma alacaksın.");
    }
    refresh();
  };

  const handleOpenPicker = () => {
    Haptics.selectionAsync();
    if (extras.length >= 4) {
      Alert.alert("Limit", "En fazla 4 ek hatırlatıcı eklenebilir. Bir tanesini sil.");
      return;
    }
    setPickerOpen(true);
  };

  const handlePickerConfirm = async (h, m) => {
    setPickerOpen(false);
    const r = await addExtraReminder(h, m);
    if (!r.success) {
      const msg = {
        no_permission: "Önce bildirim izni ver.",
        max_reached: "En fazla 4 ek hatırlatıcı eklenebilir.",
        duplicate: "Bu saatte zaten bir hatırlatıcı var.",
        base_clash: "Bu saat sabit hatırlatma ile çakışıyor — başka saat seç.",
      }[r.reason] || "Eklenemedi.";
      Alert.alert("Hata", msg);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    refresh();
  };

  const handleRemoveExtra = (index, time) => {
    Alert.alert(
      "Hatırlatıcıyı kaldır",
      `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")} hatırlatıcısı silinsin mi?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await removeExtraReminder(index);
            refresh();
          },
        },
      ]
    );
  };

  const permDetail = (() => {
    if (permStatus === "granted") return "İzin verildi";
    if (permStatus === "denied") return "İzin reddedildi — ayarlardan aç";
    if (permStatus === "device_only") return "Simulator'da çalışmaz";
    return "Henüz sorulmadı";
  })();

  const appearanceLabel = () => {
    if (preference === "system") return "Otomatik";
    if (preference === "light") return "Açık";
    return "Koyu";
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

        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }}>
          <Section title="Abonelik" c={c} s={s}>
            <Row
              iconPath={ICONS.crown}
              label={isPro ? "Pro Aktif" : "Pro'ya Geç"}
              detail={isPro ? "Tüm özellikler açık" : "Sınırsız kelime + reklamsız"}
              onPress={() =>
                !isPro && navigation.getParent()?.navigate("Paywall", { source: "settings" })
              }
              c={c}
              s={s}
            />
          </Section>

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
              label="Günlük Hatırlatma"
              detail={extras.length === 0 ? "İstediğin saati ekle" : `${extras.length}/4 — yeni ekle`}
              onPress={handleOpenPicker}
              c={c}
              s={s}
            />
            {extras.map((t, i) => (
              <Row
                key={`extra-${i}`}
                iconPath={ICONS.clock}
                label={`${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`}
                detail="Kaldırmak için dokun"
                onPress={() => handleRemoveExtra(i, t)}
                c={c}
                s={s}
              />
            ))}
            {permStatus !== "granted" && (
              <Row
                iconPath={ICONS.shield}
                label="Bildirimleri Aç"
                detail="İzin gerekli — bildirim için"
                onPress={handleActivate}
                c={c}
                s={s}
              />
            )}
            <Row
              iconPath={ICONS.check}
              label="Bildirim İzni"
              detail={permDetail}
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

        <TimePickerModal
          visible={pickerOpen}
          initialHour={14}
          initialMinute={0}
          onConfirm={handlePickerConfirm}
          onClose={() => setPickerOpen(false)}
          title="Ek hatırlatma saati"
        />
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children, c, s }) {
  return (
    <View style={{ marginBottom: spacing.xxl }}>
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
      paddingVertical: spacing.md,
      gap: spacing.md,
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
      marginLeft: spacing.xs,
    },
    sectionCard: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
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
      marginTop: spacing.md,
    },
  });
}
