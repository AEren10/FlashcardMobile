/**
 * Rozet sistemi — streak ve toplam kelime eşiklerine göre.
 */
export const STREAK_BADGES = [
  { threshold: 3,   key: "spark",      label: "Kıvılcım",    emoji: "✨" },
  { threshold: 7,   key: "flame",      label: "Alev",        emoji: "🔥" },
  { threshold: 14,  key: "bonfire",    label: "Kamp Ateşi",  emoji: "🏕️" },
  { threshold: 30,  key: "comet",      label: "Kuyruklu Yıldız", emoji: "☄️" },
  { threshold: 60,  key: "volcano",    label: "Volkan",      emoji: "🌋" },
  { threshold: 100, key: "supernova",  label: "Süpernova",   emoji: "💥" },
  { threshold: 365, key: "galaxy",     label: "Galaksi",     emoji: "🌌" },
];

export const WORDS_BADGES = [
  { threshold: 10,    key: "sprout",  label: "Filiz",   emoji: "🌱" },
  { threshold: 50,    key: "leaf",    label: "Yaprak",  emoji: "🍃" },
  { threshold: 200,   key: "tree",    label: "Ağaç",    emoji: "🌳" },
  { threshold: 1000,  key: "forest",  label: "Orman",   emoji: "🌲" },
  { threshold: 5000,  key: "master",  label: "Usta",    emoji: "🏆" },
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
