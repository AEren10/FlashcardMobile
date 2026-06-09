/**
 * RegisterScreen — Claude Design v2.
 */
import React, { useMemo, useRef, useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import AbstractIllustration from "../../components/design/AbstractIllustration";
import AuthInput from "../../components/auth/AuthInput";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { c } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const s = useMemo(() => makeStyles(c), [c]);

  const lastRef = useRef(null);
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const pw2Ref = useRef(null);

  const validate = () => {
    if (!firstName.trim()) return "Ad gerekli.";
    if (!lastName.trim()) return "Soyad gerekli.";
    if (!EMAIL_RE.test(email)) return "Geçerli bir e-posta gir.";
    if (password.length < 8) return "Şifre en az 8 karakter olmalı.";
    if (password !== confirmPassword) return "Şifreler eşleşmiyor.";
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) return Alert.alert("Eksik bilgi", err);
    try {
      setLoading(true);
      const res = await signUp(email.trim().toLowerCase(), password, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: `${firstName.trim()} ${lastName.trim()}`,
      });
      if (!res.success) {
        Alert.alert("Kayıt Hatası", res.error || "Kayıt yapılamadı.");
      } else if (res.needsConfirmation) {
        Alert.alert("E-posta Onayı", res.message || "Lütfen e-postanı onayla.", [
          { text: "Tamam", onPress: () => navigation.navigate("Login") },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
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
            <View style={{ alignItems: "center", marginBottom: spacing.xs }}>
              <AbstractIllustration kind="stack" size={120} />
            </View>
            <Text style={s.title}>Hesap oluştur</Text>
            <Text style={s.sub}>Öğrenme yolculuğun başlasın</Text>

            <View style={s.nameRow}>
              <View style={s.flex}>
                <AuthInput
                  label="AD"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Ahmet"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="given-name"
                  textContentType="givenName"
                  returnKeyType="next"
                  onSubmitEditing={() => lastRef.current?.focus()}
                />
              </View>
              <View style={s.flex}>
                <AuthInput
                  ref={lastRef}
                  label="SOYAD"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Eren"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="family-name"
                  textContentType="familyName"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
            </View>

            <AuthInput
              ref={emailRef}
              label="E-POSTA"
              value={email}
              onChangeText={setEmail}
              placeholder="sen@ornek.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => pwRef.current?.focus()}
            />

            <AuthInput
              ref={pwRef}
              label="ŞİFRE"
              value={password}
              onChangeText={setPassword}
              placeholder="En az 8 karakter"
              secure
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => pw2Ref.current?.focus()}
            />

            <AuthInput
              ref={pw2Ref}
              label="ŞİFRE TEKRAR"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secure
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="go"
              blurOnSubmit
              onSubmitEditing={handleRegister}
            />

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => [s.primaryBtn, (loading || pressed) && { opacity: 0.85 }]}
              accessibilityLabel="Hesap oluştur"
            >
              {loading ? (
                <ActivityIndicator color={c.textOnAccent} />
              ) : (
                <Text style={s.primaryText}>Hesap Oluştur</Text>
              )}
            </Pressable>

            <View style={s.bottomRow}>
              <Text style={s.bottomText}>Zaten hesabın var mı?</Text>
              <Pressable onPress={() => navigation.navigate("Login")} hitSlop={8}>
                <Text style={s.bottomLink}> Giriş yap</Text>
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
    scroll: { padding: spacing.xxl, paddingTop: spacing.lg, flexGrow: 1 },
    nameRow: { flexDirection: "row", gap: 10 },
    flex: { flex: 1 },
    title: {
      fontSize: fontSize["3xl"],
      fontFamily: c.fontDisplay,
      color: c.textPrimary,
      textAlign: "center",
      marginTop: spacing.xs,
    },
    sub: {
      fontSize: fontSize.md,
      color: c.textSec,
      textAlign: "center",
      fontFamily: c.fontBody,
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
    primaryBtn: {
      backgroundColor: c.accent,
      borderRadius: radius.sm,
      paddingVertical: spacing.lg,
      alignItems: "center",
      minHeight: 52,
      marginTop: spacing.md,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 4,
    },
    primaryText: { color: c.textOnAccent, fontSize: fontSize.lg, fontFamily: c.fontBodyBold },
    bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
    bottomText: { color: c.textSec, fontFamily: c.fontBody, fontSize: fontSize.md },
    bottomLink: { color: c.accent, fontFamily: c.fontBodyBold, fontSize: fontSize.md },
  });
}
