/**
 * Bildirim sistemi — 2 SABİT + N EKSTRA model.
 *
 * Felsefe:
 *   - 2 SABİT bildirim (sabah 09:00 + akşam 20:00) HER ZAMAN atılır.
 *     Kullanıcı bunu kapatamaz. (Apple kullanıcı cihazdan kapatabilir, app içinde kapatma yok.)
 *   - Kullanıcı isterse "ekstra hatırlatıcılar" ekleyebilir (max 4).
 *   - Permission verilmediyse hiçbir şey atılmaz, bir kez sorulur, sonra sessiz kalır.
 *
 * Kullanım:
 *   - App açılışta (auth sonrası): ensureBaseReminders() — idempotent
 *   - Onboarding sonu: requestPermissions() + ensureBaseReminders()
 *   - Settings → "Ek hatırlatıcı": addExtraReminder(hour, minute)
 *
 * Identifier şeması:
 *   - "fc-base-0" → 09:00 sabit
 *   - "fc-base-1" → 20:00 sabit
 *   - "fc-extra-{N}" → kullanıcının eklediği
 */
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const EXTRAS_KEY = "@fc:reminders:extras";
const PERM_ASKED_KEY = "@fc:reminders:permAsked";
const BASE_PREFIX = "fc-base-";
const EXTRA_PREFIX = "fc-extra-";
const MAX_EXTRAS = 4;

// HER ZAMAN aktif olacak 2 fix bildirim
export const BASE_TIMES = [
  { hour: 9, minute: 0 },   // sabah
  { hour: 20, minute: 0 },  // akşam
];

const MORNING_MESSAGES = [
  { title: "Günaydın 🌅", body: "Güne 5 kelime ile başla — beynin en taze anı." },
  { title: "Sabah molası", body: "Bugünkü 10 kelimene bakalım mı?" },
  { title: "Yeni gün, yeni kelimeler", body: "Aralıklı tekrar zamanı — birkaç dakika ayır." },
  { title: "Kahveden önce", body: "Bir kahve ardı 5 dakikalık çalışma — günü iyi başlatır." },
];

const EVENING_MESSAGES = [
  { title: "Seri bozulmasın", body: "Bugün çalışmadıysan kısa bir oturum yeter." },
  { title: "Günün özeti", body: "Yatmadan birkaç kelime daha." },
  { title: "Akşam tekrarı", body: "Yarın hatırlamak için bu akşamki 5 dakika." },
  { title: "Gün bitmeden", body: "Bugünkü hedefini tamamlamaya çok az kaldı." },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ───────── Permission ─────────

export async function getPermissionStatus() {
  if (!Device.isDevice) return "device_only";
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch {
    return "undetermined";
  }
}

export async function requestPermissions() {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const ask = await Notifications.requestPermissionsAsync();
  await AsyncStorage.setItem(PERM_ASKED_KEY, "true").catch(() => {});
  return ask.status === "granted";
}

export async function hasBeenAskedBefore() {
  return (await AsyncStorage.getItem(PERM_ASKED_KEY).catch(() => null)) === "true";
}

// ───────── Channel (Android) ─────────

async function ensureChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Çalışma Hatırlatıcısı",
    importance: Notifications.AndroidImportance.HIGH,
  });
}

function pickMessage(hour) {
  const pool = hour < 14 ? MORNING_MESSAGES : EVENING_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ───────── Cancel helpers ─────────

async function cancelByPrefix(prefix) {
  const all = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
  await Promise.all(
    all
      .filter((n) => (n.identifier || "").startsWith(prefix))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
  );
}

// ───────── BASE reminders (2 sabit) ─────────

/**
 * 2 base bildirimi (09:00 + 20:00) zamanla.
 * Idempotent — her çağrıda eski base'leri silip yenisini ekler.
 * Permission yoksa sessizce false döner.
 */
export async function ensureBaseReminders() {
  const status = await getPermissionStatus();
  if (status !== "granted") return { success: false, reason: "no_permission" };

  await ensureChannel();
  await cancelByPrefix(BASE_PREFIX);

  for (let i = 0; i < BASE_TIMES.length; i++) {
    const t = BASE_TIMES[i];
    const msg = pickMessage(t.hour);
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: `${BASE_PREFIX}${i}`,
        content: {
          title: msg.title,
          body: msg.body,
          sound: "default",
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: t.hour,
          minute: t.minute,
          channelId: "default",
        },
      });
    } catch (err) {
      console.warn("[ensureBaseReminders] schedule failed", i, err?.message);
    }
  }
  return { success: true, count: BASE_TIMES.length };
}

// ───────── EXTRA reminders (kullanıcı eklediği) ─────────

