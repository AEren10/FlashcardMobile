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
    color: "#A8C5B4",
    glow: "rgba(168, 197, 180, 0.18)",
    border: "rgba(168, 197, 180, 0.28)",
    stops: ["#C4D9CC", "#A8C5B4", "#7FA896"],
    textOn: "#1A1A18",
  },
  easy: {
    key: "easy",
    label: "Kolay",
    color: "#8BA4C4",
    glow: "rgba(139, 164, 196, 0.18)",
    border: "rgba(139, 164, 196, 0.28)",
    stops: ["#ADBDD4", "#8BA4C4", "#6A84A8"],
    textOn: "#FFFDF7",
  },
  intermediate: {
    key: "intermediate",
    label: "Orta",
    color: "#C8A96E",
    glow: "rgba(200, 169, 110, 0.20)",
    border: "rgba(200, 169, 110, 0.30)",
    stops: ["#DBBF88", "#C8A96E", "#A68B52"],
    textOn: "#1A1A18",
  },
  hard: {
    key: "hard",
    label: "Zor",
    color: "#C17B5A",
    glow: "rgba(193, 123, 90, 0.18)",
    border: "rgba(193, 123, 90, 0.28)",
    stops: ["#D49A7E", "#C17B5A", "#A05E3F"],
    textOn: "#FFFDF7",
  },
  master: {
    key: "master",
    label: "Ekstra",
    color: "#6B6560",
    glow: "rgba(107, 101, 96, 0.18)",
    border: "rgba(200, 169, 110, 0.28)",
    stops: ["#8A8480", "#6B6560", "#4A4542"],
    textOn: "#C8A96E",
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
