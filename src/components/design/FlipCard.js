/**
 * FlipCard — 3D Y-axis flip with proper touch handling.
 *
 * Touch architecture:
 *   - Both faces are pointerEvents="none" (purely visual)
 *   - Uncontrolled mode: outer Pressable catches all taps
 *   - Controlled mode: plain View wrapper lets parent PanResponder handle taps
 *   - Interactive overlay (bookmark + sound) floats above in box-none layer
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { useTheme } from "../../contexts/ThemeContext";
import BookmarkButton from "./BookmarkButton";
import WordCardMenu from "./WordCardMenu";
import Icon, { ICONS } from "./Icon";

const FLIP_DURATION = 600;
const GLINT_DURATION = 600;

export default function FlipCard({
  word,
  meaning,
  example,
  exampleTr,
  pron,
  tag,
  wordId,
  listId,
  onFlip: onFlipCb,
  flipped: flippedProp,
  onPress,
  onGraduate,
  onReport,
  disabled = false,
}) {
  const { c } = useTheme();
  const rot = useSharedValue(0);
  const glintFront = useSharedValue(0);
  const glintBack = useSharedValue(0);
  const flippedRef = useRef(false);
  const [showingBack, setShowingBack] = useState(false);
  const isControlled = flippedProp !== undefined;

  useEffect(() => {
    rot.value = 0;
    flippedRef.current = false;
    setShowingBack(false);
    glintFront.value = 0;
    glintBack.value = 0;
  }, [word]);

  const triggerGlint = useCallback((target) => {
    target.value = 0;
    target.value = withDelay(
      40,
      withTiming(1, { duration: GLINT_DURATION, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  useEffect(() => {
    if (!isControlled) return;
    flippedRef.current = !!flippedProp;
    setShowingBack(!!flippedProp);
    rot.value = withTiming(flippedProp ? 180 : 0, {
      duration: FLIP_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    triggerGlint(flippedProp ? glintBack : glintFront);
  }, [flippedProp]);

  const handleFlip = useCallback(() => {
    if (disabled) return;
    if (isControlled) { onPress?.(); return; }
    const next = !flippedRef.current;
    flippedRef.current = next;
    setShowingBack(next);
    rot.value = withTiming(next ? 180 : 0, {
      duration: FLIP_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    triggerGlint(next ? glintBack : glintFront);
    onFlipCb?.(next);
  }, [rot, glintFront, glintBack, triggerGlint, onFlipCb, isControlled, onPress, disabled]);

  const speak = useCallback(() => {
    if (!word) return;
    try {
      Speech.stop();
      Speech.speak(String(word), {
        language: "en-US",
        pitch: 1.0,
        rate: 0.92,
      });
    } catch (err) {
      // expo-speech bazen engine init'inde hata atar — sessizce yut
    }
  }, [word]);

  const s = useMemo(() => makeStyles(c), [c]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${rot.value}deg` }],
    opacity: rot.value > 90 ? 0 : 1,
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${rot.value - 180}deg` }],
    opacity: rot.value > 90 ? 1 : 0,
  }));
  const frontGlintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glintFront.value, [0, 0.38, 1], [0, 0.5, 0], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate(glintFront.value, [0, 1], [-400, 400], Extrapolation.CLAMP) }],
  }));
  const backGlintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glintBack.value, [0, 0.38, 1], [0, 0.5, 0], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate(glintBack.value, [0, 1], [-400, 400], Extrapolation.CLAMP) }],
  }));

  const content = (
    <>
      {/* FRONT — purely visual, pointerEvents="none" */}
      <Animated.View style={[s.face, { borderColor: c.borderAccent, shadowColor: c.accent }, frontStyle]} pointerEvents="none">
        <LinearGradient colors={[c.bgElevated, c.bgSurface]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
        {/* Premium gradient blob — accent → cobalt yumuşak geçiş */}
        <View style={[s.radial, { top: -40, left: -30, overflow: "hidden" }]}>
          <LinearGradient
            colors={[c.accent + "55", c.cobalt + "33", "transparent"]}
            start={{ x: 0.3, y: 0.2 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <Animated.View style={[s.glint, frontGlintStyle]} />
        <View style={s.topRow}>
          <View style={[s.chip, { borderColor: c.borderAccent, backgroundColor: c.accentGlow }]}>
            <Text style={[s.chipTxt, { color: c.accent }]}>İngilizce</Text>
          </View>
          <View style={{ width: 86 }} />
        </View>
        <View style={s.center}>
          <Text style={[s.word, { color: c.text }]}>{word}</Text>
          {!!(pron || tag) && (
            <Text style={[s.meta, { color: c.textMuted }]}>
              {[pron, tag].filter(Boolean).join(" · ")}
            </Text>
          )}
          {!!example && (
            <Text style={[s.exampleEn, { color: c.textSec, fontFamily: c.fontBody }]}>
              "{example}"
            </Text>
          )}
        </View>
        {/* Çevirme ipucu — alt köşe */}
        <View style={s.flipHint} pointerEvents="none">
          <Text style={[s.flipHintTxt, { color: c.textMuted, fontFamily: c.fontBody }]}>
            Anlamı görmek için dokun
          </Text>
        </View>
      </Animated.View>

      {/* BACK — purely visual, pointerEvents="none" */}
      <Animated.View style={[s.face, { borderColor: c.cobaltGlow, shadowColor: c.cobalt }, backStyle]} pointerEvents="none">
        <LinearGradient colors={[c.bgSurface, c.bgElevated]} start={{ x: 0.15, y: 1 }} end={{ x: 0.85, y: 0 }} style={StyleSheet.absoluteFill} />
        {/* Premium gradient blob — cobalt → accent geçiş */}
        <View style={[s.radial, { bottom: -40, right: -30, overflow: "hidden" }]}>
          <LinearGradient
            colors={[c.cobalt + "55", c.accent + "33", "transparent"]}
            start={{ x: 0.3, y: 0.2 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <Animated.View style={[s.glint, backGlintStyle]} />
        <View style={s.topRow}>
          <View style={[s.chip, { borderColor: "transparent", backgroundColor: c.cobaltDim }]}>
            <Text style={[s.chipTxt, { color: c.cobalt }]}>Türkçe</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>
        <View style={s.center}>
          <Text style={[s.meaningTxt, { color: c.text }]}>{meaning}</Text>
          {!!exampleTr && (
            <Text style={[s.exampleTr, { color: c.textSec, fontFamily: c.fontBody }]}>
              {exampleTr}
            </Text>
          )}
        </View>
        {/* Tekrar ipucu — alt köşe */}
        <View style={s.flipHint} pointerEvents="none">
          <Text style={[s.flipHintTxt, { color: c.textMuted, fontFamily: c.fontBody }]}>
            Tekrar görmek için dokun
          </Text>
        </View>
      </Animated.View>

      {/* Interactive overlay — bookmark + sound + menu, front face only */}
      {!showingBack && (
        <View style={s.overlay} pointerEvents="box-none">
          <BookmarkButton wordId={wordId} listId={listId} size={38} />
          <Pressable
            onPress={speak}
            hitSlop={10}
            style={[s.soundBtn, { borderColor: c.border, backgroundColor: c.bgSurface }]}
            accessibilityLabel="Telaffuzu dinle"
          >
            <Icon d={ICONS.sound} size={16} stroke={c.accent} sw={1.8} />
          </Pressable>
          {(onGraduate || onReport) && (
            <WordCardMenu size={38} onGraduate={onGraduate} onReport={onReport} />
          )}
        </View>
      )}
    </>
  );

  // Lift gesture — press anında kart hafif kalkıyor (elde tutuyorum hissi)
  const liftScale = useSharedValue(1);
  const liftShadow = useSharedValue(0);
  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ scale: liftScale.value }],
    shadowOpacity: 0.4 + liftShadow.value * 0.35,
    shadowRadius: 18 + liftShadow.value * 18,
  }));
  const onPressIn = () => {
    liftScale.value = withTiming(1.025, { duration: 140, easing: Easing.out(Easing.quad) });
    liftShadow.value = withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) });
  };
  const onPressOut = () => {
    liftScale.value = withTiming(1, { duration: 220, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    liftShadow.value = withTiming(0, { duration: 260, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  };

  // Controlled mode: plain View — parent PanResponder handles taps
  // Uncontrolled mode: Pressable — handles taps directly
  if (isControlled) {
    return (
      <Animated.View style={[s.stage, liftStyle, { shadowColor: c.accent }]} accessibilityLabel="Kartı çevir">
        {content}
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[s.stage, liftStyle, { shadowColor: c.accent }]}>
      <Pressable
        onPress={handleFlip}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{ width: "100%", height: "100%" }}
        accessibilityLabel="Kartı çevir"
      >
        {content}
      </Pressable>
    </Animated.View>
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
      top: 0, left: 0, right: 0, bottom: 0,
      borderRadius: 28,
      overflow: "hidden",
      padding: 22,
      borderWidth: 1,
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
      top: 0, bottom: 0, left: 0, right: 0,
      backgroundColor: "rgba(255,255,255,0.32)",
      transform: [{ translateX: -400 }],
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    overlay: {
      position: "absolute",
      top: 22,
      right: 22,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      zIndex: 10,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
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
    // Front kart — kelimenin altındaki EN cümle (Space Grotesk, okunaklı)
    exampleEn: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      maxWidth: 300,
      paddingHorizontal: 18,
      marginTop: 18,
      letterSpacing: 0.1,
    },
    // Back kart — meaning'in altındaki TR cümle (Space Grotesk)
    exampleTr: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      marginTop: 18,
      maxWidth: 300,
      paddingHorizontal: 18,
      letterSpacing: 0.1,
    },
    flipHint: {
      position: "absolute",
      bottom: 18,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    flipHintTxt: {
      fontSize: 11.5,
      letterSpacing: 0.5,
      opacity: 0.55,
    },
    hint: {
      fontFamily: c.fontBody,
      fontSize: 12,
      textAlign: "center",
      letterSpacing: 0.3,
    },
  });
}
