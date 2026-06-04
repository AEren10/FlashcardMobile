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
import { enableReminders } from "../../lib/notifications";

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
];

const ONBOARDING_KEY = "@fc:onboardingSeen";

export async function hasSeenOnboarding() {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === "true";
  } catch {
    return false;
  }
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
    // SRS algoritması bildirimsiz değer kaybeder — kullanıcıya proactive sor
    Alert.alert(
      "Hatırlatıcı kuralım mı?",
      "Her gün 12:30 ve 20:00'da seni nazikçe hatırlatalım. Akıllı tekrar sistemi bildirimle çalışıyor.",
      [
        {
          text: "Hayır, şimdi olmasın",
          style: "cancel",
          onPress: () => {
            markOnboardingSeen();
            onFinish();
          },
        },
        {
          text: "Evet, kur",
          onPress: async () => {
            await enableReminders().catch(() => {});
            markOnboardingSeen();
            onFinish();
          },
        },
      ]
    );
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
          {lottieSrc ? (
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
