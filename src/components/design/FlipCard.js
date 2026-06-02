/**
 * FlipCard — Claude Design v2 spec implementation.
 * Gerçek 3D Y-axis rotation, glint sweep, front=lime/back=cobalt aksanı,
 * Instrument Serif display, IPA + tag, sound TTS.
 */
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { useTheme } from "../../contexts/ThemeContext";
import BookmarkButton from "./BookmarkButton";

const FLIP_DURATION = 600;
const GLINT_DURATION = 600;

export default function FlipCard({
  word,
  meaning,
  example,
  pron,
  tag = "sıfat",
  wordId,
  listId,
  onFlip: onFlipCb,
  flipped: flippedProp,
  onPress,
  disabled = false,
}) {
  const { c } = useTheme();
  const rot = useSharedValue(0);
  const glintFront = useSharedValue(0);
  const glintBack = useSharedValue(0);
  const flipped = useRef(false);
  const isControlled = flippedProp !== undefined;

  // Yeni kelimede sıfırla
  useEffect(() => {
    rot.value = 0;
    flipped.current = false;
    glintFront.value = 0;
    glintBack.value = 0;
  }, [word, rot, glintFront, glintBack]);

  const triggerGlint = useCallback((target) => {
    target.value = 0;
    target.value = withDelay(
      40,
      withTiming(1, { duration: GLINT_DURATION, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  // Controlled mode: parent flippedProp gönderdiğinde rotasyon o yöne gider
  useEffect(() => {
    if (!isControlled) return;
    flipped.current = !!flippedProp;
    rot.value = withTiming(flippedProp ? 180 : 0, {
      duration: FLIP_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    triggerGlint(flippedProp ? glintBack : glintFront);
  }, [flippedProp, isControlled, rot, glintFront, glintBack, triggerGlint]);

  const handleFlip = useCallback(() => {
    if (disabled) return;
    if (isControlled) {
      onPress?.();
      return;
    }
    const next = !flipped.current;
    flipped.current = next;
    rot.value = withTiming(next ? 180 : 0, {
      duration: FLIP_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    triggerGlint(next ? glintBack : glintFront);
    onFlipCb?.(next);
  }, [rot, glintFront, glintBack, triggerGlint, onFlipCb, isControlled, onPress, disabled]);

  // Front face: 0→90 görünür, 90→180 kaybolur. Rotation: 0..180.
  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${rot.value}deg` }],
    opacity: rot.value > 90 ? 0 : 1,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${rot.value - 180}deg` }],
    opacity: rot.value > 90 ? 1 : 0,
  }));

  // Glint sweeps across card. Approximate card width ~340px → range -400..400.
  const frontGlintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      glintFront.value,
      [0, 0.38, 1],
      [0, 0.5, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateX: interpolate(
          glintFront.value,
          [0, 1],
          [-400, 400],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const backGlintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      glintBack.value,
      [0, 0.38, 1],
      [0, 0.5, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateX: interpolate(
          glintBack.value,
          [0, 1],
          [-400, 400],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const speak = useCallback(
    (e) => {
      e.stopPropagation?.();
      Speech.speak(word, { language: "en-US" });
    },
    [word]
  );

  const s = useMemo(() => makeStyles(c), [c]);

  return (
    <Pressable onPress={handleFlip} style={s.stage} accessibilityLabel="Kartı çevir">
      {/* FRONT */}
      <Animated.View style={[s.face, frontStyle]} pointerEvents="box-none">
        <LinearGradient
          colors={[c.bgElevated, c.bgSurface]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[s.radial, { backgroundColor: c.accentGlow, top: -40, left: -30 }]} pointerEvents="none" />
        <Animated.View style={[s.glint, frontGlintStyle]} pointerEvents="none" />

        <View style={s.topRow}>
          <View style={[s.chip, s.chipAccent, { borderColor: c.borderAccent, backgroundColor: c.accentGlow }]}>
            <Text style={[s.chipTxt, { color: c.accent }]}>İngilizce</Text>
          </View>
          <View style={s.topActions}>
            <BookmarkButton wordId={wordId} listId={listId} size={38} />
            <Pressable onPress={speak} hitSlop={10} style={[s.soundBtn, { borderColor: c.border, backgroundColor: c.bgSurface }]} accessibilityLabel="Telaffuzu dinle">
              <Text style={[s.soundIcon, { color: c.accent }]}>🔊</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.center}>
          <Text style={[s.word, { color: c.text }]}>{word}</Text>
          <Text style={[s.meta, { color: c.textMuted }]}>
            {pron ? `${pron} · ` : ""}{tag}
          </Text>
        </View>

        <Text style={[s.hint, { color: c.textMuted }]}>Anlamı görmek için dokun</Text>
      </Animated.View>

      {/* BACK */}
      <Animated.View style={[s.face, backStyle]} pointerEvents="box-none">
        <LinearGradient
          colors={[c.bgSurface, c.bgElevated]}
          start={{ x: 0.15, y: 1 }}
          end={{ x: 0.85, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[s.radial, { backgroundColor: c.cobaltGlow, bottom: -40, right: -30 }]} pointerEvents="none" />
        <Animated.View style={[s.glint, backGlintStyle]} pointerEvents="none" />

        <View style={s.topRow}>
          <View style={[s.chip, { borderColor: "transparent", backgroundColor: c.cobaltDim }]}>
            <Text style={[s.chipTxt, { color: c.cobalt }]}>Türkçe</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <View style={s.center}>
          <Text style={[s.meaningTxt, { color: c.text }]}>{meaning}</Text>
          {!!example && (
            <Text style={[s.example, { color: c.textSec }]}>“{example}”</Text>
          )}
        </View>

        <Text style={[s.hint, { color: c.textMuted }]}>Tekrar görmek için dokun</Text>
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    stage: {
      width: "100%",
      aspectRatio: 0.72,
      maxHeight: 430,
      alignSelf: "center",
    },
    face: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
      overflow: "hidden",
      padding: 22,
      borderWidth: 1,
      borderColor: c.borderAccent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 40,
      elevation: 12,
    },
    radial: {
      position: "absolute",
      width: 280,
      height: 220,
      borderRadius: 200,
      opacity: 0.8,
    },
    glint: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(255,255,255,0.32)",
      transform: [{ translateX: -400 }],
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    topActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    chipAccent: {},
    chipTxt: {
      fontFamily: c.fontBodySemi,
      fontSize: 12,
      letterSpacing: 0.3,
    },
    soundBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    soundIcon: { fontSize: 16 },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    word: {
      fontFamily: c.fontDisplay,
      fontSize: 52,
      lineHeight: 56,
      textAlign: "center",
    },
    meta: {
      fontFamily: c.fontBody,
      fontSize: 14,
      letterSpacing: 0.2,
    },
    meaningTxt: {
      fontFamily: c.fontDisplay,
      fontSize: 46,
      lineHeight: 50,
      textAlign: "center",
    },
    example: {
      fontFamily: c.fontDisplay,
      fontStyle: "italic",
      fontSize: 19,
      lineHeight: 26,
      textAlign: "center",
      maxWidth: 260,
      paddingHorizontal: 16,
    },
    hint: {
      fontFamily: c.fontBody,
      fontSize: 12,
      textAlign: "center",
      letterSpacing: 0.3,
    },
  });
}
