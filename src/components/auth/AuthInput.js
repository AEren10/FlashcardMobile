/**
 * AuthInput — Login/Register/ForgotPassword ortak input.
 * - forwardRef → field-to-field focus chain
 * - Pressable wrapper → tap anywhere to focus (keyboard fix)
 * - secure entry için Göster/Gizle toggle
 * - autoComplete + textContentType → iOS/Android autofill
 */
import React, { forwardRef, useRef, useState, useMemo } from "react";
import { fontSize, radius, spacing } from "../../themes/tokens";
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
  const localRef = useRef(null);

  const setRefs = (el) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const forceFocus = () => localRef.current?.focus();

  return (
    <View style={s.field}>
      {label && <Text style={s.label}>{label}</Text>}
      <Pressable
        onPress={forceFocus}
        style={[s.input, s.row, focused && s.inputFocus]}
      >
        <TextInput
          ref={setRefs}
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
          editable
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
      </Pressable>
    </View>
  );
});

function makeStyles(c) {
  return StyleSheet.create({
    field: { marginBottom: 16 },
    label: {
      fontSize: fontSize.sm,
      letterSpacing: 1.2,
      color: c.textMuted,
      fontFamily: c.fontBodyBold,
      marginBottom: 6,
    },
    input: {
      backgroundColor: c.bgElevated,
      borderRadius: radius.sm,
      paddingHorizontal: 16,
      minHeight: 54,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    row: { flexDirection: "row", alignItems: "center" },
    inputFocus: {
      borderColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 2,
    },
    inputText: {
      fontSize: fontSize.lg,
      color: c.textPrimary,
      fontFamily: c.fontBody,
      paddingVertical: Platform.OS === "ios" ? 14 : 12,
    },
    flex: { flex: 1 },
    eyeBtn: { paddingHorizontal: 8, paddingVertical: spacing.sm, marginLeft: spacing.xs },
    eyeTxt: { fontSize: fontSize.sm, letterSpacing: 0.3 },
  });
}

export default AuthInput;
