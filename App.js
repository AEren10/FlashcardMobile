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
import { getConsent, hasResolvedConsent } from "./src/lib/analyticsConsent";
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
      if (allow) initSentry();
    })();
  }, []);

  const handleConsentResolved = (allow) => {
    setConsentVisible(false);
    if (allow) initSentry();
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
