/**
 * LoginScreen — vibrant hero + accent glow + keyboard-safe inputs.
 */
import React, { useMemo, useRef, useState } from "react";
import { fontSize, radius, spacing } from "../../themes/tokens";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import AbstractIllustration from "../../components/design/AbstractIllustration";
import AppleSignInButton from "../../components/auth/AppleSignInButton";
import AuthInput from "../../components/auth/AuthInput";
import Icon, { ICONS } from "../../components/design/Icon";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { c, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signInAsGuest } = useAuth();
  const s = useMemo(() => makeStyles(c, isDark), [c, isDark]);
  const pwRef = useRef(null);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) return setError("E-posta gerekli.");
    if (!EMAIL_RE.test(email)) return setError("Lütfen doğru bir e-posta gir.");
    if (!password) return setError("Şifre gerekli.");
    try {
      setLoading(true);
      const res = await signIn(email.trim().toLowerCase(), password);
      if (!res.success) setError(res.error || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {/* Hero: gradient glow + illustration */}
            <View style={s.heroWrap}>
              <LinearGradient
                colors={[
                  isDark ? c.accent + "18" : c.accent + "14",
                  isDark ? c.cobalt + "10" : c.cobalt + "08",
                  "transparent",
                ]}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.7, y: 1 }}
                style={s.heroBg}
              />
              <View style={s.glowRing}>
                <AbstractIllustration kind="network" size={150} />
              </View>
            </View>

            {/* Welcome */}
            <Text style={s.title}>Hoş geldin</Text>
            <Text style={s.sub}>Kaldığın yerden devam et</Text>

            {/* Inputs */}
            <View style={s.form}>
              <AuthInput
                label="E-POSTA"
                value={email}
                onChangeText={(v) => { setEmail(v); setError(""); }}
                placeholder="sen@ornek.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => pwRef.current?.focus()}
                accessibilityLabel="E-posta alanı"
              />

              <AuthInput
                ref={pwRef}
                label="SIFRE"
                value={password}
                onChangeText={(v) => { setPassword(v); setError(""); }}
                placeholder="••••••••"
                secure
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="go"
                blurOnSubmit
                onSubmitEditing={handleLogin}
                accessibilityLabel="Şifre alanı"
              />

              <Pressable
                onPress={() => navigation.navigate("ForgotPassword")}
                style={s.forgot}
                accessibilityLabel="Şifremi unuttum"
              >
                <Text style={s.forgotText}>Şifremi unuttum</Text>
              </Pressable>

              {/* Inline error */}
              {!!error && (
                <View style={s.errorBox}>
                  <Icon d={ICONS.alertCircle || ICONS.x} size={16} stroke={c.error} sw={2} />
                  <Text style={s.errorText}>{error}</Text>
                </View>
              )}

              {/* Primary CTA */}
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => [s.primaryBtn, (loading || pressed) && { opacity: 0.85 }]}
                accessibilityLabel="Giriş yap"
              >
                <LinearGradient
                  colors={[c.accent, isDark ? c.accent + "CC" : c.cobalt]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.primaryGrad}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={s.primaryText}>Giriş Yap</Text>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Apple Sign In */}
              <View style={{ marginTop: 14 }}>
                <AppleSignInButton
                  onError={(msg) => setError(msg)}
                />
              </View>

              {/* Guest */}
              <Pressable onPress={signInAsGuest} style={s.ghostBtn} accessibilityLabel="Misafir olarak gir">
                <Text style={s.ghostText}>Misafir olarak keşfet</Text>
              </Pressable>
            </View>

            {/* Bottom */}
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

function makeStyles(c, isDark) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    scroll: {
      paddingHorizontal: spacing.xxl,
      paddingTop: spacing.md,
      paddingBottom: 40,
      flexGrow: 1,
    },

    heroWrap: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
      height: 180,
    },
    heroBg: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 100,
      opacity: 0.8,
    },
    glowRing: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 1.5,
      borderColor: c.accent + "22",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? c.accent + "08" : c.accent + "06",
    },

    title: {
      fontSize: 42,
      fontFamily: c.fontDisplay,
      color: c.textPrimary,
      textAlign: "center",
      lineHeight: 50,
    },
    sub: {
      fontSize: fontSize.lg,
      color: c.textSec,
      textAlign: "center",
      fontFamily: c.fontBody,
      marginTop: 6,
      marginBottom: spacing.xl,
    },

    form: {},

    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: c.error + "14",
      borderWidth: 1,
      borderColor: c.error + "44",
      borderRadius: radius.sm,
      paddingHorizontal: 14,
      paddingVertical: 11,
      marginBottom: 16,
    },
    errorText: {
      flex: 1,
      fontSize: fontSize.md,
      color: c.error,
      fontFamily: c.fontBodySemi,
      lineHeight: 18,
    },

    forgot: { alignSelf: "flex-end", marginTop: 0, marginBottom: 20, padding: spacing.xs },
    forgotText: { fontSize: fontSize.md, color: c.accent, fontFamily: c.fontBodySemi },

    primaryBtn: {
      borderRadius: radius.sm,
      overflow: "hidden",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
      elevation: 6,
    },
    primaryGrad: {
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      borderRadius: radius.sm,
    },
    primaryText: {
      color: "#FFFFFF",
      fontSize: fontSize.lg,
      fontFamily: c.fontBodyBold,
      letterSpacing: 0.4,
    },

    ghostBtn: { marginTop: spacing.md, paddingVertical: 14, alignItems: "center" },
    ghostText: { color: c.textSec, fontSize: fontSize.md, fontFamily: c.fontBodySemi },

    bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    bottomText: { color: c.textSec, fontFamily: c.fontBody, fontSize: fontSize.md },
    bottomLink: { color: c.accent, fontFamily: c.fontBodyBold, fontSize: fontSize.md },
  });
}
