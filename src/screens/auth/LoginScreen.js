/**
 * LoginScreen — Claude Design v2.
 * Abstract geometric hero (network illustration) + accent CTA + dark/light parite.
 */
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import AbstractIllustration from "../../components/design/AbstractIllustration";
import AppleSignInButton from "../../components/auth/AppleSignInButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { c } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const { signIn, signInAsGuest } = useAuth();
  const s = useMemo(() => makeStyles(c), [c]);

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert("Eksik bilgi", "E-posta gerekli.");
    if (!EMAIL_RE.test(email)) return Alert.alert("Geçersiz e-posta", "Lütfen doğru bir e-posta gir.");
    if (!password) return Alert.alert("Eksik bilgi", "Şifre gerekli.");
    try {
      setLoading(true);
      const res = await signIn(email.trim().toLowerCase(), password);
      if (!res.success) Alert.alert("Giriş Hatası", res.error || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: "center", marginBottom: 8 }}>
              <AbstractIllustration kind="network" size={140} />
            </View>
            <Text style={s.title}>Hoş geldin</Text>
            <Text style={s.sub}>Kaldığın yerden devam et</Text>

            <View style={s.field}>
              <Text style={s.label}>E-POSTA</Text>
              <View style={[s.input, focused === "email" && s.inputFocus]}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="sen@ornek.com"
                  placeholderTextColor={c.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={s.inputText}
                  selectionColor={c.accent}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  accessibilityLabel="E-posta alanı"
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>ŞİFRE</Text>
              <View style={[s.input, focused === "pw" && s.inputFocus]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={c.textMuted}
                  secureTextEntry
                  style={s.inputText}
                  selectionColor={c.accent}
                  onFocus={() => setFocused("pw")}
                  onBlur={() => setFocused(null)}
                  accessibilityLabel="Şifre alanı"
                />
              </View>
            </View>

            <Pressable
              onPress={() => navigation.navigate("ForgotPassword")}
              style={s.forgot}
              accessibilityLabel="Şifremi unuttum"
            >
              <Text style={s.forgotText}>Şifremi unuttum</Text>
            </Pressable>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [s.primaryBtn, (loading || pressed) && { opacity: 0.85 }]}
              accessibilityLabel="Giriş yap"
            >
              {loading ? (
                <ActivityIndicator color={c.textOnAccent} />
              ) : (
                <Text style={s.primaryText}>Giriş Yap</Text>
              )}
            </Pressable>

            {/* Apple Sign In — sadece iOS'ta otomatik render olur */}
            <View style={{ marginTop: 14 }}>
              <AppleSignInButton
                onError={(msg) => Alert.alert("Apple ile Giriş", msg)}
              />
            </View>

            <Pressable onPress={signInAsGuest} style={s.ghostBtn} accessibilityLabel="Misafir olarak gir">
              <Text style={s.ghostText}>Misafir olarak keşfet</Text>
            </Pressable>

            <View style={s.bottomRow}>
              <Text style={s.bottomText}>Hesabın yok mu?</Text>
              <Pressable onPress={() => navigation.navigate("Register")} hitSlop={8}>
                <Text style={s.bottomLink}> Kayıt ol</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    scroll: { padding: 24, paddingTop: 24, flexGrow: 1 },
    title: {
      fontSize: 36,
      fontFamily: c.fontDisplay,
      color: c.textPrimary,
      textAlign: "center",
      marginTop: 8,
    },
    sub: {
      fontSize: 14,
      color: c.textSec,
      textAlign: "center",
      fontFamily: c.fontBody,
      marginTop: 4,
      marginBottom: 24,
    },
    field: { marginBottom: 14 },
    label: {
      fontSize: 11,
      letterSpacing: 1.4,
      color: c.textMuted,
      fontFamily: c.fontBodyBold,
      marginBottom: 8,
    },
    input: {
      backgroundColor: c.bgElevated,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    inputFocus: {
      borderColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    inputText: {
      fontSize: 15,
      color: c.textPrimary,
      fontFamily: c.fontBody,
      paddingVertical: 10,
    },
    forgot: { alignSelf: "flex-end", marginTop: 2, marginBottom: 18, padding: 4 },
    forgotText: { fontSize: 13, color: c.accent, fontFamily: c.fontBodySemi },
    primaryBtn: {
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      minHeight: 52,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 4,
    },
    primaryText: { color: c.textOnAccent, fontSize: 16, fontFamily: c.fontBodyBold },
    ghostBtn: { marginTop: 12, paddingVertical: 14, alignItems: "center" },
    ghostText: { color: c.textSec, fontSize: 14, fontFamily: c.fontBodySemi },
    bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
    bottomText: { color: c.textSec, fontFamily: c.fontBody, fontSize: 14 },
    bottomLink: { color: c.accent, fontFamily: c.fontBodyBold, fontSize: 14 },
  });
}
