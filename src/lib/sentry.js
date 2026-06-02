/**
 * Sentry init — DSN env var'dan okunur (EXPO_PUBLIC_SENTRY_DSN).
 * DSN yoksa init çağrılmaz (dev için sessizce no-op).
 */
import * as Sentry from "@sentry/react-native";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!DSN) return;
  Sentry.init({
    dsn: DSN,
    enableInExpoDevelopment: false,
    debug: __DEV__,
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    environment: process.env.EXPO_PUBLIC_ENV || (__DEV__ ? "development" : "production"),
  });
}

export { Sentry };
