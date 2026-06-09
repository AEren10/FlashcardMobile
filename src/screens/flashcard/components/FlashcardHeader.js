/**
 * FlashcardHeader — başlık + sahip/ziyaretçi action butonları (paylaş, düzenle, sil, favori).
 * Tema-aware (useTheme).
 */
import React, { useMemo } from "react";
import { fontSize, radius } from "../../../themes/tokens";
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
          <Icon d={ICONS.share} size={18} stroke={c.textSec} sw={1.8} />
        </Pressable>

        {isOwner ? (
          <>
            <Pressable onPress={onEdit} hitSlop={8} accessibilityLabel="Listeyi düzenle" style={s.iconBtn}>
              <Icon d={ICONS.pencil} size={18} stroke={c.textSec} sw={1.8} />
            </Pressable>
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              accessibilityLabel="Listeyi sil"
              style={[s.iconBtn, { borderColor: c.error + "33" }]}
            >
              <Icon d={ICONS.x} size={18} stroke={c.error} sw={2} />
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
      fontSize: fontSize.lg,
      color: c.textPrimary,
      fontFamily: c.fontBodyBold,
      textAlign: "center",
    },
    tintChip: {
      marginTop: 4,
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: radius.full,
      borderWidth: 1,
    },
    tintTxt: {
      fontSize: fontSize.xs,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    actions: { flexDirection: "row", gap: 8 },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
    },
    icon: { fontSize: fontSize.lg },
  });
}
