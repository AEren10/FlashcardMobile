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
 * base64 string → Uint8Array (atob + char.codeAt yöntemi).
 * React Native'de Buffer/TextEncoder garantili değil, manuel decode en sağlamı.
 */
function base64ToUint8Array(base64) {
  // atob React Native'de built-in (Hermes + JSC)
  const bin = global.atob ? global.atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const len = bin.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

/**
 * Avatar dosyasını upload edip public URL'ini döner.
 *
 * @param {string} userId
 * @param {object|string} asset — ImagePicker assets[0] objesi { uri, base64, mimeType, fileName }
 *                                veya geriye dönük: sadece uri string'i (eski çağrı şekli)
 */
export async function uploadAvatar(userId, asset) {
  if (!userId || !asset) return { success: false, error: "missing args" };
  try {
    const localUri = typeof asset === "string" ? asset : asset.uri;
    const base64 = typeof asset === "object" ? asset.base64 : null;
    if (!localUri) return { success: false, error: "no uri" };

    const fileExt = (localUri.split(".").pop() || "jpg").toLowerCase().split("?")[0];
    const fileName = `${userId}/avatar.${fileExt}`;
    const contentType =
      (typeof asset === "object" && (asset.mimeType || asset.type)) ||
      (fileExt === "png" ? "image/png" : "image/jpeg");

    // En güvenli yol: base64 → Uint8Array
    // (fetch().blob() React Native'de bazen 0-byte gönderiyor)
    if (!base64) {
      return {
        success: false,
        error: "base64 missing — pickAvatar'da `base64: true` olduğundan emin ol",
      };
    }
    const bytes = base64ToUint8Array(base64);

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(fileName, bytes, { upsert: true, contentType });
    if (upErr) return { success: false, error: upErr.message };

    // Cache-busting query ile public URL — eski cached avatar'ı bypass et
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const cacheBustedUrl = urlData?.publicUrl
      ? `${urlData.publicUrl}?t=${Date.now()}`
      : null;
    return { success: true, url: cacheBustedUrl };
  } catch (e) {
    return { success: false, error: e?.message || "upload failed" };
  }
}
