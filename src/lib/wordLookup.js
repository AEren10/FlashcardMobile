/**
 * wordLookup — Kullanıcı kelime yazarken anlamı otomatik getir.
 *
 * 2 katmanlı strateji:
 *   1) AsyncStorage cache (sınırsız TTL) — 2.+ sefer instant
 *   2) Supabase RPC lookup_word(q) — 1. sefer ~60ms
 *
 * Kullanım:
 *   const data = await lookupWord("apple");
 *   // { word, meaning, example, example_tr } veya null
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../supabase/client";

const CACHE_PREFIX = "@fc:dict:";
const NULL_SENTINEL = "__NULL__"; // boş sonuç da cache'lensin (DB'yi tekrar dövme)

// In-memory hot cache — aynı oturumda AsyncStorage'a bile gitme
const memCache = new Map();

const normalize = (s) => String(s || "").trim().toLowerCase();

export async function lookupWord(raw) {
  const q = normalize(raw);
  if (!q || q.length < 2) return null;

  // L1: memory
  if (memCache.has(q)) {
    const v = memCache.get(q);
    return v === NULL_SENTINEL ? null : v;
  }

  // L2: AsyncStorage
  try {
    const stored = await AsyncStorage.getItem(CACHE_PREFIX + q);
    if (stored != null) {
      if (stored === NULL_SENTINEL) {
        memCache.set(q, NULL_SENTINEL);
        return null;
      }
      const parsed = JSON.parse(stored);
      memCache.set(q, parsed);
      return parsed;
    }
  } catch {
    // cache okuma hatası -> görmezden gel, RPC'ye geç
  }

  // L3: Supabase RPC
  try {
    const { data, error } = await supabase.rpc("lookup_word", { q });
    if (error) return null;

    const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
    const toCache = row || NULL_SENTINEL;

    memCache.set(q, toCache);
    // fire-and-forget — UI'ı tutma
    AsyncStorage.setItem(
      CACHE_PREFIX + q,
      row ? JSON.stringify(row) : NULL_SENTINEL
    ).catch(() => {});

    return row;
  } catch {
    return null;
  }
}

/** Debounce yardımcısı — input-as-you-type için */
export function makeDebouncedLookup(delayMs = 250) {
  let timer = null;
  let lastQ = null;

  return (raw, onResult) => {
    const q = normalize(raw);
    lastQ = q;
    if (timer) clearTimeout(timer);
    if (!q || q.length < 2) {
      onResult(null);
      return;
    }
    timer = setTimeout(async () => {
      const result = await lookupWord(q);
      // Stale guard — kullanıcı bu arada başka şey yazmış olabilir
      if (lastQ === q) onResult(result);
    }, delayMs);
  };
}
