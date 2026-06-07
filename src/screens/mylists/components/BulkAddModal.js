/**
 * BulkAddModal — kelimeleri tek seferde yapıştır.
 * 2 mod:
 *   - "paired": her satır "word - meaning" (ayraç: - , : | tab — )
 *   - "en-only": her satır 1 İngilizce kelime, anlamı sözlükten otomatik gelir
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

const PLACEHOLDER_PAIRED = `apple - elma
book - kitap
travel - seyahat
deserve - hak etmek

(her satır bir kelime: "ingilizce - türkçe")`;

const PLACEHOLDER_EN_ONLY = `apple
journey
opportunity
challenge

(her satır bir İngilizce kelime — anlamı ✨ otomatik gelir)`;

export default function BulkAddModal({ visible, onClose, onAdd }) {
  const { c } = useTheme();
  const [text, setText] = useState("");
  const [mode, setMode] = useState("paired"); // "paired" | "en-only"

  const lineCount = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean).length;

  const handleAdd = () => {
    if (!text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const added = onAdd(text, mode);
    setText("");
    onClose(added);
  };

  const switchMode = (m) => {
    if (m === mode) return;
    Haptics.selectionAsync();
    setMode(m);
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

        {/* Mode Segment */}
        <View style={[s.segWrap, { backgroundColor: c.bgSurface, borderColor: c.border }]}>
          <Pressable
            onPress={() => switchMode("paired")}
            style={[
              s.segBtn,
              mode === "paired" && { backgroundColor: c.bgElevated, borderColor: c.borderAccent },
            ]}
          >
            <Text style={[
              s.segTxt,
              { color: mode === "paired" ? c.textPrimary : c.textMuted, fontFamily: c.fontBodyBold }
            ]}>
              İki Dilli
            </Text>
            <Text style={[s.segHint, { color: c.textMuted, fontFamily: c.fontBody }]}>
              ing - tr
            </Text>
          </Pressable>
          <Pressable
            onPress={() => switchMode("en-only")}
            style={[
              s.segBtn,
              mode === "en-only" && { backgroundColor: c.bgElevated, borderColor: c.cobalt + "66" },
            ]}
          >
            <Text style={[
              s.segTxt,
              { color: mode === "en-only" ? c.cobalt : c.textMuted, fontFamily: c.fontBodyBold }
            ]}>
              ✨ Sadece İngilizce
            </Text>
            <Text style={[s.segHint, { color: c.textMuted, fontFamily: c.fontBody }]}>
              AI doldurur
            </Text>
          </Pressable>
        </View>

        {/* Hint */}
        <View style={[
          s.hintCard,
          mode === "en-only"
            ? { backgroundColor: c.cobalt + "12", borderColor: c.cobalt + "44" }
            : { backgroundColor: c.accentGlow, borderColor: c.borderAccent }
        ]}>
          <Text style={{ fontSize: 18 }}>{mode === "en-only" ? "🪄" : "💡"}</Text>
          <Text style={[s.hintTxt, { color: c.textSec, fontFamily: c.fontBody }]}>
            {mode === "en-only" ? (
              <>
                Sadece İngilizce kelimeleri alt alta yapıştır.{" "}
                <Text style={{ color: c.cobalt, fontFamily: c.fontBodyBold }}>Anlamları sözlükten otomatik gelir.</Text>
              </>
            ) : (
              <>
                Her satıra bir kelime yaz. Ayraç olarak{" "}
                <Text style={{ color: c.accent, fontFamily: c.fontBodyBold }}>"-" "," ":" "tab"</Text>{" "}
                kullanabilirsin.
              </>
            )}
          </Text>
        </View>

        {/* Textarea */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={mode === "en-only" ? PLACEHOLDER_EN_ONLY : PLACEHOLDER_PAIRED}
          placeholderTextColor={c.textMuted}
          multiline
          autoFocus
          textAlignVertical="top"
          selectionColor={c.accent}
          autoCapitalize={mode === "en-only" ? "none" : "sentences"}
          autoCorrect={mode === "en-only" ? false : true}
          style={[
            s.textarea,
            {
              backgroundColor: c.bgElevated,
              borderColor: mode === "en-only" ? c.cobalt + "44" : c.border,
              color: c.textPrimary,
              fontFamily: c.fontBody,
            },
          ]}
        />

        {/* CTA */}
        <View style={s.ctaWrap}>
          <PremiumButton
            label={
              lineCount > 0
                ? mode === "en-only"
                  ? `✨ ${lineCount} Kelime Ekle`
                  : `${lineCount} Kelime Ekle`
                : "Ekle"
            }
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
  segWrap: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  segTxt: { fontSize: 13 },
  segHint: { fontSize: 10, marginTop: 1, opacity: 0.8 },
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 18,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  hintTxt: { flex: 1, fontSize: 12, lineHeight: 17 },
  textarea: {
    flex: 1,
    marginHorizontal: 18,
    marginTop: 12,
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
