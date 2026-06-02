/**
 * Supabase Client
 * Session tokens → expo-secure-store (iOS Keychain / Android Keystore)
 * with AsyncStorage fallback on web.
 */

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { SUPABASE_CONFIG, AUTH_CONFIG } from "./config";

// SecureStore has ~2KB item size limit; Supabase sessions fit comfortably.
const SecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

const storage = Platform.OS === "web" ? AsyncStorage : SecureStoreAdapter;

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    ...AUTH_CONFIG,
    storage,
  },
});

export default supabase;
