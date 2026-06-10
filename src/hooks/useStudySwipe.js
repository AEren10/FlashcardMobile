/**
 * useStudySwipe — kart swipe gesture + animation values.
 *
 * onSwipe(know: boolean) — committed swipe (left/right)
 * onTap — tap algılandı (flip için)
 *
 * Returns:
 *   panHandlers — Pressable/View'a yayıl
 *   dx, shakeX, popScale — animasyon değerleri
 *   triggerCommit(know) — manuel buton'dan tetiklenir (chevron'lar)
 *   triggerShake() — wrong feedback
 *   resetCard() — sonraki kart için sıfırla
 */
import { useEffect, useMemo, useRef } from "react";
import { Animated, PanResponder } from "react-native";

const SWIPE_THRESHOLD = 60;
const TAP_THRESHOLD = 8;
const COMMIT_DISTANCE = 480;

export default function useStudySwipe({ enabled = true, onTap, onSwipe }) {
  const dx = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const popScale = useRef(new Animated.Value(0)).current;
  const dxValueRef = useRef(0);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const id = dx.addListener(({ value }) => {
      dxValueRef.current = value;
    });
    return () => dx.removeListener(id);
  }, [dx]);

  const triggerCommit = (know) => {
    Animated.timing(dx, {
      toValue: know ? COMMIT_DISTANCE : -COMMIT_DISTANCE,
      duration: know ? 280 : 380,
      delay: know ? 0 : 220,
      useNativeDriver: true,
    }).start();
    Animated.sequence([
      Animated.timing(popScale, { toValue: 1.15, duration: 220, useNativeDriver: true }),
      Animated.timing(popScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const resetCard = () => {
    dx.setValue(0);
    popScale.setValue(0);
  };

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          enabledRef.current && Math.abs(g.dx) > 14,
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderMove: (_, g) => {
          if (!enabledRef.current) return;
          dx.setValue(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (!enabledRef.current) return;
          const totalMove = Math.abs(g.dx) + Math.abs(g.dy);
          if (totalMove < TAP_THRESHOLD) {
            onTap?.();
            Animated.spring(dx, { toValue: 0, useNativeDriver: true }).start();
            return;
          }
          if (g.dx > SWIPE_THRESHOLD) {
            onSwipe?.(true);
          } else if (g.dx < -SWIPE_THRESHOLD) {
            onSwipe?.(false);
          } else {
            Animated.spring(dx, {
              toValue: 0,
              useNativeDriver: true,
              tension: 80,
              friction: 7,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          if (enabledRef.current)
            Animated.spring(dx, { toValue: 0, useNativeDriver: true }).start();
        },
      }).panHandlers,
    [dx, onTap, onSwipe]
  );

  return {
    panHandlers,
    dx,
    shakeX,
    popScale,
    triggerCommit,
    triggerShake,
    resetCard,
  };
}