export async function getExtraReminders() {
  try {
    const raw = await AsyncStorage.getItem(EXTRAS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveExtras(arr) {
  await AsyncStorage.setItem(EXTRAS_KEY, JSON.stringify(arr));
}

async function rescheduleExtras(extras) {
  await cancelByPrefix(EXTRA_PREFIX);
  for (let i = 0; i < extras.length; i++) {
    const t = extras[i];
    const msg = pickMessage(t.hour);
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: `${EXTRA_PREFIX}${i}`,
        content: {
          title: msg.title,
          body: msg.body,
          sound: "default",
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: t.hour,
          minute: t.minute,
          channelId: "default",
        },
      });
    } catch (err) {
      console.warn("[rescheduleExtras] failed", i, err?.message);
    }
  }
}

export async function addExtraReminder(hour, minute) {
  const status = await getPermissionStatus();
  if (status !== "granted") {
    const ok = await requestPermissions();
    if (!ok) return { success: false, reason: "no_permission" };
  }
  await ensureChannel();
  const extras = await getExtraReminders();
  if (extras.length >= MAX_EXTRAS) {
    return { success: false, reason: "max_reached", max: MAX_EXTRAS };
  }
  // Aynı saat-dakika zaten varsa ekleme
  const exists = extras.some((e) => e.hour === hour && e.minute === minute);
  if (exists) return { success: false, reason: "duplicate" };
  // Base saatleri ile aynıysa da ekleme
  const baseClash = BASE_TIMES.some((b) => b.hour === hour && b.minute === minute);
  if (baseClash) return { success: false, reason: "base_clash" };

  extras.push({ hour, minute });
  extras.sort((a, b) => a.hour - b.hour || a.minute - b.minute);
  await saveExtras(extras);
  await rescheduleExtras(extras);
  return { success: true, extras };
}

export async function removeExtraReminder(index) {
  const extras = await getExtraReminders();
  if (index < 0 || index >= extras.length) return { success: false };
  extras.splice(index, 1);
  await saveExtras(extras);
  await rescheduleExtras(extras);
  return { success: true, extras };
}

// ───────── Top-level convenience ─────────

/**
 * App açılışta (auth + onboarding sonrası) çağrılır.
 * - Permission istemez (sessiz)
 * - Permission varsa base + extras'ı tazeler
 */
export async function bootstrapReminders() {
  const status = await getPermissionStatus();
  if (status !== "granted") return { success: false };
  await ensureChannel();
  await ensureBaseReminders();
  const extras = await getExtraReminders();
  await rescheduleExtras(extras);
  return { success: true, baseCount: BASE_TIMES.length, extraCount: extras.length };
}

/**
 * Onboarding'in son ekranında çağrılır:
 * Permission iste → varsa base + extras'ı zamanla.
 */
export async function activateRemindersWithPrompt() {
  const ok = await requestPermissions();
  if (!ok) return { success: false };
  await ensureChannel();
  await ensureBaseReminders();
  const extras = await getExtraReminders();
  await rescheduleExtras(extras);
  return { success: true };
}

// ───────── Test / Debug ─────────

export async function sendTestNotification() {
  const ok = await requestPermissions();
  if (!ok) return { success: false, reason: "permission_denied" };
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test bildirimi",
      body: "Bildirimler çalışıyor — sabah 09:00 ve akşam 20:00'da görüşürüz.",
      sound: "default",
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: "default",
    },
  });
  return { success: true };
}

export async function getScheduledSummary() {
  const all = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
  const base = all.filter((n) => (n.identifier || "").startsWith(BASE_PREFIX));
  const extras = all.filter((n) => (n.identifier || "").startsWith(EXTRA_PREFIX));
  return { base: base.length, extras: extras.length, total: base.length + extras.length };
}

// ───────── Deprecated (geriye uyumluluk) ─────────

export const DEFAULT_TIMES = BASE_TIMES; // legacy
export async function enableReminders() {
  return activateRemindersWithPrompt();
}
export async function scheduleReminders() {
  return ensureBaseReminders();
}
export async function scheduleDailyReminder() {
  return ensureBaseReminders();
}
export async function cancelDailyReminder() {
  // ARTIK İPTAL EDİLEMEZ — base bildirimleri kalıcı.
  // Sadece extras silinir. (geriye uyumluluk için no-op)
  return { success: false, reason: "base_reminders_cannot_be_cancelled" };
}
export async function getReminderPref() {
  const status = await getPermissionStatus();
  const extras = await getExtraReminders();
  return {
    enabled: status === "granted",
    base: BASE_TIMES,
    extras,
    times: [...BASE_TIMES, ...extras],
  };
}
export async function setReminderTimes() {
  // Artık base + extras yapısı var, eski API no-op
  return ensureBaseReminders();
}
