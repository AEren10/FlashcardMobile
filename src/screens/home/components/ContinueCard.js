/**
 * ContinueCard — "Devam Et" satırındaki memoize'li kart.
 * HomeScreen'den ayrı dosya (modülarite).
 */
import { radius, spacing } from "../../../themes/tokens";
import React from "react";
import { View, Text } from "react-native";
import CategoryCover from "../../../components/design/CategoryCover";
import PressableScale from "../../../components/design/PressableScale";

const ContinueCard = React.memo(function ContinueCard({
  title,
  count,
  pct,
  level,
  imageUrl,
  c,
  onPress,
}) {
  return (
    <PressableScale onPress={onPress} style={{ width: 182 }} scaleDown={0.96}>
      <View style={{ borderRadius: radius.md, overflow: "hidden", marginBottom: 10 }}>
        <CategoryCover difficulty={level} height={100} showLabel={false} />
      </View>
      <Text
        numberOfLines={1}
        style={{ fontFamily: c.fontBodySemi, fontSize: 14, color: c.textPrimary }}
      >
        {title}
      </Text>
      <Text style={{ marginTop: 2, fontSize: 12, color: c.textSec, fontFamily: c.fontBody }}>
        {count} kelime · %{pct}
      </Text>
      <View
        style={{
          marginTop: spacing.sm,
          height: 5,
          backgroundColor: c.bgSurface,
          borderRadius: radius.full,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: c.accent,
            borderRadius: radius.full,
          }}
        />
      </View>
    </PressableScale>
  );
});

export default ContinueCard;
