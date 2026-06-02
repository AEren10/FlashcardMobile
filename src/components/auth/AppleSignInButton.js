/**
 * AppleSignInButton — sadece iOS'ta render edilir (Apple guideline 4.8).
 * expo-apple-authentication + Supabase signInWithIdToken.
 */
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import supabase from "../../supabase/client";

export default function AppleSignInButton({ onSuccess, onError, style }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    AppleAuthentication.isAvailableAsync()
      .then(setAvailable)
      .catch(() => setAvailable(false));
  }, []);

  if (Platform.OS !== "ios" || !available) return null;

  const handlePress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Apple ID token alınamadı");
      }

      // Supabase ile signIn
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });

      if (error) throw error;
      onSuccess?.(data);
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") return; // kullanıcı vazgeçti
      onError?.(e.message || "Apple ile giriş başarısız");
    }
  };

  return (
    <View style={[s.wrap, style]}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={14}
        style={s.btn}
        onPress={handlePress}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: "100%" },
  btn: { width: "100%", height: 52 },
});
