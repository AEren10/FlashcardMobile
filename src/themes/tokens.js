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
  // Surfaces — daha derin & mat (Linear/Notion/Headway etkisi)
  bg: "#0B0D14",
  bgBase: "#0B0D14",
  bgElevated: "#151921",
  bgCard: "#151921",
  bgCardHover: "#1C2030",
  bgSurface: "#1C2030",
  surface: "rgba(255,255,255,0.03)",
  surfaceHover: "rgba(255,255,255,0.06)",

  // Accents — lime brand korundu, glow'lar yumuşatıldı (daha az neon)
  accent: "#B4FF4F",
  lime: "#B4FF4F",
  limeDark: "#7EE840",
  limeDim: "rgba(180,255,79,0.12)",
  limeGlow: "rgba(180,255,79,0.18)",
  accentGlow: "rgba(180,255,79,0.12)",

  // Secondary (cobalt) — daha sofistike mavi
  cobalt: "#6B8FFF",
  cobaltDim: "rgba(107,143,255,0.12)",
  cobaltGlow: "rgba(107,143,255,0.18)",

  // Semantic — emerald/warm-amber/soft-coral (neon değil)
  success: "#5DD8A0",
  successDim: "rgba(93,216,160,0.14)",
  warning: "#FFC36B",
  warningDim: "rgba(255,195,107,0.14)",
  error: "#FF7C7C",
  errorDim: "rgba(255,124,124,0.14)",
  info: "#5EC4FF",
  infoDim: "rgba(94,196,255,0.14)",

  // Legacy aliases (geri uyum için)
  coral: "#FF7C7C",
  coralDim: "rgba(255,124,124,0.14)",
  amber: "#FFC36B",
  amberDim: "rgba(255,195,107,0.14)",
  sky: "#5EC4FF",
  skyDim: "rgba(94,196,255,0.14)",

  // Text — true white yerine soft, daha az göz yoran
  text: "#ECEFF5",
  textPrimary: "#ECEFF5",
  textSec: "#8B96AD",
  textSecondary: "#8B96AD",
  textMuted: "#525E73",
  textOnAccent: "#0B0D14",

  // Borders daha subtle
  border: "rgba(255,255,255,0.05)",
  borderAccent: "rgba(180,255,79,0.18)",
  divider: "rgba(255,255,255,0.04)",

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
