/**
 * OnboardingScreen — Claude Design v2 spec.
 * 3 ekran abstract illustration (network / stack / graph), display title, body, primary CTA + atla.
 */
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import AbstractIllustration from "../../components/design/AbstractIllustration";
import { activateRemindersWithPrompt } from "../../lib/notifications";

const LOTTIE_SOURCES = {
  network: require("../../assets/lottie/network.json"),
  stack: require("../../assets/lottie/stack.json"),
  graph: require("../../assets/lottie/graph.json"),
};

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    key: "network",
    kind: "network",
    title: "Akıllı Tekrar",
    body: "Beynin unutmaya başladığı an kelimeyi karşına çıkarıyoruz. Bilim destekli aralıklı tekrar.",
  },
  {
    key: "stack",
    kind: "stack",
    title: "Kendi Listeni Yarat",
    body: "Dilediğin kelimeleri ekle, kendi destelerini oluştur, istediğin gibi düzenle.",
  },
  {
    key: "graph",
    kind: "graph",
    title: "Seriyi Koru",
    body: "Her gün biraz çalış, serini büyüt. Küçük adımlar, kalıcı ilerleme.",
  },
  {
    key: "demo",
    kind: "demo",
    title: "Hadi dene",
    body: "Karta dokun, çevir, anlamını gör. İşte bu kadar basit.",
  },
];

const ONBOARDING_KEY = "@fc:onboardingSeen";

export async function hasSeenOnboarding() {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === "true";
  } catch {
    return false;
  }
}

/**
 * DemoFlashcard — mini interactive kart, onboarding son slide'ı.
 * Stüdyo card stilinde küçük, tek tap ile çevriliyor.
 * "ephemeral / kısa süreli" — Türk öğrencisi tanımıyor olabilir → AHA momenti.
 */
function DemoFlashcard({ c }) {
  const [flipped, setFlipped] = React.useState(false);
  const rot = React.useRef(new Animated.Value(0)).current;

  const flip = () => {
    Animated.timing(rot, {
      toValue: flipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
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
    <Pressable
      onPress={flip}
      style={{ width: 240, height: 280, alignSelf: "center" }}
      accessibilityLabel="Demo kartı çevir"
    >
      <Animated.View
        style={[{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: c.bgElevated,
          borderColor: c.accent + "66",
          borderWidth: 1.5,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          shadowColor: c.accent,
          shadowOpacity: 0.5,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        }, frontStyle]}
      >
        <Text style={{ fontFamily: c.fontDisplay, fontSize: 38, color: c.textPrimary, fontStyle: "italic" }}>
          ephemeral
        </Text>
        <Text style={{ fontFamily: c.fontBody, fontSize: 12, color: c.textSec, marginTop: 6 }}>
          sıfat
        </Text>
        <Text style={{ position: "absolute", bottom: 18, fontFamily: c.fontBody, fontSize: 11, color: c.textMuted, opacity: 0.65 }}>
          Dokunup çevir →
        </Text>
      </Animated.View>
      <Animated.View
        style={[{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: c.bgElevated,
          borderColor: c.cobalt + "66",
          borderWidth: 1.5,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          shadowColor: c.cobalt,
          shadowOpacity: 0.5,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        }, backStyle]}
      >
        <Text style={{ fontFamily: c.fontDisplay, fontSize: 30, color: c.textPrimary }}>
          kısa süreli
        </Text>
        <Text style={{ fontFamily: c.fontDisplay, fontSize: 12, color: c.textSec, marginTop: 8, fontStyle: "italic", textAlign: "center" }}>
          "Their happiness was ephemeral."
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export async function markOnboardingSeen() {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
}

export default function OnboardingScreen({ onFinish }) {
  const { c } = useTheme();
  const flatRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const finishWithReminders = () => {
    // Permission'ı 1. başarılı session sonrası StudyDoneState'te isteyeceğiz.
    // Burada Alert açmadan direkt onboarding'i kapat — kullanıcı önce değeri görmeli.
    markOnboardingSeen();
    onFinish();
  };

  const handleNext = () => {
    Haptics.selectionAsync();
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      finishWithReminders();
    }
  };

  const handleSkip = () => {
    Haptics.selectionAsync();
    markOnboardingSeen();
    onFinish();
  };

  const isLast = activeIndex === SLIDES.length - 1;

  const renderSlide = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [20, 0, 20],
      extrapolate: "clamp",
    });

    const lottieSrc = LOTTIE_SOURCES[item.kind];

    return (
      <View style={[styles.slide, { width }]}>
        <Animated.View style={{ opacity, transform: [{ scale }] }}>
          {item.kind === "demo" ? (
            <DemoFlashcard c={c} />
          ) : lottieSrc ? (
            <LottieView
              source={lottieSrc}
              autoPlay
              loop
              style={{ width: 260, height: 260 }}
              resizeMode="contain"
            />
          ) : (
            <AbstractIllustration kind={item.kind} size={220} />
          )}
        </Animated.View>
        <Animated.Text
          style={[
            styles.title,
            { color: c.textPrimary, fontFamily: c.fontDisplay, transform: [{ translateY }], opacity },
          ]}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.body,
            { color: c.textSec, fontFamily: c.fontBody, transform: [{ translateY }], opacity },
          ]}
        >
          {item.body}
        </Animated.Text>
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bgBase }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top dots */}
        <View style={styles.topBar}>
          <View style={{ width: 60 }} />
          <View style={styles.dots}>
            {SLIDES.map((_, i) => {
              const w = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [6, 26, 6],
                extrapolate: "clamp",
              });
              const bg = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [c.bgSurface, c.accent, c.bgSurface],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={i}
                  style={[styles.dot, { width: w, backgroundColor: bg }]}
                />
              );
            })}
          </View>
          {!isLast ? (
            <Pressable onPress={handleSkip} hitSlop={12} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: c.textSec, fontFamily: c.fontBodySemi }]}>
                Atla
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        <Animated.FlatList
          ref={flatRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(idx);
            Haptics.selectionAsync();
          }}
          scrollEventThrottle={16}
        />

        <View style={styles.bottom}>
          <Pressable
            onPress={handleNext}
            style={[styles.ctaBtn, { backgroundColor: c.accent, shadowColor: c.accent }]}
            accessibilityLabel={isLast ? "Başla" : "Devam"}
          >
            <Text style={[styles.ctaText, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
              {isLast ? "Başla →" : "Devam →"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  dots: { flexDirection: "row", gap: 7, alignItems: "center" },
  dot: { height: 6, borderRadius: 99 },
  skipBtn: { width: 60, alignItems: "flex-end" },
  skipText: { fontSize: 14 },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 30,
  },
  title: {
    fontSize: 40,
    lineHeight: 44,
    textAlign: "center",
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 290,
  },
  bottom: { paddingHorizontal: 22, paddingBottom: 24 },
  ctaBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaText: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
