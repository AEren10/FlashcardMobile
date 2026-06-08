/**
 * BaseModal — tüm modal'ların tek base'i.
 * Standart fade overlay + scale entrance + border/radius/elevation tokens.
 *
 * Kullanım:
 *   <BaseModal visible={open} onClose={() => setOpen(false)} maxWidth={400}>
 *     <Text>Header</Text>
 *     <Pressable>Action</Pressable>
 *   </BaseModal>
 *
 * Tutarlılık: NudgeModal, QuizModeModal, MistakesListModal, RandomReviewModal,
 * StudyModeModal hepsi bu pattern'e refactor edilebilir (eski stiller şimdilik kalıyor).
 */
import React, { useEffect, useRef } from "react";
import { Modal, View, Pressable, StyleSheet, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";

export default function BaseModal({
  visible,
  onClose,
  children,
  maxWidth = 400,
  dismissOnOverlayTap = true,
  haptic = true,
}) {
  const { c } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    if (visible) {
      if (haptic) Haptics.selectionAsync();
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 220, damping: 18 }),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.88);
    }
  }, [visible, fade, scale, haptic]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        style={s.overlayPress}
        onPress={dismissOnOverlayTap ? onClose : undefined}
        accessibilityLabel="Modal kapatma alanı"
      >
        <Animated.View style={[s.overlay, { opacity: fade }]}>
          {/* Inner Pressable — kart üstündeki tıklamaları yutmaz overlay'e ulaşmaz */}
          <Pressable onPress={() => {}}>
            <Animated.View
              style={[
                s.card,
                {
                  maxWidth,
                  backgroundColor: c.bgElevated,
                  borderColor: c.border,
                  transform: [{ scale }],
                  shadowColor: "#000",
                },
              ]}
            >
              {children}
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlayPress: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
