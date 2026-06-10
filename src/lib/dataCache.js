/**
 * dataCache — stale-while-revalidate pattern.
 * Supabase verisi gelene kadar son cache'i anında göster,
 * arka planda taze veriyi çek ve cache'i güncelle.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@fc:dc:";
const memCache = {};
const timestamps = {};

export function isFresh(key, ttlMs = 30000) {
  return timestamps[key] && (Date.now() - timestamps[key] < ttlMs);
}

/**
 * Cache'den anında oku (sync-ish).
 * İlk mount'ta AsyncStorage'dan yükler, sonrası memory'den.
 */
export async function getCached(key) {
  if (memCache[key] !== undefined) return memCache[key];
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw);
      memCache[key] = parsed;
      return parsed;
    }
  } catch {}
  return null;
}

/**
 * Cache'e yaz (memory + disk).
 */
export async function setCache(key, data) {
  memCache[key] = data;
  timestamps[key] = Date.now();
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {}
}

/**
 * Stale-while-revalidate fetch wrapper.
 * 1) Anında cache'den döner (setState ile)
 * 2) Arka planda fetcher çalıştırır
 * 3) Taze veri gelince setState + cache günceller
 *
 * @param {string} key — cache key
 * @param {Function} fetcher — async () => data
 * @param {Function} setState — React setState
 * @param {*} fallback — cache yoksa kullanılacak default
 */
export async function fetchWithCache(key, fetcher, setState, fallback) {
  // 1) Anında cache ver
  const cached = await getCached(key);
  if (cached !== null) {
    setState(cached);
  } else if (fallback !== undefined) {
    setState(fallback);
  }

  // 2) Arka planda taze veri
  try {
    const fresh = await fetcher();
    if (fresh !== null && fresh !== undefined) {
      setState(fresh);
      setCache(key, fresh);
    }
  } catch {}
}
