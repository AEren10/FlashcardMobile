/**
 * Rozet sistemi — streak ve toplam kelime eşiklerine göre.
 */
import { ICONS } from "../components/design/Icon";

// Streak rozetleri — her birinin kendi rengi (sıcak ton gradient: sarı → kırmızı → mor)
export const STREAK_BADGES = [
  { threshold: 3,   key: "spark",      label: "Kıvılcım",        icon: ICONS.sparkle,  color: "#F4C95D" },  // soluk altın
  { threshold: 7,   key: "flame",      label: "Alev",            icon: ICONS.flame,    color: "#FF8A4C" },  // turuncu
  { threshold: 14,  key: "bonfire",    label: "Kamp Ateşi",      icon: ICONS.flame,    color: "#E85A3C" },  // kırmızımsı turuncu
  { threshold: 30,  key: "comet",      label: "Kuyruklu Yıldız", icon: ICONS.star,     color: "#C13E5C" },  // koyu pembe
  { threshold: 60,  key: "volcano",    label: "Volkan",          icon: ICONS.mountain, color: "#8B4789" },  // mor
  { threshold: 100, key: "supernova",  label: "Süpernova",       icon: ICONS.bolt,     color: "#5C4DAA" },  // koyu mor
  { threshold: 365, key: "galaxy",     label: "Galaksi",         icon: ICONS.globe,    color: "#3D5F8C" },  // gece mavisi
];

// Kelime rozetleri — büyüme gradient: filiz yeşil → orman koyu yeşil → altın
export const WORDS_BADGES = [
  { threshold: 10,    key: "sprout",  label: "Filiz",   icon: ICONS.leaf,     color: "#A8D582" },  // açık yeşil
  { threshold: 50,    key: "leaf",    label: "Yaprak",  icon: ICONS.leaf,     color: "#7BB661" },  // yaprak yeşili
  { threshold: 200,   key: "tree",    label: "Ağaç",    icon: ICONS.leaf,     color: "#4E8B3F" },  // ağaç yeşili
  { threshold: 1000,  key: "forest",  label: "Orman",   icon: ICONS.crown,    color: "#2D6A4F" },  // orman
  { threshold: 5000,  key: "master",  label: "Usta",    icon: ICONS.trophy,   color: "#D4AE5E" },  // altın
];

export function currentBadge(badges, value) {
  let current = null;
  let next = null;
  for (const b of badges) {
    if (value >= b.threshold) current = b;
    else {
      next = b;
      break;
    }
  }
  return { current, next };
}

export function getStreakBadge(streakDays) {
  return currentBadge(STREAK_BADGES, streakDays);
}

export function getWordsBadge(totalWords) {
  return currentBadge(WORDS_BADGES, totalWords);
}
