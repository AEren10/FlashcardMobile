/**
 * Streak Freeze wrapper — haftalık 1 hak ile streak korunur.
 * Migration: 0008_streak_freeze.sql
 */
import supabase from "./client";

/**
 * @returns {Promise<{success, canUse, available, nextResetAt, error?}>}
 */
export async function getFreezeStatus() {
  try {
    const { data, error } = await supabase.rpc("get_freeze_status");
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return {
      success: true,
      canUse: !!row?.can_use,
      available: row?.available ?? 0,
      nextResetAt: row?.next_reset_at ?? null,
    };
  } catch (err) {
    return { success: false, error: err.message, canUse: false, available: 0 };
  }
}

/**
 * @returns {Promise<{success, message, nextResetAt, error?}>}
 */
export async function consumeStreakFreeze() {
  try {
    const { data, error } = await supabase.rpc("consume_streak_freeze");
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return {
      success: !!row?.success,
      message: row?.message || null,
      nextResetAt: row?.next_reset_at || null,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
