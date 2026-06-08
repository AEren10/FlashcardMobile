/**
 * AsyncStorage JSON safety helper — agent raporu HIGH risk (8 yer JSON.parse try/catch yok).
 * Storage corrupt olursa app crash etmesin, sessiz fallback dönsün.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AsyncStorage'dan JSON oku, parse hata olursa fallback dön.
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {Promise<T>}
 */
export async function readJSON(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      // Corrupt JSON — temizle ki bir daha denenmemeli
      AsyncStorage.removeItem(key).catch(() => {});
      return fallback;
    }
  } catch {
    return fallback;
  }
}

/**
 * AsyncStorage'a JSON yaz, hata yutulur (sessiz fail OK).
 */
export async function writeJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Array tip garantili read — non-array dönerse fallback.
 */
export async function readArray(key, fallback = []) {
  const v = await readJSON(key, fallback);
  return Array.isArray(v) ? v : fallback;
}

/**
 * Object tip garantili read — non-object dönerse fallback.
 */
export async function readObject(key, fallback = {}) {
  const v = await readJSON(key, fallback);
  return v && typeof v === "object" && !Array.isArray(v) ? v : fallback;
}
