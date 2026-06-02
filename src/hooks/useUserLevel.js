/**
 * useUserLevel — XP (total doğru cevap) → seviye + ünvan + progress.
 *
 * Formula: level = floor(sqrt(xp / 10))
 *  - Lv 1 = 10 XP
 *  - Lv 2 = 40 XP
 *  - Lv 3 = 90 XP
 *  - Lv 5 = 250 XP
 *  - Lv 10 = 1000 XP
 *  - Lv 20 = 4000 XP
 *  - Lv 30 = 9000 XP (Polyglot Master)
 *
 * Her seviyenin bir unvanı + emoji + accent rengi var.
 */
import { useMemo } from "react";

export const LEVELS = [
  { lv: 0,  threshold: 0,    title: "Çaylak",        emoji: "🌱", color: "#6EE7B7" }, // mint
  { lv: 1,  threshold: 10,   title: "Öğrenci",        emoji: "📚", color: "#6EE7B7" },
  { lv: 2,  threshold: 40,   title: "Hevesli",        emoji: "✨", color: "#818CF8" }, // indigo
  { lv: 3,  threshold: 90,   title: "Meraklı",        emoji: "🔍", color: "#818CF8" },
  { lv: 5,  threshold: 250,  title: "Bilen",          emoji: "💡", color: "#FBBF24" }, // amber
  { lv: 7,  threshold: 490,  title: "Sözlük Avcısı",  emoji: "📖", color: "#FBBF24" },
  { lv: 10, threshold: 1000, title: "Polyglot",       emoji: "🌍", color: "#FF8B73" }, // coral
  { lv: 15, threshold: 2250, title: "Usta",           emoji: "🏆", color: "#FF8B73" },
  { lv: 20, threshold: 4000, title: "Bilge",          emoji: "🧙", color: "#A78BFA" }, // violet
  { lv: 30, threshold: 9000, title: "Efsane",         emoji: "👑", color: "#A78BFA" },
];

function levelFromXP(xp) {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 10));
}

function xpForLevel(lv) {
  return lv * lv * 10;
}

/** En yakın milestone'ı bulur — title/emoji/color burdan gelir */
function findMilestone(lv) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (LEVELS[i].lv <= lv) return LEVELS[i];
  }
  return LEVELS[0];
}

/** Sonraki milestone */
function findNextMilestone(lv) {
  return LEVELS.find((m) => m.lv > lv) ?? LEVELS[LEVELS.length - 1];
}

export default function useUserLevel(totalWords = 0) {
  return useMemo(() => {
    const xp = Math.max(0, totalWords);
    const lv = levelFromXP(xp);
    const milestone = findMilestone(lv);
    const next = findNextMilestone(lv);

    const currentXP = xpForLevel(lv);
    const nextXP = xpForLevel(lv + 1);
    const progress = nextXP === currentXP ? 1 : (xp - currentXP) / (nextXP - currentXP);

    return {
      xp,
      lv,
      title: milestone.title,
      emoji: milestone.emoji,
      color: milestone.color,
      nextMilestone: next,
      progress: Math.max(0, Math.min(1, progress)),
      xpToNext: Math.max(0, nextXP - xp),
      currentLevelXP: currentXP,
      nextLevelXP: nextXP,
    };
  }, [totalWords]);
}

export { levelFromXP, xpForLevel, findMilestone, findNextMilestone };
