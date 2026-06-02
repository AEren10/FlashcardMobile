import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import T from "../../../themes/tokens";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toggleFavorite, selectIsFavorite } from "../../../store/favoritesSlice";
import { useAuth } from "../../../contexts/AuthContext";

const CATEGORY_EMOJI = {
  daily: "☀️",
  travel: "✈️",
  business: "💼",
  learning: "📚",
  popular: "🔥",
  colors: "🎨",
};

function getEmoji(cat) {
  if (!cat) return "📖";
  return CATEGORY_EMOJI[cat.toLowerCase()] || "📖";
}

const FavoriteCard = ({ item, onPress }) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((s) => selectIsFavorite(s, item.id));
  const { isAuthenticated, isGuestUser } = useAuth();

  const handleFav = (e) => {
    e.stopPropagation();
    if (!isAuthenticated() || isGuestUser()) return;
    dispatch(toggleFavorite({ listId: item.id, isFavorite }));
  };

  return (
    <Pressable style={styles.listItem} onPress={() => onPress(item)}>
      <View style={styles.emojiBox}>
        <Text style={styles.emojiTxt}>{getEmoji(item.category)}</Text>
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
        <Pressable onPress={handleFav} hitSlop={8}>
          <Text style={styles.heart}>{isFavorite ? "❤️" : "🤍"}</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: T.bgCard,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
  },
  emojiBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: T.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiTxt: { fontSize: 22 },
  title: {
    fontSize: 15,
    color: T.text,
    fontFamily: T.fontBodySemi,
    marginBottom: 3,
  },
  meta: {
    fontSize: 11,
    color: T.textMuted,
    fontFamily: T.fontBody,
  },
  heart: { fontSize: 22 },
});

export default React.memo(FavoriteCard);
