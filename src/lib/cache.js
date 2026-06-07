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

// In-flight promise registry — aynı key için paralel fetch'i tek promise'e collapse et.
// Race condition (audit #1): SWR'a inflight lock yok → 2 paralel hook = 2 paralel network.
const _inflight = new Map();

/**
 * Stale-while-revalidate. callback(data, isStale) çağrılır.
 * Önce cache varsa hemen callback(cachedData, true), sonra fresh fetch → callback(fresh, false).
 * Aynı key için paralel çağrılar: cached ayrı ayrı emit eder ama fetcher tek promise share eder.
 */
export async function swr(key, fetcher, ttlMs, onData) {
  const cached = await get(key);
  if (cached) onData(cached, true);

  // Halihazırda devam eden fetch var mı? → onu paylaş
  let p = _inflight.get(key);
  if (!p) {
    p = (async () => {
      try {
        const fresh = await fetcher();
        if (fresh != null) await set(key, fresh, ttlMs);
        return fresh;
      } finally {
        _inflight.delete(key);
      }
    })();
    _inflight.set(key, p);
  }

  try {
    const fresh = await p;
    if (fresh != null) onData(fresh, false);
    return fresh;
  } catch (e) {
    if (!cached) throw e;
    return cached;
  }
}

export default { get, set, remove, swr };
