/**
 * RandomReviewModal — "Bildiklerinden Tekrar" feature.
 *
 * Kullanıcı bildiği (repetitions>=2) kelimelerden rastgele N tane seçer ve
 * StudyScreen'i preset words ile açar — unutkanlığı önleyen taze tekrar.
 *
 * UX:
 *   - Modal açıldığında 3 seçenek: 5 / 10 / 20 kelime
 *   - Her seçenek için "X kelime biliyorsun" göstergesi
 *   - Tap → StudyScreen(presetWords: [...random], presetMode: "review")
 *   - Şu an known word count düşükse modal "henüz yeterli kelime yok, devam et" mesajı
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { getRandomKnownWords, getKnownWordsCount } from "../../supabase/progress";
import Icon, { ICONS } from "./Icon";
import PressableScale from "./PressableScale";

const OPTIONS = [
  { count: 5, label: "Hızlı tekrar", subtitle: "5 kelime · ~2 dk" },
  { count: 10, label: "Standart", subtitle: "10 kelime · ~5 dk" },
  { count: 20, label: "Derin tekrar", subtitle: "20 kelime · ~10 dk" },
];

export default function RandomReviewModal({ visible, onClose, navigation }) {
  const { c } = useTheme();
  const [knownCount, setKnownCount] = useState(null);
  const [loadingPick, setLoadingPick] = useState(null); // hangi count yükleniyor
  const slide = useRef(new Animated.Value(0)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: visible ? 1 : 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, slide, backdrop]);

  useEffect(() => {
    if (!visible) return;
    setKnownCount(null);
    getKnownWordsCount().then(setKnownCount).catch(() => setKnownCount(0));
  }, [visible]);

  const handlePick = async (count) => {
    if (loadingPick) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoadingPick(count);
    try {
      const words = await getRandomKnownWords(count);
      if (!words?.length) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setLoadingPick(null);
        return;
      }
      onClose?.();
      // Hafif gecikme — modal kapanma animasyonu görünsün
      setTimeout(() => {
        navigation.navigate("Study", {
          listId: null,
          listTitle: `${words.length} Rastgele Tekrar`,
          presetWords: words,
          presetMode: "review",
        });
        setLoadingPick(null);
      }, 280);
    } catch (err) {
      console.warn("RandomReviewModal pick error", err);
      setLoadingPick(null);
    }
  };

  // Hiç bilinen kelime yoksa hepsi disabled. Az varsa sadece o option disabled
  // ama mesaj informational olur, kullanıcıyı durdurmaz.
  const noneKnown = knownCount !== null && knownCount === 0;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.65)", opacity: backdrop }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          s.sheet,
          {
            backgroundColor: c.bgElevated,
            borderColor: c.border,
            transform: [
              { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [480, 0] }) },
            ],
          },
        ]}
      >
        {/* Top edge highlight */}
        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
          style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
          pointerEvents="none"
        />

        <View style={[s.handle, { backgroundColor: c.textMuted }]} />

        {/* Header */}
        <View style={s.headRow}>
          <View style={[s.iconBox, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
            <Icon d={ICONS.target} size={22} stroke={c.accent} sw={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
              Rastgele Tekrar
            </Text>
            <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
              {knownCount === null
                ? "Kelime sayın hesaplanıyor…"
                : noneKnown
                  ? "Henüz öğrendiğin kelime yok — bir liste aç ve başla."
                  : `${knownCount} öğrendiğin kelimeden rastgele seçilecek.`}
            </Text>
          </View>
        </View>

        {/* Options */}
        <View style={{ marginTop: 18 }}>
          {OPTIONS.map((opt) => {
            // Sadece o seçenek için yeterli kelime yoksa disabled, modal genel kullanılabilir
            const disabled = noneKnown || (knownCount !== null && knownCount < opt.count);
            const loadingThis = loadingPick === opt.count;
            return (
              <PressableScale
                key={opt.count}
                onPress={() => !disabled && handlePick(opt.count)}
                scaleDown={0.97}
                style={[
                  s.option,
                  {
                    borderColor: disabled ? c.border : c.borderAccent,
                    backgroundColor: disabled ? c.bgSurface : c.bgElevated,
                    opacity: disabled ? 0.5 : 1,
                  },
                ]}
                accessibilityLabel={opt.label}
              >
                <LinearGradient
                  colors={
                    disabled
                      ? ["transparent", "transparent"]
                      : [c.accentGlow, "transparent"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[s.countBox, { backgroundColor: disabled ? c.bgBase : c.accent }]}>
                  <Text
                    style={[
                      s.countTxt,
                      {
                        color: disabled ? c.textMuted : c.textOnAccent,
                        fontFamily: c.fontNum,
                      },
                    ]}
                  >
                    {opt.count}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.optionTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                    {opt.label}
                  </Text>
                  <Text style={[s.optionSub, { color: c.textSec, fontFamily: c.fontBody }]}>
                    {opt.subtitle}
                  </Text>
                </View>
                {loadingThis ? (
                  <ActivityIndicator color={c.accent} size="small" />
                ) : (
                  <Icon
                    d={ICONS.arrow}
                    size={16}
                    stroke={disabled ? c.textMuted : c.accent}
                    sw={2}
                  />
                )}
              </PressableScale>
            );
          })}
        </View>

        <Pressable onPress={onClose} style={s.cancelBtn}>
          <Text style={[s.cancelTxt, { color: c.textSec, fontFamily: c.fontBodySemi }]}>
            İptal
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
    opacity: 0.4,
  },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
  },
  sub: {
    fontSize: 12,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  countBox: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  countTxt: {
    fontSize: 19,
  },
  optionTitle: {
    fontSize: 15,
  },
  optionSub: {
    fontSize: 11,
    marginTop: 2,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 6,
  },
  cancelTxt: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
