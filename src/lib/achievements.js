/**
 * Achievement (Başarım) sistemi.
 *
 * 3 tip:
 *   - threshold: sayısal değere ulaşınca (streak, total words, sessions, accuracy)
 *   - event: tek seferlik tetik (first_list, first_quiz, first_share)
 *   - composite: birkaç şart aynı anda (örn. 7 gün streak + 80% accuracy)
 *
 * Persistance: kazanılmış achievement key'leri AsyncStorage'da @fc:achievements:seen
 *
 * UI:
 *   - AchievementsScreen — grid (kilitli + açık)
 *   - AchievementModal — yeni kazanılan göster (mevcut)
 *   - ProfileScreen / StreakScreen — özet
 */
import { ICONS } from "../components/design/Icon";

/**
 * @typedef {Object} Achievement
 * @property {string} key — unique id
 * @property {string} label — gösterilecek başlık
 * @property {string} description — alt açıklama
 * @property {string} icon — SVG path
 * @property {string} category — 'streak' | 'words' | 'sessions' | 'accuracy' | 'social' | 'milestone'
 * @property {string} tier — 'bronze' | 'silver' | 'gold' | 'legendary'
 * @property {string} type — 'threshold' | 'event'
 * @property {string} [trigger] — event tipi için event adı
 * @property {string} [field] — threshold için stat field'i
 * @property {number} [value] — threshold değeri
 */

export const ACHIEVEMENTS = [
  // === STREAK (gün serisi) ===
  { key: "streak_3",   label: "Kıvılcım",        description: "3 gün üst üste çalış", icon: ICONS.sparkle, category: "streak", tier: "bronze",    type: "threshold", field: "streakDays", value: 3 },
  { key: "streak_7",   label: "Alev",            description: "7 gün üst üste çalış", icon: ICONS.flame,   category: "streak", tier: "silver",    type: "threshold", field: "streakDays", value: 7 },
  { key: "streak_14",  label: "Yangın",          description: "14 gün üst üste çalış", icon: ICONS.flame,  category: "streak", tier: "silver",    type: "threshold", field: "streakDays", value: 14 },
  { key: "streak_30",  label: "Kuyruklu Yıldız", description: "30 gün üst üste çalış", icon: ICONS.star,   category: "streak", tier: "gold",      type: "threshold", field: "streakDays", value: 30 },
  { key: "streak_100", label: "Süpernova",       description: "100 gün üst üste çalış", icon: ICONS.bolt,  category: "streak", tier: "legendary", type: "threshold", field: "streakDays", value: 100 },
  { key: "streak_365", label: "Galaksi",         description: "1 yıl boyunca her gün", icon: ICONS.globe,  category: "streak", tier: "legendary", type: "threshold", field: "streakDays", value: 365 },

  // === WORDS (toplam kelime) ===
  { key: "words_10",   label: "Filiz",     description: "10 kelime öğren",  icon: ICONS.leaf,    category: "words", tier: "bronze",    type: "threshold", field: "totalWords", value: 10 },
  { key: "words_50",   label: "Yaprak",    description: "50 kelime öğren",  icon: ICONS.leaf,    category: "words", tier: "bronze",    type: "threshold", field: "totalWords", value: 50 },
  { key: "words_200",  label: "Ağaç",      description: "200 kelime öğren", icon: ICONS.mountain, category: "words", tier: "silver",   type: "threshold", field: "totalWords", value: 200 },
  { key: "words_500",  label: "Koru",      description: "500 kelime öğren", icon: ICONS.mountain, category: "words", tier: "gold",     type: "threshold", field: "totalWords", value: 500 },
  { key: "words_1000", label: "Orman",     description: "1000 kelime öğren", icon: ICONS.crown,  category: "words", tier: "gold",      type: "threshold", field: "totalWords", value: 1000 },
  { key: "words_5000", label: "Kelime Ustası", description: "5000 kelime öğren", icon: ICONS.trophy, category: "words", tier: "legendary", type: "threshold", field: "totalWords", value: 5000 },

  // === SESSIONS (oturum sayısı) ===
  { key: "sessions_1",   label: "İlk Adım",      description: "İlk çalışma oturumun", icon: ICONS.bolt,      category: "sessions", tier: "bronze", type: "threshold", field: "totalSessions", value: 1 },
  { key: "sessions_10",  label: "Tutarlı",       description: "10 çalışma oturumu",   icon: ICONS.target,    category: "sessions", tier: "silver", type: "threshold", field: "totalSessions", value: 10 },
  { key: "sessions_50",  label: "Disiplinli",    description: "50 çalışma oturumu",   icon: ICONS.target,    category: "sessions", tier: "gold",   type: "threshold", field: "totalSessions", value: 50 },
  { key: "sessions_200", label: "Maraton",       description: "200 çalışma oturumu",  icon: ICONS.trophy,    category: "sessions", tier: "legendary", type: "threshold", field: "totalSessions", value: 200 },

  // === ACCURACY (doğruluk) ===
  { key: "accuracy_70",  label: "Net",       description: "%70+ doğruluk (10+ seans)",   icon: ICONS.check, category: "accuracy", tier: "silver", type: "threshold", field: "accuracy", value: 70 },
  { key: "accuracy_85",  label: "Keskin",    description: "%85+ doğruluk (10+ seans)",   icon: ICONS.check, category: "accuracy", tier: "gold",   type: "threshold", field: "accuracy", value: 85 },
  { key: "accuracy_95",  label: "Snayper",   description: "%95+ doğruluk (10+ seans)",   icon: ICONS.target, category: "accuracy", tier: "legendary", type: "threshold", field: "accuracy", value: 95 },

  // === EVENTS (tek seferlik tetik) ===
  { key: "first_list",       label: "Liste Yarattım",   description: "İlk kendi listeni oluştur",      icon: ICONS.plus,     category: "milestone", tier: "bronze", type: "event", trigger: "list_created" },
  { key: "first_quiz",       label: "Quiz Mezunu",      description: "İlk quiz'ini tamamla",          icon: ICONS.grid,     category: "milestone", tier: "bronze", type: "event", trigger: "quiz_completed" },
  { key: "first_share",      label: "Paylaşımcı",       description: "Bir listeyi ilk kez paylaş",     icon: ICONS.share,    category: "social",    tier: "bronze", type: "event", trigger: "list_shared" },
  { key: "first_mistake_fix",label: "Hatamı Düzelttim", description: "Bilemediğin bir kelimeyi 3 kez doğru bil", icon: ICONS.shield, category: "milestone", tier: "silver", type: "event", trigger: "mistake_resolved" },
  { key: "first_graduate",   label: "Mezuniyet",        description: "Bir kelimeyi 'biliyorum' işaretle", icon: ICONS.crown, category: "milestone", tier: "bronze", type: "event", trigger: "word_graduated" },
  { key: "perfect_quiz",     label: "Mükemmel Quiz",    description: "Bir quiz'i %100 doğru tamamla",  icon: ICONS.trophy,  category: "milestone", tier: "gold",   type: "event", trigger: "perfect_quiz" },

  // === SOCIAL ===
  { key: "favorited_10", label: "Koleksiyoner", description: "10 kelimeyi yer imine ekle", icon: ICONS.bookmark, category: "social", tier: "silver", type: "threshold", field: "favoritedWords", value: 10 },
];

