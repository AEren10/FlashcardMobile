/**
 * ForgotPasswordScreen — Claude Design v2.
 */
import React, { useMemo, useState } from "react";
import { fontSize, radius, spacing } from "../../themes/tokens";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "../../components/design/Icon";
import AbstractIllustration from "../../components/design/AbstractIllustration";
import AuthInput from "../../components/auth/AuthInput";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ navigation }) {
  const { c } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const s = useMemo(() => makeStyles(c), [c]);

  const handleReset = async () => {
    if (!EMAIL_RE.test(email)) return Alert.alert("Geçersiz e-posta", "Lütfen doğru bir e-posta gir.");
    try {
      setLoading(true);
      const res = await resetPassword(email.trim().toLowerCase());
      if (res.success) setSent(true);
      else Alert.alert("Hata", res.error || "Şifre sıfırlama maili gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.headerBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={s.back}>
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
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: "center", marginBottom: spacing.sm }}>
              <AbstractIllustration kind="graph" size={140} />
            </View>
            <Text style={s.title}>Şifreni sıfırla</Text>
            <Text style={s.sub}>E-posta adresini gir, sıfırlama bağlantısı yollayalım</Text>

            {sent ? (
              <View style={s.successCard}>
                <Icon d={ICONS.mail} size={36} stroke="#D4AE5E" sw={1.5} />
                <Text style={s.successTitle}>E-posta yollandı</Text>
                <Text style={s.successSub}>
                  Gelen kutunu kontrol et. Bağlantı 24 saat geçerli.
                </Text>
                <Pressable style={s.primaryBtn} onPress={() => navigation.navigate("Login")}>
                  <Text style={s.primaryText}>Giriş'e dön</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <AuthInput
                  label="E-POSTA"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="sen@ornek.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="go"
                  blurOnSubmit
                  onSubmitEditing={handleReset}
                />

                <Pressable
                  onPress={handleReset}
                  disabled={loading}
                  style={({ pressed }) => [s.primaryBtn, (loading || pressed) && { opacity: 0.85 }]}
                  accessibilityLabel="Sıfırlama bağlantısı gönder"
                >
                  {loading ? (
                    <ActivityIndicator color={c.textOnAccent} />
                  ) : (
                    <Text style={s.primaryText}>Sıfırlama Bağlantısı Gönder</Text>
                  )}
                </Pressable>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    headerBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    back: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: { padding: spacing.xxl, paddingTop: spacing.xs, flexGrow: 1 },
    title: {
      fontSize: fontSize["3xl"],
      fontFamily: c.fontDisplay,
      color: c.textPrimary,
      textAlign: "center",
      marginTop: spacing.sm,
    },
    sub: {
      fontSize: fontSize.md,
      color: c.textSec,
      textAlign: "center",
      fontFamily: c.fontBody,
      marginTop: spacing.xs,
      marginBottom: 28,
      paddingHorizontal: spacing.md,
      lineHeight: 20,
    },
    primaryBtn: {
      backgroundColor: c.accent,
      borderRadius: radius.sm,
      paddingVertical: spacing.lg,
      alignItems: "center",
      minHeight: 52,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 4,
    },
    primaryText: { color: c.textOnAccent, fontSize: fontSize.lg, fontFamily: c.fontBodyBold },
    successCard: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.borderAccent,
      padding: spacing.xxl,
      alignItems: "center",
      gap: spacing.sm,
    },
    successTitle: {
      fontSize: fontSize.lg,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
      marginTop: spacing.xs,
    },
    successSub: {
      fontSize: fontSize.md,
      fontFamily: c.fontBody,
      color: c.textSec,
      textAlign: "center",
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.sm,
      lineHeight: 18,
    },
  });
}
