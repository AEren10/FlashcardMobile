/**
 * AsyncStorage TTL wrapper — offline-ready cache.
 * get(key) → fresh ise data döner, değilse null
 * set(key, data, ttlMs) → süresiyle yazar
 * swr(key, fetcher, ttlMs) → stale-while-revalidate: cache varsa hemen döner,
 *   arka planda fetcher'ı çalıştırıp cache'i günceller.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@fc:cache:";

export async function get(key) {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    if (expiresAt && Date.now() > expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

export async function set(key, data, ttlMs = 5 * 60 * 1000) {
  try {
    const payload = JSON.stringify({ data, expiresAt: Date.now() + ttlMs });
    await AsyncStorage.setItem(PREFIX + key, payload);
  } catch {}
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch {}
}

/**
 * Stale-while-revalidate. callback(data, isStale) çağrılır.
 * Önce cache varsa hemen callback(cachedData, true), sonra fresh fetch → callback(fresh, false).
 */
export async function swr(key, fetcher, ttlMs, onData) {
  const cached = await get(key);
  if (cached) onData(cached, true);
  try {
    const fresh = await fetcher();
    if (fresh != null) {
      await set(key, fresh, ttlMs);
      onData(fresh, false);
    }
    return fresh;
  } catch (e) {
    if (!cached) throw e;
    return cached;
  }
}

export default { get, set, remove, swr };
