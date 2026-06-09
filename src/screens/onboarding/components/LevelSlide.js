/**
 * LevelSlide — Onboarding 5. ekran: kullanıcı kendine biçtiği seviye.
 * 3 kart: Başlangıç / Orta / İleri.
 * Tap → onSelect(slug). HomeScreen önerisi bu seviyeyi temel alır.
 */
import { radius, spacing } from "../../../themes/tokens";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon, { ICONS } from "../../../components/design/Icon";

const LEVELS = [
  { key: "beginner", label: "Başlangıç", cefr: "A1 — A2", desc: "Temel kelimeler, günlük konuşma", color: "#84B19B" },
  { key: "intermediate", label: "Orta", cefr: "B1 — B2", desc: "Akıcı sohbet, kapsamlı metin", color: "#8BA4C4" },
  { key: "advanced", label: "İleri", cefr: "C1 +", desc: "Akademik, profesyonel, edebiyat", color: "#B097C4" },
];

export default function LevelSlide({ c, selected, onSelect }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
        Şu an neredesin?
      </Text>
      <Text style={[styles.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
        Doğru zorluktaki listelerle başla
      </Text>
      <View style={styles.col}>
        {LEVELS.map((l) => {
          const active = selected === l.key;
          return (
            <Pressable
              key={l.key}
              onPress={() => onSelect(l.key)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: active ? l.color + "22" : c.bgElevated,
                  borderColor: active ? l.color : c.border,
                  borderWidth: active ? 2 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  shadowColor: active ? l.color : "transparent",
                  shadowOpacity: active ? 0.3 : 0,
                  shadowRadius: 10,
                  elevation: active ? 4 : 0,
                },
              ]}
              accessibilityLabel={`${l.label} ${l.cefr}`}
            >
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.sm }}>
                    <Text style={[styles.label, { color: active ? l.color : c.textPrimary, fontFamily: c.fontBodyBold }]}>
                      {l.label}
                    </Text>
                    <Text style={[styles.cefr, { color: c.textSec, fontFamily: c.fontBodyMed }]}>
                      {l.cefr}
                    </Text>
                  </View>
                  <Text style={[styles.desc, { color: c.textSec, fontFamily: c.fontBody }]}>
                    {l.desc}
                  </Text>
                </View>
                {active && (
                  <Icon d={ICONS.check} size={22} stroke={l.color} sw={2.2} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const LEVEL_KEYS = LEVELS.map((l) => l.key);

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.xxl, paddingTop: spacing.sm, alignItems: "stretch", width: "100%" },
  heading: { fontSize: 32, lineHeight: 36, textAlign: "center" },
  sub: { fontSize: 14, textAlign: "center", marginTop: spacing.sm, opacity: 0.85 },
  col: { marginTop: 28, gap: spacing.md },
  card: { borderRadius: radius.md, padding: spacing.lg },
  row: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 17 },
  cefr: { fontSize: 12, letterSpacing: 0.4 },
  desc: { fontSize: 12, marginTop: spacing.xs, opacity: 0.9 },
});
