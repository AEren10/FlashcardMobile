/**
 * AppearanceScreen — Light / Dark / System tercih ekranı.
 */
import { radius } from "../../themes/tokens";
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "../../components/design/Icon";

const OPTIONS = [
  { key: "system", label: "Sistem", sub: "Cihazın görünüm ayarını takip eder", icon: "🔄" },
  { key: "light", label: "Açık", sub: "Aydınlık ortamlar için", icon: "☀️" },
  { key: "dark", label: "Koyu", sub: "Karanlık ortamlar, OLED dostu", icon: "🌙" },
];

export default function AppearanceScreen({ navigation }) {
  const { c, preference, setPreference } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);

  const handlePick = (k) => {
    Haptics.selectionAsync();
    setPreference(k);
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={s.back}>
            <Svg width={10} height={16} viewBox="0 0 8 14">
              <Path
                d="M7 1L1 7l6 6"
                stroke={c.textPrimary}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <Text style={s.headerTitle}>Görünüm</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={s.lead}>
            Uygulamanın görünüm temasını seç. Sistem'i seçersen telefon ayarlarını takip eder.
          </Text>

          <View style={s.list}>
            {OPTIONS.map((opt, i) => {
              const selected = preference === opt.key;
              const isLast = i === OPTIONS.length - 1;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => handlePick(opt.key)}
                  style={[
                    s.row,
                    {
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: c.divider,
                      backgroundColor: selected ? c.accentGlow : "transparent",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 22, width: 32, textAlign: "center" }}>{opt.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: c.fontBodySemi,
                        fontSize: 15,
                        color: selected ? c.accent : c.textPrimary,
                      }}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: c.fontBody,
                        fontSize: 12,
                        color: c.textSec,
                        marginTop: 2,
                      }}
                    >
                      {opt.sub}
                    </Text>
                  </View>
                  {selected && (
                    <View style={s.checkWrap}>
                      <Icon d={ICONS.check} size={16} stroke={c.accent} sw={2.4} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    back: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    lead: {
      fontFamily: c.fontBody,
      fontSize: 14,
      color: c.textSec,
      lineHeight: 20,
      marginBottom: 16,
    },
    list: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    checkWrap: {
      width: 28,
      height: 28,
      borderRadius: radius.sm,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
