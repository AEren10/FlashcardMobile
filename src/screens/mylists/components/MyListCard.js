import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import T from "../../../themes/tokens";

const EMOJIS = {
  daily: "☀️",
  travel: "✈️",
  business: "💼",
  learning: "📚",
  popular: "🔥",
};

const LEVEL_TR = {
  Beginner: "Başlangıç",
  Intermediate: "Orta",
  Advanced: "İleri",
};

const Chevron = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6l6 6-6 6"
      stroke={T.textMuted}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MyListCard = ({ item, onPress, onLongPress }) => {
  const emoji = EMOJIS[item.category] || "📖";
  const level = LEVEL_TR[item.level] || item.level || "Başlangıç";
  const wc = item.word_count ?? "?";

  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && s.pressed]}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress?.(item)}
      delayLongPress={500}
    >
      <View style={s.emojiBox}>
        <Text style={s.emoji}>{emoji}</Text>
      </View>

      <View style={s.mid}>
        <Text style={s.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={s.meta} numberOfLines={1}>
          {level} · {wc} kelime
        </Text>
      </View>

      <View style={s.chevron}>
        <Chevron />
      </View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  pressed: { opacity: 0.7 },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: { fontSize: 20 },
  mid: { flex: 1 },
  title: {
    fontSize: 15,
    fontFamily: T.fontBodySemi,
    color: T.text,
    marginBottom: 3,
  },
  meta: {
    fontSize: 13,
    fontFamily: T.fontBody,
    color: T.textSec,
  },
  chevron: { marginLeft: 8 },
});

export default React.memo(MyListCard);
