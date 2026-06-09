/**
 * ConsentModal — Sentry/analytics için GDPR/KVKK consent prompt.
 * İlk açılışta gösterilir, AsyncStorage ile bir kez sorulur.
 */
import { radius } from "../../themes/tokens";
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { setConsent } from "../lib/analyticsConsent";
import Icon, { ICONS } from "./design/Icon";

export default function ConsentModal({ visible, onResolved }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);

  const handle = async (allow) => {
    await setConsent(allow);
    onResolved?.(allow);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => handle(false)}>
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.emoji}><Icon d={ICONS.lock} size={40} stroke={c.accent} sw={1.5} /></View>
          <Text style={s.title}>Gizlilik Tercihin</Text>
          <Text style={s.body}>
            Uygulamayı geliştirmemize yardımcı olmak için anonim çökme raporları toplayabiliriz.
            Bu veriler kişisel bilgilerini içermez ve sadece hataları düzeltmek için kullanılır.
            İstediğin zaman Profil → Gizlilik'ten değiştirebilirsin.
          </Text>

          <Pressable style={s.primaryBtn} onPress={() => handle(true)}>
            <Text style={s.primaryTxt}>Kabul Et</Text>
          </Pressable>
          <Pressable style={s.secondaryBtn} onPress={() => handle(false)}>
            <Text style={s.secondaryTxt}>Reddet</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      padding: 24,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
    },
    emoji: { marginBottom: 8, alignItems: "center" },
    title: {
      fontSize: 20,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
      marginBottom: 12,
      textAlign: "center",
    },
    body: {
      fontSize: 14,
      fontFamily: c.fontBody,
      color: c.textSec,
      lineHeight: 20,
      textAlign: "center",
      marginBottom: 24,
    },
    primaryBtn: {
      backgroundColor: c.accent,
      borderRadius: radius.sm,
      paddingVertical: 14,
      width: "100%",
      alignItems: "center",
      marginBottom: 8,
    },
    primaryTxt: { color: c.textOnAccent, fontFamily: c.fontBodyBold, fontSize: 15 },
    secondaryBtn: { paddingVertical: 14, width: "100%", alignItems: "center" },
    secondaryTxt: { color: c.textSec, fontFamily: c.fontBodySemi, fontSize: 14 },
  });
}
