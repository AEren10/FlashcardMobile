/**
 * EditProfileScreen — display_name + avatar düzenleme.
 * profiles tablosuna update.
 */
import { radius, spacing } from "../../themes/tokens";
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
import { useProfile } from "../../contexts/ProfileContext";
import { getProfile, updateProfile, uploadAvatar } from "../../supabase/profile";
import { useToast } from "../../contexts/ToastContext";
import Icon, { ICONS } from "../../components/design/Icon";
import PremiumButton from "../../components/design/PremiumButton";

export default function EditProfileScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { getUserId, getUserEmail } = useAuth();
  const { patchOptimistic, refresh: refreshProfile } = useProfile();
  const toast = useToast();
  const userId = getUserId();
  const email = getUserEmail();

  const [displayName, setDisplayName] = useState("");
  const [avatarUri, setAvatarUri] = useState(null);
  const [avatarAsset, setAvatarAsset] = useState(null); // {uri, base64, mimeType}
  const [originalAvatar, setOriginalAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const res = await getProfile(userId);
      if (res.success && res.data) {
        setDisplayName(res.data.display_name || "");
        setOriginalAvatar(res.data.avatar_url || null);
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
      base64: true, // KRİTİK: fetch().blob() RN'de 0-byte gönderiyordu, base64 ile bypass
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      Haptics.selectionAsync();
      const a = res.assets[0];
      setAvatarUri(a.uri);
      setAvatarAsset({
        uri: a.uri,
        base64: a.base64,
        mimeType: a.mimeType || a.type,
        fileName: a.fileName,
      });
    }
  };

  const save = () => {
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      Alert.alert("İsim gerekli", "Lütfen bir görünen isim gir.");
      return;
    }

    // 1) OPTIMISTIC — UI'ı hemen güncelle.
    //    Avatar local URI'yi context'e yaz (Image RN'de file://uri'yi destekler),
    //    DB sync bitince cache-busted public URL ile değişir.
    const localAvatar = avatarAsset?.uri || originalAvatar;
    patchOptimistic({ display_name: trimmedName, avatar_url: localAvatar });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show({ message: "Profil güncellendi ✓", type: "success" });
    navigation.goBack();

    // 2) BACKGROUND — gerçek upload + DB write
    (async () => {
      let finalAvatarUrl = originalAvatar;
      if (avatarAsset) {
        const up = await uploadAvatar(userId, avatarAsset);
        if (up.success && up.url) {
          finalAvatarUrl = up.url;
          // Public URL ile context'i de güncelle (sonraki app açılışında cache çalışsın)
          patchOptimistic({ avatar_url: up.url });
        } else {
          toast.show({
            message: "Avatar yüklenemedi — " + (up.error || "tekrar dene"),
            type: "error",
            duration: 4000,
          });
        }
      }
      const res = await updateProfile(userId, {
        display_name: trimmedName,
        avatar_url: finalAvatarUrl,
      });
      if (!res.success) {
        toast.show({
          message: "Güncelleme başarısız — internet kontrol et",
          type: "error",
          duration: 4000,
        });
        // Rollback için fresh fetch
        refreshProfile?.();
      }
    })();
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

            {/* İsim */}
            <Text style={s.label}>İSİM</Text>
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
            <View style={{ marginTop: spacing.xxxl }}>
              <PremiumButton
                label="Kaydet"
                variant="primary"
                onPress={save}
                disabled={loading}
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
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
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
      marginTop: spacing.md,
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
      borderRadius: radius.md,
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
      marginBottom: spacing.sm,
    },
    input: {
      borderBottomWidth: 2,
      paddingVertical: spacing.sm,
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
