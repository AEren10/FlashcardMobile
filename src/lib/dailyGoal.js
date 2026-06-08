/**
 * Daily Goal — günlük hedef chip için lokal state.
 * Gece 24:00'da reset (date-based key). 10 kelime default.
 *
 * Kullanım:
 *   const { goal, done, pct } = await getDailyGoal();
 *   await incrementDailyGoal(5); // 5 kelime yapıldı
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "@fc:daily:";
const DEFAULT_GOAL = 10;

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${KEY_PREFIX}${y}-${m}-${day}`;
}

/**
 * @returns {Promise<{goal, done, pct, completed}>}
 */
export async function getDailyGoal(goal = DEFAULT_GOAL) {
  try {
    const raw = await AsyncStorage.getItem(todayKey());
    const done = raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
    const pct = Math.min(100, Math.round((done / Math.max(1, goal)) * 100));
    return { goal, done, pct, completed: done >= goal };
  } catch {
    return { goal, done: 0, pct: 0, completed: false };
  }
}

/**
 * Tamamlanan kart sayısını artır. Yeni hedefte tamamlandıysa true döner.
 */
export async function incrementDailyGoal(by = 1, goal = DEFAULT_GOAL) {
  try {
    const key = todayKey();
    const raw = await AsyncStorage.getItem(key);
    const prev = raw ? parseInt(raw, 10) || 0 : 0;
    const next = prev + Math.max(0, by);
    await AsyncStorage.setItem(key, String(next));
    return {
      goal,
      done: next,
      pct: Math.min(100, Math.round((next / Math.max(1, goal)) * 100)),
      // İlk kez tamamlandı mı? (prev < goal ≤ next)
      justCompleted: prev < goal && next >= goal,
    };
  } catch {
    return { goal, done: by, pct: 0, justCompleted: false };
  }
}
