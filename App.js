/**
 * Root: ErrorBoundary → Redux → SafeArea → Theme → Toast → Navigation
 * Sentry KVKK/GDPR uyumlu: consent verilmeden init etmez.
 */
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";

// Silence console in production builds; keep warnings/errors for Sentry capture later.
if (!__DEV__) {
  // eslint-disable-next-line no-console
  console.log = () => {};
  // eslint-disable-next-line no-console
  console.debug = () => {};
  // eslint-disable-next-line no-console
  console.info = () => {};
}

import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { initSentry, Sentry } from "./src/lib/sentry";
import { startAutoFlush } from "./src/lib/offlineQueue";
import { bootstrapReminders } from "./src/lib/notifications";
import { getConsent, hasResolvedConsent } from "./src/lib/analyticsConsent";
import { initTracking, track, EVENTS } from "./src/lib/track";
import { registerExpoPushToken, touchLastActive } from "./src/lib/pushToken";
import * as Updates from "expo-updates";

// EAS Update foreground fetcher — yeni JS bundle varsa background fetch + apply.
// Default expo-updates 2. açılışta uygular; bu manuel fetcher 1. açılışta apply yapar.
// __DEV__'de no-op (Expo Go / dev server zaten hot-reload).
async function checkForUpdatesOnce() {
  if (__DEV__) return;
  try {
    const upd = await Updates.checkForUpdateAsync();
    if (upd?.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Apply: 500ms bekle (analytics + auth init bitmesi için)
      setTimeout(() => Updates.reloadAsync().catch(() => {}), 500);
    }
  } catch {
    /* network yok veya updates server unreachable — sessiz */
  }
}
checkForUpdatesOnce();
// expo-av Audio mode — iOS silent mode'unda TTS susuyordu (bilinen sorun) → bypass
let _audioConfigured = false;
async function configureAudioModeOnce() {
  if (_audioConfigured) return;
  _audioConfigured = true;
  try {
    const { Audio } = require("expo-av");
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // DUCK_OTHERS
    });
  } catch {
    /* expo-av yoksa stub */
  }
}
configureAudioModeOnce();
import ConsentModal from "./src/components/ConsentModal";
import DynamicStatusBar from "./src/components/design/DynamicStatusBar";
import OfflineBanner from "./src/components/design/OfflineBanner";
import {
  useFonts as useSpaceGrotesk,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { View, ActivityIndicator } from "react-native";

startAutoFlush();
// Permission verilmişse base bildirimleri tazele (idempotent)
bootstrapReminders().catch(() => {});

function App() {
  const [fontsLoaded] = useSpaceGrotesk({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    InstrumentSerif_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Consent state: null = soruluyor, true = onaylı, false = reddedildi
  const [consentVisible, setConsentVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const resolved = await hasResolvedConsent();
      if (!resolved) {
        setConsentVisible(true);
        return;
      }
      const allow = await getConsent();
      if (allow) {
        initSentry();
        await initTracking();
        track(EVENTS.APP_OPEN);
      }
      // Comeback push altyapısı: her açılışta last_active_at + push token tazele
      // (consent'ten bağımsız — auth varsa çalışır, yoksa no-op)
      touchLastActive().catch(() => {});
      registerExpoPushToken().catch(() => {});
    })();
  }, []);

  const handleConsentResolved = async (allow) => {
    setConsentVisible(false);
    if (allow) {
      initSentry();
      await initTracking();
      track(EVENTS.APP_OPEN);
    }
    touchLastActive().catch(() => {});
    registerExpoPushToken().catch(() => {});
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1A1814", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#C8A96E" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <SafeAreaProvider>
            <ThemeProvider>
              <DynamicStatusBar />
              <ToastProvider>
                <AppNavigator />
                <OfflineBanner />
                <ConsentModal visible={consentVisible} onResolved={handleConsentResolved} />
              </ToastProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </Provider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default process.env.EXPO_PUBLIC_SENTRY_DSN ? Sentry.wrap(App) : App;
