/**
 * Mistakes list — "Bilemediğin Kelimeler" otomatik listesi.
 * RPC: add_to_mistakes_list, remove_from_mistakes_list.
 * Client logic: 3 doğru üst üste → otomatik çıkar.
 */
import supabase from "./client";

const AUTO_REMOVE_AFTER = 3; // 3 doğru üst üste = listeden çık

/**
 * Verilen word_ids'leri kullanıcının mistakes listesine ekler.
 * Liste yoksa oluşturur. Duplicate eklemez.
 * @returns {Promise<{success, listId, addedCount}>}
 */
export const addToMistakesList = async (wordIds = []) => {
  try {
    if (!wordIds.length) return { success: true, listId: null, addedCount: 0 };

    const { data, error } = await supabase.rpc("add_to_mistakes_list", {
      p_word_ids: wordIds,
    });

    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return {
      success: true,
      listId: row?.list_id ?? null,
      addedCount: row?.added_count ?? 0,
    };
  } catch (error) {
    console.error("addToMistakesList:", error.message);
    return { success: false, error: error.message, addedCount: 0 };
  }
};

/**
 * Kelime + meaning eşleşmesi ile mistakes listesinden tek kelimeyi siler.
 * (word_id farklı çünkü kopyalanan kelime yeni id alıyor — content match.)
 */
export const removeFromMistakesList = async (wordText, meaningText) => {
  try {
    const { data, error } = await supabase.rpc("remove_from_mistakes_list", {
      p_word_text: wordText,
      p_meaning_text: meaningText,
    });
    if (error) throw error;
    return { success: true, removed: !!data };
  } catch (error) {
    console.error("removeFromMistakesList:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Kullanıcının mistakes listesini getirir (varsa).
 */
export const getMistakesList = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, data: null };

    const { data, error } = await supabase
      .from("lists")
      .select("*, words(count)")
      .eq("user_id", user.id)
      .eq("kind", "mistakes")
      .maybeSingle();

    if (error) throw error;
    if (!data) return { success: true, data: null };

    return {
      success: true,
      data: { ...data, word_count: data.words?.[0]?.count ?? 0 },
    };
  } catch (error) {
    console.error("getMistakesList:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Bir kelime mistakes listesinde mi?  (word+meaning ile content match)
 */
export const isInMistakesList = async (wordText, meaningText) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, inList: false };

    const { data: list } = await supabase
      .from("lists")
      .select("id")
      .eq("user_id", user.id)
      .eq("kind", "mistakes")
      .maybeSingle();

    if (!list) return { success: true, inList: false };

    const { data, error } = await supabase
      .from("words")
      .select("id")
      .eq("list_id", list.id)
      .eq("word", wordText)
      .eq("meaning", meaningText)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return { success: true, inList: !!data };
  } catch (error) {
    return { success: false, error: error.message, inList: false };
  }
};

/**
 * Kelime doğru bilindiğinde çağrılır — ATOMİC RPC.
 *   - Audit #5 race condition fix: select+update'i tek transaction'a koy.
 *   - word_progress.mistakes_streak++ (UPSERT)
 *   - threshold'a (3) ulaşırsa: mistakes listesinden çıkar + streak=0
 */
export const bumpMistakesStreak = async (wordId, wordText, meaningText) => {
  try {
    const { data, error } = await supabase.rpc("bump_mistakes_streak_atomic", {
      p_word_id: wordId,
      p_word_text: wordText,
      p_meaning_text: meaningText,
      p_threshold: AUTO_REMOVE_AFTER,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return {
      success: true,
      newStreak: row?.new_streak ?? 0,
      removedFromMistakes: !!row?.removed_from_mistakes,
    };
  } catch (error) {
    console.error("bumpMistakesStreak:", error.message);
    return { success: false, error: error.message };
  }
};

export const resetMistakesStreak = async (wordId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    await supabase
      .from("word_progress")
      .update({ mistakes_streak: 0 })
      .eq("user_id", user.id)
      .eq("word_id", wordId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
