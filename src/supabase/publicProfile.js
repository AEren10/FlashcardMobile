/**
 * publicProfile — Başkasının profil verilerini getir.
 *   - get_public_profile_data RPC: user info + stats
 *   - get_public_lists_by_user RPC: paginated public listeler
 */
import supabase from "./client";

export async function getPublicProfile(userId) {
  try {
    const { data, error } = await supabase.rpc("get_public_profile_data", {
      p_user_id: userId,
    });
    if (error) throw error;
    const row = Array.isArray(data) && data.length ? data[0] : null;
    return { success: true, data: row };
  } catch (err) {
    return { success: false, error: err.message, data: null };
  }
}

export async function getPublicListsByUser(userId, limit = 50) {
  try {
    const { data, error } = await supabase.rpc("get_public_lists_by_user", {
      p_user_id: userId,
      p_limit: limit,
    });
    if (error) throw error;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { success: false, error: err.message, data: [] };
  }
}
