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
  // Surfaces
  bg: "#0A1019",
  bgBase: "#0A1019",
  bgElevated: "#0E1726",
  bgCard: "#0E1726",
  bgCardHover: "#14202E",
  bgSurface: "#14202E",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",

  // Accents
  accent: "#B4FF4F",
  lime: "#B4FF4F",
  limeDark: "#7EE840",
  limeDim: "rgba(180,255,79,0.18)",
  limeGlow: "rgba(180,255,79,0.25)",
  accentGlow: "rgba(180,255,79,0.18)",

  // Secondary (cobalt)
  cobalt: "#5B7FFF",
  cobaltDim: "rgba(91,127,255,0.16)",
  cobaltGlow: "rgba(91,127,255,0.22)",

  // Semantic
  success: "#4ADE80",
  successDim: "rgba(74,222,128,0.18)",
  warning: "#FFB84D",
  warningDim: "rgba(255,184,77,0.18)",
  error: "#FF6B6B",
  errorDim: "rgba(255,107,107,0.18)",
  info: "#4DC9FF",
  infoDim: "rgba(77,201,255,0.18)",

  // Legacy aliases (geri uyum için)
  coral: "#FF6B6B",
  coralDim: "rgba(255,107,107,0.18)",
  amber: "#FFB84D",
  amberDim: "rgba(255,184,77,0.18)",
  sky: "#4DC9FF",
  skyDim: "rgba(77,201,255,0.18)",

  // Text
  text: "#F1F5F9",
  textPrimary: "#F1F5F9",
  textSec: "#8899AB",
  textSecondary: "#8899AB",
  textMuted: "#4A5C6E",
  textOnAccent: "#0A1019",

  // Borders
  border: "rgba(255,255,255,0.06)",
  borderAccent: "rgba(180,255,79,0.20)",
  divider: "rgba(255,255,255,0.05)",

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
  bg: "#FAFBFC",
  bgBase: "#FAFBFC",
  bgElevated: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgCardHover: "#F1F4F8",
  bgSurface: "#F1F4F8",
  surface: "rgba(15,25,37,0.04)",
  surfaceHover: "rgba(15,25,37,0.07)",

  accent: "#4A8E1F",
  lime: "#4A8E1F",
  limeDark: "#3A6F18",
  limeDim: "rgba(74,142,31,0.12)",
  limeGlow: "rgba(74,142,31,0.18)",
  accentGlow: "rgba(74,142,31,0.12)",

  cobalt: "#3B5BDB",
  cobaltDim: "rgba(59,91,219,0.10)",
  cobaltGlow: "rgba(59,91,219,0.16)",

  success: "#15803D",
  successDim: "rgba(21,128,61,0.12)",
  warning: "#B45309",
  warningDim: "rgba(180,83,9,0.12)",
  error: "#B91C1C",
  errorDim: "rgba(185,28,28,0.12)",
  info: "#0284C7",
  infoDim: "rgba(2,132,199,0.12)",

  coral: "#B91C1C",
  coralDim: "rgba(185,28,28,0.12)",
  amber: "#B45309",
  amberDim: "rgba(180,83,9,0.12)",
  sky: "#0284C7",
  skyDim: "rgba(2,132,199,0.12)",

  text: "#0F1925",
  textPrimary: "#0F1925",
  textSec: "#4A5C6E",
  textSecondary: "#4A5C6E",
  textMuted: "#8899AB",
  textOnAccent: "#FFFFFF",

  border: "rgba(15,25,37,0.08)",
  borderAccent: "rgba(74,142,31,0.28)",
  divider: "rgba(15,25,37,0.05)",

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
