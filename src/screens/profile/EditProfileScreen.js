/**
 * EditProfileScreen — display_name + avatar düzenleme.
 * profiles tablosuna update.
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../supabase/client";
import { useToast } from "../../contexts/ToastContext";
import Icon, { ICONS } from "../../components/design/Icon";
import PremiumButton from "../../components/design/PremiumButton";

export default function EditProfileScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { getUserId, getUserEmail } = useAuth();
  const toast = useToast();
  const userId = getUserId();
  const email = getUserEmail();

  const [displayName, setDisplayName] = useState("");
  const [avatarUri, setAvatarUri] = useState(null);
  const [originalAvatar, setOriginalAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name || "");
        setOriginalAvatar(data.avatar_url || null);
      }
      setLoading(false);
    })();
  }, [userId]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("İzin gerekli", "Fotoğraf seçmek için izin ver.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      Haptics.selectionAsync();
      setAvatarUri(res.assets[0].uri);
    }
  };

  const save = async () => {
    if (!displayName.trim()) {
      Alert.alert("İsim gerekli", "Lütfen bir görünen isim gir.");
      return;
    }
    setSaving(true);
    try {
      let avatarUrl = originalAvatar;
      if (avatarUri) {
        // Upload to storage
        const fileExt = avatarUri.split(".").pop();
        const fileName = `${userId}/avatar.${fileExt}`;
        const response = await fetch(avatarUri);
        const blob = await response.blob();
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(fileName, blob, { upsert: true, contentType: blob.type });
        if (upErr) console.warn("Avatar upload fail:", upErr.message);
        else {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
          avatarUrl = urlData?.publicUrl;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (error) throw error;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.show({ message: "Profil güncellendi ✓", type: "success" });
      navigation.goBack();
    } catch (e) {
      Alert.alert("Hata", e.message || "Profil kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const previewUri = avatarUri || originalAvatar;
  const initial = (displayName || email || "?").charAt(0).toUpperCase();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          {/* Header */}
          <View style={s.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={[s.iconBtn, { borderColor: c.border, backgroundColor: c.bgSurface }]}
              hitSlop={12}
              accessibilityLabel="İptal"
            >
              <Icon d={ICONS.x} size={18} stroke={c.textPrimary} sw={2} />
            </Pressable>
            <Text style={s.title}>Profili Düzenle</Text>
            <View style={{ width: 38 }} />
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 22, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar */}
            <Pressable onPress={pickAvatar} style={s.avatarWrap}>
              {previewUri ? (
                <Image source={{ uri: previewUri }} style={s.avatarImg} />
              ) : (
                <LinearGradient
                  colors={[c.accent, c.cobalt]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.avatarFallback}
                >
                  <Text style={s.avatarLetter}>{initial}</Text>
                </LinearGradient>
              )}
              <View style={[s.editBadge, { backgroundColor: c.accent }]}>
                <Text style={{ fontSize: 14 }}>📷</Text>
              </View>
            </Pressable>

            {/* Display name */}
            <Text style={s.label}>GÖRÜNEN İSİM</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Adın"
              placeholderTextColor={c.textMuted}
              style={[s.input, { borderBottomColor: displayName ? c.accent : c.border }]}
              selectionColor={c.accent}
              maxLength={40}
              editable={!loading}
            />

            {/* Email read-only */}
            <Text style={[s.label, { marginTop: 22 }]}>E-POSTA</Text>
            <Text style={s.emailTxt}>{email || "—"}</Text>

            {/* Save */}
            <View style={{ marginTop: 32 }}>
              <PremiumButton
                label="Kaydet"
                variant="primary"
                onPress={save}
                disabled={saving || loading}
                hapticStyle="success"
                block
                size="lg"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      gap: 12,
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 17,
      color: c.textPrimary,
      fontFamily: c.fontBodyBold,
    },
    avatarWrap: {
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 28,
      width: 110,
      height: 110,
    },
    avatarImg: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 2,
      borderColor: c.accent,
    },
    avatarFallback: {
      width: 110,
      height: 110,
      borderRadius: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarLetter: {
      fontSize: 44,
      color: c.textOnAccent,
      fontFamily: c.fontDisplay,
    },
    editBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: c.bgBase,
    },
    label: {
      fontSize: 10,
      letterSpacing: 1.5,
      color: c.textMuted,
      fontFamily: c.fontBodyBold,
      marginBottom: 8,
    },
    input: {
      borderBottomWidth: 2,
      paddingVertical: 8,
      fontSize: 18,
      color: c.textPrimary,
      fontFamily: c.fontBodySemi,
    },
    emailTxt: {
      fontSize: 16,
      color: c.textSec,
      fontFamily: c.fontBody,
    },
  });
}
