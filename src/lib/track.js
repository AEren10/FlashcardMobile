/**
 * Analytics Tracking — PostHog wrapper.
 *
 * Felsefe:
 *   - GDPR/KVKK consent yoksa hiçbir event gönderilmez (analyticsConsent.js'e bağlı)
 *   - Offline: event queue (AsyncStorage) → online'da batch flush
 *   - Stub mode: posthog key yoksa veya consent yoksa no-op (geliştirme akışı bozulmaz)
 *
 * Kullanım:
 *   import { track, identifyUser, EVENTS } from "../lib/track";
 *   track(EVENTS.STUDY_START, { listId, mode });
 *
 * Init: App.js'te initTracking() consent alındıktan SONRA çağrılır.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConsent } from "./analyticsConsent";

let _posthog = null;
let _enabled = false;
let _queue = []; // online olunca flush
const QUEUE_KEY = "@fc:track:queue";
const MAX_QUEUE = 100;

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

/** 12 core event — string literal, autocomplete + tipo koruması */
export const EVENTS = {
  APP_OPEN: "app_open",
  SIGNUP: "signup",
  ONBOARDING_STEP: "onboarding_step",
  ONBOARDING_COMPLETE: "onboarding_complete",
  STUDY_START: "study_start",
  CARD_RATED: "card_rated",
  QUIZ_FINISH: "quiz_finish",
  PAYWALL_VIEW: "paywall_view",
  PAYWALL_PURCHASE: "paywall_purchase",
  STREAK_DAY: "streak_day",
  NOTIFICATION_RECEIVED: "notification_received",
  SHARE_INITIATED: "share_initiated",
  PUSH_PROMPT_SHOWN: "push_prompt_shown",
  PUSH_PROMPT_RESULT: "push_prompt_result",
};

/**
 * Init — consent verildiyse PostHog client'ı kur ve queue'yu flush et.
 * App.js consent resolve sonrası çağırır.
 */
export async function initTracking() {
  try {
    const allow = await getConsent();
    if (!allow || !POSTHOG_KEY) {
      _enabled = false;
      return;
    }
    const { default: PostHog } = require("posthog-react-native");
    _posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST });
    _enabled = true;
    await _flushQueue();
  } catch {
    _enabled = false;
  }
}

/** Kullanıcı kimliği bağla — auth sonrası çağır. */
export function identifyUser(userId, traits = {}) {
  if (!_enabled || !_posthog) return;
  try {
    _posthog.identify(userId, traits);
  } catch {}
}

/** Reset — logout sonrası anonim'e dön. */
export function resetUser() {
  if (!_enabled || !_posthog) return;
  try {
    _posthog.reset();
  } catch {}
}

/**
 * Event gönder. Disabled ise queue'la (consent sonra gelirse flush olur).
 * @param {string} name — EVENTS.* sabitlerinden biri
 * @param {object} props — opsiyonel meta
 */
export function track(name, props = {}) {
  if (!_enabled || !_posthog) {
    // Queue'la (max 100), consent gelirse flush
    _queue.push({ name, props, ts: Date.now() });
    if (_queue.length > MAX_QUEUE) _queue.shift();
    AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(_queue)).catch(() => {});
    return;
  }
  try {
    _posthog.capture(name, props);
  } catch {}
}

async function _flushQueue() {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (raw) _queue = JSON.parse(raw) || [];
  } catch {}
  if (!_posthog || _queue.length === 0) return;
  for (const e of _queue) {
    try {
      _posthog.capture(e.name, { ...e.props, _queued_at: e.ts });
    } catch {}
  }
  _queue = [];
  await AsyncStorage.removeItem(QUEUE_KEY).catch(() => {});
}

/** Test/debug için */
export function isTrackingEnabled() {
  return _enabled;
}
