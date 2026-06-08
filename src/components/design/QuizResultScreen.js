/**
 * QuizResultScreen — quiz/study sonu detaylı celebration.
 *
 * Bölümler:
 *  - Hero: animated counter sayısı (0 → final) + rozet
 *  - Stats row: doğru, yanlış, süre, doğruluk %
 *  - "Şunları biliyorsun" list (doğru cevaplananlar, lime tint)
 *  - "Şurada takıldın" list (yanlış cevaplananlar, coral tint, "tekrar göster" link)
 *  - 2 CTA: "Tekrar Dene" (secondary) · "Bitir" (primary)
 *
 * Animation: counter tick + stagger entrance + confetti (≥80%)
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Alert,
  Pressable,
  Share,
} from "react-native";
import * as Haptics from "expo-haptics";
import { track, EVENTS } from "../../lib/track";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";
import PremiumButton from "./PremiumButton";
import StaggerEnter from "./StaggerEnter";
import LottieSuccess from "./LottieSuccess";
import { addFavoriteWord } from "../../supabase/wordFavorites";
import PerfectScoreOverlay from "../celebration/PerfectScoreOverlay";

const { width: W } = Dimensions.get("window");

export default function QuizResultScreen({
  correct = 0,
  total = 0,
  durationSec = 0,
  correctWords = [],
  wrongWords = [],
  mistakesAdded = 0,
  listId,
  onRetry,
  onFinish,
}) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const [displayScore, setDisplayScore] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const scoreScale = useRef(new Animated.Value(0)).current;

  const handleSaveWrongs = async () => {
    if (favorited || !wrongWords.length) return;
    setFavorited(true);
    await Promise.all(
      wrongWords.map((w) => addFavoriteWord(w.id, listId || w.list_id))
    );
    Alert.alert("Eklendi", `${wrongWords.length} kelime favorilerine eklendi.`);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const accuracyPct = total ? Math.round((correct / total) * 100) : 0;
    const emoji = accuracyPct >= 80 ? "🏆" : accuracyPct >= 50 ? "✨" : "💪";
    const deepLink = listId
      ? `https://flashcardmobile.app/list/${listId}`
      : "https://flashcardmobile.app";
    const msg = `${emoji} FlashcardMobile'da quiz bitirdim: ${correct}/${total} doğru (%${accuracyPct})!\n\nSen kaç bilirsin? ${deepLink}`;
    try {
      await Share.share({ message: msg, url: deepLink });
      track(EVENTS.SHARE_INITIATED, { source: "quiz_result", correct, total, accuracy: accuracyPct });
    } catch {}
  };
  const ratio = total ? correct / total : 0;
  const accuracyPct = Math.round(ratio * 100);
  const isExcellent = ratio >= 0.8;
  const isGood = ratio >= 0.5;

  const medalIcon = isExcellent ? ICONS.trophy : isGood ? ICONS.star : ICONS.flame;
  const title = isExcellent
    ? "Harika!"
    : isGood
      ? "İyi gidiyorsun"
      : "Devam et!";
  const subtitle = isExcellent
    ? "Bu listeyi çok iyi biliyorsun. Yeni listeye geçmeye hazırsın."
    : isGood
      ? "Biraz daha çalışarak mükemmelleştir."
      : "Tekrar çalışmak öğrenmenin anahtarı.";

  // Counter tick: 0 → correct
  useEffect(() => {
    Animated.spring(scoreScale, {
      toValue: 1,
      stiffness: 240,
      damping: 14,
      delay: 300,
      useNativeDriver: true,
    }).start();

    const start = Date.now();
    const duration = 1500;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * correct));
      if (t < 1) requestAnimationFrame(tick);
    };
    const timeoutId = setTimeout(tick, 400);
    return () => clearTimeout(timeoutId);
  }, [correct, scoreScale]);

  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const timeStr = mins > 0 ? `${mins}d ${secs}s` : `${secs}s`;

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>
          {/* Perfect/Excellent — büyük başlık + glow + konfeti */}
          <PerfectScoreOverlay ratio={ratio} total={total} correct={correct} />

          {/* Hero */}
          <View style={s.hero}>
            <Animated.View
              style={[
                s.medalBox,
                {
                  backgroundColor: c.accentGlow,
                  borderColor: c.borderAccent,
                  shadowColor: c.accent,
                  transform: [{ scale: scoreScale }],
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.15)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.4 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
                pointerEvents="none"
              />
              <Icon d={medalIcon} size={40} stroke={c.accent} fill={isExcellent ? c.accent : "none"} sw={1.8} />
            </Animated.View>
            {isExcellent && (
              <View style={{ position: "absolute", top: -6, right: -6 }}>
                <LottieSuccess size={48} />
              </View>
            )}

            <Text style={s.scoreNum}>
              {displayScore}
              <Text style={s.scoreTotal}>/{total}</Text>
            </Text>
            <Text style={s.scoreCap}>doğru cevap</Text>

            <Text style={s.title}>{title}</Text>
            <Text style={s.subtitle}>{subtitle}</Text>
          </View>

          {/* Share kartı — viral kanal, accuracy yüksekse vurgulu */}
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              s.shareCard,
              {
                backgroundColor: isExcellent ? c.accent + "1F" : c.bgElevated,
                borderColor: isExcellent ? c.accent + "88" : c.border,
                shadowColor: isExcellent ? c.accent : "transparent",
                shadowOpacity: isExcellent ? 0.35 : 0,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
                elevation: isExcellent ? 5 : 0,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Icon
              d={ICONS.share || ICONS.arrow}
              size={20}
              stroke={isExcellent ? c.accent : c.textSec}
              sw={1.8}
            />
            <View style={{ flex: 1 }}>
              <Text style={[s.shareTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                {isExcellent ? "Bu skoru göster 🎉" : "Arkadaşlarına meydan oku"}
              </Text>
              <Text style={[s.shareSub, { color: c.textSec, fontFamily: c.fontBody }]}>
                {isExcellent
                  ? `%${accuracyPct} başarıyı paylaş — kim daha iyi?`
                  : "Bu listeyi arkadaşına gönder, beraber çalışın"}
              </Text>
            </View>
            <Icon d={ICONS.arrow} size={16} stroke={c.textMuted} sw={2} />
          </Pressable>

          {/* Mistakes saved info */}
          {mistakesAdded > 0 && (
            <View style={s.infoCard}>
              <View style={s.infoIcon}>
                <Icon d={ICONS.target} size={18} stroke={c.accent} sw={1.5} />
              </View>
              <Text style={s.infoTxt}>
                <Text style={{ fontFamily: c.fontBodyBold, color: c.textPrimary }}>
                  {mistakesAdded} kelime
                </Text>{" "}
                "Bilemediğin Kelimeler" listene eklendi. 3 kez doğru bilince
                otomatik çıkar.
              </Text>
            </View>
          )}

          {/* Stats row */}
          <View style={s.statsRow}>
            <StatPill
              icon="✓"
              value={correct}
              label="doğru"
              accent={c.success}
              c={c}
              s={s}
            />
            <StatPill
              icon="✗"
              value={total - correct}
              label="yanlış"
              accent={c.error}
              c={c}
              s={s}
            />
            <StatPill icon="⏱" value={timeStr} label="süre" accent={c.cobalt} c={c} s={s} />
            <StatPill
              icon="%"
              value={`${accuracyPct}`}
              label="başarı"
              accent={c.warning}
              c={c}
              s={s}
            />
          </View>

          {/* Correct words */}
          {correctWords.length > 0 && (
            <StaggerEnter index={0} delay={250}>
              <View style={s.sectionCard}>
                <View style={s.sectionHead}>
                  <View style={[s.sectionIcon, { backgroundColor: c.successDim }]}>
                    <Icon d={ICONS.check} size={14} stroke={c.success} sw={2.4} />
                  </View>
                  <Text style={s.sectionTitle}>Bunları biliyorsun</Text>
                  <Text style={s.sectionCount}>{correctWords.length}</Text>
                </View>
                <View style={{ marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {correctWords.slice(0, 20).map((w) => (
                    <View
                      key={w.id}
                      style={[
                        s.wordChip,
                        { backgroundColor: c.successDim, borderColor: c.success + "33" },
                      ]}
                    >
                      <Text style={[s.wordChipTxt, { color: c.success }]}>{w.word}</Text>
                    </View>
                  ))}
                  {correctWords.length > 20 && (
                    <Text style={[s.moreTxt, { color: c.textMuted }]}>
                      +{correctWords.length - 20} daha
                    </Text>
                  )}
                </View>
              </View>
            </StaggerEnter>
          )}

          {/* Wrong words */}
          {wrongWords.length > 0 && (
            <StaggerEnter index={1} delay={250}>
              <View style={s.sectionCard}>
                <View style={s.sectionHead}>
                  <View style={[s.sectionIcon, { backgroundColor: c.errorDim }]}>
                    <Icon d={ICONS.x} size={14} stroke={c.error} sw={2.4} />
                  </View>
                  <Text style={s.sectionTitle}>Şurada takıldın</Text>
                  <Text style={s.sectionCount}>{wrongWords.length}</Text>
                </View>
                <View style={{ marginTop: 12, gap: 8 }}>
                  {wrongWords.slice(0, 10).map((w) => (
                    <View
                      key={w.id}
                      style={[s.wrongRow, { backgroundColor: c.errorDim, borderColor: c.error + "22" }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[s.wrongWord, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                          {w.word}
                        </Text>
                        <Text style={[s.wrongMeaning, { color: c.textSec, fontFamily: c.fontBody }]}>
                          {w.meaning}
                        </Text>
                      </View>
                      {w.example && (
                        <Text
                          numberOfLines={2}
                          style={[
                            s.wrongExample,
                            { color: c.textMuted, fontFamily: c.fontDisplay },
                          ]}
                        >
                          "{w.example}"
                        </Text>
                      )}
                    </View>
                  ))}
                  {wrongWords.length > 10 && (
                    <Text style={[s.moreTxt, { color: c.textMuted, textAlign: "center" }]}>
                      +{wrongWords.length - 10} daha
                    </Text>
                  )}
                </View>
              </View>
            </StaggerEnter>
          )}

          {/* Save wrongs CTA */}
          {wrongWords.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <PremiumButton
                label={favorited ? "✓ Favorilere Eklendi" : "Bilemediklerimi Favorile"}
                variant={favorited ? "secondary" : "primary"}
                onPress={handleSaveWrongs}
                hapticStyle="medium"
                block
                size="lg"
                disabled={favorited}
              />
            </View>
          )}

          {/* CTAs */}
          <View style={s.ctaRow}>
            <PremiumButton
              label="Tekrar Dene"
              variant="secondary"
              onPress={onRetry}
              hapticStyle="medium"
              block
              size="lg"
            />
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
            count={150}
            origin={{ x: W / 2, y: -10 }}
            autoStart
            fadeOut
            explosionSpeed={350}
            colors={[c.accent, c.cobalt, c.warning, c.success]}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function StatPill({ icon, value, label, accent, c, s }) {
  return (
    <View style={[s.statPill, { borderTopColor: accent, borderTopWidth: 2 }]}>
      <Text style={[s.statIcon, { color: accent }]}>{icon}</Text>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    hero: { alignItems: "center", paddingVertical: 20 },
    medalBox: {
      width: 96,
      height: 96,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      overflow: "hidden",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 40,
      elevation: 12,
      marginBottom: 16,
    },
    medalEmoji: { fontSize: 52 },
    scoreNum: {
      fontFamily: c.fontNum,
      fontSize: 56,
      lineHeight: 60,
      color: c.textPrimary,
    },
    scoreTotal: { fontSize: 30, color: c.textMuted },
    scoreCap: { fontFamily: c.fontBody, fontSize: 13, color: c.textSec, marginTop: 2 },
    title: {
      fontFamily: c.fontDisplay,
      fontSize: 30,
      color: c.textPrimary,
      marginTop: 16,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: c.fontBody,
      fontSize: 14,
      color: c.textSec,
      marginTop: 6,
      textAlign: "center",
      maxWidth: 300,
      lineHeight: 20,
    },

    statsRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 20,
    },
    statPill: {
      flex: 1,
      backgroundColor: c.bgElevated,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 10,
      alignItems: "center",
    },
    statIcon: {
      fontFamily: c.fontBodyBold,
      fontSize: 14,
      marginBottom: 2,
    },
    statVal: { fontFamily: c.fontNum, fontSize: 18, color: c.textPrimary },
    statLbl: { fontFamily: c.fontBody, fontSize: 10, color: c.textSec, marginTop: 2 },

    sectionCard: {
      marginTop: 18,
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
    },
    sectionHead: { flexDirection: "row", alignItems: "center", gap: 10 },
    sectionIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      flex: 1,
      fontFamily: c.fontBodyBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    sectionCount: {
      fontFamily: c.fontNum,
      fontSize: 14,
      color: c.textSec,
    },
    wordChip: {
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    wordChipTxt: { fontFamily: c.fontBodySemi, fontSize: 13 },
    wrongRow: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
    },
    wrongWord: { fontSize: 15 },
    wrongMeaning: { fontSize: 12, marginTop: 2 },
    wrongExample: {
      fontSize: 11,
      maxWidth: 130,
      fontStyle: "italic",
      textAlign: "right",
      lineHeight: 16,
    },
    moreTxt: { fontFamily: c.fontBody, fontSize: 12, marginTop: 4 },

    ctaRow: { flexDirection: "row", gap: 12, marginTop: 16 },

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

    shareCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      marginTop: 14,
    },
    shareTitle: { fontSize: 14, marginBottom: 2 },
    shareSub: { fontSize: 12, lineHeight: 16 },
  });
}
