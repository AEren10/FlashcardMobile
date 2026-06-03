/**
 * Local daily reminders — sunucusuz push.
 *
 * Sistem:
 *   - Default: 2 fix bildirim (öğle 12:30 + akşam 20:00)
 *   - Kullanıcı kendi saatlerini ekleyebilir (max 4 toplam)
 *   - Her saat için ayrı kanal/ID, hepsi DAILY trigger
 *
 * AsyncStorage formatı:
 *   { enabled: true, times: [{ hour: 12, minute: 30 }, { hour: 20, minute: 0 }] }
 */
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PREF_KEY = "@fc:reminder";
const NOTIF_ID_PREFIX = "daily-study-reminder";
const MAX_REMINDERS = 4;

// Default 2 fix bildirim — kullanıcı eklemediği sürece bunlar atılır
export const DEFAULT_TIMES = [
  { hour: 12, minute: 30 }, // öğle
  { hour: 20, minute: 0 },  // akşam
];

// Rotating mesajlar — her bildirim aynı yazıyı atmasın
const NOON_MESSAGES = [
  { title: "Öğle molası", body: "5 dakika kelime çalış, beynini tazele." },
  { title: "Kısa bir mola", body: "Bugünkü 10 kelimene bakalım mı?" },
  { title: "Aralıklı tekrar zamanı", body: "Beynin tam unutmaya başladı — şimdi öğrenmek tam zamanı." },
];

const EVENING_MESSAGES = [
  { title: "Seri bozulmasın", body: "Bugün biraz çalışmadıysan kısa bir oturum yeter." },
  { title: "Günün özeti", body: "Yatmadan birkaç kelime daha." },
  { title: "Akşam tekrarı", body: "Yarın hatırlamak için bu akşamki 5 dakika." },
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

export async function requestPermissions() {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const ask = await Notifications.requestPermissionsAsync();
  return ask.status === "granted";
}

/** Tüm zamanlanmış bildirimleri sil */
async function cancelAll() {
  const all = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
  await Promise.all(
    all
      .filter((n) => (n.identifier || "").startsWith(NOTIF_ID_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
  );
}

function pickMessage(hour) {
  // saat 0-13 arası → noon, 14+ → evening
  const pool = hour < 14 ? NOON_MESSAGES : EVENING_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Verilen saatlere göre günlük bildirim zamanla.
 * @param {Array<{hour:number, minute:number}>} times
 */
export async function scheduleReminders(times = DEFAULT_TIMES) {
  const ok = await requestPermissions();
  if (!ok) return { success: false, reason: "permission_denied" };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Çalışma Hatırlatıcısı",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await cancelAll();

  const capped = (times || []).slice(0, MAX_REMINDERS);
  for (let i = 0; i < capped.length; i++) {
    const t = capped[i];
    const msg = pickMessage(t.hour);
    await Notifications.scheduleNotificationAsync({
      identifier: `${NOTIF_ID_PREFIX}-${i}`,
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
  }

  await AsyncStorage.setItem(PREF_KEY, JSON.stringify({ enabled: true, times: capped }));
  return { success: true, count: capped.length };
}

/** Hatırlatıcıları aç — kullanıcı tercih ettiği saatleri varsa onlar, yoksa default */
export async function enableReminders() {
  const pref = await getReminderPref();
  const times = pref.times?.length ? pref.times : DEFAULT_TIMES;
  return scheduleReminders(times);
}

export async function cancelDailyReminder() {
  await cancelAll();
  const prev = await getReminderPref();
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify({ ...prev, enabled: false }));
}

/** Kullanıcı yeni saat ekledi/sildi → tekrar zamanla */
export async function setReminderTimes(times) {
  const capped = (times || []).slice(0, MAX_REMINDERS);
  return scheduleReminders(capped);
}

export async function getReminderPref() {
  try {
    const raw = await AsyncStorage.getItem(PREF_KEY);
    if (!raw) return { enabled: false, times: DEFAULT_TIMES };
    const parsed = JSON.parse(raw);
    return {
      enabled: false,
      times: DEFAULT_TIMES,
      ...parsed,
      times: parsed.times?.length ? parsed.times : DEFAULT_TIMES,
    };
  } catch {
    return { enabled: false, times: DEFAULT_TIMES };
  }
}

// Geriye uyumluluk — eski API çağrıları için
export async function scheduleDailyReminder(hour = 20, minute = 0) {
  return scheduleReminders([{ hour, minute }]);
}
