/**
 * HeroDashboard — HomeScreen üstü animasyonlu, canlı dashboard.
 * Card değil, full-bleed alan. Floating particles + radial daily goal + streak orbit.
 * Tap → ilgili sayfa.
 */
import React, { memo, useEffect, useMemo, useRef } from "react";
import { View, Text, Pressable, Animated, Easing, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, G, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../contexts/ThemeContext";
import useCountUp from "../../../hooks/useCountUp";
import Icon, { ICONS } from "../../../components/design/Icon";

const { width: W } = Dimensions.get("window");

function HeroDashboard({
  greeting,
  greetingSub,
  userName,
  streak = 0,
  dailyDone = 0,
  dailyTotal = 10,
  onStreakPress,
  onGoalPress,
}) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const ratio = Math.min(1, dailyDone / Math.max(1, dailyTotal));
  const pct = Math.round(ratio * 100);
  const animStreak = useCountUp(streak, 1000);

  return (
    <View style={s.wrap}>
      {/* Sade soft gradient — kare blob YOK */}
      <LinearGradient
        colors={[c.accent + "10", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating particles */}
      <Particles c={c} />

      {/* Greeting */}
      <Text style={[s.greet, { color: c.textSec, fontFamily: c.fontBody }]}>
        {greeting},
      </Text>
      <Text style={[s.name, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
        {userName}
      </Text>
      {!!greetingSub && (
        <Text
          style={[
            s.greetSub,
            { color: c.accent, fontFamily: c.fontBodySemi },
          ]}
          numberOfLines={2}
        >
          {greetingSub}
        </Text>
      )}

      {/* Dashboard row: streak (sol) + daily radial (sağ-ortada) */}
      <View style={s.row}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onStreakPress?.();
          }}
          style={({ pressed }) => [
            s.streakBox,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityLabel="Streak"
        >
          <StreakOrbit streak={streak} c={c} />
          <View style={s.streakInfo}>
            <View style={s.streakNumRow}>
              <Text style={[s.streakNum, { color: c.textPrimary, fontFamily: c.fontNum }]}>
                {animStreak}
              </Text>
              <Text style={[s.streakUnit, { color: c.textSec, fontFamily: c.fontBodyMed }]}>
                gün
              </Text>
            </View>
            <Text style={[s.streakLbl, { color: streak > 0 ? c.warning : c.textMuted, fontFamily: c.fontBodySemi }]}>
              {streak === 0 ? "henüz seri yok" : streak === 1 ? "ilk gün" : "ateşin tütüyor"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onGoalPress?.();
          }}
          style={({ pressed }) => [
            s.goalBox,
            { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
          accessibilityLabel="Günlük hedef"
        >
          <RadialGoal ratio={ratio} c={c} />
        </Pressable>
      </View>

      <Text style={[s.hint, { color: c.textMuted, fontFamily: c.fontBody }]}>
        {pct >= 100
          ? "Bugünkü hedefini tamamladın!"
          : `${dailyTotal - dailyDone} kelime kaldı`}
      </Text>
    </View>
  );
}

/** Doğal alev — yükselip küçülen, etrafında daire YOK, sadece soft text-shadow halo */
function StreakOrbit({ streak, c }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const shadowGlow = useRef(new Animated.Value(0.6)).current;
  const active = streak > 0;
  const intensity = Math.min(1, streak / 30);

  useEffect(() => {
    if (!active) {
      scale.setValue(1);
      lift.setValue(0);
      shadowGlow.setValue(0.3);
      return;
    }
    // Alev "nefes alır": büyür-küçülür (700ms — gerçek alev gibi hızlı)
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 650,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.92,
          duration: 550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    // Yukarı doğru hafif çekilme (alev yükseliyor)
    const liftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(lift, {
          toValue: -5,
          duration: 800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(lift, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    // Glow flicker (alev parlaklığı titriyor)
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shadowGlow, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(shadowGlow, {
          toValue: 0.55,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(shadowGlow, {
          toValue: 0.85,
          duration: 380,
          useNativeDriver: true,
        }),
      ])
    );
    scaleLoop.start();
    liftLoop.start();
    glowLoop.start();
    return () => {
      scaleLoop.stop();
      liftLoop.stop();
      glowLoop.stop();
    };
  }, [scale, lift, shadowGlow, active]);

  // Streak'e göre renk gradient'i — yeni başlayanda turuncu, uzun streak'te kırmızı
  const flameColor =
    streak >= 30 ? "#E74C3C" :   // uzun streak — kırmızı
    streak >= 7  ? "#F39C12" :   // orta streak — koyu turuncu
                   "#FF6B4A";   // yeni başlayan — canlı turuncu
  const iconSize = 34 + intensity * 14;

  return (
    <View style={s.flameWrap}>
      <Animated.View
        style={{
          opacity: shadowGlow,
          transform: [{ scale }, { translateY: lift }],
        }}
      >
        <Icon d={ICONS.flame} size={iconSize} stroke={flameColor} fill={flameColor} sw={1.2} />
      </Animated.View>
    </View>
  );
}

// Memoize — sadece props değişince re-render
export default memo(HeroDashboard);

/** DailyGoal — üstte büyük yüzde + altta 10 dot horizontal bar.
 *  Dolu dotlar cobalt (mavi), tamamlanınca success (yeşil). Pulse animasyonu.
 */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RADIAL_SIZE = 100;
const RADIAL_STROKE = 8;
const RADIAL_R = (RADIAL_SIZE - RADIAL_STROKE) / 2;
const RADIAL_C = 2 * Math.PI * RADIAL_R;

function RadialGoal({ ratio, c }) {
  const completed = ratio >= 1;
  const pct = Math.round(ratio * 100);
  const fillColor = completed ? c.success : c.cobalt;
  const trackColor = c.border;

  // Entry scale spring
  const entryScale = useRef(new Animated.Value(0.8)).current;
  // Progress arc (0 → ratio)
  const arc = useRef(new Animated.Value(0)).current;
  // Continuous rotation
  const spin = useRef(new Animated.Value(0)).current;
  // Pulse when complete
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(entryScale, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 180,
      damping: 14,
    }).start();
  }, [entryScale]);

  useEffect(() => {
    Animated.timing(arc, {
      toValue: Math.min(1, ratio),
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [ratio, arc]);

  // Sürekli yavaş dönüş — completed olduğunda daha hızlı
  useEffect(() => {
    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: completed ? 4000 : 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [completed, spin]);

  useEffect(() => {
    if (!completed) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [completed, pulse]);

  const strokeDashoffset = arc.interpolate({
    inputRange: [0, 1],
    outputRange: [RADIAL_C, 0],
  });

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        width: RADIAL_SIZE,
        height: RADIAL_SIZE,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: entryScale }, { scale: pulse }],
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: RADIAL_SIZE,
          height: RADIAL_SIZE,
          transform: [{ rotate }],
        }}
      >
        <Svg width={RADIAL_SIZE} height={RADIAL_SIZE}>
          <Defs>
            <SvgGradient id="goalGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={fillColor} stopOpacity="1" />
              <Stop offset="1" stopColor={c.accent || fillColor} stopOpacity="0.85" />
            </SvgGradient>
          </Defs>
          {/* Track */}
          <Circle
            cx={RADIAL_SIZE / 2}
            cy={RADIAL_SIZE / 2}
            r={RADIAL_R}
            stroke={trackColor}
            strokeWidth={RADIAL_STROKE}
            fill="none"
            opacity={0.35}
          />
          {/* Progress arc — starts from top (rotate -90deg) */}
          <G rotation={-90} origin={`${RADIAL_SIZE / 2}, ${RADIAL_SIZE / 2}`}>
            <AnimatedCircle
              cx={RADIAL_SIZE / 2}
              cy={RADIAL_SIZE / 2}
              r={RADIAL_R}
              stroke="url(#goalGrad)"
              strokeWidth={RADIAL_STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${RADIAL_C} ${RADIAL_C}`}
              strokeDashoffset={strokeDashoffset}
            />
          </G>
        </Svg>
      </Animated.View>

      <Text
        style={{
          fontFamily: c.fontNum,
          fontSize: 24,
          lineHeight: 26,
          color: fillColor,
          textShadowColor: fillColor,
          textShadowRadius: 6,
          textShadowOffset: { width: 0, height: 0 },
        }}
      >
        %{pct}
      </Text>
    </Animated.View>
  );
}

/** Particles — 5 ufak nokta, scale+opacity loop, farklı period */
function Particles({ c }) {
  const dots = useRef(
    Array.from({ length: 6 }).map((_, i) => ({
      anim: new Animated.Value(0),
      x: (i * (W - 100)) / 5 + 30 + (i % 2 === 0 ? 20 : -10),
      y: 30 + (i % 3) * 28 + (i * 7) % 18,
      delay: i * 500,
      size: 3 + (i % 3),
    }))
  ).current;

  useEffect(() => {
    const loops = dots.map((d) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(d.delay),
          Animated.timing(d.anim, {
            toValue: 1,
            duration: 2400,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(d.anim, {
            toValue: 0,
            duration: 2400,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [dots]);

  return (
    <>
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.size * 2,
            height: d.size * 2,
            borderRadius: d.size,
            backgroundColor: i % 2 === 0 ? c.accent : c.cobalt,
            opacity: d.anim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.7] }),
            transform: [
              {
                translateY: d.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -14],
                }),
              },
              {
                scale: d.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1.2],
                }),
              },
            ],
          }}
        />
      ))}
    </>
  );
}

const FLAME_BOX = 58;

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      paddingTop: 4,
      paddingBottom: 10,
      marginBottom: 6,
      overflow: "hidden",
    },
    greet: {
      fontSize: 13,
      letterSpacing: 0.3,
    },
    name: {
      fontSize: 38,
      lineHeight: 42,
      marginTop: 2,
    },
    greetSub: {
      fontSize: 13,
      lineHeight: 18,
      marginTop: 8,
      letterSpacing: 0.2,
      fontStyle: "italic",
      opacity: 0.92,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 20,
      paddingRight: 4,
    },
    streakBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      paddingVertical: 6,
    },
    flameWrap: {
      width: FLAME_BOX,
      height: FLAME_BOX,
      alignItems: "center",
      justifyContent: "center",
    },
    flameEmoji: {
      textAlign: "center",
    },
    streakInfo: { flex: 1 },
    streakNumRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
    streakNum: { fontSize: 34, lineHeight: 36 },
    streakUnit: { fontSize: 14, letterSpacing: 0.3 },
    streakLbl: { fontSize: 11, marginTop: 3, letterSpacing: 0.3 },

    goalBox: {
      width: 100,
      height: 100,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      marginRight: 6,
    },
    goalCenter: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    goalPct: { fontSize: 18, lineHeight: 20 },
    goalLbl: { fontSize: 10, marginTop: 1 },

    hint: {
      marginTop: 14,
      fontSize: 12,
      letterSpacing: 0.3,
    },
  });
}

const s = StyleSheet.create({
  flameWrap: {
    width: FLAME_BOX,
    height: FLAME_BOX,
    alignItems: "center",
    justifyContent: "center",
  },
  flameEmoji: { textAlign: "center" },
});
