/**
 * ProfileScreen — Dashboard (public bilgiler).
 * Ayarlar → sağ üst ⚙️ → SettingsScreen
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fontSize } from "../../themes/tokens";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/ProfileContext";
import { getStudyStats, getDailyActivity } from "../../supabase/progress";
import { getLists } from "../../supabase/database";
import Icon, { ICONS } from "../../components/design/Icon";
import AnimatedFlame from "../../components/design/AnimatedFlame";
import Last7DaysDots from "../../components/design/Last7DaysDots";
import StaggerEnter from "../../components/design/StaggerEnter";
import CategoryCover from "../../components/design/CategoryCover";
import RatingChip from "../../components/design/RatingChip";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useUserLevel from "../../hooks/useUserLevel";
import { getStreakBadge, getWordsBadge } from "../../lib/badges";
import { getAchievementByKey } from "../../lib/achievements";
import { useAchievements } from "../../contexts/AchievementsContext";

export default function ProfileScreen() {
  const { c } = useTheme();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const bottomPad = tabBarHeight + 40;
  const { user, signOut, getUserEmail, isGuestUser } = useAuth();
  const { profile } = useProfile();
  const { unlocked } = useAchievements();
  const [stats, setStats] = useState({ totalSessions: 0, totalWords: 0, streakDays: 0 });
  const [statsError, setStatsError] = useState(false);
  const [days, setDays] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);

  const s = useMemo(() => makeStyles(c), [c]);

  const loadStats = useCallback(() => {
    if (isGuestUser()) return;
    setStatsError(false);
    Promise.allSettled([getStudyStats(), getDailyActivity(7)]).then(([sr, dr]) => {
      if (sr.status === "fulfilled" && sr.value) setStats(sr.value); else setStatsError(true);
      if (dr.status === "fulfilled" && Array.isArray(dr.value)) setDays(dr.value);
    });
  }, [isGuestUser]);

  useEffect(() => { loadStats(); }, []);

  const loadPublicLists = useCallback(async () => {
    if (isGuestUser()) { setListsLoading(false); return; }
    setListsLoading(true);
    try {
      const r = await getLists();
      setPublicLists((r?.data || []).filter((l) => l.is_public === true));
    } catch { setPublicLists([]); }
    finally { setListsLoading(false); }
  }, [isGuestUser]);

  useEffect(() => { loadPublicLists(); }, []);

  const displayName = () => {
    if (profile.display_name) return profile.display_name;
    const m = user?.user_metadata;
    if (m?.full_name) return m.full_name;
    if (m?.first_name) return m.last_name ? `${m.first_name} ${m.last_name}` : m.first_name;
    const email = getUserEmail();
    return email ? email.split("@")[0] : "Hoşgeldin";
  };

  const initials = () => {
    const parts = displayName().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : displayName().substring(0, 2).toUpperCase();
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

  const userLevel = useUserLevel(stats.totalWords);
  const streakBadge = useMemo(() => getStreakBadge(stats.streakDays), [stats.streakDays]);
  const wordsBadge = useMemo(() => getWordsBadge(stats.totalWords), [stats.totalWords]);
  const recentUnlocks = useMemo(() => {
    if (!unlocked || unlocked.size === 0) return [];
    return Array.from(unlocked).map((k) => getAchievementByKey(k)).filter(Boolean).slice(-3).reverse();
  }, [unlocked]);
  const visibleLists = useMemo(() => publicLists.slice(0, 6), [publicLists]);

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Top bar — Düzenle + ⚙️ */}
        <View style={s.topBar}>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); navigation.navigate("EditProfile"); }}
            hitSlop={10}
            style={({ pressed }) => [s.topBtn, pressed && { opacity: 0.6 }]}
          >
            <Icon d={ICONS.user} size={16} stroke={c.textSec} sw={1.8} />
            <Text style={s.topBtnTxt}>Düzenle</Text>
          </Pressable>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); navigation.navigate("Settings"); }}
            hitSlop={10}
            style={({ pressed }) => [s.gearBtn, pressed && { opacity: 0.6 }]}
            accessibilityLabel="Ayarlar"
          >
            <Icon d={ICONS.gear} size={24} stroke={c.textSec} sw={1.8} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: bottomPad }}>
          {/* Avatar + name + level */}
          <View style={s.headerBlock}>
            <View style={s.avatarWrap}>
              {profile.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={s.avatarImg} />
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
                { backgroundColor: userLevel.color + "14", borderColor: userLevel.color + "44", transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <View style={[s.levelIconWrap, { backgroundColor: userLevel.color + "22" }]}>
                <Icon d={userLevel.icon} size={14} stroke={userLevel.color} fill={userLevel.color + "33"} sw={1.7} />
              </View>
              <Text style={[s.levelTitle, { color: userLevel.color, fontFamily: c.fontBodyBold }]}>{userLevel.title}</Text>
              <View style={[s.levelDot, { backgroundColor: userLevel.color + "66" }]} />
              <Text style={[s.levelSub, { color: userLevel.color, fontFamily: c.fontBody }]}>Seviye {userLevel.lv}</Text>
            </Pressable>
          </View>

          {/* 3-stat bar */}
          <View style={s.statBar}>
            <StatItem icon={ICONS.flame} value={stats.streakDays} label="gün seri" color="#FF8A4C" c={c} s={s} />
            <View style={s.statDivider} />
            <StatItem icon={ICONS.books} value={stats.totalWords} label="kelime" color={c.cobalt} c={c} s={s} />
            <View style={s.statDivider} />
            <StatItem icon={ICONS.grid} value={publicLists.length} label="liste" color={c.accent} c={c} s={s} />
          </View>

          {/* Streak hero — flame + sayı + bu hafta */}
          <Pressable
            onPress={() => navigation.navigate("Streak")}
            style={({ pressed }) => [s.streakHero, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}
          >
            <AnimatedFlame size={48} streak={stats.streakDays} />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={s.streakNum}>{stats.streakDays}</Text>
              <Text style={s.streakCap}>
                {stats.streakDays === 0 ? "henüz seri yok" : stats.streakDays === 1 ? "ilk gün — devam et" : "gün üst üste"}
              </Text>
            </View>
            <Icon d={ICONS.arrow} size={16} stroke={c.textMuted} sw={1.8} />
          </Pressable>

          <Last7DaysDots days={days} />

          {/* 3 stat tile — Kelime / Seans / Doğruluk */}
          <View style={s.tileRow}>
            <ProfileTile value={stats.totalWords} label="Kelime" accent={c.warning} c={c} s={s} />
            <ProfileTile value={stats.totalSessions} label="Seans" accent={c.cobalt} c={c} s={s} />
            <ProfileTile
              value={`%${stats.totalSessions ? Math.round((stats.totalWords / Math.max(stats.totalSessions * 10, 1)) * 100) : 0}`}
              label="Doğruluk"
              accent={c.success}
              c={c} s={s}
            />
          </View>

          {statsError && (
            <Pressable onPress={loadStats} style={s.errorBanner}>
              <Text style={[s.errorTxt, { color: c.warning }]}>İstatistikler yüklenemedi — dokun ve yenile</Text>
              <Text style={{ color: c.warning, fontSize: fontSize.md }}>↻</Text>
            </Pressable>
          )}

          {/* Motivation card */}
          <Pressable
            onPress={() => navigation.navigate("Streak")}
            style={({ pressed }) => [s.motivationCard, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}
          >
            <LinearGradient colors={[c.bgElevated, c.bgSurface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={s.motivationGlow} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={s.motTitle}>Bu hafta {Math.min(stats.totalWords, 99)} kelime öğrendin</Text>
              <Icon d={ICONS.sparkle} size={20} stroke={c.warning} fill={c.warning} sw={1.5} />
            </View>
            <Text style={s.motSub}>Detayları gör →</Text>
          </Pressable>

          {/* Rozetlerim */}
          <StaggerEnter index={0}>
            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>Rozetlerim</Text>
              <Pressable onPress={() => navigation.navigate("Achievements")} hitSlop={8}>
                <Text style={s.sectionLink}>Tümü →</Text>
              </Pressable>
            </View>
            <View style={s.badgeRow}>
              <BadgeCard
                title={streakBadge.current?.label || "Kıvılcım"}
                iconPath={streakBadge.current?.icon || ICONS.sparkle}
                color={streakBadge.current?.color || c.textMuted}
                value={`${stats.streakDays} gün üst üste`}
                hint={streakBadge.next ? `${streakBadge.next.threshold - stats.streakDays} güne ${streakBadge.next.label}` : "Tüm streak rozetleri tamam!"}
                locked={!streakBadge.current}
                onPress={() => navigation.navigate("Achievements")}
                c={c} s={s}
              />
              <BadgeCard
                title={wordsBadge.current?.label || "Filiz"}
                iconPath={wordsBadge.current?.icon || ICONS.leaf}
                color={wordsBadge.current?.color || c.textMuted}
                value={`${stats.totalWords} kelime`}
                hint={wordsBadge.next ? `${wordsBadge.next.threshold - stats.totalWords} kelime'ye ${wordsBadge.next.label}` : "Tüm kelime rozetleri tamam!"}
                locked={!wordsBadge.current}
                onPress={() => navigation.navigate("Achievements")}
                c={c} s={s}
              />
            </View>
            {recentUnlocks.length > 0 && (
              <View style={s.recentBadges}>
                {recentUnlocks.map((a) => (
                  <Pressable key={a.key} onPress={() => navigation.navigate("Achievements")} style={({ pressed }) => [s.recentBadgePill, { borderColor: c.border, backgroundColor: c.bgElevated, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
                    <Icon d={a.icon} size={14} stroke={c.accent} sw={1.8} />
                    <Text style={[s.recentBadgeTxt, { color: c.textPrimary }]}>{a.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </StaggerEnter>

          {/* Oluşturduğum Listeler */}
          <StaggerEnter index={1}>
            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>Oluşturduğum Listeler</Text>
              {publicLists.length > 6 && (
                <Pressable onPress={() => navigation.navigate("MyLists")} hitSlop={8}>
                  <Text style={s.sectionLink}>Tümünü gör →</Text>
                </Pressable>
              )}
            </View>
            {listsLoading ? (
              <View style={s.listsEmpty}><Text style={s.listsEmptyTxt}>Yükleniyor…</Text></View>
            ) : publicLists.length === 0 ? (
              <Pressable onPress={() => navigation.navigate("MyLists")} style={({ pressed }) => [s.listsEmpty, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}>
                <Icon d={ICONS.plus} size={20} stroke={c.textMuted} sw={1.8} />
                <Text style={s.listsEmptyTxt}>Henüz public listen yok</Text>
                <Text style={s.listsEmptyHint}>Liste oluştur ve paylaş →</Text>
              </Pressable>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 8 }}>
                {visibleLists.map((item, i) => (
                  <StaggerEnter key={String(item.id)} index={i} delay={50}>
                    <Pressable
                      onPress={() => navigation.navigate("FlashcardDetail", { listId: item.id, listTitle: item.title, listLevel: item.level, listIsPublic: item.is_public })}
                      style={({ pressed }) => [s.listCard, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                    >
                      <CategoryCover difficulty={item.level} cat={item.category} imageUrl={item.image_url} height={72} showLabel={false} />
                      <View style={s.listCardBody}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Text style={[s.listCardTitle, { flex: 1 }]} numberOfLines={1}>{item.title}</Text>
                          <RatingChip avg={item.avg_rating} count={item.rating_count} c={c} />
                        </View>
                        <View style={s.listCardMeta}>
                          <Text style={s.listCardCount}>{item.word_count ?? 0} kelime</Text>
                          {item.level && <View style={s.listCardChip}><Text style={s.listCardChipTxt}>{item.level}</Text></View>}
                        </View>
                      </View>
                    </Pressable>
                  </StaggerEnter>
                ))}
              </ScrollView>
            )}
          </StaggerEnter>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatItem({ icon, value, label, color, c, s }) {
  return (
    <View style={s.statItem}>
      <Icon d={icon} size={16} stroke={color} sw={1.8} />
      <Text style={[s.statValue, { color: c.textPrimary }]}>{value}</Text>
      <Text style={[s.statLabel, { color: c.textSec }]}>{label}</Text>
    </View>
  );
}

function ProfileTile({ value, label, accent, c, s }) {
  return (
    <View style={[s.tile, { borderTopColor: accent, borderColor: accent + "44", shadowColor: accent }]}>
      <View style={[s.tileHalo, { backgroundColor: accent + "55" }]} />
      <Text style={[s.tileVal, { color: accent }]}>{value}</Text>
      <Text style={s.tileLbl}>{label}</Text>
    </View>
  );
}

function BadgeCard({ title, iconPath, color, value, hint, locked, onPress, c, s }) {
  const bg = locked ? c.textMuted + "12" : color + "22";
  const border = locked ? c.border : color + "55";
  const accent = locked ? c.textMuted : color;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.badgeCard, { backgroundColor: bg, borderColor: border, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
      <View style={[s.badgeIconBox, { backgroundColor: accent + "33", borderColor: accent + "66" }]}>
        <Icon d={iconPath} size={24} stroke={accent} fill={accent + "44"} sw={1.8} />
      </View>
      <Text style={[s.badgeTitle, { color: accent, fontFamily: c.fontBodyBold }]} numberOfLines={1}>{locked ? "Kilitli" : title}</Text>
      <Text style={[s.badgeValue, { color: c.textPrimary, fontFamily: c.fontBodySemi }]} numberOfLines={1}>{value}</Text>
      <Text style={[s.badgeHint, { color: c.textSec, fontFamily: c.fontBody }]} numberOfLines={2}>{hint}</Text>
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 8 },
    topBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: c.bgElevated, borderWidth: 1, borderColor: c.border },
    topBtnTxt: { fontFamily: c.fontBodySemi, fontSize: fontSize.sm, color: c.textSec },
    gearBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.bgElevated, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
    headerBlock: { alignItems: "center", paddingTop: 4, paddingBottom: 16 },
    avatarWrap: { shadowColor: c.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 8, marginBottom: 14 },
    avatarGrad: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center" },
    avatarImg: { width: 84, height: 84, borderRadius: 42 },
    avatarTxt: { fontFamily: c.fontNum, fontSize: fontSize["3xl"], color: "#FFFFFF" },
    name: { fontFamily: c.fontBodyBold, fontSize: fontSize.xl, color: c.textPrimary, marginTop: 14 },
    levelChip: { marginTop: 10, paddingLeft: 6, paddingRight: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 8 },
    levelIconWrap: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    levelTitle: { fontSize: fontSize.md, letterSpacing: 0.3 },
    levelDot: { width: 3, height: 3, borderRadius: 1.5 },
    levelSub: { fontSize: fontSize.sm, letterSpacing: 0.2, opacity: 0.85 },
    // 3-stat bar
    statBar: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: c.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: c.border, paddingVertical: 14, marginBottom: 16 },
    statItem: { flex: 1, alignItems: "center", gap: 4 },
    statValue: { fontFamily: c.fontNum, fontSize: fontSize.xl },
    statLabel: { fontFamily: c.fontBody, fontSize: fontSize.xs },
    statDivider: { width: 1, height: 32, backgroundColor: c.border },
    // streak hero
    streakHero: { flexDirection: "row", alignItems: "center", backgroundColor: c.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 16, marginBottom: 14 },
    streakNum: { fontFamily: c.fontNum, fontSize: fontSize["2xl"], color: c.textPrimary, lineHeight: 30 },
    streakCap: { fontFamily: c.fontBody, fontSize: fontSize.sm, color: c.textSec, marginTop: 2 },
    // stat tiles
    tileRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    tile: { flex: 1, backgroundColor: c.bgElevated, borderRadius: 16, borderWidth: 1.5, borderColor: c.border, borderTopWidth: 3, padding: 14, paddingTop: 12, alignItems: "center", overflow: "hidden", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 3 },
    tileHalo: { position: "absolute", top: -22, width: 80, height: 40, borderRadius: 99, opacity: 0.9 },
    tileVal: { fontFamily: c.fontNum, fontSize: fontSize["2xl"] },
    tileLbl: { fontFamily: c.fontBody, fontSize: fontSize.xs, color: c.textSec, marginTop: 2 },
    // error
    errorBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.warning + "1A", borderWidth: 1, borderColor: c.warning + "55", marginBottom: 14 },
    errorTxt: { flex: 1, fontFamily: c.fontBodySemi, fontSize: fontSize.sm },
    // motivation
    motivationCard: { borderRadius: 18, padding: 18, borderWidth: 1, borderColor: c.borderAccent, overflow: "hidden", marginBottom: 20, shadowColor: c.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 32, elevation: 4 },
    motivationGlow: { position: "absolute", top: -34, right: -24, width: 130, height: 130, borderRadius: 65, backgroundColor: c.accentGlow },
    motTitle: { fontFamily: c.fontBodyBold, fontSize: fontSize.lg, color: c.textPrimary },
    motSub: { fontFamily: c.fontBody, fontSize: fontSize.sm, color: c.textSec, marginTop: 3 },
    // sections
    sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18, marginBottom: 10, paddingHorizontal: 2 },
    sectionTitle: { fontFamily: c.fontBodyBold, fontSize: fontSize.lg, color: c.textPrimary, letterSpacing: 0.2 },
    sectionLink: { fontFamily: c.fontBodySemi, fontSize: fontSize.sm, color: c.accent },
    // badges
    badgeRow: { flexDirection: "row", gap: 12 },
    badgeCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "flex-start", minHeight: 140 },
    badgeIconBox: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    badgeTitle: { fontSize: fontSize.md, letterSpacing: 0.2, marginBottom: 4 },
    badgeValue: { fontSize: fontSize.md, marginBottom: 6 },
    badgeHint: { fontSize: fontSize.sm, lineHeight: 14 },
    recentBadges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
    recentBadgePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
    recentBadgeTxt: { fontFamily: c.fontBodySemi, fontSize: fontSize.sm },
    // lists
    listsEmpty: { borderRadius: 16, borderWidth: 1, borderColor: c.border, borderStyle: "dashed", backgroundColor: c.bgElevated, padding: 20, alignItems: "center", gap: 4 },
    listsEmptyTxt: { fontFamily: c.fontBodySemi, fontSize: fontSize.md, color: c.textSec, marginTop: 4 },
    listsEmptyHint: { fontFamily: c.fontBody, fontSize: fontSize.sm, color: c.textMuted },
    listCard: { width: 170, borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.bgElevated, overflow: "hidden", shadowColor: c.cobalt, shadowOpacity: 0.15, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
    listCardBody: { padding: 10, gap: 6 },
    listCardTitle: { fontFamily: c.fontBodyBold, fontSize: fontSize.md, color: c.textPrimary },
    listCardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 },
    listCardCount: { fontFamily: c.fontBodySemi, fontSize: fontSize.sm, color: c.textPrimary, opacity: 0.85 },
    listCardChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: c.accent + "1A", borderWidth: 1, borderColor: c.accent + "44" },
    listCardChipTxt: { fontFamily: c.fontBodySemi, fontSize: fontSize.xs, color: c.accent, letterSpacing: 0.3, textTransform: "uppercase" },
    // guest
    guestTitle: { fontFamily: c.fontBodyBold, fontSize: fontSize.xl, color: c.textPrimary, marginTop: 12 },
    guestSub: { fontFamily: c.fontBody, fontSize: fontSize.md, color: c.textSec, marginTop: 4 },
    primaryBtn: { marginTop: 24, backgroundColor: c.accent, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
    primaryBtnTxt: { color: c.textOnAccent, fontFamily: c.fontBodyBold, fontSize: fontSize.lg },
  });
}
