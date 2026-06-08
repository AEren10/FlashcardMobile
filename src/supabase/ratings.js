/**
 * List rating wrappers (1-5 stars).
 * RPC tabanlı: rate_list, get_list_rating, top_rated_lists.
 */
import supabase from "./client";

export const rateList = async (listId, stars) => {
  try {
    if (!listId) return { success: false, error: "missing_list_id" };
    const n = Number(stars);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return { success: false, error: "invalid_rating" };
    }
    const { data, error } = await supabase.rpc("rate_list", {
      p_list_id: listId,
      p_rating: n,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return {
      success: true,
      avg: Number(row?.avg ?? 0),
      count: Number(row?.count ?? 0),
    };
  } catch (error) {
    console.error("rateList:", error.message);
    return { success: false, error: error.message };
  }
};

export const getListRating = async (listId) => {
  try {
    if (!listId) return { success: false, error: "missing_list_id" };
    const { data, error } = await supabase.rpc("get_list_rating", {
      p_list_id: listId,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return {
      success: true,
      avg: Number(row?.avg ?? 0),
      count: Number(row?.count ?? 0),
      userRating: row?.user_rating ?? null,
    };
  } catch (error) {
    console.error("getListRating:", error.message);
    return { success: false, error: error.message, avg: 0, count: 0, userRating: null };
  }
};

export const getTopRatedLists = async (limit = 10) => {
  try {
    const { data, error } = await supabase.rpc("top_rated_lists", {
      p_limit: limit,
    });
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("getTopRatedLists:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};
