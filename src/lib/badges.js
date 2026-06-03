/**
 * Rozet sistemi — streak ve toplam kelime eşiklerine göre.
 */
import { ICONS } from "../components/design/Icon";

export const STREAK_BADGES = [
  { threshold: 3,   key: "spark",      label: "Kıvılcım",    emoji: "✨", icon: ICONS.sparkle },
  { threshold: 7,   key: "flame",      label: "Alev",        emoji: "🔥", icon: ICONS.flame },
  { threshold: 14,  key: "bonfire",    label: "Kamp Ateşi",  emoji: "🏕️", icon: ICONS.flame },
  { threshold: 30,  key: "comet",      label: "Kuyruklu Yıldız", emoji: "☄️", icon: ICONS.star },
  { threshold: 60,  key: "volcano",    label: "Volkan",      emoji: "🌋", icon: ICONS.mountain },
  { threshold: 100, key: "supernova",  label: "Süpernova",   emoji: "💥", icon: ICONS.bolt },
  { threshold: 365, key: "galaxy",     label: "Galaksi",     emoji: "🌌", icon: ICONS.globe },
];

export const WORDS_BADGES = [
  { threshold: 10,    key: "sprout",  label: "Filiz",   emoji: "🌱", icon: ICONS.leaf },
  { threshold: 50,    key: "leaf",    label: "Yaprak",  emoji: "🍃", icon: ICONS.leaf },
  { threshold: 200,   key: "tree",    label: "Ağaç",    emoji: "🌳", icon: ICONS.leaf },
  { threshold: 1000,  key: "forest",  label: "Orman",   emoji: "🌲", icon: ICONS.crown },
  { threshold: 5000,  key: "master",  label: "Usta",    emoji: "🏆", icon: ICONS.trophy },
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
