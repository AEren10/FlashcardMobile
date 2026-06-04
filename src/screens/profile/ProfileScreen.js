/**
 * ProfileScreen — Claude Design v2.
 * Avatar gradient + level chip + motivation glow card + settings list.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/ProfileContext";
import { getStudyStats } from "../../supabase/progress";
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
  const { profile } = useProfile();
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [statsError, setStatsError] = useState(false);

  const appearanceLabel = () => {
    if (preference === "system") return "Otomatik";
    if (preference === "light") return "Açık";
    return "Koyu";
  };

  const s = useMemo(() => makeStyles(c), [c]);

  const loadStats = useCallback(() => {
    if (isGuestUser()) return;
    setStatsError(false);
    getStudyStats()
      .then((data) => {
        if (data) setStats(data);
        else setStatsError(true);
      })
      .catch(() => setStatsError(true));
  }, [isGuestUser]);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Profil verisi artık ProfileContext'ten — EditProfile optimistic patch yapınca
  // anında burada güncellenir, useFocusEffect gerekmez.

  const displayName = () => {
    if (profile.display_name) return profile.display_name;
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
          <Icon d={ICONS.user} size={64} stroke="#A69E90" sw={1.5} />
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
              {profile.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={s.avatarGrad} />
              ) : (
                <LinearGradient
                  colors={[c.cobalt, c.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.avatarGrad}
                >
                  <Text style={s.avatarTxt}>{initials()}</Text>
                </LinearGradient>
              )}
            </View>
            <Text style={s.name}>{displayName()}</Text>
            <Pressable
              onPress={() => navigation.navigate("Roadmap")}
              style={({ pressed }) => [
                s.levelChip,
                {
                  backgroundColor: userLevel.color + "14",
                  borderColor: userLevel.color + "44",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              accessibilityLabel="Yol haritam"
            >
              <View style={[s.levelIconWrap, { backgroundColor: userLevel.color + "22" }]}>
                <Icon d={userLevel.icon} size={14} stroke={userLevel.color} fill={userLevel.color + "33"} sw={1.7} />
              </View>
              <Text style={[s.levelTitle, { color: userLevel.color, fontFamily: c.fontBodyBold }]}>
                {userLevel.title}
              </Text>
              <View style={[s.levelDot, { backgroundColor: userLevel.color + "66" }]} />
              <Text style={[s.levelSub, { color: userLevel.color, fontFamily: c.fontBody }]}>
                Seviye {userLevel.lv}
              </Text>
            </Pressable>
          </View>

          {/* Bağlantı sorunu banner */}
          {statsError && (
            <Pressable
              onPress={loadStats}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: c.warning + "1A",
                borderWidth: 1,
                borderColor: c.warning + "55",
                marginBottom: 14,
              }}
            >
              <Text style={{ flex: 1, color: c.warning, fontFamily: c.fontBodySemi, fontSize: 12 }}>
                İstatistikler yüklenemedi — dokun ve yenile
              </Text>
              <Text style={{ color: c.warning, fontSize: 14 }}>↻</Text>
            </Pressable>
          )}

          {/* Motivation card — tıklanabilir, Stats sayfasına gider */}
          <Pressable
            onPress={() => navigation.navigate("Streak")}
            style={({ pressed }) => [
              s.motivationCard,
              { transform: [{ scale: pressed ? 0.99 : 1 }] },
            ]}
            accessibilityLabel="İstatistikler"
          >
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={s.motTitle}>
                Bu hafta {Math.min(stats.totalWords, 99)} kelime öğrendin
              </Text>
              <Icon d={ICONS.sparkle} size={20} stroke={c.warning} fill={c.warning} sw={1.5} />
            </View>
            <Text style={s.motSub}>
              Harika gidiyorsun — devam ettikçe daha kalıcı olur. Detayları gör →
            </Text>
            <View style={s.miniBadges}>
              {[
                { icon: ICONS.leaf, l: "İlk Adım", on: stats.totalWords >= 1, color: "#7BB661" },
                { icon: ICONS.flame, l: "7 Gün", on: stats.streakDays >= 7, color: "#FF8A4C" },
                { icon: ICONS.bolt, l: "100 Kelime", on: stats.totalWords >= 100, color: "#7BAEC8" },
              ].map((b) => (
                <View key={b.l} style={{ flex: 1, alignItems: "center" }}>
                  <View
                    style={[
                      s.miniBadgeBox,
                      {
                        backgroundColor: b.on ? b.color + "22" : c.bgSurface,
                        borderColor: b.on ? b.color + "55" : c.border,
                        opacity: b.on ? 1 : 0.4,
                      },
                    ]}
                  >
                    <Icon d={b.icon} size={22} stroke={b.on ? b.color : c.textMuted} fill={b.on ? b.color + "33" : "none"} sw={1.6} />
                  </View>
                  <Text style={[s.miniBadgeLbl, b.on && { color: b.color, fontFamily: c.fontBodyBold }]}>{b.l}</Text>
                </View>
              ))}
            </View>
          </Pressable>

          {/* Quick actions — renkli icon'larla */}
          <View style={s.list}>
            <Row
              iconPath={ICONS.target}
              iconColor="#8B5CF6"
              label="Yol Haritam"
              detail="Seviye + İlerleme"
              onPress={() => navigation.navigate("Roadmap")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.trophy}
              iconColor="#D4AE5E"
              label="Başarımlar"
              detail="Tüm rozetlerin"
              onPress={() => navigation.navigate("Achievements")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.user}
              iconColor="#7BAEC8"
              label="Profili Düzenle"
              onPress={() => navigation.navigate("EditProfile")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.bolt}
              iconColor="#6DB585"
              label="Ayarlar"
              detail="Tema, Dil, Bildirim…"
              onPress={() => navigation.navigate("Settings")}
              c={c}
              s={s}
            />
            <Row
              iconPath={ICONS.shield}
              iconColor="#A8B0B5"
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

function Row({ icon, iconPath, iconColor, label, detail, onPress, c, s, last }) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.row, last ? { borderBottomWidth: 0 } : { borderBottomColor: c.divider }]}
    >
      {iconPath ? (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: (iconColor || c.accent) + "1F",
            borderWidth: 1,
            borderColor: (iconColor || c.accent) + "44",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon d={iconPath} size={17} stroke={iconColor || c.accent} sw={1.8} />
        </View>
      ) : (
        <Text style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</Text>
      )}
      <Text style={{ flex: 1, fontFamily: c.fontBody, fontSize: 15, color: c.textPrimary, marginLeft: 4 }}>
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
    headerBlock: { alignItems: "center", paddingTop: 8, paddingBottom: 22 },
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
    name: { fontFamily: c.fontBodyBold, fontSize: 22, color: c.textPrimary, marginTop: 14 },
    levelChip: {
      marginTop: 10,
      paddingLeft: 6,
      paddingRight: 14,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    levelIconWrap: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    levelTitle: {
      fontSize: 13,
      letterSpacing: 0.3,
    },
    levelDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
    },
    levelSub: {
      fontSize: 11,
      letterSpacing: 0.2,
      opacity: 0.85,
    },
    // legacy (henüz başka yerden referans varsa)
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
      marginBottom: 20,
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
