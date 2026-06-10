/**
 * FlashcardMobile — Design Tokens (Claude Design v2 handoff)
 * Lime + Cobalt sistem. Dark default + Light mode parite.
 *
 * Kullanım:
 *   import T from "src/themes/tokens";    // dark default (geri uyum)
 *   import { tokens } from "src/themes/tokens";
 *   const c = tokens(isDark);              // light/dark seçimli
 */

// ─────────────────────────────────────────────
// FOUNDATION TOKENS — fontSize / spacing / shadow / radius (yeni)
// Hardcoded değerler legacy olarak duruyor, yeni kod bunları kullanmalı
// ─────────────────────────────────────────────
export const fontSize = {
  xs: 10,    // micro label, badge
  sm: 12,    // caption, secondary text
  md: 14,    // body
  lg: 16,    // emphasized body
  xl: 20,    // section title
  "2xl": 26, // hero subhead
  "3xl": 34, // hero title
  "4xl": 52, // FlipCard word
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  xxl: 24,
  "3xl": 32,
  xxxl: 32,
};

export const elevation = {
  subtle: { opacity: 0.15, radius: 8, offsetY: 2, level: 2 },
  card:   { opacity: 0.30, radius: 12, offsetY: 4, level: 4 },
  modal:  { opacity: 0.45, radius: 18, offsetY: 8, level: 8 },
  overlay:{ opacity: 0.55, radius: 24, offsetY: 12, level: 12 },
};

export const letterSpacing = {
  tight: 0,
  normal: 0.2,
  wide: 0.4,
  extraWide: 1.4, // uppercase only
};

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

  // Accent — canlı amber, doygun ve sıcak (mockup 3 referans)
  accent: "#D49A20",
  lime: "#D49A20",
  limeDark: "#B88018",
  limeDim: "rgba(212,154,32,0.18)",
  limeGlow: "rgba(212,154,32,0.30)",
  accentGlow: "rgba(212,154,32,0.25)",

  // Secondary — canlı mavi
  cobalt: "#6AB0D8",
  cobaltDim: "rgba(106,176,216,0.16)",
  cobaltGlow: "rgba(106,176,216,0.28)",

  // Semantic — canlı, parlak tonlar
  success: "#40B85C",
  successDim: "rgba(64,184,92,0.18)",
  warning: "#D49A20",
  warningDim: "rgba(212,154,32,0.18)",
  error: "#D4604A",
  errorDim: "rgba(212,96,74,0.18)",
  info: "#5AACE0",
  infoDim: "rgba(90,172,224,0.18)",

  // Legacy aliases
  coral: "#D4604A",
  coralDim: "rgba(212,96,74,0.16)",
  amber: "#D49A20",
  amberDim: "rgba(212,154,32,0.16)",
  sky: "#5AACE0",
  skyDim: "rgba(90,172,224,0.16)",

  // Object accent paleti — daha canlı obje renkleri
  lavender: "#B88CD8",
  lavenderDim: "rgba(184,140,216,0.16)",
  mint: "#40B888",
  mintDim: "rgba(64,184,136,0.16)",
  peach: "#E89870",
  peachDim: "rgba(232,152,112,0.16)",
  rose: "#D878A8",
  roseDim: "rgba(216,120,168,0.16)",
  slate: "#8898B0",
  slateDim: "rgba(136,152,176,0.16)",

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

  // Accent — canlı turuncu-altın (Canlı mockup referans)
  accent: "#C07818",
  lime: "#C07818",
  limeDark: "#A06210",
  limeDim: "rgba(192,120,24,0.16)",
  limeGlow: "rgba(192,120,24,0.24)",
  accentGlow: "rgba(192,120,24,0.18)",

  cobalt: "#2E7EAA",
  cobaltDim: "rgba(46,126,170,0.14)",
  cobaltGlow: "rgba(46,126,170,0.22)",

  success: "#288A40",
  successDim: "rgba(40,138,64,0.16)",
  warning: "#C07818",
  warningDim: "rgba(192,120,24,0.16)",
  error: "#C04030",
  errorDim: "rgba(192,64,48,0.16)",
  info: "#2878A8",
  infoDim: "rgba(40,120,168,0.16)",

  coral: "#C04030",
  coralDim: "rgba(192,64,48,0.14)",
  amber: "#C07818",
  amberDim: "rgba(192,120,24,0.14)",
  sky: "#2878A8",
  skyDim: "rgba(40,120,168,0.14)",

  // Object accent paleti — canlı obje renkleri
  lavender: "#7850A8",
  lavenderDim: "rgba(120,80,168,0.14)",
  mint: "#28886A",
  mintDim: "rgba(40,136,106,0.14)",
  peach: "#C86838",
  peachDim: "rgba(200,104,56,0.14)",
  rose: "#A84878",
  roseDim: "rgba(168,72,120,0.14)",
  slate: "#506880",
  slateDim: "rgba(80,104,128,0.14)",

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
