/**
 * AuthInput — Login/Register/ForgotPassword ortak input.
 * - forwardRef → field-to-field focus chain
 * - secure entry için Göster/Gizle toggle
 * - autoComplete + textContentType → iOS/Android autofill
 * - returnKeyType + onSubmitEditing → klavye next/go davranışı
 */
import React, { forwardRef, useState, useMemo } from "react";
import { fontSize } from "../../themes/tokens";
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const AuthInput = forwardRef(function AuthInput(
  {
    label,
    value,
    onChangeText,
    placeholder,
    secure = false,
    returnKeyType = "next",
    onSubmitEditing,
    blurOnSubmit = false,
    autoComplete,
    textContentType,
    keyboardType = "default",
    autoCapitalize = "sentences",
    autoCorrect = true,
    accessibilityLabel,
  },
  ref
) {
  const { c } = useTheme();
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const s = useMemo(() => makeStyles(c), [c]);
  const hide = secure && !show;

  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.input, s.row, focused && s.inputFocus]}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.textMuted}
          secureTextEntry={hide}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={autoCorrect}
          autoComplete={autoComplete}
          textContentType={textContentType}
          importantForAutofill="yes"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={c.accent}
          style={[s.inputText, s.flex]}
          accessibilityLabel={accessibilityLabel || label}
        />
        {secure && (
          <Pressable
            onPress={() => setShow((v) => !v)}
            hitSlop={10}
            style={s.eyeBtn}
            accessibilityLabel={show ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            <Text style={[s.eyeTxt, { color: c.textSec, fontFamily: c.fontBodySemi }]}>
              {show ? "Gizle" : "Göster"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
});

function makeStyles(c) {
  return StyleSheet.create({
    field: { marginBottom: 14 },
    label: {
      fontSize: fontSize.sm,
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
    row: { flexDirection: "row", alignItems: "center" },
    inputFocus: {
      borderColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    inputText: {
      fontSize: fontSize.lg,
      color: c.textPrimary,
      fontFamily: c.fontBody,
      paddingVertical: Platform.OS === "ios" ? 12 : 10,
    },
    flex: { flex: 1 },
    eyeBtn: { paddingHorizontal: 6, paddingVertical: 4, marginLeft: 4 },
    eyeTxt: { fontSize: fontSize.sm, letterSpacing: 0.3 },
  });
}

export default AuthInput;
