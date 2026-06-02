/**
 * Word-level favorites (kelime bazında favori).
 * Liste favorisinden ayrıdır — kullanıcı tek tek kelimeleri işaretler.
 */
import supabase from "./client";

const TABLE = "favorite_words";

export const getFavoriteWords = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, data: [], error: "not_authenticated" };

    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        word_id,
        list_id,
        created_at,
        words ( id, word, meaning, example, list_id ),
        lists ( id, title, level, category )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("getFavoriteWords:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const getFavoriteWordIds = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, data: [] };

    const { data, error } = await supabase
      .from(TABLE)
      .select("word_id")
      .eq("user_id", user.id);

    if (error) throw error;
    return { success: true, data: (data || []).map((r) => r.word_id) };
  } catch (error) {
    console.error("getFavoriteWordIds:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const addFavoriteWord = async (wordId, listId = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "not_authenticated" };

    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { user_id: user.id, word_id: wordId, list_id: listId },
        { onConflict: "user_id,word_id" }
      );

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("addFavoriteWord:", error.message);
    return { success: false, error: error.message };
  }
};

export const removeFavoriteWord = async (wordId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "not_authenticated" };

    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("user_id", user.id)
      .eq("word_id", wordId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("removeFavoriteWord:", error.message);
    return { success: false, error: error.message };
  }
};
