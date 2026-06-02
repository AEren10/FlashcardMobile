/**
 * ConsentModal — Sentry/analytics için GDPR/KVKK consent prompt.
 * İlk açılışta gösterilir, AsyncStorage ile bir kez sorulur.
 */
import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import T from "../themes/tokens";
import { setConsent } from "../lib/analyticsConsent";

export default function ConsentModal({ visible, onResolved }) {
  const handle = async (allow) => {
    await setConsent(allow);
    onResolved?.(allow);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => handle(false)}>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.emoji}>🔒</Text>
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

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: T.bgCard,
    borderRadius: T.radius,
    padding: 24,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
  },
  emoji: { fontSize: 40, marginBottom: 8 },
  title: {
    fontSize: 20,
    fontFamily: T.fontBodyBold,
    color: T.text,
    marginBottom: 12,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    fontFamily: T.fontBody,
    color: T.textSec,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: T.lime,
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  primaryTxt: { color: T.bg, fontFamily: T.fontBodyBold, fontSize: 15 },
  secondaryBtn: { paddingVertical: 14, width: "100%", alignItems: "center" },
  secondaryTxt: { color: T.textSec, fontFamily: T.fontBodySemi, fontSize: 14 },
});
