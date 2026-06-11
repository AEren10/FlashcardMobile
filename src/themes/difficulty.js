/**
 * Difficulty (Zorluk Seviyesi) — 5 katman renk sistemi.
 *
 * Cool → Hot progression: kullanıcı zorlukla beraber renk de ısınır.
 *   beginner  → mint    (taze başlama)
 *   easy      → indigo  (rahat akış)
 *   intermediate → amber (orta yol, sıcak)
 *   hard      → coral   (alev, mücadele — kırmızı YERİNE, çünkü kırmızı=hata)
 *   master    → violet  (premium, sofistike)
 *
 * Renkler tek kaynaktan: getDifficulty(level) ile çekilir.
 * Liste cover band'i + liste içi buton/badge/progress = aynı renk.
 */

export const DIFFICULTY = {
  beginner: {
    key: "beginner",
    label: "Başlangıç",
    color: "#34B878",
    glow: "rgba(52, 184, 120, 0.20)",
    border: "rgba(52, 184, 120, 0.30)",
    stops: ["#5CD898", "#34B878", "#22905C"],
    textOn: "#FFFFFF",
  },
  easy: {
    key: "easy",
    label: "Kolay",
    color: "#4A90D8",
    glow: "rgba(74, 144, 216, 0.20)",
    border: "rgba(74, 144, 216, 0.30)",
    stops: ["#70AAE8", "#4A90D8", "#2E72B5"],
    textOn: "#FFFFFF",
  },
  intermediate: {
    key: "intermediate",
    label: "Orta",
    color: "#E8A425",
    glow: "rgba(232, 164, 37, 0.22)",
    border: "rgba(232, 164, 37, 0.32)",
    stops: ["#F0C050", "#E8A425", "#D08E18"],
    textOn: "#FFFFFF",
  },
  hard: {
    key: "hard",
    label: "Zor",
    color: "#E05540",
    glow: "rgba(224, 85, 64, 0.20)",
    border: "rgba(224, 85, 64, 0.30)",
    stops: ["#F07050", "#E05540", "#C03828"],
    textOn: "#FFFFFF",
  },
  master: {
    key: "master",
    label: "Ekstra",
    color: "#8848B8",
    glow: "rgba(136, 72, 184, 0.20)",
    border: "rgba(136, 72, 184, 0.30)",
    stops: ["#A868D8", "#8848B8", "#6E35A0"],
    textOn: "#FFFFFF",
  },
};

export const DIFFICULTY_KEYS = ["beginner", "easy", "intermediate", "hard", "master"];

/**
 * XP çarpanı — liste zorluğuna göre kelime başına kazanılan puan.
 * Kolay listeler 1 puan, zor listeler 3 puana kadar çıkar.
 * Path / Roadmap "çok kolay atlanmasın" sorununu çözer.
 */
export const XP_PER_WORD = {
  beginner: 1,
  easy: 1,
  intermediate: 2,
  hard: 3,
  master: 3,
};

export function getXpPerWord(level) {
  return XP_PER_WORD[levelToKey(level)] ?? 1;
}

/**
 * Veritabanından gelen level string'ini ("Beginner", "Başlangıç", "B1" vb.)
 * difficulty key'e çevirir. Default: beginner.
 */
export function levelToKey(level) {
  if (!level) return "beginner";
  const l = String(level).toLowerCase().trim();

  // Türkçe
  if (l.includes("ekstra") || l.includes("uzman")) return "master";
  if (l.includes("zor") || l.includes("ileri")) return "hard";
  if (l.includes("orta")) return "intermediate";
  if (l.includes("kolay")) return "easy";
  if (l.includes("başlangıç") || l.includes("baslangic")) return "beginner";

  // İngilizce
  if (l.includes("master") || l.includes("expert") || l.includes("c2")) return "master";
  if (l.includes("hard") || l.includes("advanced") || l.includes("c1") || l.includes("b2"))
    return "hard";
  if (l.includes("intermediate") || l.includes("b1")) return "intermediate";
  if (l.includes("easy") || l.includes("elementary") || l.includes("a2")) return "easy";
  if (l.includes("beginner") || l.includes("starter") || l.includes("a1")) return "beginner";

  return "beginner";
}

/**
 * @param {string} level — veritabanı string'i
 * @returns difficulty token objesi
 */
export function getDifficulty(level) {
  return DIFFICULTY[levelToKey(level)];
}
