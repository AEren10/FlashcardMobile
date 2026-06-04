/**
 * WarmConfetti — stüdyo paletinde konfeti wrapper.
 *
 * Standart confetti'den farkı:
 *   - Warm renkler (gold + cobalt + warning + rose)
 *   - Daha az parçacık (40-60)
 *   - Yumuşak fadeOut
 *   - Origin Y kontrol edilebilir (üstten / merkezden)
 */
import React from "react";
import { Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { useTheme } from "../../contexts/ThemeContext";

const { width: W } = Dimensions.get("window");

export default function WarmConfetti({
  count = 60,
  origin = "top",
  explosionSpeed = 320,
  fallSpeed = 2400,
  autoStart = true,
  fadeOut = true,
  onAnimationEnd,
}) {
  const { c } = useTheme();
  // Warm palette — accent (gold) + cobalt + warning + soft rose + soft green
  const colors = [
    c.accent,        // gold
    c.cobalt,        // blue
    c.warning,       // amber
    "#C13E5C",       // soft rose
    "#A8D582",       // soft green
    c.accent + "DD", // gold with alpha for variation
  ];
  const originPoint =
    origin === "top"
      ? { x: W / 2, y: -10 }
      : origin === "center"
        ? { x: W / 2, y: 200 }
        : origin; // custom {x,y}
  return (
    <ConfettiCannon
      count={count}
      origin={originPoint}
      autoStart={autoStart}
      fadeOut={fadeOut}
      explosionSpeed={explosionSpeed}
      fallSpeed={fallSpeed}
      colors={colors}
      onAnimationEnd={onAnimationEnd}
    />
  );
}
