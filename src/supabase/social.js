/**
 * Sosyal layer — like, follow, leaderboard.
 */
import supabase from "./client";

export async function toggleListLike(listId) {
  try {
    const { data, error } = await supabase.rpc("toggle_list_like", { p_list_id: listId });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return { success: true, liked: !!row?.liked, likeCount: row?.like_count ?? 0 };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function toggleFollow(userId) {
  try {
    const { data, error } = await supabase.rpc("toggle_follow", { p_target_user: userId });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return { success: true, following: !!row?.following, followerCount: row?.follower_count ?? 0 };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function amIFollowing(userId) {
  try {
    const { data, error } = await supabase.rpc("am_i_following", { p_target_user: userId });
    if (error) throw error;
    return !!data;
  } catch {
    return false;
  }
}

export async function getTopLikedLists(limit = 20) {
  try {
    const { data, error } = await supabase.rpc("top_liked_lists", { p_limit: limit });
    if (error) throw error;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { success: false, error: err.message, data: [] };
  }
}
