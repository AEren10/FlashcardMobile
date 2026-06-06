/**
 * Kategoriler — TEK MERKEZİ KAYNAK.
 *
 * Bu dosya her yerde tüketilir:
 *   - themes/categories.js → buradan re-export
 *   - screens/favorites/components/FavoriteCard.js → buradan icon
 *   - screens/home/HomeScreen.js → buradan filtre + tint
 *
 * Yeni kategori eklemek için: sadece bu dosyada `CATEGORIES` map'ine ekle.
 *
 * Slug Supabase `lists.category` kolonuyla birebir uymalı.
 */
import { ICONS } from "../components/design/Icon";

/**
 * @typedef {Object} CategoryMeta
 * @property {string} slug — Supabase'te kullanılan key
 * @property {string} name — TR display name
 * @property {string} icon — SVG path (Icon.js'ten)
 * @property {string[]} stops — gradient renkler (CategoryCover için)
 * @property {string} accent — tek renk (chip / tint için)
 * @property {string[]} aliases — eski/alternatif slug'lar (DB tutarsızlığı için)
 */

export const CATEGORIES = {
  exam: {
    slug: "exam",
    name: "Sınav Hazırlık",
    subtitle: "YDS · YÖKDİL · IELTS · TOEFL",
    icon: ICONS.target,
    stops: ["#D4AE5E", "#B08A3F", "#7E5F22"],
    accent: "#D4AE5E",
    aliases: ["sınav", "exam-prep", "yds", "yokdil", "yökdil", "ielts", "toefl", "yks"],
  },
  daily: {
    slug: "daily",
    name: "Günlük Hayat",
    subtitle: "Konuşma, sokak, ev",
    icon: ICONS.sun,
    stops: ["#C4D9CC", "#A8C5B4", "#7FA896"],
    accent: "#A8C5B4",
    aliases: ["daily-life", "günlük", "everyday", "learning"],
  },
  business: {
    slug: "business",
    name: "İş & Kariyer",
    subtitle: "Profesyonel İngilizce",
    icon: ICONS.briefcase,
    stops: ["#ADBDD4", "#8BA4C4", "#6A84A8"],
    accent: "#8BA4C4",
    aliases: ["iş", "kariyer", "career", "work"],
  },
  travel: {
    slug: "travel",
    name: "Seyahat",
    subtitle: "Yolda, havaalanında, otelde",
    icon: ICONS.plane,
    stops: ["#DBBF88", "#C8A96E", "#A68B52"],
    accent: "#C8A96E",
    aliases: ["seyahat", "trip"],
  },
  academic: {
    slug: "academic",
    name: "Akademik",
    subtitle: "Makale, araştırma, üniversite",
    icon: ICONS.graduation,
    stops: ["#B07BEA", "#8B5CF6", "#5B2E94"],
    accent: "#8B5CF6",
    aliases: ["academy", "akademi"],
  },
  tech: {
    slug: "tech",
    name: "Teknoloji",
    subtitle: "Yazılım, AI, internet",
    icon: ICONS.laptop,
    stops: ["#7BAEC8", "#5A8FAB", "#3D6A85"],
    accent: "#7BAEC8",
    aliases: ["technology", "teknoloji", "it"],
  },
  food: {
    slug: "food",
    name: "Yemek & Mutfak",
    subtitle: "Restoran, sipariş, tarif",
    icon: ICONS.food,
    stops: ["#D49A7E", "#C17B5A", "#A05E3F"],
    accent: "#C17B5A",
    aliases: ["yemek", "mutfak", "cuisine"],
  },
  learning: {
    slug: "learning",
    name: "Öğrenme",
    icon: ICONS.books,
    stops: ["#8BA4C4", "#6A84A8", "#4A6580"],
    accent: "#8BA4C4",
    aliases: ["learn", "öğrenme", "education"],
  },
  popular: {
    slug: "popular",
    name: "Popüler",
    icon: ICONS.flame,
    stops: ["#FF8B73", "#F4674E", "#B23A2E"],
    accent: "#F4674E",
    aliases: ["popüler", "trending"],
  },
  colors: {
    slug: "colors",
    name: "Renkler",
    icon: ICONS.palette,
    stops: ["#B07BEA", "#8B5CF6", "#5B2E94"],
    accent: "#8B5CF6",
    aliases: ["renk", "color"],
  },
  nature: {
    slug: "nature",
    name: "Doğa & Hayvanlar",
    subtitle: "Manzara, vahşi & evcil",
    icon: ICONS.leaf,
    stops: ["#A8D582", "#7BB661", "#4E8B3F"],
    accent: "#7BB661",
    aliases: ["doğa", "hayvan", "nature"],
  },
  emotions: {
    slug: "emotions",
    name: "Duygular",
    subtitle: "Pozitif & karmaşık hisler",
    icon: ICONS.sparkle,
    stops: ["#E8A5B8", "#C13E5C", "#8B2C42"],
    accent: "#C13E5C",
    aliases: ["duygu", "hissi", "emotion"],
  },
  sports: {
    slug: "sports",
    name: "Spor",
    subtitle: "Futbol, basketbol, egzersiz",
    icon: ICONS.bolt,
    stops: ["#FFB066", "#FF8A4C", "#C56B2E"],
    accent: "#FF8A4C",
    aliases: ["spor", "sport"],
  },
  transportation: {
    slug: "transportation",
    name: "Ulaşım",
    subtitle: "Şehir içi & yolculuk",
    icon: ICONS.plane,
    stops: ["#B8C5D6", "#7B95B8", "#4E6580"],
    accent: "#7B95B8",
    aliases: ["ulaşım", "transport", "yolculuk"],
  },
  arts: {
    slug: "arts",
    name: "Sanat & Müzik",
    subtitle: "Görsel, sahne, enstrüman",
    icon: ICONS.palette,
    stops: ["#D4A8E8", "#B07BEA", "#7C3E9B"],
    accent: "#B07BEA",
    aliases: ["sanat", "müzik", "art", "music"],
  },
  home: {
    slug: "home",
    name: "Ev & Aile",
    subtitle: "Oda, eşya, akrabalar",
    icon: ICONS.home,
    stops: ["#E8D2A8", "#D4AE5E", "#8B6831"],
    accent: "#D4AE5E",
    aliases: ["ev", "aile", "home", "family"],
  },
  social: {
    slug: "social",
    name: "Sosyal Medya",
    subtitle: "Platform dili, mesajlaşma",
    icon: ICONS.user,
    stops: ["#A8C5D6", "#7BAEC8", "#3D6A85"],
    accent: "#7BAEC8",
    aliases: ["sosyal", "social", "internet"],
  },
  news: {
    slug: "news",
    name: "Haber & Güncel",
    subtitle: "Manşet, basın, medya",
    icon: ICONS.books,
    stops: ["#C8B8A8", "#A89880", "#6B5E52"],
    accent: "#A89880",
    aliases: ["haber", "news", "güncel"],
  },
  shopping: {
    slug: "shopping",
    name: "Market & Alışveriş",
    subtitle: "Market, fiyat, ürün",
    icon: ICONS.bookmark,
    stops: ["#F0C8A8", "#D49A7E", "#A05E3F"],
    accent: "#D49A7E",
    aliases: ["alışveriş", "market", "shopping"],
  },
  other: {
    slug: "other",
    name: "Diğer",
    icon: ICONS.books,
    stops: ["#94A2B2", "#6B7785", "#48535F"],
    accent: "#6B7785",
    aliases: [],
  },
};

