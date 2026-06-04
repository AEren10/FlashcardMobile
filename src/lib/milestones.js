/**
 * Milestones — kullanıcının "ilk-X" anları.
 *
 * Her milestone bir kere kutlanır; AsyncStorage'a yazılır.
 * AchievementsContext'ten ayrı; bunlar event-based, threshold değil.
 *
 * Stüdyo ton: "İlk adımını attın" tarzı sıcak başlık + sonraki hedef chip.
 */
import { ICONS } from "../components/design/Icon";

export const MILESTONES = {
  FIRST_WORD: {
    key: "first_word",
    title: "İlk kelime",
    headline: "İlk kelimeni öğrendin",
    sub: "Yolun başı bu — devamı çok daha kolay",
    icon: ICONS.sparkle,
    color: "#A8D582", // soft green — başlangıç
    nextHint: "Hedef: 10 kelime",
  },
  FIRST_LIST_DONE: {
    key: "first_list_done",
    title: "İlk liste tamam",
    headline: "İlk listeni bitirdin",
    sub: "Listeyi tamamladın, sıradakine geçebilirsin",
    icon: ICONS.check,
    color: "#7BAEC8", // cobalt
    nextHint: "İkinci listeni aç",
  },
  FIRST_WEEK_STREAK: {
    key: "first_week_streak",
    title: "İlk hafta",
    headline: "7 gün üst üste",
    sub: "Alev tutuştu — bu artık alışkanlık",
    icon: ICONS.flame,
    color: "#FF8A4C", // warm orange
    nextHint: "Hedef: 14 gün",
  },
  FIRST_100_WORDS: {
    key: "first_100_words",
    title: "100 kelime",
    headline: "100 kelime öğrendin",
    sub: "Artık günlük konuşmaya yetecek temel kelime hazinen var",
    icon: ICONS.books,
    color: "#D4AE5E", // accent gold
    nextHint: "Hedef: 250 kelime",
  },
  FIRST_PERFECT_QUIZ: {
    key: "first_perfect_quiz",
    title: "İlk %100",
    headline: "İlk mükemmel quiz",
    sub: "Hepsini bildin — beyin pekiştirme moduna geçti",
    icon: ICONS.trophy,
    color: "#D4AE5E", // gold
    nextHint: "Daha zor liste dene",
  },
  FIRST_FAVORITE: {
    key: "first_favorite",
    title: "İlk favori",
    headline: "İlk kelimeni favoriledin",
    sub: "Önemli bulduğun kelimeler tek tuşla erişilebilir",
    icon: ICONS.star,
    color: "#C13E5C", // soft rose
    nextHint: "10 favori biriktir",
  },
};

export const MILESTONE_LIST = Object.values(MILESTONES);

export function getMilestone(key) {
  return MILESTONE_LIST.find((m) => m.key === key) || null;
}

/**
 * Kullanıcı stats'ından hangi milestone'lar tetiklenmeli — kontrolü.
 * Tek seferlik — daha önce unlock olmuşları çıkarır.
 *
 * @param {object} stats
 * @param {string[]} unlockedKeys — AsyncStorage'tan gelen
 * @returns {string[]} yeni tetiklenecek key'ler
 */
export function detectNewMilestones(stats, unlockedKeys = []) {
  const set = new Set(unlockedKeys);
  const triggered = [];
  const check = (key, cond) => {
    if (!set.has(key) && cond) triggered.push(key);
  };

  check(MILESTONES.FIRST_WORD.key, (stats.totalWords || 0) >= 1);
  check(MILESTONES.FIRST_100_WORDS.key, (stats.totalWords || 0) >= 100);
  check(MILESTONES.FIRST_WEEK_STREAK.key, (stats.streakDays || 0) >= 7);
  check(MILESTONES.FIRST_LIST_DONE.key, (stats.listsCompleted || 0) >= 1);
  check(MILESTONES.FIRST_PERFECT_QUIZ.key, (stats.perfectQuizCount || 0) >= 1);
  check(MILESTONES.FIRST_FAVORITE.key, (stats.favoriteWordsCount || 0) >= 1);

  return triggered;
}
