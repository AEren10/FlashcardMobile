/**
 * HeroDashboard — Minimal hero: Hoşgeldin + İsim + streak chip.
 * Artık RadialGoal / Particles / StreakOrbit YOK — sade ve net.
 */
import { spacing } from "../../../themes/tokens";
import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import Icon, { ICONS } from "../../../components/design/Icon";

function HeroDashboard({
  greeting,
  greetingSub,
  userName,
  streak = 0,
  onStreakPress,
}) {
  const { c } = useTheme();

  return (
    <View style={{ paddingTop: spacing.xs, paddingBottom: 6, marginBottom: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, color: c.textSec, fontFamily: c.fontBodySemi, letterSpacing: 0.2 }}>
            {greeting},
          </Text>
          <Text
            style={{
              fontSize: 34,
              lineHeight: 40,
              color: c.textPrimary,
              fontFamily: c.fontDisplay,
              marginTop: 2,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {userName}
          </Text>
          {!!greetingSub && (
            <Text style={{ fontSize: 13, color: c.textMuted, fontFamily: c.fontBody, marginTop: 4 }}>
              {greetingSub}
            </Text>
          )}
        </View>

        {streak > 0 && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onStreakPress?.();
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: c.warning + "22",
              borderWidth: 1.5,
              borderColor: c.warning + "66",
              shadowColor: c.warning,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
            accessibilityLabel="Streak"
          >
            <Icon d={ICONS.flame} size={20} stroke={c.warning} fill={c.warning} sw={1.2} />
            <Text style={{ fontFamily: c.fontBodyBold, fontSize: 22, color: c.warning, lineHeight: 26 }}>
              {streak}
            </Text>
            <Text style={{ fontFamily: c.fontBodySemi, fontSize: 12, color: c.warning + "CC" }}>
              gün
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default memo(HeroDashboard);
