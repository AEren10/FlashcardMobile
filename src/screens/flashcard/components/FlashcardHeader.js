/**
 * FlashcardHeader — başlık + sahip/ziyaretçi action butonları (paylaş, düzenle, sil, favori).
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import T from "../../../themes/tokens";

export default function FlashcardHeader({
  title,
  tint,
  onBack,
  onShare,
  isOwner,
  onEdit,
  onDelete,
  canFavorite,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack} style={s.iconBtn} hitSlop={12} accessibilityLabel="Geri dön">
        <Svg width={10} height={16} viewBox="0 0 8 14">
          <Path
            d="M7 1L1 7l6 6"
            stroke={T.text}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={s.title} numberOfLines={1}>
          {title}
        </Text>
        {tint && (
          <View
            style={{
              marginTop: 2,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 999,
              backgroundColor: tint.glow,
              borderWidth: 1,
              borderColor: tint.border,
            }}
          >
            <Text
              style={{
                fontFamily: T.fontBodySemi,
                fontSize: 10,
                color: tint.color,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {tint.label}
            </Text>
          </View>
        )}
      </View>

      <View style={s.actions}>
        <Pressable onPress={onShare} hitSlop={8} accessibilityLabel="Listeyi paylaş" style={s.iconBtn}>
          <Text style={s.icon}>📤</Text>
        </Pressable>

        {isOwner ? (
          <>
            <Pressable onPress={onEdit} hitSlop={8} accessibilityLabel="Listeyi düzenle" style={s.iconBtn}>
              <Text style={s.icon}>✏️</Text>
            </Pressable>
            <Pressable onPress={onDelete} hitSlop={8} accessibilityLabel="Listeyi sil" style={s.deleteBtn}>
              <Text style={s.icon}>🗑️</Text>
            </Pressable>
          </>
        ) : (
          canFavorite && (
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={8}
              accessibilityLabel={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              style={s.iconBtn}
            >
              <Text style={s.icon}>{isFavorite ? "❤️" : "🤍"}</Text>
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 14,
    gap: 12,
  },
  title: {
    fontSize: 18,
    color: T.text,
    fontFamily: T.fontBodyBold,
    textAlign: "center",
  },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: T.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: T.border,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: T.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,99,99,0.2)",
  },
  icon: { fontSize: 16 },
});
