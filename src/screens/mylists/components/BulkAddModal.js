/**
 * BulkAddModal — kelimeleri tek seferde yapıştır.
 * Format: her satır "word - meaning" (veya , : | tab).
 */
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import PremiumButton from "../../../components/design/PremiumButton";
import Icon, { ICONS } from "../../../components/design/Icon";

const PLACEHOLDER = `apple - elma
book - kitap
travel - seyahat
deserve - hak etmek

(her satır bir kelime: "ingilizce - türkçe")`;

export default function BulkAddModal({ visible, onClose, onAdd }) {
  const { c } = useTheme();
  const [text, setText] = useState("");

  const lineCount = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean).length;

  const handleAdd = () => {
    if (!text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const added = onAdd(text);
    setText("");
    onClose(added);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => onClose(0)}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: c.bgBase }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={[s.header, { borderBottomColor: c.border }]}>
          <Pressable
            onPress={() => onClose(0)}
            hitSlop={12}
            style={[s.iconBtn, { backgroundColor: c.bgSurface, borderColor: c.border }]}
          >
            <Icon d={ICONS.x} size={18} stroke={c.textPrimary} sw={2} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
              Toplu Kelime Ekle
            </Text>
            <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
              {lineCount > 0 ? `${lineCount} satır` : "Listeyi yapıştır"}
            </Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Hint */}
        <View style={[s.hintCard, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
          <Text style={{ fontSize: 18 }}>💡</Text>
          <Text style={[s.hintTxt, { color: c.textSec, fontFamily: c.fontBody }]}>
            Her satıra bir kelime yaz. Ayraç olarak{" "}
            <Text style={{ color: c.accent, fontFamily: c.fontBodyBold }}>"-" "," ":" "tab"</Text>{" "}
            kullanabilirsin.
          </Text>
        </View>

        {/* Textarea */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={PLACEHOLDER}
          placeholderTextColor={c.textMuted}
          multiline
          autoFocus
          textAlignVertical="top"
          selectionColor={c.accent}
          style={[
            s.textarea,
            {
              backgroundColor: c.bgElevated,
              borderColor: c.border,
              color: c.textPrimary,
              fontFamily: c.fontBody,
            },
          ]}
        />

        {/* CTA */}
        <View style={s.ctaWrap}>
          <PremiumButton
            label={lineCount > 0 ? `${lineCount} Kelime Ekle` : "Ekle"}
            variant="primary"
            onPress={handleAdd}
            disabled={lineCount === 0}
            hapticStyle="success"
            block
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: { fontSize: 16 },
  sub: { fontSize: 11, marginTop: 2 },
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 18,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  hintTxt: { flex: 1, fontSize: 12, lineHeight: 17 },
  textarea: {
    flex: 1,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 200,
  },
  ctaWrap: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 4,
  },
});
