/**
 * PublicProfileScreen — Başka bir kullanıcının profili.
 * route.params: { userId, displayName? }
 * Gösterir: avatar + display_name + bio + 3 stat + public listeleri
 */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "../../components/design/Icon";
import CategoryCover from "../../components/design/CategoryCover";
import PressableScale from "../../components/design/PressableScale";
import { getPublicProfile, getPublicListsByUser } from "../../supabase/publicProfile";

export default function PublicProfileScreen({ route }) {
  const navigation = useNavigation();
  const { c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const userId = route?.params?.userId;
  const fallbackName = route?.params?.displayName;

  const [profile, setProfile] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("Kullanıcı bulunamadı");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [p, ls] = await Promise.all([
        getPublicProfile(userId),
        getPublicListsByUser(userId, 50),
      ]);
      if (cancelled) return;
      if (p.success && p.data) setProfile(p.data);
      else setError(p.error || "Profil yüklenemedi");
      if (ls.success) setLists(ls.data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const openList = useCallback(
    (item) => {
      navigation.navigate("FlashcardDetail", {
        listId: item.id,
        listTitle: item.title,
      });
    },
    [navigation]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <ActivityIndicator color={c.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
            <Icon d={ICONS.arrowLeft} size={20} stroke={c.textPrimary} sw={2} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Text style={styles.errorTxt}>{error || "Profil bulunamadı"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = (profile.display_name || fallbackName || "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
          <Icon d={ICONS.arrowLeft} size={20} stroke={c.textPrimary} sw={2} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {profile.display_name}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Avatar + İsim + Bio */}
        <View style={styles.heroWrap}>
          <View style={[styles.avatarRing, { borderColor: c.borderAccent }]}>
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: c.accentGlow }]}>
                <Text style={[styles.initials, { color: c.accent }]}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{profile.display_name}</Text>
          {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          {profile.joined_at && (
            <Text style={styles.joined}>
              {formatJoined(profile.joined_at)} tarihinden beri
            </Text>
          )}
        </View>

        {/* Stats — 3 mini card */}
        <View style={styles.statsRow}>
          <StatBox icon={ICONS.books} value={profile.total_lists} label="Liste" tint={c.accent} styles={styles} />
          <StatBox icon={ICONS.sparkle} value={profile.total_words} label="Kelime" tint={c.cobalt} styles={styles} />
          <StatBox icon={ICONS.flame} value={profile.total_studied} label="Öğrenilen" tint={c.warning} styles={styles} />
        </View>

        {/* Public Listeler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listeler</Text>
          {lists.length === 0 ? (
            <Text style={styles.emptyTxt}>Henüz public liste yok</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {lists.map((l) => (
                <PressableScale
                  key={l.id}
                  onPress={() => openList(l)}
                  style={styles.listCard}
                  scaleDown={0.97}
                >
                  <View style={styles.coverWrap}>
                    <CategoryCover
                      difficulty={l.level}
                      imageUrl={l.image_url}
                      height={70}
                      showLabel={false}
                    />
                  </View>
                  <View style={{ flex: 1, padding: 12 }}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {l.title}
                    </Text>
                    <Text style={styles.listMeta}>
                      {l.word_count} kelime · {l.level || "Karma"}
                    </Text>
                  </View>
                  <Icon d={ICONS.arrow} size={16} stroke={c.textMuted} sw={2} />
                </PressableScale>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label, tint, styles }) {
  return (
    <View style={[styles.statBox, { borderColor: tint + "55" }]}>
      <View style={[styles.statIcon, { backgroundColor: tint + "1A" }]}>
        <Icon d={icon} size={16} stroke={tint} sw={1.8} />
      </View>
      <Text style={[styles.statValue, { color: tint }]}>{value ?? 0}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function formatJoined(iso) {
  try {
    const d = new Date(iso);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
    ];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return "";
  }
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 10,
      gap: 12,
    },
    back: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bgSurface,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 16,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    errorTxt: { color: c.textSec, fontFamily: c.fontBody, fontSize: 14 },
    heroWrap: { alignItems: "center", paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },
    avatarRing: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 3,
      padding: 4,
      marginBottom: 14,
    },
    avatar: { width: "100%", height: "100%", borderRadius: 50 },
    avatarFallback: {
      width: "100%",
      height: "100%",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    initials: { fontSize: 36, fontFamily: c.fontDisplay },
    name: {
      fontSize: 22,
      color: c.textPrimary,
      fontFamily: c.fontDisplay,
      textAlign: "center",
    },
    bio: {
      marginTop: 6,
      fontSize: 14,
      color: c.textSec,
      fontFamily: c.fontBody,
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 320,
    },
    joined: {
      marginTop: 8,
      fontSize: 11,
      color: c.textMuted,
      fontFamily: c.fontBody,
    },
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 18,
      gap: 10,
      marginBottom: 22,
    },
    statBox: {
      flex: 1,
      alignItems: "center",
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: c.bgElevated,
      gap: 6,
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    statValue: { fontSize: 20, fontFamily: c.fontDisplay },
    statLabel: { fontSize: 11, color: c.textMuted, fontFamily: c.fontBody },
    section: { paddingHorizontal: 18, gap: 10 },
    sectionTitle: {
      fontSize: 15,
      color: c.textPrimary,
      fontFamily: c.fontBodyBold,
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    emptyTxt: {
      textAlign: "center",
      color: c.textMuted,
      fontFamily: c.fontBody,
      fontSize: 13,
      paddingVertical: 30,
    },
    listCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bgElevated,
      overflow: "hidden",
      paddingRight: 12,
    },
    coverWrap: { width: 80, overflow: "hidden" },
    listTitle: { fontSize: 14, color: c.textPrimary, fontFamily: c.fontBodySemi },
    listMeta: { fontSize: 11, color: c.textMuted, fontFamily: c.fontBody, marginTop: 2 },
  });
}
