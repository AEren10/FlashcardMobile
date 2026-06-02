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
    color: "#6EE7B7",
    glow: "rgba(110, 231, 183, 0.18)",
    border: "rgba(110, 231, 183, 0.28)",
    stops: ["#A7F3D0", "#6EE7B7", "#39BE8C"],
    textOn: "#0A1019",
  },
  easy: {
    key: "easy",
    label: "Kolay",
    color: "#818CF8",
    glow: "rgba(129, 140, 248, 0.18)",
    border: "rgba(129, 140, 248, 0.28)",
    stops: ["#A5B4FC", "#818CF8", "#5E5DD8"],
    textOn: "#FFFFFF",
  },
  intermediate: {
    key: "intermediate",
    label: "Orta",
    color: "#FBBF24",
    glow: "rgba(251, 191, 36, 0.20)",
    border: "rgba(251, 191, 36, 0.30)",
    stops: ["#FCD34D", "#FBBF24", "#D97706"],
    textOn: "#0A1019",
  },
  hard: {
    key: "hard",
    label: "Zor",
    color: "#FF8B73",
    glow: "rgba(255, 139, 115, 0.18)",
    border: "rgba(255, 139, 115, 0.28)",
    stops: ["#FFB29B", "#FF8B73", "#E66B53"],
    textOn: "#FFFFFF",
  },
  master: {
    key: "master",
    label: "Ekstra",
    color: "#A78BFA",
    glow: "rgba(167, 139, 250, 0.18)",
    border: "rgba(167, 139, 250, 0.28)",
    stops: ["#C4B5FD", "#A78BFA", "#7C5DE3"],
    textOn: "#FFFFFF",
  },
};

export const DIFFICULTY_KEYS = ["beginner", "easy", "intermediate", "hard", "master"];

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
