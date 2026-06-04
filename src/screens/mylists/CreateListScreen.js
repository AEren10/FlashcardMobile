/**
 * CreateListScreen — Premium Dark redesign.
 * Form state → useListEditor, image → useImageUpload.
 */
import React, { useMemo, useRef, useState } from "react";
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

import { useTheme } from "../../contexts/ThemeContext";
import { useAchievements } from "../../contexts/AchievementsContext";
import useImageUpload from "../../hooks/useImageUpload";
import useListEditor from "../../hooks/useListEditor";
import { useToast } from "../../contexts/ToastContext";
import BulkAddModal from "./components/BulkAddModal";
import { invalidatePublicLists } from "../../hooks/usePublicLists";

export default function CreateListScreen({ route }) {
  const navigation = useNavigation();
  const { c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const toast = useToast();
  const { trigger: triggerAchievement } = useAchievements();
  const listId = route?.params?.listId;
  const editor = useListEditor(listId);
  const img = useImageUpload();
  const [saving, setSaving] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  // Her satırdaki 3 input için ref — onSubmitEditing'de next field'a focus
  const wordRefs = useRef([]);
  const meaningRefs = useRef([]);
  const exampleRefs = useRef([]);

  const focusNext = (index, field) => {
    if (field === "word") {
      meaningRefs.current[index]?.focus();
    } else if (field === "meaning") {
      exampleRefs.current[index]?.focus();
    } else if (field === "example") {
      // Son satırda örnek bitirilince → otomatik yeni satır + word'a focus
      if (index === editor.words.length - 1) {
        editor.addWord();
        setTimeout(() => wordRefs.current[index + 1]?.focus(), 50);
      } else {
        wordRefs.current[index + 1]?.focus();
      }
    }
  };

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
      if (img.asset) {
        try {
          finalUrl = await img.upload(img.asset);
        } catch {
          Alert.alert("Uyarı", "Görsel yüklenemedi, mevcut görsel korunacak.");
        }
      }
      const saved = await editor.save(finalUrl);
      // Public lists cache'i geçersiz kıl — diğer ekranlar fresh data alsın
      await invalidatePublicLists();
      // Achievement: ilk liste
      if (!editor.isEdit) triggerAchievement?.("list_created");
      toast.show({
        message: editor.isEdit ? "Liste güncellendi ✓" : "Liste oluşturuldu ✓",
        type: "success",
      });

      // Yeni liste oluşturulduysa "Şimdi Çalış?" sor
      const validWordCount = editor.words.filter(
        (w) => w.word.trim() && w.meaning.trim()
      ).length;
      if (!editor.isEdit && saved?.id && validWordCount > 0) {
        Alert.alert(
          "Liste hazır!",
          `${validWordCount} kelime ile listeyi şimdi çalışmak ister misin?`,
          [
            {
              text: "Sonra",
              style: "cancel",
              onPress: () => navigation.goBack(),
            },
            {
              text: "Şimdi Çalış",
              onPress: () => {
                navigation.replace("Study", {
                  listId: saved.id,
                  listTitle: editor.title.trim(),
                });
              },
            },
          ]
        );
      } else {
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (editor.fetching) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={c.accent} size="large" />
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
                  stroke={c.textPrimary}
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
                { backgroundColor: canSave ? c.accent : c.bgSurface },
              ]}
              accessibilityLabel="Kaydet"
            >
              {saving ? (
                <ActivityIndicator color={c.bgBase} size="small" />
              ) : (
                <Text
                  style={[
                    styles.saveText,
                    { color: canSave ? c.bgBase : c.textMuted },
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
                placeholderTextColor={c.textMuted}
                style={[
                  styles.nameInput,
                  { borderBottomColor: editor.title ? c.accent : c.border },
                ]}
                selectionColor={c.accent}
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
                  <ActivityIndicator color={c.accent} />
                </View>
              )}
            </Pressable>

            {/* Tip */}
            <View style={styles.tip}>
              <Text style={{ fontSize: 24 }}>💡</Text>
              <Text style={styles.tipText}>
                <Text style={{ color: c.accent, fontFamily: c.fontBodyBold }}>İpucu:</Text> En az 5
                kelime ekle, SRS daha verimli çalışsın.
              </Text>
            </View>

            {/* Words header — count + bulk button */}
            <View style={styles.wordsHead}>
              <Text style={[styles.label, { marginBottom: 0 }]}>
                KELİMELER ({editor.words.length})
              </Text>
              <Pressable
                onPress={() => setBulkOpen(true)}
                style={styles.bulkBtn}
                accessibilityLabel="Toplu kelime ekle"
              >
                <Text style={styles.bulkBtnTxt}>📋 Toplu Yapıştır</Text>
              </Pressable>
            </View>

            {editor.words.map((w, i) => (
              <View key={w.id || i} style={styles.wordRow}>
                <View style={styles.wordNum}>
                  <Text style={styles.wordNumText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <TextInput
                    ref={(r) => (wordRefs.current[i] = r)}
                    value={w.word}
                    onChangeText={(v) => editor.updateWord(i, "word", v)}
                    onSubmitEditing={() => focusNext(i, "word")}
                    placeholder="İngilizce"
                    placeholderTextColor={c.textMuted}
                    style={styles.wordInputEn}
                    selectionColor={c.accent}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TextInput
                    ref={(r) => (meaningRefs.current[i] = r)}
                    value={w.meaning}
                    onChangeText={(v) => editor.updateWord(i, "meaning", v)}
                    onSubmitEditing={() => focusNext(i, "meaning")}
                    placeholder="Türkçe"
                    placeholderTextColor={c.textMuted}
                    style={styles.wordInputTr}
                    selectionColor={c.accent}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TextInput
                    ref={(r) => (exampleRefs.current[i] = r)}
                    value={w.example}
                    onChangeText={(v) => editor.updateWord(i, "example", v)}
                    onSubmitEditing={() => focusNext(i, "example")}
                    placeholder="Örnek cümle (opsiyonel)"
                    placeholderTextColor={c.textMuted}
                    style={styles.wordInputEx}
                    selectionColor={c.accent}
                    returnKeyType="next"
                    blurOnSubmit={false}
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

            <Pressable
              onPress={() => {
                editor.addWord();
                // Yeni satır eklenince otomatik focus
                setTimeout(
                  () => wordRefs.current[editor.words.length]?.focus(),
                  60
                );
              }}
              style={styles.addWordBtn}
            >
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
                  { backgroundColor: editor.isPublic ? c.accent : "rgba(255,255,255,0.1)" },
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
                      backgroundColor: editor.isPublic ? c.bgBase : c.textMuted,
                    },
                  ]}
                />
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>

        <BulkAddModal
          visible={bulkOpen}
          onClose={(added) => {
            setBulkOpen(false);
            if (added > 0) {
              toast.show({
                message: `${added} kelime eklendi ✓`,
                type: "success",
              });
            }
          }}
          onAdd={(text) => editor.bulkAdd(text)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bgBase },
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
  backText: { fontSize: 15, color: c.textPrimary, fontFamily: c.fontBodySemi },
  title: { fontSize: 18, color: c.textPrimary, fontFamily: c.fontBodyBold },
  saveBtn: { borderRadius: 12, paddingVertical: 8, paddingHorizontal: 18, minWidth: 70, alignItems: "center" },
  saveText: { fontSize: 14, fontFamily: c.fontBodyBold },

  card: {
    backgroundColor: c.bgElevated,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 14,
  },
  label: {
    fontSize: 10,
    fontFamily: c.fontBodyBold,
    color: c.textMuted,
    letterSpacing: 1.5,
  },
  nameInput: {
    marginTop: 10,
    fontSize: 18,
    color: c.textPrimary,
    fontFamily: c.fontBodySemi,
    borderBottomWidth: 2,
    paddingBottom: 8,
    paddingTop: 0,
  },

  imagePicker: {
    height: 140,
    borderRadius: 16,
    backgroundColor: c.bgElevated,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 14,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: { width: "100%", height: "100%" },
  imageEmpty: { alignItems: "center", gap: 8 },
  imageEmojiIcon: { fontSize: 32, opacity: 0.7 },
  imageEmptyText: { fontSize: 12, color: c.textMuted, fontFamily: c.fontBody },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },

  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: c.accentGlow,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(180,255,79,0.08)",
    marginBottom: 4,
  },
  tipText: { flex: 1, fontSize: 12, color: c.textPrimary, fontFamily: c.fontBody, lineHeight: 18 },

  wordsHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 12,
  },
  bulkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: c.accentGlow,
    borderWidth: 1,
    borderColor: "rgba(180,255,79,0.25)",
  },
  bulkBtnTxt: {
    fontSize: 11,
    color: c.accent,
    fontFamily: c.fontBodyBold,
    letterSpacing: 0.3,
  },
  wordRow: {
    backgroundColor: c.bgElevated,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 10,
  },
  wordNum: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: c.accentGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  wordNumText: { fontSize: 13, color: c.accent, fontFamily: c.fontBodyBold },
  wordInputEn: { fontSize: 15, color: c.textPrimary, fontFamily: c.fontBodySemi, padding: 0 },
  wordInputTr: { fontSize: 13, color: c.textSec, fontFamily: c.fontBody, padding: 0 },
  wordInputEx: { fontSize: 12, color: c.textMuted, fontFamily: c.fontBody, fontStyle: "italic", padding: 0 },
  removeIcon: { fontSize: 14, color: c.textMuted, paddingHorizontal: 6 },

  addWordBtn: {
    marginTop: 2,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(180,255,79,0.2)",
    backgroundColor: c.accentGlow,
    alignItems: "center",
  },
  addWordText: { fontSize: 14, color: c.accent, fontFamily: c.fontBodyBold },

  toggleRow: {
    marginTop: 16,
    backgroundColor: c.bgElevated,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  toggleTitle: { fontSize: 15, color: c.textPrimary, fontFamily: c.fontBodySemi },
  toggleSub: { fontSize: 11, color: c.textMuted, fontFamily: c.fontBody, marginTop: 2 },
  toggle: { width: 50, height: 28, borderRadius: 99, position: "relative" },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 2,
  },
  });
}
