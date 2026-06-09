/**
 * LectioScreen — "Sadece Okuma" modu.
 * Kelime + EN cümle büyük gösterilir. TR çevirisi default gizli.
 * Sağa swipe veya butona basınca TR overlay yandan kayarak açılır.
 * Sonraki kelimeye geçmek için aşağı swipe veya "Sonraki" butonu.
 *
 * route.params: { listId, listTitle }
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { speak as ttsSpeak } from "../../lib/tts";
import * as Haptics from "expo-haptics";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import Icon, { ICONS } from "../../components/design/Icon";
import { fetchListWords } from "../../lib/cachedApi";

const LECTIO_HINT_KEY = "@fc:lectio:hintShown";
const BACK_ARROW = "M19 12H5m6 6-6-6 6-6"; // ICONS.arrowLeft yok — inline path

const { width: W, height: H } = Dimensions.get("window");

export default function LectioScreen({ route }) {
  const navigation = useNavigation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(c, insets), [c, insets]);
  const toast = useToast();
  const { listId, listTitle } = route?.params || {};

  // TabBar'ı tamamen sakla — okuma deneyimi full-screen olsun.
  // 2 kademe getParent (Lectio → HomeStack → TabNavigator).
  // Yine de bottomBar safe area + tab bar height kadar padding alıyor (style'da insets.bottom + 100).
  useLayoutEffect(() => {
    const tab = navigation.getParent()?.getParent() || navigation.getParent();
    tab?.setOptions?.({ tabBarStyle: { display: "none" } });
    return () => tab?.setOptions?.({ tabBarStyle: undefined });
  }, [navigation]);

  const [words, setWords] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trVisible, setTrVisible] = useState(false);

  // TR overlay slide animasyonu
  const trX = useRef(new Animated.Value(W)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = [];
      await fetchListWords(listId, (data) => {
        if (Array.isArray(data) && data.length) list.push(...data);
      });
      if (cancelled) return;
      setWords(list);
      setLoading(false);

      // İlk açılışta TR çevirisi nasıl açılır hint'i — bir kez göster
      try {
        const shown = await AsyncStorage.getItem(LECTIO_HINT_KEY);
        if (!shown) {
          setTimeout(() => {
            toast?.show?.({
              message: "💡 Türkçe çeviri için alttaki butona dokun",
              type: "info",
              duration: 4000,
            });
          }, 600);
          AsyncStorage.setItem(LECTIO_HINT_KEY, "1").catch(() => {});
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [listId, toast]);

  // Yeni kelime gelince kart fade-in
  useEffect(() => {
    cardFade.setValue(0);
    Animated.timing(cardFade, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [idx, cardFade]);

  const current = words[idx];

  const showTR = useCallback(() => {
    if (trVisible || !current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTrVisible(true);
    Animated.spring(trX, {
      toValue: 0,
      useNativeDriver: true,
      stiffness: 140,
      damping: 18,
    }).start();
  }, [current, trVisible, trX]);

  const hideTR = useCallback(() => {
    if (!trVisible) return;
    Animated.timing(trX, {
      toValue: W,
      duration: 280,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setTrVisible(false));
  }, [trVisible, trX]);

  const next = useCallback(() => {
    if (idx + 1 >= words.length) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
      return;
    }
    Haptics.selectionAsync();
    hideTR();
    setIdx((i) => i + 1);
  }, [idx, words.length, navigation, hideTR]);

  const prev = useCallback(() => {
    if (idx === 0) return;
    Haptics.selectionAsync();
    hideTR();
    setIdx((i) => i - 1);
  }, [idx, hideTR]);

  const speakWord = useCallback(() => {
    if (!current?.word) return;
    Haptics.selectionAsync();
    ttsSpeak(String(current.word));
  }, [current]);

  // Gesture: sağa swipe → TR aç, sola swipe → kapa, yukarı swipe → sonraki
  const swipe = Gesture.Pan()
    .onEnd((e) => {
      "worklet";
      const { translationX, translationY } = e;
      if (Math.abs(translationY) > Math.abs(translationX)) {
        if (translationY < -60) {
          // yukarı → next
          // worklet'ten JS callback için scheduleOnJS gerek — basit setIdx için arada bir hack
        }
      } else {
        if (translationX < -60) {
          // sol → tr aç (intuitive: sağdan sola çekiyorsun)
        } else if (translationX > 60) {
          // sağ → tr kapa
        }
      }
    });

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <ActivityIndicator color={c.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!current) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.empty}>Bu listede kelime yok</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (idx + 1) / words.length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.iconBtn}>
            <Icon d={BACK_ARROW} size={20} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {listTitle || "Lectio"}
          </Text>
          <Text style={styles.counter}>
            {idx + 1}/{words.length}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: c.accent }]} />
        </View>

        {/* Kart alanı — EN ve TR aynı boyut+konum, sadece içerik değişir.
            TR overlay artık card'a absolute fill, sağdan kayar. */}
        <View style={styles.cardArea}>
          <Animated.View style={[styles.card, { opacity: cardFade }]}>
            <Pressable onPress={speakWord} hitSlop={8}>
              <Text style={styles.word}>{current.word}</Text>
            </Pressable>

            {!!current.example && (
              <Text style={styles.example}>"{current.example}"</Text>
            )}

            {/* Dinle butonu — kullanıcı "app beni mi duyuyor?" düşünmesin,
                "Dinle" labelı net açıklar (TTS, mikrofon değil) */}
            <Pressable onPress={speakWord} style={styles.speakerCircle} accessibilityLabel="Kelimeyi dinle">
              <Icon d={ICONS.sound} size={16} stroke={c.cobalt} sw={2.2} />
              <Text style={styles.speakerLbl}>Dinle</Text>
            </Pressable>

            {/* TR Overlay — card'ın TAM içine, sağdan kayar */}
            {trVisible && (
              <Animated.View
                style={[
                  styles.trOverlay,
                  { transform: [{ translateX: trX }] },
                ]}
              >
                <Pressable style={styles.trClose} onPress={hideTR} hitSlop={10}>
                  <Icon d={ICONS.x} size={18} stroke={c.textPrimary} sw={2} />
                </Pressable>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.trLabel}>TÜRKÇE</Text>
                  <Text style={styles.trMeaning}>{current.meaning}</Text>
                  {!!current.example_tr && (
                    <Text style={styles.trExample}>"{current.example_tr}"</Text>
                  )}
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {/* Bottom CTAs */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={prev}
            disabled={idx === 0}
            style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
            hitSlop={8}
          >
            <Icon d={BACK_ARROW} size={20} stroke={idx === 0 ? c.textMuted : c.textPrimary} sw={2.2} />
          </Pressable>

          <Pressable
            onPress={trVisible ? hideTR : showTR}
            style={[styles.trCta, { backgroundColor: trVisible ? c.bgSurface : c.cobalt + "22", borderColor: c.cobalt + "55" }]}
          >
            <Text style={[styles.trCtaTxt, { color: c.cobalt }]}>
              {trVisible ? "Türkçeyi gizle" : "Türkçeyi göster"}
            </Text>
          </Pressable>

          <Pressable onPress={next} style={[styles.navBtn, { backgroundColor: c.accent }]} hitSlop={8}>
            <Icon
              d={idx + 1 >= words.length ? ICONS.check : "M9 6l6 6-6 6"}
              size={20}
              stroke={c.textOnAccent}
              sw={2.4}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function makeStyles(c, insets = { top: 0, bottom: 0 }) {
  // TabBar useLayoutEffect ile gizlenmeye çalışılıyor ama nested navigator hierarchy'de
  // çağrı tabNavigator'a ulaşmıyor olabilir — bottomBar her halükarda tab bar + safe area
  // kadar padding alıyor ki butonlar arkada kalmasın.
  const tabBarFallback = 90;
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 10,
      gap: spacing.md,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bgSurface,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 15,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    counter: { fontSize: 12, color: c.textMuted, fontFamily: c.fontBodySemi, minWidth: 40, textAlign: "right" },
    progressTrack: {
      height: 3,
      marginHorizontal: 18,
      backgroundColor: c.bgSurface,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: { height: "100%", borderRadius: 2 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: { color: c.textSec, fontFamily: c.fontBody },
    cardArea: { flex: 1, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, justifyContent: "center", position: "relative", overflow: "hidden" },
    card: {
      backgroundColor: c.bgElevated,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.xxxl,
      alignItems: "center",
      minHeight: 380,
      maxHeight: 480,
      justifyContent: "center",
      gap: 18,
      overflow: "hidden", // TR overlay card içinde kalsın
    },
    word: {
      fontFamily: c.fontDisplay,
      fontSize: 44,
      color: c.textPrimary,
      textAlign: "center",
      lineHeight: 50,
    },
    example: {
      fontFamily: c.fontBody,
      fontSize: 16,
      lineHeight: 24,
      color: c.textSec,
      textAlign: "center",
      maxWidth: 320,
    },
    speakerCircle: {
      marginTop: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: 14,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: c.cobalt + "1A",
      borderWidth: 1,
      borderColor: c.cobalt + "55",
    },
    speakerLbl: {
      fontFamily: c.fontBodyBold,
      fontSize: 12,
      color: c.cobalt,
      letterSpacing: 0.3,
    },
    trOverlay: {
      // Card'ın TAM içine — aynı boyut, aynı pozisyon
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.bgElevated,
      borderRadius: 24,
      padding: spacing.xxxl,
      paddingTop: 56,
    },
    trClose: {
      position: "absolute",
      top: 16,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bgElevated,
    },
    trLabel: {
      fontSize: 10,
      letterSpacing: 1.6,
      color: c.cobalt,
      fontFamily: c.fontBodyBold,
      marginBottom: 10,
    },
    trMeaning: {
      fontFamily: c.fontDisplay,
      fontSize: 32,
      color: c.textPrimary,
      lineHeight: 38,
      marginBottom: 14,
    },
    trExample: {
      fontFamily: c.fontBody,
      fontSize: 15,
      lineHeight: 22,
      color: c.textSec,
    },
    bottomBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: 18,
      paddingTop: 14,
      // TabBar bazen gizlenmiyor (nested navigator) → safe area + tab bar yüksekliği
      paddingBottom: Math.max(insets.bottom, 8) + tabBarFallback,
      backgroundColor: c.bgBase,
    },
    navBtn: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
    },
    navBtnDisabled: { opacity: 0.4 },
    trCta: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: radius.md,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    trCtaTxt: { fontSize: 14, fontFamily: c.fontBodyBold, letterSpacing: 0.3 },
  });
}
