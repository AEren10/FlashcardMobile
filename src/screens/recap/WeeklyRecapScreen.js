/**
 * WeeklyRecapScreen — son 7 günün özeti, Spotify Wrapped tarzı paylaşılabilir kart.
 *
 * Stüdyo washi-paper estetiği:
 *   - Yumuşak kraft cream bg
 *   - Warm accent vurgular
 *   - 3-4 büyük rakam (kelime/dakika/doğruluk)
 *   - En aktif gün + hardest word + top list spotlights
 *   - 7 günlük bar chart
 *   - Paylaş + Kapat butonları
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { getWeeklyRecap } from "../../supabase/weeklyRecap";
import Icon, { ICONS } from "../../components/design/Icon";
import { Skeleton } from "../../components/design/Skeleton";

const DAY_LABELS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

function formatDayName(date) {
  return DAY_LABELS_TR[date.getDay()];
}

export default function WeeklyRecapScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyRecap()
      .then((data) => setRecap(data))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const lines = [
      `🌟 Bu haftaki yolculuğum`,
      ``,
      `📚 ${recap.totalWords} kelime`,
      `⏱️  ${recap.totalMinutes} dakika`,
      `🎯 %${recap.accuracy} doğruluk`,
    ];
    if (recap.hardestWord) {
      lines.push(``, `🔥 Bu haftanın yeneni: "${recap.hardestWord.word}"`);
    }
    lines.push(``, `FlashcardMobile ile İngilizce öğreniyorum 💛`);
    try {
      await Share.share({ message: lines.join("\n") });
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <Header c={c} s={s} onClose={() => navigation.goBack()} />
          <View style={{ padding: 22, gap: 12 }}>
            <Skeleton width="60%" height={28} radius={8} />
            <Skeleton width="100%" height={180} radius={20} />
            <Skeleton width="100%" height={100} radius={16} />
            <Skeleton width="100%" height={100} radius={16} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!recap || recap.isEmpty) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <Header c={c} s={s} onClose={() => navigation.goBack()} />
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 }}>
            <View
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: c.accent + "22", borderWidth: 1, borderColor: c.accent + "55",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon d={ICONS.sparkle} size={36} stroke={c.accent} sw={1.8} />
            </View>
            <Text style={{ fontFamily: c.fontDisplay, fontSize: 22, color: c.textPrimary, textAlign: "center" }}>
              Bu hafta henüz çalışmadın
            </Text>
            <Text style={{ fontFamily: c.fontBody, fontSize: 14, color: c.textSec, textAlign: "center", maxWidth: 280 }}>
              Birkaç kelime çalıştıktan sonra haftalık özetin burada görünür — Spotify Wrapped gibi.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <Header c={c} s={s} onClose={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
          {/* Hero card — washi paper */}
          <View style={s.heroCard}>
            <LinearGradient
              colors={[c.accent + "26", c.cobalt + "1A", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.18)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.4 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
              pointerEvents="none"
            />
            <Text style={s.heroTag}>BU HAFTA</Text>
            <Text style={s.heroBig}>{recap.totalWords}</Text>
            <Text style={s.heroLabel}>kelime öğrendin</Text>
          </View>

          {/* 3 stat tile yan yana */}
          <View style={s.statsRow}>
            <StatTile
              icon={ICONS.clock}
              value={recap.totalMinutes}
              label="dakika"
              color={c.cobalt}
              c={c}
              s={s}
            />
            <StatTile
              icon={ICONS.target}
              value={`%${recap.accuracy}`}
              label="doğruluk"
              color={c.success}
              c={c}
              s={s}
            />
            <StatTile
              icon={ICONS.bolt}
              value={recap.totalSessions}
              label="oturum"
              color={c.accent}
              c={c}
              s={s}
            />
          </View>

          {/* 7 günlük bar chart */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Haftalık ritmin</Text>
            <View style={s.barRow}>
              {recap.daily.map((d, i) => {
                const max = Math.max(...recap.daily.map((x) => x.words), 1);
                const h = Math.max(4, (d.words / max) * 100);
                const isToday = i === recap.daily.length - 1;
                return (
                  <View key={i} style={s.barCol}>
                    <View
                      style={[
                        s.bar,
                        {
                          height: h,
                          backgroundColor: d.words > 0 ? c.accent : c.bgSurface,
                          opacity: isToday ? 1 : 0.85,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        s.barLabel,
                        { color: isToday ? c.accent : c.textMuted, fontFamily: isToday ? c.fontBodyBold : c.fontBody },
                      ]}
                    >
                      {formatDayName(d.date)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Hardest word spotlight */}
          {recap.hardestWord && (
            <View style={[s.spotlightCard, { borderColor: c.error + "44" }]}>
              <LinearGradient
                colors={[c.error + "1F", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={s.spotlightHead}>
                <Icon d={ICONS.flame} size={16} stroke={c.error} fill={c.error + "44"} sw={1.8} />
                <Text style={[s.spotlightTag, { color: c.error, fontFamily: c.fontBodyBold }]}>
                  HAFTANIN ZORU
                </Text>
              </View>
              <Text style={[s.spotlightWord, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
                {recap.hardestWord.word}
              </Text>
              <Text style={[s.spotlightMeaning, { color: c.textSec, fontFamily: c.fontBody }]}>
                {recap.hardestWord.meaning}
              </Text>
            </View>
          )}

          {/* Top list spotlight */}
          {recap.topListTitle && (
            <View style={[s.spotlightCard, { borderColor: c.cobalt + "44", marginTop: 12 }]}>
              <LinearGradient
                colors={[c.cobalt + "1F", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={s.spotlightHead}>
                <Icon d={ICONS.books} size={16} stroke={c.cobalt} fill={c.cobalt + "44"} sw={1.8} />
                <Text style={[s.spotlightTag, { color: c.cobalt, fontFamily: c.fontBodyBold }]}>
                  EN ÇOK ÇALIŞTIĞIN
                </Text>
              </View>
              <Text style={[s.spotlightWord, { color: c.textPrimary, fontFamily: c.fontDisplay, fontSize: 22 }]}>
                {recap.topListTitle}
              </Text>
              <Text style={[s.spotlightMeaning, { color: c.textSec, fontFamily: c.fontBody }]}>
                {recap.topListWords} kelime · bu listede yoğunlaştın
              </Text>
            </View>
          )}

          {/* Share button */}
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              s.shareBtn,
              {
                backgroundColor: c.accent,
                shadowColor: c.accent,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Icon d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" size={18} stroke={c.textOnAccent} sw={2.2} />
            <Text style={[s.shareTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
              Paylaş
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Header({ c, s, onClose }) {
  return (
    <View style={s.header}>
      <Pressable onPress={onClose} hitSlop={12} style={[s.iconBtn, { backgroundColor: c.bgSurface, borderColor: c.border }]}>
        <Icon d={ICONS.x} size={18} stroke={c.textPrimary} sw={2} />
      </Pressable>
      <Text style={[s.headerTitle, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
        Haftalık Özet
      </Text>
      <View style={{ width: 38 }} />
    </View>
  );
}

function StatTile({ icon, value, label, color, c, s }) {
  return (
    <View style={[s.statTile, { borderColor: color + "44", backgroundColor: color + "14" }]}>
      <Icon d={icon} size={18} stroke={color} sw={1.8} />
      <Text style={[s.statVal, { color: c.textPrimary, fontFamily: c.fontNum }]}>{value}</Text>
      <Text style={[s.statLbl, { color: c.textSec, fontFamily: c.fontBody }]}>{label}</Text>
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
    iconBtn: {
      width: 38, height: 38,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center", justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 19,
    },
    heroCard: {
      borderRadius: 22,
      padding: 28,
      borderWidth: 1,
      borderColor: c.borderAccent,
      backgroundColor: c.bgElevated,
      overflow: "hidden",
      alignItems: "center",
      marginBottom: 14,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 30,
      elevation: 6,
    },
    heroTag: {
      fontSize: 11,
      letterSpacing: 1.8,
      color: c.accent,
      fontFamily: c.fontBodyBold,
      marginBottom: 8,
    },
    heroBig: {
      fontSize: 76,
      lineHeight: 80,
      color: c.textPrimary,
      fontFamily: c.fontDisplay,
      textShadowColor: c.accent + "55",
      textShadowRadius: 16,
      textShadowOffset: { width: 0, height: 0 },
    },
    heroLabel: {
      fontSize: 15,
      color: c.textSec,
      fontFamily: c.fontBody,
      marginTop: 4,
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
    },
    statTile: {
      flex: 1,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      gap: 6,
    },
    statVal: { fontSize: 22 },
    statLbl: { fontSize: 11, letterSpacing: 0.3 },
    section: {
      marginTop: 4,
      padding: 18,
      borderRadius: 18,
      backgroundColor: c.bgElevated,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 14,
      color: c.textSec,
      fontFamily: c.fontBodyBold,
      letterSpacing: 0.4,
      marginBottom: 14,
    },
    barRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 120,
    },
    barCol: {
      alignItems: "center",
      gap: 6,
      flex: 1,
    },
    bar: {
      width: 18,
      borderRadius: 4,
    },
    barLabel: {
      fontSize: 10,
      letterSpacing: 0.3,
    },
    spotlightCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      overflow: "hidden",
    },
    spotlightHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    },
    spotlightTag: {
      fontSize: 10,
      letterSpacing: 1.4,
    },
    spotlightWord: {
      fontSize: 26,
      lineHeight: 30,
    },
    spotlightMeaning: {
      fontSize: 13,
      marginTop: 2,
    },
    shareBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      borderRadius: 16,
      marginTop: 22,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 18,
      elevation: 5,
    },
    shareTxt: {
      fontSize: 15,
      letterSpacing: 0.3,
    },
  });
}
