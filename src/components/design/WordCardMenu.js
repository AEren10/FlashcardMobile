/**
 * WordCardMenu — Flashcard üst-sağ köşede 3-noktalı menü.
 * İçinde:
 *   - "Bu kelimeyi biliyorum" → SRS graduate (kelime 21 gün sonra döner)
 *   - "Yanlış çeviri bildir"  → kullanıcı feedback, hatayı işaretle
 *
 * onGraduate ve onReport callback'leri opsiyonel — props olarak gelmezse o seçenek görünmez.
 */
import React, { useState, useRef, useEffect } from "react";
import { Pressable, View, Text, StyleSheet, Modal, Animated, Easing } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import Icon, { ICONS } from "./Icon";

// 3-dot icon path
const DOTS = "M12 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z";

export default function WordCardMenu({ size = 38, onGraduate, onReport }) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);

  const handlePress = (e) => {
    e?.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpen(true);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        hitSlop={10}
        style={[
          s.btn,
          {
            width: size,
            height: size,
            borderRadius: 12,
            borderColor: c.border,
            backgroundColor: c.bgSurface,
          },
        ]}
        accessibilityLabel="Kelime menüsü"
      >
        <Icon d={DOTS} size={18} stroke={c.textSec} fill={c.textSec} sw={1} />
      </Pressable>

      <ActionSheet visible={open} onClose={() => setOpen(false)} c={c}>
        {onGraduate && (
          <SheetItem
            icon={ICONS.check}
            iconColor={c.success}
            title="Bu kelimeyi biliyorum"
            subtitle="Tekrar 21 gün sonra çıkar"
            onPress={() => {
              setOpen(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onGraduate?.();
            }}
            c={c}
          />
        )}
        {onReport && (
          <SheetItem
            icon={ICONS.shield}
            iconColor={c.warning}
            title="Yanlış çeviri bildir"
            subtitle="Bu kelimenin anlamı/cümlesi yanlış"
            onPress={() => {
              setOpen(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onReport?.();
            }}
            c={c}
          />
        )}
        <SheetItem
          icon={ICONS.x}
          iconColor={c.textMuted}
          title="İptal"
          onPress={() => setOpen(false)}
          c={c}
        />
      </ActionSheet>
    </>
  );
}

function ActionSheet({ visible, onClose, c, children }) {
  const slide = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: visible ? 1 : 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, slide, fade]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.55)", opacity: fade }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          s.sheet,
          {
            backgroundColor: c.bgElevated,
            borderColor: c.border,
            transform: [
              { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) },
            ],
          },
        ]}
      >
        <View style={[s.handle, { backgroundColor: c.textMuted }]} />
        {children}
      </Animated.View>
    </Modal>
  );
}

function SheetItem({ icon, iconColor, title, subtitle, onPress, c }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.item,
        { backgroundColor: pressed ? c.bgSurface : "transparent" },
      ]}
    >
      <View style={[s.itemIcon, { backgroundColor: iconColor + "22", borderColor: iconColor + "44" }]}>
        <Icon d={icon} size={18} stroke={iconColor} sw={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.itemTitle, { color: c.textPrimary, fontFamily: c.fontBodySemi }]}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={[s.itemSub, { color: c.textSec, fontFamily: c.fontBody }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
    opacity: 0.4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 15,
  },
  itemSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
