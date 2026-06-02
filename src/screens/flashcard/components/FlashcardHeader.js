/**
 * FlashcardHeader — başlık + sahip/ziyaretçi action butonları (paylaş, düzenle, sil, favori).
 * Tema-aware (useTheme).
 */
import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";

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
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={s.header}>
      <Pressable onPress={onBack} style={s.iconBtn} hitSlop={12} accessibilityLabel="Geri dön">
        <Icon d="M15 6l-6 6 6 6" size={18} stroke={c.textPrimary} sw={2.2} />
      </Pressable>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={s.title} numberOfLines={1}>
          {title}
        </Text>
        {tint && (
          <View
            style={[
              s.tintChip,
              { backgroundColor: tint.glow, borderColor: tint.border },
            ]}
          >
            <Text
              style={[
                s.tintTxt,
                { color: tint.color, fontFamily: c.fontBodySemi },
              ]}
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
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              accessibilityLabel="Listeyi sil"
              style={[s.iconBtn, { borderColor: c.error + "33" }]}
            >
              <Text style={s.icon}>🗑️</Text>
            </Pressable>
          </>
        ) : (
          canFavorite && (
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={8}
              accessibilityLabel={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              style={[
                s.iconBtn,
                isFavorite && {
                  backgroundColor: c.warningDim,
                  borderColor: c.warning + "55",
                },
              ]}
            >
              <Icon
                d={ICONS.star}
                size={18}
                stroke={isFavorite ? c.warning : c.textMuted}
                fill={isFavorite ? c.warning : "none"}
                sw={1.8}
              />
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 22,
      paddingTop: 14,
      gap: 12,
    },
    title: {
      fontSize: 18,
      color: c.textPrimary,
      fontFamily: c.fontBodyBold,
      textAlign: "center",
    },
    tintChip: {
      marginTop: 4,
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: 999,
      borderWidth: 1,
    },
    tintTxt: {
      fontSize: 10,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    actions: { flexDirection: "row", gap: 8 },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
    },
    icon: { fontSize: 16 },
  });
}
