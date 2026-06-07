/**
 * CategoryCover — liste kartı gradient cover band + chip.
 * `difficulty` (level) prop verilirse zorluk renklerini kullanır (tercih edilen).
 * Eski `cat` prop'u backward compat için kalmış.
 */
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CATS } from "../../themes/categories";
import { getDifficulty } from "../../themes/difficulty";

export default function CategoryCover({
  difficulty, // tercih edilen: "Beginner" | "Kolay" | "Orta" | "Zor" | "Ekstra" vs.
  cat = "other", // legacy fallback
  imageUrl, // Liste görseli (varsa) — fotoğraf + alt overlay olarak gösterilir
  height = 72,
  children,
  showLabel = true,
}) {
  // Önce difficulty kontrol et
  const diff = difficulty ? getDifficulty(difficulty) : null;
  let stops, label;

  if (diff) {
    stops = diff.stops;
    label = diff.label;
  } else {
    const conf = CATS[cat] || CATS.other;
    stops = conf.stops;
    label = conf.name;
  }

  const [a, b, d] = stops;

  return (
    <View style={[s.wrap, { height }]}>
      {imageUrl ? (
        <>
          <Image
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {/* Alt yarı için renkli gradient overlay → chip okunabilirliği + kategori rengi */}
          <LinearGradient
            colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.35)", d + "CC"]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : (
        <LinearGradient
          colors={[a, b, d]}
          locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {!imageUrl && <View style={s.shine} pointerEvents="none" />}
      {showLabel && (
        <View style={s.chipWrap}>
          <View style={s.chip}>
            <Text style={s.chipTxt}>{label}</Text>
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
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    // Cover gradient zaten koyu — chip kontrastını garantilemek için biraz daha vurgulu zemin
    backgroundColor: "rgba(0,0,0,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  chipTxt: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontFamily: "Inter",
  },
});
