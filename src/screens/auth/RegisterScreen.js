/**
 * RegisterScreen — Claude Design v2.
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { c } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const { signUp } = useAuth();
  const s = useMemo(() => makeStyles(c), [c]);

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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: "center", marginBottom: 4 }}>
              <AbstractIllustration kind="stack" size={120} />
            </View>
            <Text style={s.title}>Hesap oluştur</Text>
            <Text style={s.sub}>Öğrenme yolculuğun başlasın</Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[s.field, { flex: 1 }]}>
                <Text style={s.label}>AD</Text>
                <View style={[s.input, focused === "first" && s.inputFocus]}>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Ahmet"
                    placeholderTextColor={c.textMuted}
                    style={s.inputText}
                    selectionColor={c.accent}
                    onFocus={() => setFocused("first")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>
              <View style={[s.field, { flex: 1 }]}>
                <Text style={s.label}>SOYAD</Text>
                <View style={[s.input, focused === "last" && s.inputFocus]}>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Eren"
                    placeholderTextColor={c.textMuted}
                    style={s.inputText}
                    selectionColor={c.accent}
                    onFocus={() => setFocused("last")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>
            </View>

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
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>ŞİFRE</Text>
              <View style={[s.input, focused === "pw" && s.inputFocus]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="En az 8 karakter"
                  placeholderTextColor={c.textMuted}
                  secureTextEntry
                  style={s.inputText}
                  selectionColor={c.accent}
                  onFocus={() => setFocused("pw")}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>ŞİFRE TEKRAR</Text>
              <View style={[s.input, focused === "pw2" && s.inputFocus]}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor={c.textMuted}
                  secureTextEntry
                  style={s.inputText}
                  selectionColor={c.accent}
                  onFocus={() => setFocused("pw2")}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>

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
    scroll: { padding: 24, paddingTop: 16, flexGrow: 1 },
    title: {
      fontSize: 32,
      fontFamily: c.fontDisplay,
      color: c.textPrimary,
      textAlign: "center",
      marginTop: 4,
    },
    sub: {
      fontSize: 14,
      color: c.textSec,
      textAlign: "center",
      fontFamily: c.fontBody,
      marginTop: 4,
      marginBottom: 20,
    },
    field: { marginBottom: 12 },
    label: {
      fontSize: 11,
      letterSpacing: 1.4,
      color: c.textMuted,
      fontFamily: c.fontBodyBold,
      marginBottom: 6,
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
    primaryBtn: {
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      minHeight: 52,
      marginTop: 12,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 4,
    },
    primaryText: { color: c.textOnAccent, fontSize: 16, fontFamily: c.fontBodyBold },
    bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
    bottomText: { color: c.textSec, fontFamily: c.fontBody, fontSize: 14 },
    bottomLink: { color: c.accent, fontFamily: c.fontBodyBold, fontSize: 14 },
  });
}
