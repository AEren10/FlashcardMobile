import { radius, spacing } from "../../../themes/tokens";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";
import SpeakToast from "../../../components/design/SpeakToast";
import { speak } from "../../../lib/tts";

function WordRow({ item, index, c, tint, onSpeak, isSpeaking }) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [backH, setBackH] = useState(0);

  // Stagger entrance
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = Math.min(index * 60, 600);
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideX, { toValue: 0, duration: 350, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideX, index]);

  const handleFlip = useCallback(() => {
    Haptics.selectionAsync();
    const toValue = flipped ? 0 : 180;
    setFlipped((prev) => !prev);
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [flipped, flipAnim]);

  const handleSpeak = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSpeak(item.word);
  }, [item.word, onSpeak]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: ["0deg", "90deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: ["180deg", "270deg", "360deg"],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 89.9, 90],
    outputRange: [1, 1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 90.1, 180],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <Animated.View style={{ opacity: fadeIn, transform: [{ translateX: slideX }] }}>
      <Pressable onPress={handleFlip}>
        <View style={{ minHeight: flipped && backH > 0 ? backH : undefined }}>
          {/* Front — word card */}
          <Animated.View
            style={[
              s.row,
              {
                backgroundColor: c.bgElevated,
                borderColor: c.border,
                transform: [{ perspective: 800 }, { rotateX: frontRotate }],
                opacity: frontOpacity,
                backfaceVisibility: "hidden",
              },
            ]}
          >
            <Text style={[s.indexTxt, { color: c.textMuted, fontFamily: c.fontNum }]}>
              {index + 1}
            </Text>

            <View style={s.textCol}>
              <Text
                style={[s.word, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}
                numberOfLines={1}
              >
                {item.word}
              </Text>
              <Text
                style={[s.meaning, { color: c.textSec, fontFamily: c.fontBody }]}
                numberOfLines={2}
              >
                {item.meaning}
              </Text>
            </View>

            <Pressable
              onPress={handleSpeak}
              hitSlop={14}
              style={({ pressed }) => [
                s.speakerBtn,
                {
                  backgroundColor: isSpeaking ? tint + "28" : c.bgSurface,
                  borderColor: isSpeaking ? tint + "55" : c.border,
                  transform: [{ scale: pressed ? 0.88 : 1 }],
                },
              ]}
              accessibilityLabel={`${item.word} seslendir`}
            >
              <Icon d={ICONS.sound} size={18} stroke={isSpeaking ? tint : c.textSec} sw={1.8} />
            </Pressable>
          </Animated.View>

          {/* Back — example card */}
          <Animated.View
            onLayout={(e) => setBackH(e.nativeEvent.layout.height)}
            style={[
              s.row,
              s.backFace,
              {
                backgroundColor: tint + "0C",
                borderColor: tint + "30",
                transform: [{ perspective: 800 }, { rotateX: backRotate }],
                opacity: backOpacity,
                backfaceVisibility: "hidden",
              },
            ]}
          >
            <View style={s.backContent}>
              <View style={s.backHeader}>
                <View style={[s.exBadge, { backgroundColor: tint + "18" }]}>
                  <Text
                    style={[s.backLabel, { color: tint, fontFamily: c.fontBodySemi }]}
                  >
                    ÖRNEK
                  </Text>
                </View>
                <Icon d={ICONS.arrow} size={14} stroke={c.textMuted} sw={1.5} />
              </View>
              {item.example ? (
                <>
                  <Text style={[s.exampleTxt, { color: c.textPrimary, fontFamily: c.fontBody }]}>
                    {item.example}
                  </Text>
                  <Text style={[s.exampleTr, { color: c.textSec, fontFamily: c.fontBody }]}>
                    {item.example_tr}
                  </Text>
                </>
              ) : (
                <Text style={[s.noExample, { color: c.textMuted, fontFamily: c.fontBody }]}>
                  Örnek cümle bulunamadı.
                </Text>
              )}
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function WordListArea({ words, tint, listId }) {
  const { c } = useTheme();
  const accentColor = tint?.color || c.accent;
  const [speakingWord, setSpeakingWord] = useState(null);

  const handleSpeak = useCallback((word) => {
    setSpeakingWord(word);
    speak(word, {
      onDone: () => setSpeakingWord(null),
    });
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <WordRow
        item={item}
        index={index}
        c={c}
        tint={accentColor}
        onSpeak={handleSpeak}
        isSpeaking={speakingWord === item.word}
      />
    ),
    [c, accentColor, handleSpeak, speakingWord]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={12}
        windowSize={7}
        ListHeaderComponent={
          <View style={s.headerRow}>
            <Text style={[s.headerTxt, { color: c.textMuted, fontFamily: c.fontBodySemi }]}>
              {words.length} kelime
            </Text>
            <Text style={[s.hintTxt, { color: c.textMuted, fontFamily: c.fontBody }]}>
              Kartlara dokun → örnek cümle
            </Text>
          </View>
        }
      />
      <SpeakToast word={speakingWord || ""} visible={!!speakingWord} />
    </View>
  );
}

const s = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerTxt: {
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  hintTxt: {
    fontSize: 11,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  backFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "stretch",
  },
  backContent: {
    flex: 1,
    gap: spacing.sm,
  },
  backHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  backLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  exampleTxt: {
    fontSize: 14,
    lineHeight: 20,
  },
  exampleTr: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  noExample: {
    fontSize: 13,
    fontStyle: "italic",
  },
  indexTxt: {
    fontSize: 13,
    opacity: 0.4,
    width: 20,
    textAlign: "center",
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  word: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
  meaning: {
    fontSize: 13,
    lineHeight: 18,
  },
  speakerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
