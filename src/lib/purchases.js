/**
 * RevenueCat entegrasyonu — In-App Purchase yönetimi.
 *
 * Setup:
 *   1. RevenueCat dashboard'da proje aç (https://app.revenuecat.com)
 *   2. iOS + Android app'leri bağla (bundle id: com.aeren.flashcardmobile)
 *   3. Entitlement: "pro"
 *   4. Products:
 *      - flashcardmobile_pro_monthly  (Aylık 89 TL)
 *      - flashcardmobile_pro_yearly   (Yıllık 449 TL)
 *      - flashcardmobile_pro_lifetime (Tek seferlik 1499 TL)
 *   5. iOS API Key + Android API Key'i .env'e ekle:
 *      EXPO_PUBLIC_RC_IOS_KEY=appl_xxx
 *      EXPO_PUBLIC_RC_ANDROID_KEY=goog_xxx
 *
 * Test:
 *   - iOS: Sandbox account ile App Store Connect
 *   - Android: Internal testing track
 *
 * Eğer key yoksa: stub mode → Pro her zaman false, hiçbir purchase çalışmaz.
 *
 * @see https://www.revenuecat.com/docs/getting-started/installation/reactnative
 */

// Dynamic import — Expo Go'da native module yok, stub mode'a düş.
// Bu sayede EAS update preview link PM tarafında Expo Go ile açılır.
let Purchases = null;
let LOG_LEVEL = null;
try {
  // require ile sar — Expo Go'da modül yoksa try/catch yakalar
  const rc = require("react-native-purchases");
  Purchases = rc.default || rc;
  LOG_LEVEL = rc.LOG_LEVEL;
} catch {
  // Native module yok → otomatik STUB mode
}
import { Platform } from "react-native";

const ENTITLEMENT_ID = "pro";

const IOS_KEY = process.env.EXPO_PUBLIC_RC_IOS_KEY;
const ANDROID_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_KEY;

let _initialized = false;
let _stub = false; // API key yoksa veya native modül yoksa stub mode

export async function initPurchases(userId) {
  if (_initialized) return;

  // Native module yoksa (Expo Go) → stub
  if (!Purchases) {
    console.warn("[Purchases] Native module not available (Expo Go?) — STUB mode");
    _stub = true;
    _initialized = true;
    return;
  }

  const apiKey = Platform.OS === "ios" ? IOS_KEY : ANDROID_KEY;

  if (!apiKey) {
    console.warn("[Purchases] No API key — STUB mode. Set EXPO_PUBLIC_RC_IOS_KEY / EXPO_PUBLIC_RC_ANDROID_KEY in .env");
    _stub = true;
    _initialized = true;
    return;
  }

  try {
    if (__DEV__ && LOG_LEVEL) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    await Purchases.configure({ apiKey, appUserID: userId || null });
    _initialized = true;
  } catch (err) {
    console.warn("[Purchases] configure failed", err?.message);
    _stub = true;
    _initialized = true;
  }
}

/**
 * Kullanıcının Pro statüsünü öğren.
 * @returns {Promise<boolean>}
 */
export async function isPro() {
  if (_stub) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return !!info?.entitlements?.active?.[ENTITLEMENT_ID];
  } catch (err) {
    console.warn("[Purchases] isPro check failed", err?.message);
    return false;
  }
}

/**
 * Mevcut tüm offerings'i getir (paywall'da göstermek için).
 * @returns {Promise<{monthly, yearly, lifetime}>}
 */
export async function getOfferings() {
  if (_stub) {
    return {
      monthly: { priceString: "89,00 ₺", title: "Aylık" },
      yearly: { priceString: "449,00 ₺", title: "Yıllık" },
      lifetime: { priceString: "1.499,00 ₺", title: "Yaşam boyu" },
      _stub: true,
    };
  }
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    return {
      monthly: current?.monthly,
      yearly: current?.annual,
      lifetime: current?.lifetime,
    };
  } catch (err) {
    console.warn("[Purchases] getOfferings failed", err?.message);
    return {};
  }
}

/**
 * Bir paketi satın al. RevenueCat kendisi App Store / Google Play akışını açar.
 * @param {object} pkg — RC package object
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function purchase(pkg) {
  if (_stub) {
    return { success: false, error: "Stub mode — IAP yapılandırılmamış" };
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const ok = !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
    return { success: ok };
  } catch (err) {
    if (err?.userCancelled) return { success: false, cancelled: true };
    return { success: false, error: err?.message || "Satın alma başarısız" };
  }
}

/**
 * Önceki satın almaları geri yükle (cihaz değişimi vs.).
 */
export async function restore() {
  if (_stub) return { success: false, error: "Stub mode" };
  try {
    const info = await Purchases.restorePurchases();
    const ok = !!info?.entitlements?.active?.[ENTITLEMENT_ID];
    return { success: ok };
  } catch (err) {
    return { success: false, error: err?.message };
  }
}

/**
 * Customer info değiştiğinde tetiklenir (otomatik renewal, expire, vs.).
 */
export function addCustomerInfoListener(callback) {
  if (_stub) return () => {};
  const listener = (info) => {
    callback(!!info?.entitlements?.active?.[ENTITLEMENT_ID]);
  };
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => Purchases.removeCustomerInfoUpdateListener(listener);
}

export const IS_STUB = () => _stub;
