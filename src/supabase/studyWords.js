/**
 * Study Mode kelime fetcher — mod'a göre filtreli kelime listesi.
 * Migration: 0010_get_study_words.sql
 */
import supabase from "./client";
import { getListWords } from "./database";

/**
 * @param {string} listId
 * @param {"all"|"smart"|"new"|"mistakes"} mode
 * @param {number} limit
 * @returns {Promise<{success, data: word[], error?}>}
 */
export async function getStudyWords(listId, mode = "all", limit = 200) {
  if (!listId) return { success: false, data: [], error: "no listId" };
  try {
    const { data, error } = await supabase.rpc("get_study_words", {
      p_list_id: listId,
      p_mode: mode,
      p_limit: limit,
    });
    if (error) throw error;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (err) {
    // Fallback: RPC yoksa veya hata — eski getListWords çağrısı (sadece "all" davranışı)
    try {
      const r = await getListWords(listId);
      return { success: true, data: r.data || [], fallback: true };
    } catch {
      return { success: false, data: [], error: err.message };
    }
  }
}
