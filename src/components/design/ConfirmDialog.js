/**
 * ConfirmDialog — Alert.alert yerine custom Türkçe modal.
 * BaseModal üzerine sarılı, primary/destructive variant destekli.
 *
 * Kullanım:
 *   <ConfirmDialog
 *     visible={open}
 *     title="Çalışmayı bırakmak istiyor musun?"
 *     message="İlerlemen kaydedilmeyecek."
 *     confirmText="Çık"
 *     cancelText="Devam Et"
 *     destructive
 *     onConfirm={...}
 *     onCancel={() => setOpen(false)}
 *   />
 *
 * imperative kullanım da olabilir (useConfirm hook, sonra eklenir).
 */
import { radius } from "../../themes/tokens";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import BaseModal from "./BaseModal";

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Tamam",
  cancelText = "Vazgeç",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const { c } = useTheme();

  return (
    <BaseModal visible={visible} onClose={onCancel} dismissOnOverlayTap={false}>
      <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
        {title}
      </Text>
      {!!message && (
        <Text style={[s.message, { color: c.textSec, fontFamily: c.fontBody }]}>
          {message}
        </Text>
      )}

      <View style={s.row}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onCancel?.();
          }}
          style={({ pressed }) => [
            s.btn,
            {
              backgroundColor: c.bgSurface,
              borderColor: c.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[s.btnTxt, { color: c.textSec, fontFamily: c.fontBodySemi }]}>
            {cancelText}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.notificationAsync(
              destructive
                ? Haptics.NotificationFeedbackType.Warning
                : Haptics.NotificationFeedbackType.Success
            );
            onConfirm?.();
          }}
          style={({ pressed }) => [
            s.btn,
            {
              backgroundColor: destructive ? c.error : c.accent,
              borderColor: destructive ? c.error : c.accent,
              opacity: pressed ? 0.85 : 1,
              shadowColor: destructive ? c.error : c.accent,
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            },
          ]}
        >
          <Text
            style={[
              s.btnTxt,
              { color: destructive ? "#fff" : c.textOnAccent, fontFamily: c.fontBodyBold },
            ]}
          >
            {confirmText}
          </Text>
        </Pressable>
      </View>
    </BaseModal>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, lineHeight: 26, marginBottom: 8 },
  message: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: { fontSize: 14, letterSpacing: 0.3 },
});
