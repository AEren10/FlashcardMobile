/**
 * wordLookup — Kullanıcı kelime yazarken anlamı otomatik getir.
 *
 * 3 katmanlı strateji:
 *   1) AsyncStorage cache (sınırsız TTL) — 2.+ sefer instant
 *   2) Supabase RPC lookup_word(q) — 1. sefer ~60ms
 *   3) Free Dictionary API fallback — RPC'de yoksa
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../supabase/client";

const CACHE_PREFIX = "@fc:dict:";
const NULL_SENTINEL = "__NULL__";

const memCache = new Map();

const normalize = (s) => String(s || "").trim().toLowerCase();

async function fetchFreeDictionary(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (!res.ok) return null;
    const json = await res.json();
    const entry = json?.[0];
    if (!entry) return null;
    const def = entry.meanings?.[0]?.definitions?.[0];
    return {
      word: entry.word || word,
      meaning: def?.definition || "",
      example: def?.example || null,
      example_tr: null,
    };
  } catch {
    return null;
  }
}

export async function lookupWord(raw) {
  const q = normalize(raw);
  if (!q || q.length < 2) return null;

  if (memCache.has(q)) {
    const v = memCache.get(q);
    return v === NULL_SENTINEL ? null : v;
  }

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
  } catch {}

  let row = null;

  try {
    const { data, error } = await supabase.rpc("lookup_word", { q });
    if (!error && Array.isArray(data) && data.length > 0) {
      row = data[0];
    }
  } catch {}

  if (!row) {
    row = await fetchFreeDictionary(q);
  }

  const toCache = row || NULL_SENTINEL;
  memCache.set(q, toCache);
  AsyncStorage.setItem(
    CACHE_PREFIX + q,
    row ? JSON.stringify(row) : NULL_SENTINEL
  ).catch(() => {});

  return row;
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
