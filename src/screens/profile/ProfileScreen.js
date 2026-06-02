/**
 * ProfileScreen — Claude Design v2.
 * Avatar gradient + level chip + motivation glow card + settings list.
 */
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getStudyStats } from "../../supabase/progress";
import {
  scheduleDailyReminder,
  cancelDailyReminder,
  getReminderPref,
} from "../../lib/notifications";
import Icon, { ICONS } from "../../components/design/Icon";
import useUserLevel from "../../hooks/useUserLevel";

function inferLevel(words) {
  if (words < 100) return "A1 BEGINNER";
  if (words < 300) return "A2 ELEMENTARY";
  if (words < 600) return "B1 INTERMEDIATE";
  if (words < 1200) return "B2 UPPER-INT.";
  return "C1 ADVANCED";
}

export default function ProfileScreen() {
  const { c, preference } = useTheme();
  const navigation = useNavigation();
  const { user, signOut, getUserEmail, isGuestUser, deleteAccount } = useAuth();
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [reminder, setReminder] = useState({ enabled: false, hour: 20, minute: 0 });

  const appearanceLabel = () => {
    if (preference === "system") return "Otomatik";
    if (preference === "light") return "Açık";
    return "Koyu";
  };

  const s = useMemo(() => makeStyles(c), [c]);

  useEffect(() => {
    if (!isGuestUser()) {
      getStudyStats().then(setStats).catch(() => {});
    }
    getReminderPref().then(setReminder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const displayName = () => {
    const m = user?.user_metadata;
    if (m?.full_name) return m.full_name;
    if (m?.first_name) return m.last_name ? `${m.first_name} ${m.last_name}` : m.first_name;
    const email = getUserEmail();
    if (!email) return "Hoşgeldin";
    return email.split("@")[0];
  };

  const initials = () => {
    const parts = displayName().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : displayName().substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Hesabından çıkmak istediğine emin misin?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive", onPress: () => signOut().catch(() => {}) },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Hesabı Sil", "Tüm verilerin kalıcı olarak silinecek. Bu işlem geri alınamaz.", [
      { text: "İptal", style: "cancel" },
      {
        text: "Hesabı Sil",
        style: "destructive",
        onPress: async () => {
          const r = await deleteAccount().catch(() => ({ success: false }));
          if (!r.success) Alert.alert("Hata", r.error || "Hesap silinemedi.");
        },
      },
    ]);
  };

  if (isGuestUser()) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: 64 }}>👤</Text>
          <Text style={s.guestTitle}>Profil</Text>
          <Text style={s.guestSub}>Bu özelliği kullanmak için kayıt ol</Text>
          <Pressable style={s.primaryBtn} onPress={() => signOut()}>
            <Text style={s.primaryBtnTxt}>Kayıt Ol / Giriş Yap</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const _legacyLevel = inferLevel(stats.totalWords);
  const userLevel = useUserLevel(stats.totalWords);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 160 }}>
          {/* Avatar + name + level */}
          <View style={s.headerBlock}>
            <View style={s.avatarWrap}>
              <LinearGradient
                colors={[c.cobalt, c.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.avatarGrad}
              >
                <Text style={s.avatarTxt}>{initials()}</Text>
              </LinearGradient>
            </View>
            <Text style={s.name}>{displayName()}</Text>
            <Pressable
              onPress={() => navigation.navigate("Roadmap")}
              style={({ pressed }) => [
                s.levelChip,
                {
                  backgroundColor: userLevel.color + "1F",
                  borderColor: userLevel.color + "55",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                },
              ]}
              accessibilityLabel="Yol haritam"
            >
              <Text style={{ fontSize: 14 }}>{userLevel.emoji}</Text>
              <Text style={[s.levelTxt, { color: userLevel.color }]}>
                LV {userLevel.lv} · {userLevel.title.toUpperCase()}
              </Text>
            </Pressable>
          </View>

          {/* Motivation card */}
          <View style={s.motivationCard}>
            <LinearGradient
              colors={[c.bgElevated, c.bgSurface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.motivationGlow} />
            {/* Top edge highlight */}
            <LinearGradient
              colors={["rgba(255,255,255,0.08)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.4 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
              pointerEvents="none"
            />
            <Text style={s.motTitle}>
              Bu hafta {Math.min(stats.totalWords, 99)} kelime öğrendin 🎉
            </Text>
            <Text style={s.motSub}>
              Harika gidiyorsun — devam ettikçe daha kalıcı olur.
            </Text>
            <View style={s.miniBadges}>
              {[
                { e: "🌱", l: "İlk Adım", on: stats.totalWords >= 1 },
                { e: "🔥", l: "7 Gün", on: stats.streakDays >= 7 },
                { e: "⚡", l: "100 Kelime", on: stats.totalWords >= 100 },
              ].map((b) => (
                <View key={b.l} style={{ flex: 1, alignItems: "center" }}>
                  <View
                    style={[
                      s.miniBadgeBox,
                      {
                        backgroundColor: b.on ? c.accentGlow : c.bgSurface,
                        borderColor: b.on ? c.borderAccent : c.border,
                        opacity: b.on ? 1 : 0.45,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 22 }}>{b.e}</Text>
                  </View>
                  <Text style={s.miniBadgeLbl}>{b.l}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick actions — sade */}
          <View style={s.list}>
            <Row
              icon="🗺️"
              label="Yol Haritam"
              detail="Seviye + İlerleme"
              onPress={() => navigation.navigate("Roadmap")}
              c={c}
              s={s}
            />
            <Row
              icon="👤"
              label="Profili Düzenle"
              onPress={() => navigation.navigate("EditProfile")}
              c={c}
              s={s}
            />
            <Row
              icon="⚙️"
              label="Ayarlar"
              detail="Tema, Dil, Bildirim…"
              onPress={() => navigation.navigate("Settings")}
              c={c}
              s={s}
            />
            <Row
              icon="ℹ️"
              label="Hakkında"
              onPress={() =>
                Alert.alert(
                  "FlashcardMobile v1.0.0",
                  "Akıllı tekrar sistemi ile kelime öğren.\n\nGeliştirici: A.Eren\nAlgoritma: SM-2 Spaced Repetition"
                )
              }
              c={c}
              s={s}
              last
            />
          </View>

          {/* Account */}
          <Text style={s.sectionLabel}>HESAP</Text>
          <View style={s.list}>
            <Pressable style={[s.row, { borderBottomColor: c.divider }]} onPress={handleLogout}>
              <Text style={{ fontFamily: c.fontBodySemi, fontSize: 15, color: c.error, flex: 1 }}>
                Çıkış Yap
              </Text>
            </Pressable>
            <Pressable style={[s.row, { borderBottomWidth: 0 }]} onPress={handleDelete}>
              <Text style={{ fontFamily: c.fontBody, fontSize: 14, color: c.textMuted, flex: 1 }}>
                Hesabı Sil
              </Text>
            </Pressable>
          </View>

          <Text style={s.version}>FlashcardMobile v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Row({ icon, label, detail, onPress, c, s, last }) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.row, last ? { borderBottomWidth: 0 } : { borderBottomColor: c.divider }]}
    >
      <Text style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</Text>
      <Text style={{ flex: 1, fontFamily: c.fontBody, fontSize: 15, color: c.textPrimary }}>
        {label}
      </Text>
      {detail && (
        <Text style={{ fontFamily: c.fontBody, fontSize: 13, color: c.textSec }}>
          {detail}
        </Text>
      )}
      <Icon d={ICONS.arrow} size={16} stroke={c.textMuted} sw={2} />
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    headerBlock: { alignItems: "center", paddingVertical: 14 },
    avatarWrap: {
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 30,
      elevation: 8,
      marginBottom: 14,
    },
    avatarGrad: {
      width: 84,
      height: 84,
      borderRadius: 42,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarTxt: { fontFamily: c.fontNum, fontSize: 30, color: "#FFFFFF" },
    name: { fontFamily: c.fontBodyBold, fontSize: 22, color: c.textPrimary },
    levelChip: {
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: c.accentGlow,
      borderWidth: 1,
      borderColor: c.borderAccent,
    },
    levelTxt: {
      fontFamily: c.fontNum,
      fontSize: 11,
      color: c.accent,
      letterSpacing: 0.5,
    },
    motivationCard: {
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: c.borderAccent,
      overflow: "hidden",
      marginTop: 8,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 32,
      elevation: 4,
    },
    motivationGlow: {
      position: "absolute",
      top: -34,
      right: -24,
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: c.accentGlow,
    },
    motTitle: { fontFamily: c.fontBodyBold, fontSize: 17, color: c.textPrimary },
    motSub: { fontFamily: c.fontBody, fontSize: 12, color: c.textSec, marginTop: 3 },
    miniBadges: { flexDirection: "row", gap: 12, marginTop: 16 },
    miniBadgeBox: {
      width: 46,
      height: 46,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    miniBadgeLbl: {
      fontFamily: c.fontBody,
      fontSize: 10,
      color: c.textSec,
      marginTop: 6,
    },
    sectionLabel: {
      fontFamily: c.fontBodyBold,
      fontSize: 12,
      color: c.textSec,
      letterSpacing: 1.2,
      marginTop: 24,
      marginBottom: 8,
      marginLeft: 4,
    },
    list: {
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 16,
      paddingVertical: 15,
      borderBottomWidth: 1,
    },
    version: {
      textAlign: "center",
      marginTop: 16,
      fontSize: 12,
      color: c.textMuted,
      fontFamily: c.fontBody,
    },
    guestTitle: { fontFamily: c.fontBodyBold, fontSize: 22, color: c.textPrimary, marginTop: 12 },
    guestSub: { fontFamily: c.fontBody, fontSize: 14, color: c.textSec, marginTop: 4 },
    primaryBtn: {
      marginTop: 24,
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 32,
    },
    primaryBtnTxt: { color: c.textOnAccent, fontFamily: c.fontBodyBold, fontSize: 15 },
  });
}
