/**
 * TasteDeck — Onboarding son slide: 5 etkileyici kelimelik mini deck.
 * Time-to-first-value: kullanıcı onboarding'i bitirmeden önce "vay be" anı yaşasın.
 *
 * UX: Kart üstünde İngilizce + sıfat tipi, tap → çevir → Türkçe + örnek cümle.
 * Sonraki butona bas → next kart. 5/5 tamamlandıysa onComplete tetiklenir + confetti.
 */
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import Icon, { ICONS } from "../../../components/design/Icon";
import { track, EVENTS } from "../../../lib/track";

const TASTE_WORDS = [
  { en: "serendipity", tr: "tatlı tesadüf", pos: "isim", ex: "Onunla tanışmam tam bir serendipity'di." },
  { en: "ephemeral", tr: "kısa süreli", pos: "sıfat", ex: "Mutluluğu ephemeral'di." },
  { en: "resilient", tr: "dirençli", pos: "sıfat", ex: "Çocuklar şaşırtıcı derecede resilient." },
  { en: "wanderlust", tr: "seyahat tutkusu", pos: "isim", ex: "Her bahar wanderlust beni sarar." },
  { en: "petrichor", tr: "yağmur sonrası kokusu", pos: "isim", ex: "Yağmurdan sonraki petrichor'a bayılırım." },
];

export default function TasteDeck({ c, onComplete }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const rot = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef(null);
  const w = TASTE_WORDS[Math.min(index, TASTE_WORDS.length - 1)];

  useEffect(() => {
    // İlk kart açıldığında track
    track("onboarding_taste_card_shown", { index: 0 });
  }, []);

  const flip = () => {
    Haptics.selectionAsync();
    Animated.timing(rot, {
      toValue: flipped ? 0 : 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
    setFlipped((f) => !f);
    if (!flipped) {
      track("onboarding_taste_card_flipped", { index, word: w.en });
    }
  };

  const next = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (index + 1 >= TASTE_WORDS.length) {
      setCompleted(true);
      confettiRef.current?.start();
      track("onboarding_taste_complete", { total: TASTE_WORDS.length });
      setTimeout(() => onComplete?.(), 900);
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
    rot.setValue(0);
    track("onboarding_taste_card_shown", { index: index + 1 });
  };

  const frontStyle = {
    transform: [{ perspective: 1000 }, { rotateY: rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }],
    backfaceVisibility: "hidden",
  };
  const backStyle = {
    transform: [{ perspective: 1000 }, { rotateY: rot.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] }) }],
    backfaceVisibility: "hidden",
  };

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      {/* Progress dots */}
      <View style={s.dots}>
        {TASTE_WORDS.map((_, i) => (
          <View
            key={i}
            style={[
              s.dot,
              {
                backgroundColor: i <= index ? c.accent : c.border,
                width: i === index ? 18 : 6,
              },
            ]}
          />
        ))}
      </View>

      <Pressable onPress={flip} style={s.card} accessibilityLabel={`${w.en} kart`}>
        <Animated.View style={[s.face, frontStyle, { backgroundColor: c.bgElevated, borderColor: c.accent + "66", shadowColor: c.accent }]}>
          <Text style={[s.word, { color: c.textPrimary, fontFamily: c.fontDisplay }]} adjustsFontSizeToFit numberOfLines={1}>
            {w.en}
          </Text>
          <Text style={[s.pos, { color: c.textSec, fontFamily: c.fontBody }]}>{w.pos}</Text>
          <Text style={[s.hint, { color: c.textMuted, fontFamily: c.fontBody }]}>Dokunup çevir →</Text>
        </Animated.View>
        <Animated.View style={[s.face, backStyle, { backgroundColor: c.bgElevated, borderColor: c.cobalt + "66", shadowColor: c.cobalt }]}>
          <Text style={[s.meaning, { color: c.textPrimary, fontFamily: c.fontDisplay }]} adjustsFontSizeToFit numberOfLines={2}>
            {w.tr}
          </Text>
          <Text style={[s.ex, { color: c.textSec, fontFamily: c.fontBody }]} numberOfLines={2}>
            "{w.ex}"
          </Text>
        </Animated.View>
      </Pressable>

      <Pressable onPress={next} style={({ pressed }) => [s.nextBtn, { backgroundColor: c.accent, opacity: pressed ? 0.85 : 1, shadowColor: c.accent }]}>
        <Text style={[s.nextTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
          {index + 1 >= TASTE_WORDS.length ? "Bitir 🎉" : "Sonraki"}
        </Text>
        <Icon d={ICONS.arrow} size={16} stroke={c.textOnAccent} sw={2.2} />
      </Pressable>

      {completed && (
        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: 0, y: 0 }}
          autoStart={false}
          fadeOut
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  dots: { flexDirection: "row", gap: 6, marginBottom: 18, alignItems: "center", justifyContent: "center" },
  dot: { height: 6, borderRadius: 3 },
  card: { width: 260, height: 280, alignSelf: "center" },
  face: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  word: { fontSize: 36, fontStyle: "italic", textAlign: "center" },
  pos: { fontSize: 12, marginTop: 6, letterSpacing: 0.3 },
  hint: { position: "absolute", bottom: 18, fontSize: 11, opacity: 0.7 },
  meaning: { fontSize: 24, textAlign: "center", fontStyle: "italic" },
  ex: { fontSize: 12, marginTop: 12, textAlign: "center", fontStyle: "italic", opacity: 0.9 },
  nextBtn: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  nextTxt: { fontSize: 15, letterSpacing: 0.3 },
});
