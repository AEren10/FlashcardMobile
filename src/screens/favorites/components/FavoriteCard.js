import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toggleFavorite, selectIsFavorite } from "../../../store/favoritesSlice";
import { useAuth } from "../../../contexts/AuthContext";
import Icon from "../../../components/design/Icon";
import PressableScale from "../../../components/design/PressableScale";
import { getCategoryIcon } from "../../../lib/categoryMeta";

const FavoriteCard = ({ item, onPress }) => {
  const { c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((s) => selectIsFavorite(s, item.id));
  const { isAuthenticated, isGuestUser } = useAuth();

  const handleFav = (e) => {
    e.stopPropagation();
    if (!isAuthenticated() || isGuestUser()) return;
    dispatch(toggleFavorite({ listId: item.id, isFavorite }));
  };

  return (
    <PressableScale
      style={styles.listItem}
      scaleDown={0.98}
      onPress={() => onPress(item)}
    >
      <View style={styles.emojiBox}>
        <Icon d={getCategoryIcon(item.category)} size={20} stroke={c.textSec} sw={1.5} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.meta}>
          {({ Beginner: "Başlangıç", Intermediate: "Orta", Advanced: "İleri" })[item.level] || item.level || "Başlangıç"} · {item.word_count ?? item.cardCount ?? "?"} kelime
          {item.description ? ` · ${item.description}` : ""}
        </Text>
      </View>
      {isAuthenticated() && !isGuestUser() && (
        <Pressable onPress={handleFav} hitSlop={8} style={styles.starBtn}>
          <Icon
            d={ICONS.star}
            size={20}
            stroke={isFavorite ? c.warning : c.textMuted}
            fill={isFavorite ? c.warning : "none"}
            sw={1.8}
          />
        </Pressable>
      )}
    </PressableScale>
  );
};

function makeStyles(c) {
  return StyleSheet.create({
    listItem: {
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    emojiBox: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    emojiTxt: { fontSize: 22 },
    title: {
      fontSize: 15,
      color: c.textPrimary,
      fontFamily: c.fontBodySemi,
      marginBottom: 3,
    },
    meta: {
      fontSize: 11,
      color: c.textMuted,
      fontFamily: c.fontBody,
    },
    starBtn: { padding: 4 },
  });
}

export default React.memo(FavoriteCard);
