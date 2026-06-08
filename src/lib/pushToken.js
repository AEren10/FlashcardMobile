/**
 * Push token register — Expo push token alır ve Supabase'e (register_push_token RPC) kaydeder.
 * Migration: 0009_comeback_push.sql
 *
 * App.js içinde permission alındıktan sonra çağırılır (idempotent — aynı token tekrar yazılırsa sorun yok).
 */
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import supabase from "../supabase/client";

let _lastRegisteredToken = null;

/**
 * Expo push token al + Supabase'e kaydet.
 * Permission yoksa veya simulator'sa no-op döner.
 */
export async function registerExpoPushToken() {
  try {
    if (!Device.isDevice) return { success: false, reason: "simulator" };

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return { success: false, reason: "no_permission" };

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId;
    const tokenRes = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : {}
    );
    const token = tokenRes?.data;
    if (!token) return { success: false, reason: "no_token" };

    // Aynı token zaten kayıtlıysa skip
    if (token === _lastRegisteredToken) return { success: true, cached: true };

    const { error } = await supabase.rpc("register_push_token", { p_token: token });
    if (error) throw error;

    _lastRegisteredToken = token;
    return { success: true, token };
  } catch (err) {
    return { success: false, error: err?.message };
  }
}

/**
 * `profiles.last_active_at` güncelle — app her açıldığında çağırılır.
 * Comeback push 3-gün-absent kontrolü için bu kolon temel kaynak.
 */
export async function touchLastActive() {
  try {
    const { error } = await supabase.rpc("touch_last_active");
    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: err?.message };
  }
}
