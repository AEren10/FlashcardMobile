/**
 * CreateListScreen — Premium Dark redesign.
 * Form state → useListEditor, image → useImageUpload.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

import T from "../../themes/tokens";
import useImageUpload from "../../hooks/useImageUpload";
import useListEditor from "../../hooks/useListEditor";
import { useToast } from "../../contexts/ToastContext";

export default function CreateListScreen({ route }) {
  const navigation = useNavigation();
  const toast = useToast();
  const listId = route?.params?.listId;
  const editor = useListEditor(listId);
  const img = useImageUpload();
  const [saving, setSaving] = useState(false);

  const canSave = editor.title.trim().length > 0;

  const onPickImage = async () => {
    try {
      await img.pick();
    } catch (e) {
      Alert.alert("İzin gerekli", e.message);
    }
  };

  const onSave = async () => {
    const err = editor.validate();
    if (err) return Alert.alert("Eksik bilgi", err);
    setSaving(true);
    try {
      let finalUrl = editor.existingImageUrl;
      if (img.localUri) {
        try {
          finalUrl = await img.upload(img.localUri);
        } catch {
          Alert.alert("Uyarı", "Görsel yüklenemedi, mevcut görsel korunacak.");
        }
      }
      await editor.save(finalUrl);
      toast.show({
        message: editor.isEdit ? "Liste güncellendi ✓" : "Liste oluşturuldu ✓",
        type: "success",
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (editor.fetching) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={T.lime} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.root}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={12}
              accessibilityLabel="İptal"
            >
              <Svg width={10} height={16} viewBox="0 0 8 14">
                <Path
                  d="M7 1L1 7l6 6"
                  stroke={T.text}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.backText}>İptal</Text>
            </Pressable>
            <Text style={styles.title}>{editor.isEdit ? "Liste Düzenle" : "Yeni Liste"}</Text>
            <Pressable
              onPress={canSave && !saving ? onSave : null}
              disabled={!canSave || saving}
              style={[
                styles.saveBtn,
                { backgroundColor: canSave ? T.lime : T.surface },
              ]}
              accessibilityLabel="Kaydet"
            >
              {saving ? (
                <ActivityIndicator color={T.bg} size="small" />
              ) : (
                <Text
                  style={[
                    styles.saveText,
                    { color: canSave ? T.bg : T.textMuted },
                  ]}
                >
                  Kaydet
                </Text>
              )}
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 140 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Name */}
            <View style={styles.card}>
              <Text style={styles.label}>LİSTE ADI</Text>
              <TextInput
                value={editor.title}
                onChangeText={editor.setTitle}
                placeholder="Örn: Seyahat kelimeleri"
                placeholderTextColor={T.textMuted}
                style={[
                  styles.nameInput,
                  { borderBottomColor: editor.title ? T.lime : T.border },
                ]}
                selectionColor={T.lime}
              />
            </View>

            {/* Image */}
            <Pressable onPress={onPickImage} style={styles.imagePicker}>
              {img.localUri || editor.existingImageUrl ? (
                <Image
                  source={{ uri: img.localUri || editor.existingImageUrl }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.imageEmpty}>
                  <Text style={styles.imageEmojiIcon}>🖼️</Text>
                  <Text style={styles.imageEmptyText}>Kapak görseli ekle (opsiyonel)</Text>
                </View>
              )}
              {img.uploading && (
                <View style={styles.imageOverlay}>
                  <ActivityIndicator color={T.lime} />
                </View>
              )}
            </Pressable>

            {/* Tip */}
            <View style={styles.tip}>
              <Text style={{ fontSize: 24 }}>💡</Text>
              <Text style={styles.tipText}>
                <Text style={{ color: T.lime, fontFamily: T.fontBodyBold }}>İpucu:</Text> En az 5
                kelime ekle, SRS daha verimli çalışsın.
              </Text>
            </View>

            {/* Words */}
            <Text style={[styles.label, { marginTop: 10, marginBottom: 10 }]}>
              KELİMELER ({editor.words.length})
            </Text>

            {editor.words.map((w, i) => (
              <View key={w.id || i} style={styles.wordRow}>
                <View style={styles.wordNum}>
                  <Text style={styles.wordNumText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <TextInput
                    value={w.word}
                    onChangeText={(v) => editor.updateWord(i, "word", v)}
                    placeholder="İngilizce"
                    placeholderTextColor={T.textMuted}
                    style={styles.wordInputEn}
                    selectionColor={T.lime}
                  />
                  <TextInput
                    value={w.meaning}
                    onChangeText={(v) => editor.updateWord(i, "meaning", v)}
                    placeholder="Türkçe"
                    placeholderTextColor={T.textMuted}
                    style={styles.wordInputTr}
                    selectionColor={T.lime}
                  />
                  <TextInput
                    value={w.example}
                    onChangeText={(v) => editor.updateWord(i, "example", v)}
                    placeholder="Örnek cümle (opsiyonel)"
                    placeholderTextColor={T.textMuted}
                    style={styles.wordInputEx}
                    selectionColor={T.lime}
                  />
                </View>
                {editor.words.length > 1 && (
                  <Pressable
                    onPress={() => editor.removeWord(i)}
                    hitSlop={10}
                    accessibilityLabel={`${i + 1}. kelimeyi sil`}
                  >
                    <Text style={styles.removeIcon}>✕</Text>
                  </Pressable>
                )}
              </View>
            ))}

            <Pressable onPress={editor.addWord} style={styles.addWordBtn}>
              <Text style={styles.addWordText}>+ Kelime Ekle</Text>
            </Pressable>

            {/* Public toggle */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>
                  {editor.isPublic ? "🌍 Herkese Açık" : "🔒 Herkese Açık"}
                </Text>
                <Text style={styles.toggleSub}>
                  {editor.isPublic
                    ? "Bu liste Keşfet sekmesinde görünür"
                    : "Sadece sen göreceksin"}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  if (!editor.isPublic) {
                    // ilk açış: onay sor
                    Alert.alert(
                      "Listeyi herkese açıyorsun",
                      "Bu listeyi diğer kullanıcılar Keşfet sekmesinde görür ve çalışabilir. Onaylıyor musun?",
                      [
                        { text: "Vazgeç", style: "cancel" },
                        {
                          text: "Public Yap",
                          onPress: () => editor.setIsPublic(true),
                        },
                      ]
                    );
                  } else {
                    editor.setIsPublic(false);
                  }
                }}
                style={[
                  styles.toggle,
                  { backgroundColor: editor.isPublic ? T.lime : "rgba(255,255,255,0.1)" },
                ]}
                accessibilityRole="switch"
                accessibilityState={{ checked: editor.isPublic }}
                accessibilityLabel="Listeyi herkese açık yap"
              >
                <View
                  style={[
                    styles.toggleKnob,
                    {
                      left: editor.isPublic ? 24 : 2,
                      backgroundColor: editor.isPublic ? T.bg : T.textMuted,
                    },
                  ]}
                />
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  center: { alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, minWidth: 70 },
  backText: { fontSize: 15, color: T.text, fontFamily: T.fontBodySemi },
  title: { fontSize: 18, color: T.text, fontFamily: T.fontBodyBold },
  saveBtn: { borderRadius: 12, paddingVertical: 8, paddingHorizontal: 18, minWidth: 70, alignItems: "center" },
  saveText: { fontSize: 14, fontFamily: T.fontBodyBold },

  card: {
    backgroundColor: T.bgCard,
    borderRadius: T.radius,
    padding: 18,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 14,
  },
  label: {
    fontSize: 10,
    fontFamily: T.fontBodyBold,
    color: T.textMuted,
    letterSpacing: 1.5,
  },
  nameInput: {
    marginTop: 10,
    fontSize: 18,
    color: T.text,
    fontFamily: T.fontBodySemi,
    borderBottomWidth: 2,
    paddingBottom: 8,
    paddingTop: 0,
  },

  imagePicker: {
    height: 140,
    borderRadius: T.radius,
    backgroundColor: T.bgCard,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 14,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: { width: "100%", height: "100%" },
  imageEmpty: { alignItems: "center", gap: 8 },
  imageEmojiIcon: { fontSize: 32, opacity: 0.7 },
  imageEmptyText: { fontSize: 12, color: T.textMuted, fontFamily: T.fontBody },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },

  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.limeDim,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(180,255,79,0.08)",
    marginBottom: 4,
  },
  tipText: { flex: 1, fontSize: 12, color: T.text, fontFamily: T.fontBody, lineHeight: 18 },

  wordRow: {
    backgroundColor: T.bgCard,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
  },
  wordNum: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: T.limeDim,
    alignItems: "center",
    justifyContent: "center",
  },
  wordNumText: { fontSize: 13, color: T.lime, fontFamily: T.fontBodyBold },
  wordInputEn: { fontSize: 15, color: T.text, fontFamily: T.fontBodySemi, padding: 0 },
  wordInputTr: { fontSize: 13, color: T.textSec, fontFamily: T.fontBody, padding: 0 },
  wordInputEx: { fontSize: 12, color: T.textMuted, fontFamily: T.fontBody, fontStyle: "italic", padding: 0 },
  removeIcon: { fontSize: 14, color: T.textMuted, paddingHorizontal: 6 },

  addWordBtn: {
    marginTop: 2,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(180,255,79,0.2)",
    backgroundColor: T.limeDim,
    alignItems: "center",
  },
  addWordText: { fontSize: 14, color: T.lime, fontFamily: T.fontBodyBold },

  toggleRow: {
    marginTop: 16,
    backgroundColor: T.bgCard,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: T.border,
  },
  toggleTitle: { fontSize: 15, color: T.text, fontFamily: T.fontBodySemi },
  toggleSub: { fontSize: 11, color: T.textMuted, fontFamily: T.fontBody, marginTop: 2 },
  toggle: { width: 50, height: 28, borderRadius: 99, position: "relative" },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 2,
  },
});
