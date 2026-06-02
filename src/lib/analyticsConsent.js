/**
 * Analytics / Sentry Consent (GDPR / KVKK uyumlu)
 * Kullanıcı opt-in vermeden hiçbir telemetri kaydedilmez.
 * App.js, initSentry'i sadece consent === true ise çağırır.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@fc:analyticsConsent";
const RESOLVED = "@fc:analyticsConsentResolved";

/**
 * @returns {Promise<boolean>} true = opt-in, false = opt-out
 */
export async function getConsent() {
  try {
    return (await AsyncStorage.getItem(KEY)) === "true";
  } catch {
    return false;
  }
}

/**
 * Consent prompt'unun sorulup sorulmadığını kontrol eder.
 */
export async function hasResolvedConsent() {
  try {
    return (await AsyncStorage.getItem(RESOLVED)) === "true";
  } catch {
    return false;
  }
}

/**
 * @param {boolean} allow — true: opt-in, false: opt-out
 */
export async function setConsent(allow) {
  try {
    await AsyncStorage.setItem(KEY, allow ? "true" : "false");
    await AsyncStorage.setItem(RESOLVED, "true");
  } catch {}
}

/**
 * Test / kullanıcı reset için.
 */
export async function resetConsent() {
  try {
    await AsyncStorage.removeItem(KEY);
    await AsyncStorage.removeItem(RESOLVED);
  } catch {}
}
