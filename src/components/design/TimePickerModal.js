/**
 * TimePickerModal — saat ve dakika için yuvarlanan wheel picker.
 * iOS UIDatePicker hissi. Tema uyumlu.
 *
 * props:
 *   visible: bool
 *   initialHour: 0-23 (default 9)
 *   initialMinute: 0-59 (default 0)
 *   onConfirm(hour, minute)
 *   onClose()
 *   title: string
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";

const ITEM_H = 44;
const VISIBLE_ROWS = 5; // ortada + 2 üst + 2 alt
const WHEEL_H = ITEM_H * VISIBLE_ROWS;

function Wheel({ values, initial, onChange, c, format }) {
  const ref = useRef(null);
  const scrollY = useRef(new Animated.Value(initial * ITEM_H)).current;
  const lastIndex = useRef(initial);

  useEffect(() => {
    // ilk açılışta initial konuma scroll
    if (ref.current) {
      ref.current.scrollTo({ y: initial * ITEM_H, animated: false });
    }
  }, [initial]);

  const handleMomentumEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const i = Math.round(y / ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, i));
    if (clamped !== lastIndex.current) {
      Haptics.selectionAsync();
      lastIndex.current = clamped;
    }
    onChange(values[clamped]);
    // snap düzeltmesi
    if (ref.current && y !== clamped * ITEM_H) {
      ref.current.scrollTo({ y: clamped * ITEM_H, animated: true });
    }
  };

  return (
    <View style={{ height: WHEEL_H, width: 92, overflow: "hidden" }}>
      <Animated.ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingTop: ITEM_H * 2,
          paddingBottom: ITEM_H * 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {values.map((v, i) => {
          const distance = Animated.divide(
            Animated.subtract(scrollY, i * ITEM_H),
            ITEM_H
          );
          const opacity = distance.interpolate({
            inputRange: [-2.5, -1, 0, 1, 2.5],
            outputRange: [0.2, 0.55, 1, 0.55, 0.2],
            extrapolate: "clamp",
          });
          const scale = distance.interpolate({
            inputRange: [-2, 0, 2],
            outputRange: [0.78, 1, 0.78],
            extrapolate: "clamp",
          });
          return (
            <View
              key={v}
              style={{
                height: ITEM_H,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.Text
                style={{
                  fontFamily: c.fontNum,
                  fontSize: 28,
                  color: c.textPrimary,
                  opacity,
                  transform: [{ scale }],
                }}
              >
                {format(v)}
              </Animated.Text>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

export default function TimePickerModal({
  visible,
  initialHour = 9,
  initialMinute = 0,
  onConfirm,
  onClose,
  title = "Saat seç",
}) {
  const { c } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const hourRef = useRef(initialHour);
  const minuteRef = useRef(initialMinute);

  useEffect(() => {
    if (visible) {
      hourRef.current = initialHour;
      minuteRef.current = initialMinute;
      Haptics.selectionAsync();
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 220, damping: 18 }),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.85);
    }
  }, [visible, fade, scale, initialHour, initialMinute]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm?.(hourRef.current, minuteRef.current);
  };

  if (!visible) return null;
  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[s.overlay, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            s.card,
            {
              backgroundColor: c.bgElevated,
              borderColor: c.border,
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
            {title}
          </Text>
          <Text style={[s.sub, { color: c.textSec, fontFamily: c.fontBody }]}>
            Hatırlatmanın gelmesini istediğin saati seç
          </Text>

          <View style={s.wheelsRow}>
            {/* Highlight band — orta satır */}
            <View
              pointerEvents="none"
              style={[
                s.highlight,
                {
                  backgroundColor: c.accent + "12",
                  borderColor: c.accent + "55",
                  top: WHEEL_H / 2 - ITEM_H / 2,
                },
              ]}
            />
            {/* Top fade */}
            <LinearGradient
              pointerEvents="none"
              colors={[c.bgElevated, "transparent"]}
              style={[s.fadeTop]}
            />
            {/* Bottom fade */}
            <LinearGradient
              pointerEvents="none"
              colors={["transparent", c.bgElevated]}
              style={[s.fadeBottom]}
            />

            <Wheel
              values={hours}
              initial={initialHour}
              onChange={(v) => (hourRef.current = v)}
              c={c}
              format={(v) => String(v).padStart(2, "0")}
            />
            <Text style={[s.colon, { color: c.textPrimary, fontFamily: c.fontNum }]}>
              :
            </Text>
            <Wheel
              values={minutes}
              initial={initialMinute}
              onChange={(v) => (minuteRef.current = v)}
              c={c}
              format={(v) => String(v).padStart(2, "0")}
            />
          </View>

          <View style={s.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                s.btn,
                {
                  backgroundColor: c.bgSurface,
                  borderColor: c.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[s.btnTxt, { color: c.textSec, fontFamily: c.fontBodyMed }]}>
                Vazgeç
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                s.btn,
                {
                  backgroundColor: c.accent,
                  borderColor: c.accent,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[s.btnTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
                Ekle
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  sub: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
  },
  wheelsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: WHEEL_H,
    position: "relative",
    gap: 6,
    marginVertical: 6,
  },
  colon: {
    fontSize: 28,
    paddingHorizontal: spacing.xs,
  },
  highlight: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_H,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_H * 2,
    zIndex: 1,
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_H * 2,
    zIndex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
