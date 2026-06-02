/**
 * Cache'lenmiş Supabase fetcher'ları — offline-first.
 */
import { swr, get as cacheGet } from "./cache";
import supabaseApi from "../services/supabaseApi";

const TTL_LISTS = 10 * 60 * 1000;   // 10 dk
const TTL_WORDS = 30 * 60 * 1000;   // 30 dk

export async function fetchPublicLists(onData) {
  return swr(
    "public_lists",
    async () => {
      const r = await supabaseApi.getAllPublicLists();
      return r.success ? r.data : null;
    },
    TTL_LISTS,
    onData
  );
}

export async function fetchListWords(listId, onData) {
  return swr(
    `list_words:${listId}`,
    async () => {
      const r = await supabaseApi.getListWords(listId);
      return r.success ? r.data : null;
    },
    TTL_WORDS,
    onData
  );
}

export { cacheGet };
