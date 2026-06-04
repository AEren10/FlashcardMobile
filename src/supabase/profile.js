/**
 * Profile helpers — profiles tablosu.
 *
 * NOT: profiles tablosunun PK'sı `id` ve auth.users.id ile birebir eşleşir.
 * Diğer tablolar `user_id` foreign key kullanır ama profiles farklı.
 * Bu helper'lar tek doğru sorgu yolunu garanti eder.
 *
 * Schema beklentisi:
 *   profiles (
 *     id          uuid PK references auth.users(id) on delete cascade,
 *     display_name text,
 *     avatar_url   text,
 *     updated_at   timestamptz
 *   )
 */
import supabase from "./client";

/**
 * Kullanıcının profile satırını döner.
 * @returns {Promise<{ success: boolean, data?: { display_name, avatar_url }, error?: string }>}
 */
export async function getProfile(userId) {
  if (!userId) return { success: false, error: "no user id" };
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    if (error) return { success: false, error: error.message };
    return {
      success: true,
      data: data
        ? { display_name: data.display_name || null, avatar_url: data.avatar_url || null }
        : { display_name: null, avatar_url: null },
    };
  } catch (e) {
    return { success: false, error: e?.message || "fetch failed" };
  }
}

/**
 * Profile satırını günceller — yoksa insert eder (upsert).
 * @param {string} userId
 * @param {{ display_name?: string, avatar_url?: string|null }} patch
 */
export async function updateProfile(userId, patch) {
  if (!userId) return { success: false, error: "no user id" };
  try {
    const row = {
      id: userId,
      ...patch,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("profiles")
      .upsert(row, { onConflict: "id" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message || "update failed" };
  }
}

/**
 * Avatar dosyasını upload edip public URL'ini döner.
 * @param {string} userId
 * @param {string} localUri — ImagePicker.assets[0].uri
 */
export async function uploadAvatar(userId, localUri) {
  if (!userId || !localUri) return { success: false, error: "missing args" };
  try {
    const fileExt = (localUri.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${userId}/avatar.${fileExt}`;
    const response = await fetch(localUri);
    const blob = await response.blob();
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, { upsert: true, contentType: blob.type });
    if (upErr) return { success: false, error: upErr.message };
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return { success: true, url: urlData?.publicUrl || null };
  } catch (e) {
    return { success: false, error: e?.message || "upload failed" };
  }
}
