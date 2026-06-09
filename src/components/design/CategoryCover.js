/**
 * CategoryCover — liste kartı gradient cover band + chip.
 * difficulty → gradient rengi (zorluk atmosferi)
 * cat → chip rengi (kategori kimliği) — dual color sistem
 */
import React from "react";
import { fontSize } from "../../themes/tokens";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CATEGORIES, getCategoryAccent, getCategoryName } from "../../lib/categoryMeta";
import { getDifficulty } from "../../themes/difficulty";

export default function CategoryCover({
  difficulty,
  cat = "other",
  imageUrl,
  height = 72,
  children,
  showLabel = true,
}) {
  const diff = difficulty ? getDifficulty(difficulty) : null;
  const catMeta = CATEGORIES[cat] || CATEGORIES.other;

  // Gradient: difficulty varsa zorluk renkleri, yoksa kategori
  const stops = diff ? diff.stops : catMeta.stops;

  // Chip: gerçek bir kategori atanmadıysa (other/null) chip'i difficulty etiketine düşür
  // — "Diğer Diğer Diğer" tekrarı UX kabusu, kullanıcının atadığı kategori varsa o gösterilir
  const isGenericCat = !cat || cat === "other";
  const chipLabel = isGenericCat ? (diff?.label || null) : catMeta.name;
  const chipAccent = isGenericCat ? (diff?.color || "#D4AE5E") : catMeta.accent;

  const [, , d] = stops;

  return (
    <View style={[s.wrap, { height }]}>
      {imageUrl ? (
        <>
          <Image
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {/* Image üstünde sade overlay — %CC (80%) çok parlıyordu, %66 (40%) yaptık.
              Chip okunaklı kalır, image rengi parlamadan baskın olmaz */}
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.18)", d + "66"]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : (
        <LinearGradient
          colors={stops}
          locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {!imageUrl && <View style={s.shine} pointerEvents="none" />}
      {showLabel && (
        <View style={s.chipWrap}>
          <View style={[s.chip, { borderColor: chipAccent + "AA", backgroundColor: chipAccent + "33" }]}>
            <View style={[s.dot, { backgroundColor: chipAccent }]} />
            <Text style={s.chipTxt}>{chipLabel}</Text>
          </View>
        </View>
      )}
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: "100%", overflow: "hidden" },
  shine: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "70%",
    height: "100%",
    opacity: 0.25,
  },
  chipWrap: {
    position: "absolute",
    bottom: 10,
    left: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chipTxt: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontFamily: "Inter",
  },
});
