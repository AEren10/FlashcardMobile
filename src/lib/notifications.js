/**
 * Local daily reminder — sunucusuz push.
 * scheduleDailyReminder(hour, minute) → her gün belirli saatte bildirim.
 * Tercih AsyncStorage'da tutulur; Profile'a toggle eklenebilir.
 */
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PREF_KEY = "@fc:reminder";
const NOTIF_ID = "daily-study-reminder";

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

export async function scheduleDailyReminder(hour = 20, minute = 0) {
  const ok = await requestPermissions();
  if (!ok) return { success: false, reason: "permission_denied" };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Çalışma Hatırlatıcısı",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Notifications.cancelScheduledNotificationAsync(NOTIF_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID,
    content: {
      title: "🔥 Seri bozulmasın!",
      body: "Bugün çalıştın mı? Birkaç dakika ayır, kelimeleri tekrar et.",
      sound: "default",
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: "default",
    },
  });
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify({ enabled: true, hour, minute }));
  return { success: true };
}

export async function cancelDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(NOTIF_ID).catch(() => {});
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify({ enabled: false }));
}

export async function getReminderPref() {
  try {
    const raw = await AsyncStorage.getItem(PREF_KEY);
    if (!raw) return { enabled: false, hour: 20, minute: 0 };
    return { hour: 20, minute: 0, ...JSON.parse(raw) };
  } catch {
    return { enabled: false, hour: 20, minute: 0 };
  }
}
