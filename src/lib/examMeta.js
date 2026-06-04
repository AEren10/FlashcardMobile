/**
 * Sınav-spesifik metadata — ExamHomeScreen'in slider'larını bunlar yönetir.
 *
 * Tüm bu listelerin DB'de category='exam' olarak kayıtlı olması beklenir.
 * Hangi sınava ait olduğu liste BAŞLIĞINDAN (title) çıkarılır:
 *   - "YDS-1 — Sınav Klasikleri" → yds
 *   - "IELTS Essentials" → ielts
 *   - "TOEFL Hot 25" → toefl
 *
 * Yeni sınav eklemek için: bu dosyaya bir satır + DB'ye liste eklensin yeter.
 */
import { ICONS } from "../components/design/Icon";

export const EXAMS = {
  yds: {
    slug: "yds",
    name: "YDS",
    subtitle: "Yabancı Dil Sınavı · akademik",
    icon: ICONS.target,
    stops: ["#D4AE5E", "#B08A3F", "#7E5F22"],
    accent: "#D4AE5E",
    titlePrefixes: ["YDS"],
  },
  yokdil: {
    slug: "yokdil",
    name: "YÖKDİL",
    subtitle: "Akademik dil yeterlilik",
    icon: ICONS.graduation,
    stops: ["#B07BEA", "#8B5CF6", "#5B2E94"],
    accent: "#8B5CF6",
    titlePrefixes: ["YÖKDİL", "YOKDIL", "YÖKDIL"],
  },
  ielts: {
    slug: "ielts",
    name: "IELTS",
    subtitle: "International English",
    icon: ICONS.globe,
    stops: ["#7BAEC8", "#5A8FAB", "#3D6A85"],
    accent: "#7BAEC8",
    titlePrefixes: ["IELTS"],
  },
  toefl: {
    slug: "toefl",
    name: "TOEFL",
    subtitle: "Akademik İngilizce (ABD)",
    icon: ICONS.briefcase,
    stops: ["#C8A96E", "#A68B52", "#7C6A40"],
    accent: "#C8A96E",
    titlePrefixes: ["TOEFL"],
  },
  yksdil: {
    slug: "yksdil",
    name: "YKS-DİL",
    subtitle: "Üniversite girişi",
    icon: ICONS.books,
    stops: ["#A8C5B4", "#7FA896", "#5C8273"],
    accent: "#A8C5B4",
    titlePrefixes: ["YKS-DİL", "YKS-DIL", "YDT", "YKS "],
  },
};

// Slider sıralaması (en yaygın → en az)
export const EXAM_ORDER = ["yds", "yokdil", "ielts", "toefl", "yksdil"];

/**
 * Liste başlığından sınav türünü çıkar.
 * Eşleşme yoksa null döner — o liste "Diğer Sınav" slider'ına düşer.
 */
export function matchExam(title) {
  if (!title) return null;
  const t = title.toUpperCase();
  for (const key of EXAM_ORDER) {
    for (const prefix of EXAMS[key].titlePrefixes) {
      if (t.startsWith(prefix.toUpperCase()) || t.includes(prefix.toUpperCase())) {
        return key;
      }
    }
  }
  return null;
}

export function getExamMeta(slug) {
  return EXAMS[slug] || null;
}
