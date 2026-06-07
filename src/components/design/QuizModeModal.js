/**
 * QuizModeModal — Quiz başlamadan önce mod seçimi (Normal / Hızlı).
 * Hızlı modda her soru için 10sn süre.
 */
import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";

export default function QuizModeModal({ visible, onPick, onClose, blankReadyCount = null }) {
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

  const pick = (timed, mode = "classic") => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPick({ timed, mode });
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
            Quiz Modu Seç
          </Text>
          <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
            Nasıl çalışmak istersin?
          </Text>

          <Pressable
            onPress={() => pick(false)}
            style={({ pressed }) => [
              s.mode,
              {
                borderColor: c.borderAccent,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <LinearGradient
              colors={[c.accent, "#8FE03A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.modeRow}>
              <Text style={s.modeEmoji}>🧩</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.modeTitle, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
                  Normal Mod
                </Text>
                <Text style={[s.modeDesc, { color: c.textOnAccent, opacity: 0.75, fontFamily: c.fontBody }]}>
                  Süre baskısı yok, sakin tempo
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => pick(true)}
            style={({ pressed }) => [
              s.mode,
              {
                marginTop: 10,
                borderColor: c.warning + "55",
                backgroundColor: c.bgSurface,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={s.modeRow}>
              <Text style={s.modeEmoji}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.modeTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                  Hızlı Mod
                </Text>
                <Text style={[s.modeDesc, { color: c.textSec, fontFamily: c.fontBody }]}>
                  Her soru için 10 saniye süre
                </Text>
              </View>
              <View style={[s.badge, { backgroundColor: c.warningDim }]}>
                <Text style={[s.badgeTxt, { color: c.warning, fontFamily: c.fontBodyBold }]}>
                  10sn
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Boşluk Doldurma — cümleden eksik kelime tahmin
              Yeterince örnek cümle yoksa disabled — kullanıcıya neden olduğunu söyle */}
          {(() => {
            const enough = blankReadyCount === null || blankReadyCount >= 4;
            return (
              <Pressable
                onPress={() => {
                  if (!enough) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    return;
                  }
                  pick(false, "blank");
                }}
                style={({ pressed }) => [
                  s.mode,
                  {
                    marginTop: 10,
                    borderColor: enough ? c.cobalt + "55" : c.border,
                    backgroundColor: c.bgSurface,
                    opacity: enough ? 1 : 0.6,
                    transform: [{ scale: pressed && enough ? 0.97 : 1 }],
                  },
                ]}
              >
                <View style={s.modeRow}>
                  <Text style={s.modeEmoji}>🧠</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.modeTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
                      Boşluk Doldurma
                    </Text>
                    <Text style={[s.modeDesc, { color: c.textSec, fontFamily: c.fontBody }]}>
                      {enough
                        ? "Cümledeki boşluğu tamamla"
                        : `Bu liste için yetersiz cümle (${blankReadyCount}/4)`}
                    </Text>
                  </View>
                  <View
                    style={[
                      s.badge,
                      { backgroundColor: enough ? c.cobalt + "22" : c.warningDim },
                    ]}
                  >
                    <Text
                      style={[
                        s.badgeTxt,
                        { color: enough ? c.cobalt : c.warning, fontFamily: c.fontBodyBold },
                      ]}
                    >
                      {enough ? "Yeni" : "Cümle yok"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })()}

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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
  },
  title: { fontSize: 26, textAlign: "center" },
  sub: { fontSize: 13, textAlign: "center", marginTop: 4, marginBottom: 20 },
  mode: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    padding: 16,
  },
  modeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  modeEmoji: { fontSize: 30 },
  modeTitle: { fontSize: 16 },
  modeDesc: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  badgeTxt: { fontSize: 11, letterSpacing: 0.3 },
  cancel: { marginTop: 16, alignItems: "center", paddingVertical: 8 },
  cancelTxt: { fontSize: 13 },
});
