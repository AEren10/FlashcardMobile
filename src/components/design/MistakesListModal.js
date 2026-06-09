/**
 * MistakesListModal — "Sana özel liste hazırladık" celebration modal.
 * Study/Quiz sonrası, 5+ yeni kelime mistakes listesine eklenirse açılır.
 */
import { radius } from "../../themes/tokens";
import React, { useEffect, useRef } from "react";
import Icon, { ICONS } from "./Icon";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import PremiumButton from "./PremiumButton";

const { width: W } = Dimensions.get("window");

export default function MistakesListModal({
  visible,
  addedCount = 0,
  onStudy,
  onLater,
}) {
  const { c } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          stiffness: 200,
          damping: 16,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(wave, {
              toValue: 1,
              duration: 1400,
              useNativeDriver: true,
            }),
            Animated.timing(wave, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        ),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.6);
      wave.setValue(0);
    }
  }, [visible, fade, scale, wave]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onLater}>
      <Animated.View
        style={[s.backdrop, { opacity: fade, backgroundColor: "rgba(0,0,0,0.75)" }]}
      >
        <Animated.View
          style={[
            s.card,
            {
              backgroundColor: c.bgElevated,
              borderColor: c.borderAccent,
              transform: [{ scale }],
              shadowColor: c.accent,
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.08)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            pointerEvents="none"
          />

          {/* Wave rings */}
          <Animated.View
            pointerEvents="none"
            style={[
              s.wave,
              {
                borderColor: c.accent,
                opacity: wave.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0.45, 0],
                }),
                transform: [
                  {
                    scale: wave.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 2.2],
                    }),
                  },
                ],
              },
            ]}
          />

          <View style={[s.iconCircle, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
            <Icon d={ICONS.target} size={42} stroke={c.accent} sw={1.5} />
          </View>

          <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
            Sana özel liste hazırladık
          </Text>

          <Text style={[s.desc, { color: c.textSec, fontFamily: c.fontBody }]}>
            Bu seansta takıldığın{" "}
            <Text style={{ fontFamily: c.fontBodyBold, color: c.accent }}>
              {addedCount} kelime
            </Text>
            , "Bilemediğin Kelimeler" adlı listene eklendi. 3 kez doğru bilince
            otomatik çıkar.
          </Text>

          <View style={{ width: "100%", marginTop: 24, gap: 10 }}>
            <PremiumButton
              label="Şimdi Çalış"
              variant="primary"
              onPress={onStudy}
              hapticStyle="medium"
              block
              size="lg"
            />
            <PremiumButton
              label="Sonra"
              variant="ghost"
              onPress={onLater}
              hapticStyle="light"
              block
              size="lg"
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 12,
  },
  wave: {
    position: "absolute",
    top: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    paddingHorizontal: 6,
  },
});
