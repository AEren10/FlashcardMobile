/**
 * StudyResultScreen — SRS / Study modu bitiminde gösterilen detaylı rapor.
 * - Donut chart (%doğru)
 * - Süre + ortalama, retention tahmini
 * - 3 aksiyon: Favorile / Sadece Bunlardan Çalış / Bitir
 * - Bilemediklerin (default expanded) + Bildiklerin (chip list)
 */
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";
import PremiumButton from "./PremiumButton";
import DonutChart from "./DonutChart";
import StaggerEnter from "./StaggerEnter";
import LottieSuccess from "./LottieSuccess";
import { addFavoriteWord } from "../../supabase/wordFavorites";

const { width: W } = Dimensions.get("window");

export default function StudyResultScreen({
  total = 0,
  correct = 0,
  durationSec = 0,
  correctWords = [],
  wrongWords = [],
  mistakesAdded = 0,
  onRetryMistakes,
  onFinish,
}) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [favorited, setFavorited] = useState(false);
  const ratio = total ? correct / total : 0;
  const pct = Math.round(ratio * 100);
  const isExcellent = ratio >= 0.8;
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const timeStr = mins > 0 ? `${mins}d ${secs}s` : `${secs}s`;
  const retentionEstimate = Math.round(60 + ratio * 30); // 60-90% arası

  const handleSaveWrongs = async () => {
    if (favorited || !wrongWords.length) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFavorited(true);
    await Promise.all(
      wrongWords.map((w) => addFavoriteWord(w.id, w.list_id))
    );
    Alert.alert("Eklendi", `${wrongWords.length} kelime favorilerine eklendi.`);
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Hero */}
          <View style={s.hero}>
            <View style={{ position: "relative" }}>
              <DonutChart
                percent={pct}
                size={150}
                strokeWidth={14}
                color={pct >= 70 ? c.success : pct >= 40 ? c.warning : c.error}
                label={`${correct}/${total}`}
              />
              {isExcellent && (
                <View style={{ position: "absolute", top: -10, right: -10 }}>
                  <LottieSuccess size={56} />
                </View>
              )}
            </View>
            <Text style={s.title}>{titleFor(ratio)}</Text>
            <Text style={s.sub}>{subtitleFor(ratio)}</Text>
          </View>

          {/* Quick stats */}
          <View style={s.statsRow}>
            <StatBox icon="⏱" value={timeStr} label="Süre" c={c} s={s} />
            <StatBox
              icon="🧠"
              value={`%${retentionEstimate}`}
              label="24s sonra"
              c={c}
              s={s}
            />
            <StatBox
              icon="📚"
              value={mistakesAdded > 0 ? `+${mistakesAdded}` : "0"}
              label="Listene"
              c={c}
              s={s}
            />
          </View>

          {/* Mistakes saved info */}
          {mistakesAdded > 0 && (
            <View style={s.infoCard}>
              <View style={s.infoIcon}>
                <Text style={{ fontSize: 18 }}>🎯</Text>
              </View>
              <Text style={s.infoTxt}>
                <Text style={{ fontFamily: c.fontBodyBold, color: c.textPrimary }}>
                  {mistakesAdded} kelime
                </Text>{" "}
                "Bilemediğin Kelimeler" listene eklendi. 3 kez doğru bilince otomatik
                çıkar.
              </Text>
            </View>
          )}

          {/* Wrongs detailed */}
          {wrongWords.length > 0 && (
            <StaggerEnter index={0} delay={200}>
              <View style={s.section}>
                <View style={s.sectionHead}>
                  <View style={[s.sectionDot, { backgroundColor: c.error }]} />
                  <Text style={s.sectionTitle}>Şurada takıldın</Text>
                  <Text style={s.sectionCount}>{wrongWords.length}</Text>
                </View>
                <View style={{ marginTop: 10, gap: 8 }}>
                  {wrongWords.slice(0, 15).map((w) => (
                    <WrongCard key={w.id} word={w} c={c} s={s} />
                  ))}
                  {wrongWords.length > 15 && (
                    <Text style={s.moreTxt}>+{wrongWords.length - 15} daha</Text>
                  )}
                </View>
              </View>
            </StaggerEnter>
          )}

          {/* Knowns chips */}
          {correctWords.length > 0 && (
            <StaggerEnter index={1} delay={250}>
              <View style={s.section}>
                <View style={s.sectionHead}>
                  <View style={[s.sectionDot, { backgroundColor: c.success }]} />
                  <Text style={s.sectionTitle}>Bunları biliyorsun</Text>
                  <Text style={s.sectionCount}>{correctWords.length}</Text>
                </View>
                <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {correctWords.slice(0, 30).map((w) => (
                    <View key={w.id} style={s.knownChip}>
                      <Text style={s.knownChipTxt}>{w.word}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </StaggerEnter>
          )}

          {/* Action buttons */}
          <View style={{ gap: 10, marginTop: 24 }}>
            {wrongWords.length > 0 && (
              <PremiumButton
                label={favorited ? "✓ Favorilere Eklendi" : "Bilemediklerimi Favorile"}
                variant={favorited ? "secondary" : "primary"}
                onPress={handleSaveWrongs}
                hapticStyle="medium"
                block
                size="lg"
                disabled={favorited}
              />
            )}
            {mistakesAdded > 0 && onRetryMistakes && (
              <PremiumButton
                label="Bilemediğin Kelimelere Git"
                variant="secondary"
                onPress={onRetryMistakes}
                hapticStyle="light"
                block
                size="lg"
              />
            )}
            <PremiumButton
              label="Bitir"
              variant="ghost"
              onPress={onFinish}
              hapticStyle="success"
              block
              size="lg"
            />
          </View>
        </ScrollView>

        {isExcellent && (
          <ConfettiCannon
            count={120}
            origin={{ x: W / 2, y: -10 }}
            autoStart
            fadeOut
            explosionSpeed={300}
            colors={[c.accent, c.cobalt, c.warning, c.success]}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function titleFor(r) {
  if (r >= 0.9) return "Mükemmel 🏆";
  if (r >= 0.7) return "Çok iyi 👏";
  if (r >= 0.5) return "Fena değil";
  return "Daha çalışman lazım 💪";
}
function subtitleFor(r) {
  if (r >= 0.9) return "Bu listeyi neredeyse ezbere biliyorsun.";
  if (r >= 0.7) return "Bir kaç tekrar daha, tam oturacak.";
  if (r >= 0.5) return "Yarısından fazlasını biliyorsun — devam.";
  return "Tekrar gözden geçir, sonra dene.";
}

function WrongCard({ word, c, s }) {
  return (
    <View style={s.wrongCard}>
      <View style={{ flex: 1 }}>
        <Text style={s.wrongWord}>{word.word}</Text>
        <Text style={s.wrongMeaning}>{word.meaning}</Text>
        {!!word.example && (
          <Text style={s.wrongExample} numberOfLines={2}>
            "{word.example}"
          </Text>
        )}
      </View>
      <Pressable
        hitSlop={10}
        style={[s.soundBtn, { borderColor: c.border }]}
        onPress={() => Speech.speak(word.word, { language: "en-US" })}
        accessibilityLabel="Telaffuzu dinle"
      >
        <Icon d={ICONS.sound} size={16} stroke={c.cobalt} sw={1.8} />
      </Pressable>
    </View>
  );
}

function StatBox({ icon, value, label, c, s }) {
  return (
    <View style={s.statBox}>
      <Text style={s.statIcon}>{icon}</Text>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    hero: { alignItems: "center", paddingVertical: 14, gap: 10 },
    title: {
      fontFamily: c.fontDisplay,
      fontSize: 28,
      color: c.textPrimary,
      marginTop: 10,
      textAlign: "center",
    },
    sub: {
      fontFamily: c.fontBody,
      fontSize: 13,
      color: c.textSec,
      textAlign: "center",
      maxWidth: 300,
      lineHeight: 19,
    },
    statsRow: { flexDirection: "row", gap: 10, marginTop: 22 },
    statBox: {
      flex: 1,
      backgroundColor: c.bgElevated,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 12,
      alignItems: "center",
    },
    statIcon: { fontSize: 18, marginBottom: 4 },
    statVal: { fontFamily: c.fontNum, fontSize: 18, color: c.textPrimary },
    statLbl: { fontFamily: c.fontBody, fontSize: 10, color: c.textSec, marginTop: 2 },

    infoCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: c.accentGlow,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borderAccent,
      padding: 14,
      marginTop: 16,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.bgBase,
      alignItems: "center",
      justifyContent: "center",
    },
    infoTxt: {
      flex: 1,
      fontFamily: c.fontBody,
      fontSize: 13,
      color: c.textSec,
      lineHeight: 18,
    },

    section: { marginTop: 22 },
    sectionHead: { flexDirection: "row", alignItems: "center", gap: 10 },
    sectionDot: { width: 9, height: 9, borderRadius: 5 },
    sectionTitle: {
      flex: 1,
      fontFamily: c.fontBodyBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    sectionCount: { fontFamily: c.fontNum, fontSize: 14, color: c.textSec },

    wrongCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      backgroundColor: c.errorDim,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.error + "33",
    },
    wrongWord: { fontFamily: c.fontBodyBold, fontSize: 15, color: c.textPrimary },
    wrongMeaning: { fontFamily: c.fontBody, fontSize: 13, color: c.textSec, marginTop: 2 },
    wrongExample: {
      fontFamily: c.fontDisplay,
      fontSize: 12,
      fontStyle: "italic",
      color: c.textMuted,
      marginTop: 6,
      lineHeight: 16,
    },
    soundBtn: {
      width: 34,
      height: 34,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bgSurface,
    },

    knownChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: c.successDim,
      borderWidth: 1,
      borderColor: c.success + "33",
    },
    knownChipTxt: { fontFamily: c.fontBodySemi, fontSize: 12, color: c.success },

    moreTxt: {
      fontFamily: c.fontBody,
      fontSize: 12,
      color: c.textMuted,
      textAlign: "center",
      marginTop: 4,
    },
  });
}
