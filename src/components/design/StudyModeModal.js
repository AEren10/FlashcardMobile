/**
 * StudyModeModal — Study başlamadan önce mod seçimi.
 * 4 mod: Akıllı (SRS due) / Tüm Liste / Yeni Kelimeler / Bilemediklerin.
 *
 * Şimdilik UI seçimi, asıl filtering useStudyEngine'in client-side filter'ında.
 * Server-side filtering Sprint sonraki turn'de (yeni RPC: get_study_words).
 */
import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

const MODES = [
  {
    key: "smart",
    icon: ICONS.sparkle,
    title: "Akıllı Tekrar",
    desc: "Yalnız zamanı gelenler — beynin için optimal",
    badge: "SRS",
  },
  {
    key: "all",
    icon: ICONS.books,
    title: "Tüm Liste",
    desc: "Baştan sırayla — review için",
    badge: null,
    primary: true,
  },
  {
    key: "new",
    icon: ICONS.plus,
    title: "Yeni Kelimeler",
    desc: "Hiç görmediğin kelimeler",
    badge: null,
  },
  {
    key: "mistakes",
    icon: ICONS.target,
    title: "Bilemediklerin",
    desc: "Quizde takıldığın kelimeler",
    badge: null,
  },
];

export default function StudyModeModal({ visible, onPick, onClose }) {
  const { c } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Haptics.selectionAsync();
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 220, damping: 18 }),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.85);
    }
  }, [visible, fade, scale]);

  const pick = (mode) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPick?.(mode);
  };

  if (!visible) return null;
  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[s.overlay, { opacity: fade }]}>
        <Animated.View
          style={[
            s.card,
            { backgroundColor: c.bgElevated, borderColor: c.border, transform: [{ scale }] },
          ]}
        >
          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
            Çalışma Modu
          </Text>
          <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
            Hangi kelimelerle çalışmak istersin?
          </Text>

          {MODES.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => pick(m.key)}
              style={({ pressed }) => [
                s.mode,
                {
                  borderColor: m.primary ? c.accent + "AA" : c.border,
                  backgroundColor: m.primary ? c.accent + "1A" : c.bgSurface,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  marginTop: 10,
                },
              ]}
            >
              {m.primary && (
                <LinearGradient
                  colors={[c.accent + "30", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <View style={s.modeRow}>
                <Icon d={m.icon} size={26} stroke={m.primary ? c.accent : c.textSec} sw={1.7} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={[s.modeTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                      {m.title}
                    </Text>
                    {m.badge && (
                      <View style={[s.badge, { backgroundColor: c.cobalt + "22" }]}>
                        <Text style={[s.badgeTxt, { color: c.cobalt, fontFamily: c.fontBodyBold }]}>
                          {m.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[s.modeDesc, { color: c.textSec, fontFamily: c.fontBody }]}>
                    {m.desc}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}

          <Pressable onPress={onClose} style={s.cancel} hitSlop={8}>
            <Text style={[s.cancelTxt, { color: c.textMuted, fontFamily: c.fontBodySemi }]}>
              Vazgeç
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 400, borderRadius: 22, borderWidth: 1, padding: 22 },
  title: { fontSize: 26, textAlign: "center" },
  sub: { fontSize: 13, textAlign: "center", marginTop: 4, marginBottom: 14 },
  mode: { borderRadius: 14, borderWidth: 1, overflow: "hidden", padding: 14 },
  modeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  modeTitle: { fontSize: 15 },
  modeDesc: { fontSize: 11.5, marginTop: 2, lineHeight: 15 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  badgeTxt: { fontSize: 9, letterSpacing: 0.3 },
  cancel: { marginTop: 14, alignItems: "center", paddingVertical: 8 },
  cancelTxt: { fontSize: 13 },
});
