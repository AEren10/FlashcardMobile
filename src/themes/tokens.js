/**
 * FlashcardMobile — Design Tokens (Claude Design v2 handoff)
 * Lime + Cobalt sistem. Dark default + Light mode parite.
 *
 * Kullanım:
 *   import T from "src/themes/tokens";    // dark default (geri uyum)
 *   import { tokens } from "src/themes/tokens";
 *   const c = tokens(isDark);              // light/dark seçimli
 */

const dark = {
  // Surfaces — sıcak stüdyo, gece kağıt dokusu hissi
  bg: "#1A1814",
  bgBase: "#1A1814",
  bgElevated: "#242118",
  bgCard: "#242118",
  bgCardHover: "#2C2920",
  bgSurface: "#2C2920",
  surface: "rgba(255,245,230,0.04)",
  surfaceHover: "rgba(255,245,230,0.07)",

  // Accent — sıcak altın, canlı ama doğal
  accent: "#D4AE5E",
  lime: "#D4AE5E",
  limeDark: "#B8933E",
  limeDim: "rgba(212,174,94,0.14)",
  limeGlow: "rgba(212,174,94,0.22)",
  accentGlow: "rgba(212,174,94,0.18)",

  // Secondary — tozlu mavi, hafif daha canlı
  cobalt: "#92ABC0",
  cobaltDim: "rgba(146,171,192,0.14)",
  cobaltGlow: "rgba(146,171,192,0.24)",

  // Semantic — doğal ama okunabilir
  success: "#6DB585",
  successDim: "rgba(109,181,133,0.16)",
  warning: "#D4A457",
  warningDim: "rgba(212,164,87,0.16)",
  error: "#CF7B68",
  errorDim: "rgba(207,123,104,0.16)",
  info: "#7BAEC8",
  infoDim: "rgba(123,174,200,0.16)",

  // Legacy aliases
  coral: "#C47B6B",
  coralDim: "rgba(196,123,107,0.14)",
  amber: "#D4A457",
  amberDim: "rgba(212,164,87,0.14)",
  sky: "#7BA3BE",
  skyDim: "rgba(123,163,190,0.14)",

  // Object accent paleti — kart/badge/stat objelerine çeşit
  lavender: "#B097C4",
  lavenderDim: "rgba(176,151,196,0.14)",
  mint: "#84B19B",
  mintDim: "rgba(132,177,155,0.14)",
  peach: "#E0A887",
  peachDim: "rgba(224,168,135,0.14)",
  rose: "#C88AAB",
  roseDim: "rgba(200,138,171,0.14)",
  slate: "#8896A4",
  slateDim: "rgba(136,150,164,0.14)",

  // Text — krem tonlu, biraz daha kontrastlı
  text: "#ECE4D8",
  textPrimary: "#ECE4D8",
  textSec: "#A69E90",
  textSecondary: "#A69E90",
  textMuted: "#6A6358",
  textOnAccent: "#121210",

  // Borders — sıcak, ince çizgiler
  border: "rgba(255,245,230,0.06)",
  borderAccent: "rgba(200,169,110,0.22)",
  divider: "rgba(255,245,230,0.04)",

  // Radius
  radius: 16,
  radiusSm: 12,
  radiusMd: 16,
  radiusLg: 20,
  radiusXl: 28,
  radiusFull: 999,

  // Typography
  fontDisplay: "InstrumentSerif_400Regular_Italic",
  fontHead: "SpaceGrotesk_700Bold",
  fontBodyBold: "SpaceGrotesk_700Bold",
  fontBodySemi: "SpaceGrotesk_600SemiBold",
  fontBody: "Inter_400Regular",
  fontBodyMed: "Inter_500Medium",
  fontCap: "Inter_500Medium",
  fontNum: "SpaceGrotesk_700Bold",
};

const light = {
  // Surfaces — sıcak kağıt, defter sayfası
  bg: "#F5F0E8",
  bgBase: "#F5F0E8",
  bgElevated: "#FFFDF7",
  bgCard: "#FFFDF7",
  bgCardHover: "#EDE8DD",
  bgSurface: "#EDE8DD",
  surface: "rgba(80,65,40,0.04)",
  surfaceHover: "rgba(80,65,40,0.07)",

  // Accent — koyu altın, zengin ve sıcak
  accent: "#8B6831",
  lime: "#8B6831",
  limeDark: "#6F5228",
  limeDim: "rgba(139,104,49,0.14)",
  limeGlow: "rgba(139,104,49,0.20)",
  accentGlow: "rgba(139,104,49,0.14)",

  cobalt: "#4A7290",
  cobaltDim: "rgba(74,114,144,0.12)",
  cobaltGlow: "rgba(74,114,144,0.18)",

  success: "#3D7A52",
  successDim: "rgba(61,122,82,0.14)",
  warning: "#9B7230",
  warningDim: "rgba(155,114,48,0.14)",
  error: "#A0503E",
  errorDim: "rgba(160,80,62,0.14)",
  info: "#3A7A9B",
  infoDim: "rgba(58,122,155,0.14)",

  coral: "#9E5A4A",
  coralDim: "rgba(158,90,74,0.12)",
  amber: "#9B7230",
  amberDim: "rgba(155,114,48,0.12)",
  sky: "#4A7F9B",
  skyDim: "rgba(74,127,155,0.12)",

  // Object accent paleti — kart/badge/stat objelerine çeşit (light mode varyantları)
  lavender: "#7E66A1",
  lavenderDim: "rgba(126,102,161,0.12)",
  mint: "#4F7E69",
  mintDim: "rgba(79,126,105,0.12)",
  peach: "#B8704A",
  peachDim: "rgba(184,112,74,0.12)",
  rose: "#9D4E78",
  roseDim: "rgba(157,78,120,0.12)",
  slate: "#5C6975",
  slateDim: "rgba(92,105,117,0.12)",

  // Text — mürekkep siyahı, kağıt üstüne yazılmış
  text: "#2C2520",
  textPrimary: "#2C2520",
  textSec: "#6B5E52",
  textSecondary: "#6B5E52",
  textMuted: "#7A6E60", // Light mode WCAG AA fix (önce #A09688 → 2.4:1 kontrast yetersizdi)
  textOnAccent: "#FFFDF7",

  border: "rgba(80,65,40,0.10)",
  borderAccent: "rgba(150,115,74,0.28)",
  divider: "rgba(80,65,40,0.06)",

  radius: 16,
  radiusSm: 12,
  radiusMd: 16,
  radiusLg: 20,
  radiusXl: 28,
  radiusFull: 999,

  fontDisplay: "InstrumentSerif_400Regular_Italic",
  fontHead: "SpaceGrotesk_700Bold",
  fontBodyBold: "SpaceGrotesk_700Bold",
  fontBodySemi: "SpaceGrotesk_600SemiBold",
  fontBody: "Inter_400Regular",
  fontBodyMed: "Inter_500Medium",
  fontCap: "Inter_500Medium",
  fontNum: "SpaceGrotesk_700Bold",
};

export const tokens = (isDark = true) => (isDark ? dark : light);

// Geri uyum: T direkt import edilen yerler dark token'ları alır
export const T = dark;
export default T;
