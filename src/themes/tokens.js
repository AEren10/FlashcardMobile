/**
 * FlashcardMobile — Design Tokens
 * Dark = koyu nötr + energetic accents, Light = temiz beyaz + warm accents
 */

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  "2xl": 26,
  "3xl": 34,
  "4xl": 52,
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
  xxl: 24,
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
  extraWide: 1.4,
};

const dark = {
  // Surfaces — gercek koyu, kahverengi degil
  bg: "#131314",
  bgBase: "#131314",
  bgElevated: "#1C1C1E",
  bgCard: "#1C1C1E",
  bgCardHover: "#252527",
  bgSurface: "#252527",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",

  // Accent — energetic canli amber
  accent: "#F0991F",
  lime: "#F0991F",
  limeDark: "#E07C0E",
  limeDim: "rgba(240,153,31,0.18)",
  limeGlow: "rgba(240,153,31,0.30)",
  accentGlow: "rgba(240,153,31,0.25)",

  // Secondary — energetic teal
  cobalt: "#1FA59A",
  cobaltDim: "rgba(31,165,154,0.16)",
  cobaltGlow: "rgba(31,165,154,0.28)",

  // Semantic
  success: "#3FA85B",
  successDim: "rgba(63,168,91,0.18)",
  warning: "#F0991F",
  warningDim: "rgba(240,153,31,0.18)",
  error: "#FF6B5C",
  errorDim: "rgba(255,107,92,0.18)",
  info: "#1FA59A",
  infoDim: "rgba(31,165,154,0.18)",

  coral: "#FF6B5C",
  coralDim: "rgba(255,107,92,0.16)",
  amber: "#F0991F",
  amberDim: "rgba(240,153,31,0.16)",
  sky: "#1FA59A",
  skyDim: "rgba(31,165,154,0.16)",

  lavender: "#C49AE8",
  lavenderDim: "rgba(196,154,232,0.16)",
  mint: "#3FC8A0",
  mintDim: "rgba(63,200,160,0.16)",
  peach: "#F0985C",
  peachDim: "rgba(240,152,92,0.16)",
  rose: "#E878A8",
  roseDim: "rgba(232,120,168,0.16)",
  slate: "#8898B0",
  slateDim: "rgba(136,152,176,0.16)",

  // Text — krem beyaz (koyu bg ustunde sicak text iyi kontrast)
  text: "#EEEBE6",
  textPrimary: "#EEEBE6",
  textSec: "#9B9790",
  textMuted: "#7A7874",
  textOnAccent: "#111111",

  // Borders
  border: "rgba(255,255,255,0.07)",
  borderAccent: "rgba(240,153,31,0.22)",
  divider: "rgba(255,255,255,0.04)",

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

const light = {
  // Surfaces — temiz beyaz, krem degil
  bg: "#F5F4F1",
  bgBase: "#F5F4F1",
  bgElevated: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgCardHover: "#ECEAE6",
  bgSurface: "#ECEAE6",
  surface: "rgba(0,0,0,0.03)",
  surfaceHover: "rgba(0,0,0,0.06)",

  // Accent — vivid orange (NOT brown)
  accent: "#E08820",
  lime: "#E08820",
  limeDark: "#C87518",
  limeDim: "rgba(224,136,32,0.18)",
  limeGlow: "rgba(224,136,32,0.28)",
  accentGlow: "rgba(224,136,32,0.22)",

  cobalt: "#168F82",
  cobaltDim: "rgba(22,143,130,0.18)",
  cobaltGlow: "rgba(22,143,130,0.28)",

  success: "#2E8B47",
  successDim: "rgba(46,139,71,0.18)",
  warning: "#E08820",
  warningDim: "rgba(224,136,32,0.18)",
  error: "#D94235",
  errorDim: "rgba(217,66,53,0.18)",
  info: "#168F82",
  infoDim: "rgba(22,143,130,0.18)",

  coral: "#D94235",
  coralDim: "rgba(217,66,53,0.16)",
  amber: "#E08820",
  amberDim: "rgba(224,136,32,0.16)",
  sky: "#168F82",
  skyDim: "rgba(22,143,130,0.16)",

  lavender: "#7040B0",
  lavenderDim: "rgba(112,64,176,0.16)",
  mint: "#1C9068",
  mintDim: "rgba(28,144,104,0.16)",
  peach: "#D45830",
  peachDim: "rgba(212,88,48,0.16)",
  rose: "#C03870",
  roseDim: "rgba(192,56,112,0.16)",
  slate: "#3E6080",
  slateDim: "rgba(62,96,128,0.16)",

  // Text — koyu ink
  text: "#1A1918",
  textPrimary: "#1A1918",
  textSec: "#5A5654",
  textMuted: "#8A8684",
  textOnAccent: "#FFFFFF",

  // Borders
  border: "rgba(0,0,0,0.08)",
  borderAccent: "rgba(224,136,32,0.22)",
  divider: "rgba(0,0,0,0.05)",

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

export const T = dark;
export default T;