export const CATEGORIES = [
  { key: "streak",    label: "Seri" },
  { key: "words",     label: "Kelime" },
  { key: "sessions",  label: "Oturum" },
  { key: "accuracy",  label: "Doğruluk" },
  { key: "milestone", label: "Kilometre Taşı" },
  { key: "social",    label: "Sosyal" },
];

export const TIER_COLORS = {
  bronze:    { color: "#C17B5A", label: "Bronz" },
  silver:    { color: "#A8B0B5", label: "Gümüş" },
  gold:      { color: "#D4AE5E", label: "Altın" },
  legendary: { color: "#92ABC0", label: "Efsane" },
};

/**
 * Stats'ten unlocked achievement key'leri çıkar.
 * @param {object} stats — { streakDays, totalWords, totalSessions, accuracy, favoritedWords }
 * @param {Set<string>} eventsTriggered — daha önce tetiklenmiş event achievement key'leri
 * @returns {Set<string>}
 */
export function getUnlockedKeys(stats, eventsTriggered = new Set()) {
  const unlocked = new Set();
  for (const a of ACHIEVEMENTS) {
    if (a.type === "threshold") {
      const v = stats?.[a.field] ?? 0;
      // accuracy için min 10 seans şartı
      if (a.field === "accuracy" && (stats?.totalSessions ?? 0) < 10) continue;
      if (v >= a.value) unlocked.add(a.key);
    } else if (a.type === "event") {
      if (eventsTriggered.has(a.key)) unlocked.add(a.key);
    }
  }
  return unlocked;
}

/**
 * Kategoriye göre grupla.
 */
export function groupByCategory(achievements) {
  const map = {};
  for (const a of achievements) {
    if (!map[a.category]) map[a.category] = [];
    map[a.category].push(a);
  }
  return map;
}

export function getAchievementByKey(key) {
  return ACHIEVEMENTS.find((a) => a.key === key);
}