// Hızlı alias → canonical lookup
const ALIAS_MAP = (() => {
  const map = {};
  for (const key of Object.keys(CATEGORIES)) {
    const cat = CATEGORIES[key];
    map[key] = key;
    for (const a of cat.aliases || []) {
      map[a.toLowerCase()] = key;
    }
  }
  return map;
})();

/**
 * Slug normalize — DB'den gelen aliası canonical slug'a çevir.
 */
export function normalizeCategorySlug(slug) {
  if (!slug) return "other";
  return ALIAS_MAP[String(slug).toLowerCase()] || "other";
}

/**
 * Kategori meta objesini al — yoksa "other" döner.
 */
export function getCategoryMeta(slug) {
  return CATEGORIES[normalizeCategorySlug(slug)] || CATEGORIES.other;
}

export function getCategoryName(slug) {
  return getCategoryMeta(slug).name;
}

export function getCategoryStops(slug) {
  return getCategoryMeta(slug).stops;
}

export function getCategoryIcon(slug) {
  return getCategoryMeta(slug).icon;
}

export function getCategoryAccent(slug) {
  return getCategoryMeta(slug).accent;
}

/**
 * Home/Discovery slider'larında gösterilecek kategoriler (sırasıyla).
 * UI sırası buradan kontrol edilir.
 */
// HomeScreen'de slider sırası — en önemli/dolu olan üstte
export const DISCOVERY_CATEGORIES = [
  "exam",            // YDS / YÖKDİL / IELTS / TOEFL / YKS-DİL — en ödeme istekli segment
  "academic",        // Sınav-dışı akademik
  "business",        // İş & Kariyer
  "daily",           // Günlük + Renkler + Sayılar + Phrasal
  "social",          // Sosyal Medya + Internet (Z-gen için kritik)
  "shopping",        // Market & Alışveriş — günlük hayat
  "transportation",  // Ulaşım & Yolculuk
  "home",            // Ev & Aile
  "sports",          // Spor
  "emotions",        // Duygular
  "arts",            // Sanat & Müzik
  "nature",          // Doğa & Hayvanlar
  "news",            // Haber & Güncel
  "tech",            // Teknoloji
  "food",            // Yemek
  "travel",          // Seyahat (eski — transportation ile birleştirilebilir ileride)
];

export const ALL_SLUGS = Object.keys(CATEGORIES);
